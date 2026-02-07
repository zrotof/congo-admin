export interface Filter {
  id: number;
  name: string | null;
  imageUrl: string | null;
  filterUrl: string;
  platform: string;
  usageCount: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;

}