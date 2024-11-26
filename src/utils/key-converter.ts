// 유틸리티 함수: camelCase 또는 PascalCase를 snake_case로 변환
const toSnakeCase = (str: string): string => {
  return str
    .replace(/([A-Z])/g, "_$1")
    .toLowerCase()
    .replace(/^_/, "");
};

export function convertKeysToPEP8<T extends Record<string, any>>(
  input: T
): Record<string, any> {
  const output: Record<string, any> = {};

  for (const key in input) {
    if (input.hasOwnProperty(key)) {
      const newKey = toSnakeCase(key);
      const value = input[key];

      if (Array.isArray(value)) {
        // 배열이라면 배열 내부의 각 요소를 검사
        output[newKey] = value.map((item) =>
          item && typeof item === "object" && !Array.isArray(item)
            ? convertKeysToPEP8(item) // 배열 내부 객체 키 변환
            : item
        );
      } else if (value && typeof value === "object") {
        // 객체라면 재귀적으로 변환
        output[newKey] = convertKeysToPEP8(value);
      } else {
        // 기본 값은 그대로 할당
        output[newKey] = value;
      }
    }
  }

  return output;
}


// snake_case를 camelCase로 변환하는 유틸리티 함수
const toCamelCase = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

// 인터페이스 객체의 키를 camelCase로 변환하는 함수 (재귀 포함)
export function convertKeysToCamelCase<T extends Record<string, any>>(
  input: T
): Record<string, any> {
  const output: Record<string, any> = {};

  for (const key in input) {
    if (input.hasOwnProperty(key)) {
      const newKey = toCamelCase(key);
      const value = input[key];

      // 값이 객체인지 확인하고, 객체라면 재귀적으로 변환
      output[newKey] =
        value && typeof value === "object" && !Array.isArray(value)
          ? convertKeysToCamelCase(value)
          : value;
    }
  }

  return output;
}
