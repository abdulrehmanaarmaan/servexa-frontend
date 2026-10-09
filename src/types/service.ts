export interface Service {
  id: string;
  name: string;
  description: string | null;
  basePrice: number | string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}