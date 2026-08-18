import { prisma } from "../../lib/prisma"

type ReviewInput = {
orderId: string;
  orderItemId: string;
  mealId: string;
  starCount: number; // Integer (1 to 5)
  comment: string;
  customerId: string;
}


const createReview = async (data: ReviewInput) => {
  // চেক করা হচ্ছে অর্ডারটি আসলেই ডেলিভার্ড এবং এই ইউজারের কিনা

  // console.log(data);
  const validOrder = await prisma.order.findFirst({
    where: {
      id: data.orderId,
      customerId: data.customerId,
      status: "DELIVERED",
      orderItems: {
        some: {
          mealId: data.mealId, 
        },
      },
    },
  });

  // যদি অর্ডার খুঁজে না পাওয়া যায় বা শর্ত না মিলে
  if (!validOrder) {
    throw new Error("আপনি কেবল সফলভাবে ডেলিভারি পাওয়া খাবারের ওপরই রিভিউ দিতে পারবেন!");
  }

  const result = await prisma.review.create({
    data: {
      customerId: data.customerId,
      orderId: data.orderId,
      orderItemId: data.orderItemId,
      mealId: data.mealId,
      starCount: data.starCount,
      comment: data.comment,
    },
  })

  return result
}


export const reviewService = {
  createReview,
}