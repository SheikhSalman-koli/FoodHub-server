// যেকোনো ইংরেজি সংখ্যাকে বাংলায় রূপান্তর
export const toBanglaNumber = (num: number | string): string => {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/\d/g, (digit) => banglaDigits[parseInt(digit)]);
};

// বাংলা ফরম্যাটিং ফাংশন
export const formatToBanglaDate = (label: string, type: "daily" | "weekly" | "monthly"): string => {
  if (!label) return "";

  try {
    // MONTHLY: "2026-08" ➔ "আগস্ট ২০২৬"
    if (type === "monthly") {
      const [year, month] = label.split("-");
      if (year && month) {
        const date = new Date(Number(year), Number(month) - 1, 1);
        const monthName = new Intl.DateTimeFormat("bn-BD", { month: "long" }).format(date);
        return `${monthName} ${toBanglaNumber(year)}`;
      }
    }

    // WEEKLY: "2026-08-03" (YYYY-MM-DD) বা "2026-W30"
    if (type === "weekly") {
      // যদি ডাটাবেজ থেকে "2026-W30" আসে
      if (label.includes("W")) {
        const [year, week] = label.split("-W");
        return `সপ্তাহ ${toBanglaNumber(week)} (${toBanglaNumber(year)})`;
      }

      // যদি "YYYY-MM-DD" আসে (যেমন: 2026-08-03)
      const [year, month, day] = label.split("-").map(Number);
      if (year && month && day) {
        const startDate = new Date(year, month - 1, day);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);

        const startDay = toBanglaNumber(startDate.getDate());
        const endDay = toBanglaNumber(endDate.getDate());
        
        const startMonth = new Intl.DateTimeFormat("bn-BD", { month: "long" }).format(startDate);
        const endMonth = new Intl.DateTimeFormat("bn-BD", { month: "long" }).format(endDate);

        if (startMonth === endMonth) {
          return `${startDay}-${endDay} ${startMonth}`;
        }
        return `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
      }
    }

    // DAILY: "2026-08-03" ➔ "৩ আগস্ট"
    if (type === "daily") {
      const [year, month, day] = label.split("-").map(Number);
      if (year && month && day) {
        const date = new Date(year, month - 1, day);
        const dayNum = toBanglaNumber(day);
        const monthName = new Intl.DateTimeFormat("bn-BD", { month: "long" }).format(date);
        return `${dayNum} ${monthName}`;
      }
    }
  } catch (error) {
    console.error("Bangla Date Conversion Error:", error);
  }

  // ফালব্যাক: সংখ্যাগুলোকে কেবল বাংলায় রূপান্তর করে দেওয়া
  return toBanglaNumber(label);
};