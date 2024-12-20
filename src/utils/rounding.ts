export function roundUpToNextPowerOfTen(num: number): number {
    if (num <= 0) return 10; // 음수나 0의 경우 10으로 처리
    
    const magnitude = Math.pow(10, Math.floor(Math.log10(num))); // 자리수의 기준 (10의 제곱)
    const roundedValue = Math.ceil(num / magnitude) * magnitude; // 올림한 값 반환
  
    return roundedValue;
  }