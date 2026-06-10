import { prisma } from "../../lib/prisma"

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

    const subtotal = orderItems?.reduce((sum: number, item: OrderItemInput) => {
        const discountAmount = item?.discount ? Number(item.discount) : 0;
        const itemTotal = (Number(item?.price) - discountAmount) * item?.quantity;
        return sum + itemTotal;
    }, 0);

    const totalAmount = subtotal + Number(deliveryFee);

    // ডাটাবেজে ট্রানজেকশন রান করা
    const result = await prisma.$transaction(async (tx) => {
        //  অর্ডার মেইন টেবিলে ডাটা তৈরি করা
        const orderData = {
            customerId,
            providerId,
            deliveryAddress,
            contactNumber, 
            deliveryFee,
            subtotal,      
            totalAmount,
        }

        const order = await tx.order.create({
            data: orderData,
        });

        //------------------------
        // অর্ডারের ভেতরের আইটেমগুলো লুপ চালিয়ে OrderItem ডেটা রেডি করা
        const orderItemsData = orderItems.map((item: OrderItemInput) => ({
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

        // সবশেষে রিলেশনসহ অর্ডার ডেটা রিটার্ন করতে চাইলে এভাবে করতে পারেন (ঐচ্ছিক)
        // return await tx.order.findUnique({
        //     where: { id: order.id },
        //     include: { orderItems: true }
        // });
    });

    return result
};


const getAllOrders = async () => {
    // check role, if provider then filter by providerId, if customer then filter by customerId, if admin then return all orders
    const result = await prisma.order.findMany({
        include: {
            orderItems: true
        }
    })
    return result
}



export const orderService = {
    createOrder,
    getAllOrders,
}