import { success } from "better-auth";
import { prisma } from "../../lib/prisma";
import { formatToBanglaDate } from "../../lib/helpers/convertDateToBangla";

export const getProviderStats = async (email: string) => {
    // console.log(email);
    try {
        const getProviderId = await prisma.provider.findUnique({
            where: { authoremail: email },
            select: { id: true }
        })

      const providerId = getProviderId?.id

    if (!providerId) {
      return {
        success: false,
        message: "প্রোভাইডার অ্যাকাউন্ট পাওয়া যায়নি!",
      };
    }

//  meal card data
    const [totalMeals, activeMeals, inactiveMeals] = await Promise.all([
      prisma.meal.count({ where: { providerId } }),
      prisma.meal.count({ where: { providerId, isDeleted: false } }),
      prisma.meal.count({ where: { providerId, isDeleted: true } }),
    ]);

// order card data
    const [totalOrders, cancelledOrders, deliveredOrders] = await Promise.all([
      prisma.order.count({ where: { providerId } }),
      prisma.order.count({ where: { providerId, status: "CANCELLED" } }),
      prisma.order.count({ where: { providerId, status: "DELIVERED" } }),
    ]);

//  financial card data
    const financialStats = await prisma.order.aggregate({
      where: {
        providerId,
        status: "DELIVERED",
      },
      _sum: {
        totalAmount: true,
        deliveryFee: true,
        subtotal: true, 
      },
    });

    const totalAmount = financialStats._sum.totalAmount || 0;
    const deliveryFeeCost = financialStats._sum.deliveryFee || 0;
    const totalEarn = financialStats._sum.subtotal || 0; // earn = subtotal

// chart data
    
    // Daily Stats
    const dailyRaw = await prisma.$queryRaw<
      { date: string; totalOrders: bigint; totalEarn: number }[]
    >`
      SELECT 
        TO_CHAR("createdAt", 'YYYY-MM-DD') as date,
        COUNT(id) as "totalOrders",
        COALESCE(SUM(CASE WHEN status = 'DELIVERED' THEN subtotal ELSE 0 END), 0) as "totalEarn"
      FROM "Order"
      WHERE "providerId" = ${providerId}
        AND "createdAt" >= NOW() - INTERVAL '30 days'
      GROUP BY TO_CHAR("createdAt", 'YYYY-MM-DD')
      ORDER BY date ASC;
    `;

    // Weekly Stats (গত ১২ সপ্তাহ)
    const weeklyRaw = await prisma.$queryRaw<
      { week: string; totalOrders: bigint; totalEarn: number }[]
    >`
      SELECT 
        TO_CHAR("createdAt", 'IYYY-"W"IW') as week,
        COUNT(id) as "totalOrders",
        COALESCE(SUM(CASE WHEN status = 'DELIVERED' THEN subtotal ELSE 0 END), 0) as "totalEarn"
      FROM "Order"
      WHERE "providerId" = ${providerId}
        AND "createdAt" >= NOW() - INTERVAL '12 weeks'
      GROUP BY TO_CHAR("createdAt", 'IYYY-"W"IW')
      ORDER BY week ASC;
    `;

    // Monthly Stats (গত ১২ মাস)
    const monthlyRaw = await prisma.$queryRaw<
      { month: string; totalOrders: bigint; totalEarn: number }[]
    >`
      SELECT 
        TO_CHAR("createdAt", 'YYYY-MM') as month,
        COUNT(id) as "totalOrders",
        COALESCE(SUM(CASE WHEN status = 'DELIVERED' THEN subtotal ELSE 0 END), 0) as "totalEarn"
      FROM "Order"
      WHERE "providerId" = ${providerId}
        AND "createdAt" >= NOW() - INTERVAL '12 months'
      GROUP BY TO_CHAR("createdAt", 'YYYY-MM')
      ORDER BY month ASC;
    `;

    // BigInt কে Number এ কনভার্ট করা (Next.js Serialization Fix)
 const formatChartData = (data: any[], keyName: string, type: "daily" | "weekly" | "monthly") =>
  data.map((item) => ({
    label: formatToBanglaDate(item[keyName], type),
    orders: Number(item.totalOrders || 0),
    earn: Number(item.totalEarn || 0),
  }));

    return {
       cards: {
          meals: {
            total: totalMeals,
            active: activeMeals,
            inactive: inactiveMeals,
          },
          orders: {
            total: totalOrders,
            cancelled: cancelledOrders,
            delivered: deliveredOrders,
          },
          finance: {
            totalAmount,
            deliveryFeeCost,
            totalEarn,
          },
        },
        charts: {
          daily: formatChartData(dailyRaw, "date", "daily"),
          weekly: formatChartData(weeklyRaw, "week", "weekly"),
          monthly: formatChartData(monthlyRaw, "month", "monthly"),
        },
    };
  } catch (error) {
    console.error("Provider Stats Error:", error);
    return {
      success: false,
      message: "স্ট্যাটাস লোড করতে সমস্যা হয়েছে!",
    };
  }
}

export const statsService = {
    getProviderStats
}