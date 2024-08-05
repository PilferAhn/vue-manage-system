export function containsSPL(input: string): boolean {
    const regex = /SPL/;
    return regex.test(input);
  }