export interface Service {
  id: string;
  name: string;
  description: string | null;
  basePrice: number | string | null;
  imageUrl: string | null;
  imagePublicId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceImageChange {
  file: File | null;
  remove: boolean;
}