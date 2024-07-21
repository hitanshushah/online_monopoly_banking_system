import { Property } from "./Property";

// types/Player.ts
export type Player = {
    name: string;
    funds: number;
    debt: number;
    properties: Property[];
    lentAmounts: { [key: string]: number };
    // Add any other relevant fields
  };
  