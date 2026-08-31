// ইংরেজি সংখ্যাকে বাংলায় রূপান্তর
export const toBanglaNumber = (num) => {
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).replace(/\d/g, (digit) => banglaDigits[parseInt(digit)]);
};
// বাংলা ফরম্যাটিং
export const formatToBanglaDate = (label, type) => {
    if (!label)
        return "";
    try {
        // MONTHLY
        if (type === "monthly") {
            const [year, month] = label.split("-");
            if (year && month) {
                const date = new Date(Number(year), Number(month) - 1, 1);
                const monthName = new Intl.DateTimeFormat("bn-BD", { month: "long" }).format(date);
                return `${monthName} ${toBanglaNumber(year)}`;
            }
        }
        // WEEKLY
        if (type === "weekly") {
            if (label.includes("W")) {
                const [year, week] = label.split("-W");
                return `সপ্তাহ ${toBanglaNumber(week)} (${toBanglaNumber(year)})`;
            }
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
        // DAILY
        if (type === "daily") {
            const [year, month, day] = label.split("-").map(Number);
            if (year && month && day) {
                const date = new Date(year, month - 1, day);
                const dayNum = toBanglaNumber(day);
                const monthName = new Intl.DateTimeFormat("bn-BD", { month: "long" }).format(date);
                return `${dayNum} ${monthName}`;
            }
        }
    }
    catch (error) {
        console.error("Bangla Date Conversion Error:", error);
    }
    return toBanglaNumber(label);
};
