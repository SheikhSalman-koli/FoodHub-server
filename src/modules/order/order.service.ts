import { OrderStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma"
import { userRole } from "../../middlewares/auth";

type OrderItemInput = {
    mealId: string,
    name: string,
    quantity: number,
    price: number,
    discount?: number,
}

type CreateOrderInput = {
    customerId: string,
    providerId: string,
    deliveryFee: number,
    deliveryAddress: string,
    contactNumber: string,
    orderItems: OrderItemInput[],
}


export const createOrder = async (orderData: CreateOrderInput) => {
    const { customerId, providerId, deliveryAddress, contactNumber, deliveryFee, orderItems } = orderData;

    let originalSubtotal = 0; 
    let subtotal = 0;         

    orderItems?.forEach((item: OrderItemInput) => {
        const originalPrice = Number(item?.price) || 0;
        const discount = Number(item?.discount) || 0;
        const quantity = Number(item?.quantity) || 0;

        // ১টি আইটেমের মূল এবং ফাইনাল প্রাইজ
        const itemOriginalTotal = originalPrice * quantity;
        const finalPricePerUnit = discount > 0
            ? originalPrice - (originalPrice * discount) / 100
            : originalPrice;

        originalSubtotal += itemOriginalTotal;
        subtotal += finalPricePerUnit * quantity;
    });

    const discountedAmount = originalSubtotal - subtotal; // কত টাকা ছাড় পেল 
    const totalAmount = subtotal + Number(deliveryFee);

    await prisma.$transaction(async (tx) => {
        //  অর্ডার মেইন টেবিলে ডাটা তৈরি করা
        const orderData = {
            customerId,
            providerId,
            deliveryAddress,
            contactNumber,
            deliveryFee: Number(deliveryFee),
            subtotal,          
            discountedAmount,   
            totalAmount,
        }

        const order = await tx.order.create({
            data: orderData,
        });

        //------------------------
        // অর্ডারের ভেতরের আইটেমগুলো লুপ চালিয়ে OrderItem ডেটা রেডি করা
        const orderItemsData = orderItems?.map((item: OrderItemInput) => ({
            orderId: order.id,
            mealId: item?.mealId,
            name: item?.name,
            quantity: item?.quantity,
            price: item?.price,
            discount: item?.discount || 0,
        }));


        await tx.orderItem.createMany({
            data: orderItemsData,
        });

        // Promise.all ব্যবহার করা হয়েছে যাতে সবগুলো আপডেট কোয়ারি একসাথে প্যারালালি রান হয়
        await Promise.all(
            orderItems?.map((item: OrderItemInput) =>
                tx.meal.update({
                    where: { id: item?.mealId },
                    data: {
                        orderCount: {
                            increment: item?.quantity, // ইউজারের অর্ডার করা quantity অনুযায়ী কাউন্ট বাড়বে
                        },
                    },
                })
            )
        );

        // সবশেষে রিলেশনসহ অর্ডার ডেটা রিটার্ন করতে চাইলে এভাবে করতে পারেন (ঐচ্ছিক)
        return await tx.order.findUnique({
            where: { id: order.id },
            include: { orderItems: true }
        });
    });
};


const getAllOrders = async (data: { id: string, role: string, email: string }) => {
    const { id, role, email } = data;
    // check role, if provider then filter by providerId, if customer then filter by customerId, if admin then return all orders
    if (role === 'ADMIN') {
        const result = await prisma.order.findMany({
            include: {
                orderItems: true,
                provider: {
                    select: {
                        id: true,
                        restaurantName: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        return result
    }

    if (role === 'CUSTOMER') {
        const result = await prisma.order.findMany({
            where: {
                customerId: id
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                orderItems: true
            }
        })
        return result
    }

    if (role === 'PROVIDER') {
        const getProviderId = await prisma.provider.findUnique({
            where: {
                authoremail: email
            }
        })

        const result = await prisma.order.findMany({
            where: {
                providerId: getProviderId?.id
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                orderItems: true
            }
        })
        return result
    }
}


const updateOrderStatus = async (orderId: string, role: string, userId: string, userEmail: string, status: OrderStatus) => {

    const getOrderInfo = await prisma.order.findUnique({
        where: {
            id: orderId
        },
        select: {
            customerId: true,
            providerId: true,
            status: true
        }
    })

    if (!getOrderInfo) {
        throw new Error("Order not found!");
    }

    if (getOrderInfo.status === "DELIVERED" || getOrderInfo.status === "CANCELLED") {
        throw new Error(`This order is already ${getOrderInfo.status.toLowerCase()} and cannot be modified further!`);
    }
    // -------------------------------------------
    if (role === userRole.CUSTOMER) {

        if (status !== "CANCELLED") {
            throw new Error("Customers are only allowed to cancel orders.");
        }

        if (getOrderInfo?.status !== "PLACED") {
            throw new Error("You cannot cancel an order that is already PREPARING or READY.");
        }

        const isOrderOwner = getOrderInfo?.customerId === userId

        if (!isOrderOwner) throw new Error('you are the not owner of the order!')

    }
    // -----------------------------------
    if (role === userRole.PROVIDER) {

        const allowedProviderStatuses: OrderStatus[] = ["PREPARING", "READY", "DELIVERED"];

        if (!allowedProviderStatuses.includes(status)) {
            throw new Error("Providers are not allowed to set this status.");
        }

        const getProviderId = await prisma.provider.findUnique({
            where: {
                authoremail: userEmail
            },
            select: {
                id: true
            }
        })

        if (!getProviderId) {
            throw new Error("Provider profile not found!");
        }

        const isRestaurantOwner = getProviderId?.id === getOrderInfo.providerId

        if (!isRestaurantOwner) throw new Error('you are not the actual restaurant owner!')
    }
    // -------------------------------------------

    const result = await prisma.order.update({
        where: {
            id: orderId
        },
        data: {
            status
        }
    })

    return result

}



export const orderService = {
    createOrder,
    getAllOrders,
    updateOrderStatus
}