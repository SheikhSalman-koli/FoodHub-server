import { prisma } from "../../lib/prisma"

type ReviewInput = {
    orderId: string,
    mealId: string,
    customerId: string,
    comment: string,
    starCount: number,
}


const createReview = async (reviewData: ReviewInput) => {
    const { customerId, mealId, orderId, comment, starCount } = reviewData;

  // 🔍 চেক করা হচ্ছে অর্ডারটি আসলেই ডেলিভার্ড এবং এই ইউজারের কিনা
  const validOrder = await prisma.order.findFirst({
    where: {
      id: orderId,
      customerId: customerId,
    //   status: "DELIVERED", // ১ নম্বর শর্ত
      orderItems: {
        some: {
          mealId: mealId, // ২ নম্বর শর্ত (অর্ডারের ভেতর এই খাবারটি ছিল)
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
            orderId,    
            mealId,
            customerId,
            comment,
            starCount,
        }
    })

    return result
}


export const reviewService = {
    createReview,
}