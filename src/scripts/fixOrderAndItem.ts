import { prisma } from "../lib/prisma";


async function fixOrdersAndOrderItems() {
  console.log("🔄 পুরোনো ডাটা ফিক্স করা শুরু হচ্ছে...");

  // ১. যেসব অর্ডারে ডিসকাউন্ট হিসেব বাকি আছে সেগুলো নিয়ে আসা
  const orders = await prisma.order.findMany({
    include: { orderItems: true },
  });

  for (const order of orders) {
    let totalDiscountForOrder = 0;

    // ২. আগে প্রতিটি OrderItem আপডেট করা এবং মোট ডিসকাউন্ট বের করা
    for (const item of order.orderItems) {
      const currentPrice = Number(item.price) || 0; // এটি ডিসকাউন্টেড প্রাইজ
      const discountPercent = Number(item.discount) || 0;
      const quantity = Number(item.quantity) || 0;

      if (discountPercent > 0 && discountPercent < 100) {
        // 🧮 ১টি আইটেমের অরিজিনাল প্রাইজ বের করা
        const originalPrice = (currentPrice * 100) / (100 - discountPercent);
        
        // 🧮 ১টি আইটেমে কত টাকা ছাড় পেয়েছে
        const discountPerUnit = originalPrice - currentPrice;
        totalDiscountForOrder += discountPerUnit * quantity;

        // Step 1: OrderItem-এর price আপডেট (Original Price দিয়ে)
        await prisma.orderItem.update({
          where: { id: item.id },
          data: {
            price: String(Math.round(originalPrice)),
          },
        });
      }
    }
console.log(" step one is done! ");
    // Step 2: Order-এর discountedAmount আপডেট করা
    if (totalDiscountForOrder > 0) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          discountedAmount: Math.round(totalDiscountForOrder),
        },
      });
    }
  }

  console.log("✅ OrderItem এবং Order টেবিল সফলভাবে ফিক্সড হয়েছে!");
}

fixOrdersAndOrderItems()
  .catch((e) => console.error("❌ ভুল হয়েছে:", e))
  .finally(async () => await prisma.$disconnect());