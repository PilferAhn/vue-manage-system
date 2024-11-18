// Utility function to convert snake_case to camelCase
function toCamelCase(key: string): string {
    return key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
  }
  
  // Function to convert an object with snake_case keys to camelCase
  export function convertToCamelCase(data: any): any {
    if (Array.isArray(data)) {
      return data.map((item) => convertToCamelCase(item)); // Convert array elements
    } else if (typeof data === "object" && data !== null) {
      const newObject: { [key: string]: any } = {};
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const newKey = toCamelCase(key);
          newObject[newKey] = data[key]; // Recursively convert values if they are objects/arrays
        }
      }
      return newObject;
    } else {
      return data;
    }
  }

  // Convert camelCase to snake_case
function toSnakeCase(key: string): string {
    return key.replace(/([A-Z])/g, "_$1").toLowerCase();
  }
  
  // Convert ApplicationData object to snake_case keys
  export function convertToPep8(data: any): any {
    const convertedData: { [key: string]: any } = {};
  
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        // Convert each key to snake_case
        convertedData[toSnakeCase(key)] = data[key];
      }
    }
    return convertedData;
  }