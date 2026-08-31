import { success } from "better-auth";
import { prisma } from "../../lib/prisma.js";
import { formatToBanglaDate } from "../../lib/helpers/convertDateToBangla.js";

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

    // Weekly Stats
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

    // Monthly Stats 
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


export const getAdminDashboardStats = async () => {
  const [
    allOrders,
    totalCustomersCount,
    totalProvidersCount,
    recentOrders,
    topMealGroups,
  ] = await Promise.all([
    prisma.order.findMany({
      where: { isDeleted: false },
      select: {
        id: true,
        totalAmount: true,
        status: true,
        providerId: true,
        createdAt: true,
        provider: {
          select: {
            restaurantName: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    }),

    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.user.count({ where: { role: "PROVIDER" } }),

    prisma.order.findMany({
      where: { isDeleted: false },
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        provider: { select: { restaurantName: true } },
        orderItems: true,
      },
    }),

    prisma.orderItem.groupBy({
      by: ["mealId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
  ]);

  let totalRevenue = 0;
  let deliveredOrdersCount = 0;
  let cancelledOrdersCount = 0;

  const rawStatusMap: Record<string, number> = {
    PLACED: 0,
    PREPARING: 0,
    DELIVERED: 0,
    CANCELLED: 0,
  };

  const providerRevenueMap: Record<
    string,
    { id: string; name: string; totalRevenue: number; ordersCount: number }
  > = {};

  // Chart 
  const dailyMap: Record<string, { revenue: number; orders: number }> = {};
  const weeklyMap: Record<string, { revenue: number; orders: number }> = {};
  const monthlyMap: Record<string, { revenue: number; orders: number }> = {};

  allOrders.forEach((order) => {
    const amount = Number(order.totalAmount ?? 0);
    const dateObj = new Date(order.createdAt);

    if (order.status in rawStatusMap) {
      rawStatusMap[order.status]++;
    }

    if (order.status === "DELIVERED") {
      totalRevenue += amount;
      deliveredOrdersCount++;
    }

    if (order.status === "CANCELLED") {
      cancelledOrdersCount++;
    }

    // Provider Calculation
    if (order.providerId) {
      const providerName = order.provider?.restaurantName || "Unknown Provider";
      if (!providerRevenueMap[order.providerId]) {
        providerRevenueMap[order.providerId] = {
          id: order.providerId,
          name: providerName,
          totalRevenue: 0,
          ordersCount: 0,
        };
      }
      if (order.status === "DELIVERED") {
        providerRevenueMap[order.providerId].totalRevenue += amount;
      }
      providerRevenueMap[order.providerId].ordersCount += 1;
    }

    // Daily Key Format (YYYY-MM-DD)
    const dayKey = dateObj.toISOString().split("T")[0];
    if (!dailyMap[dayKey]) dailyMap[dayKey] = { revenue: 0, orders: 0 };
    dailyMap[dayKey].orders += 1;
    if (order.status === "DELIVERED") dailyMap[dayKey].revenue += amount;

    // Weekly Key Format (Week W)
    const weekNum = Math.ceil(dateObj.getDate() / 7);
    const weekKey = `W${weekNum} (${dateObj.toLocaleString("default", { month: "short" })})`;
    if (!weeklyMap[weekKey]) weeklyMap[weekKey] = { revenue: 0, orders: 0 };
    weeklyMap[weekKey].orders += 1;
    if (order.status === "DELIVERED") weeklyMap[weekKey].revenue += amount;

    // Monthly Key Format (MMM YYYY)
    const monthKey = dateObj.toLocaleString("default", { month: "short", year: "2-digit" });
    if (!monthlyMap[monthKey]) monthlyMap[monthKey] = { revenue: 0, orders: 0 };
    monthlyMap[monthKey].orders += 1;
    if (order.status === "DELIVERED") monthlyMap[monthKey].revenue += amount;
  });

  const totalOrdersCount = allOrders.length;
  const averageOrderValue = deliveredOrdersCount > 0 ? totalRevenue / deliveredOrdersCount : 0;
  const cancellationRate = totalOrdersCount > 0 ? (cancelledOrdersCount / totalOrdersCount) * 100 : 0;

  // Best Provider
  const sortedProviders = Object.values(providerRevenueMap).sort((a, b) => b.totalRevenue - a.totalRevenue);
  const bestProvider = sortedProviders.length > 0 ? sortedProviders[0] : null;

  // Top 5 Meals
  const mealIds = topMealGroups.map((item) => item.mealId);
  const mealsData = await prisma.meal.findMany({
    where: { id: { in: mealIds } },
    select: { id: true, name: true },
  });

  const topMeals = topMealGroups.map((item) => {
    const meal = mealsData.find((m) => m.id === item.mealId);
    return {
      mealId: item.mealId,
      name: meal?.name || "Unknown Meal",
      totalSold: item._sum.quantity || 0,
    };
  });

  // Recharts Compatible Status Array
  const statusBreakdown = [
    { name: "Placed", value: rawStatusMap.PLACED, color: "#3B82F6" },
    { name: "Preparing", value: rawStatusMap.PREPARING, color: "#F59E0B" },
    { name: "Delivered", value: rawStatusMap.DELIVERED, color: "#10B981" },
    { name: "Cancelled", value: rawStatusMap.CANCELLED, color: "#EF4444" },
  ];

  return {
    kpis: {
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalOrders: totalOrdersCount,
      deliveredOrders: deliveredOrdersCount,
      cancelledOrders: cancelledOrdersCount,
      totalCustomers: totalCustomersCount,
      totalProviders: totalProvidersCount,
      averageOrderValue: Number(averageOrderValue.toFixed(2)),
      cancellationRate: Number(cancellationRate.toFixed(2)),
    },
    statusBreakdown,
    growthData: {
      daily: Object.entries(dailyMap).slice(-7).map(([label, v]) => ({ label, ...v })),
      weekly: Object.entries(weeklyMap).slice(-4).map(([label, v]) => ({ label, ...v })),
      monthly: Object.entries(monthlyMap).slice(-6).map(([label, v]) => ({ label, ...v })),
    },
    recentOrders,
    bestProvider,
    topMeals,
  };
};











export const statsService = {
    getProviderStats,
    getAdminDashboardStats
}