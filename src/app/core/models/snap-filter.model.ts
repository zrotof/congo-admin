export interface SnapFilter {
  id: number;
  name: string | null;
  imageUrl: string | null;
  snapchatUrl: string;
  usageCount: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}