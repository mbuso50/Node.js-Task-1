// src/models/item.ts

export interface Item {
  id: string;
  name: string;
  quantity: number;
  unit?: string;
  purchased: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateItemDTO {
  name: string;
  quantity?: number;
  unit?: string;
}

export interface UpdateItemDTO {
  name?: string;
  quantity?: number;
  unit?: string;
  purchased?: boolean;
}
