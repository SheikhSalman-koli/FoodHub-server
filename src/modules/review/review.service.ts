import { prisma } from "../../lib/prisma.js"

type ReviewInput = {
orderId: string;
  orderItemId: string;
  mealId: string;
  starCount: number;
  comment: string;
  customerId: string;
}


const createReview = async (data: ReviewInput) => {

  // console.log(data);
  // validation
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


const getAllReviews =async()=>{
  const result = await prisma.review.findMany({
      orderBy:{
      createdAt: 'desc'
    },
    select:{
      id: true,
      comment: true,
      starCount: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          name: true,
          image: true
        }
      },
      meal: {
        select: {
          id: true,
          name: true
        }
      },
    }
  })

  return result
}



export const reviewService = {
  createReview,
  getAllReviews
}