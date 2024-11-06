export function getCurrentWeekNumber(): number {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const pastDaysOfYear = (now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000);

    // startOfYear.getDay()가 1(월요일)이 되도록 조정
    const dayOfWeekAdjustment = (startOfYear.getDay() + 6) % 7;

    return Math.ceil((pastDaysOfYear + dayOfWeekAdjustment) / 7);
}


