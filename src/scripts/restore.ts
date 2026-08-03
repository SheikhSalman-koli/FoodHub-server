
import fs from "fs";
import { prisma } from "../lib/prisma";


async function restoreBackup() {
  console.log("🔄 ব্যাকআপ ফাইল থেকে রিস্টোর করা হচ্ছে...");
  const rawData = fs.readFileSync("backup_data.json", "utf-8");
  const orders = JSON.parse(rawData);

  for (const order of orders) {
    // ১. OrderItem আপডেট রিস্টোর
    for (const item of order.orderItems) {
      await prisma.orderItem.update({
        where: { id: item.id },
        data: {
          price: item.price,
          discount: item.discount,
        },
      });
    }

    // ২. Order আপডেট রিস্টোর
    await prisma.order.update({
      where: { id: order.id },
      data: {
        discountedAmount: order.discountedAmount ?? 0,
        subtotal: order.subtotal,
        totalAmount: order.totalAmount,
      },
    });
  }
  console.log("✅ আগের ডাটা সফলভাবে রিস্টোর করা হয়েছে!");
}

restoreBackup()
  .catch(console.error)
  .finally(() => prisma.$disconnect());