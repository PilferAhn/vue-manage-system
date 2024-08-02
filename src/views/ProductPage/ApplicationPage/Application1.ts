// Application.ts
export interface Address {
  houseName: string;
  street: string;
}

export interface Person {
  name: string;
  age: number;
  addressQuantity: number;
  addresses: Address[];
}
