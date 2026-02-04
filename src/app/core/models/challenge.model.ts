export interface Challenge {
  id: number;
  title: string;
  contextText?: string;
  imageUrl?: string;
  blurredImageUrl?: string;
  targetViews: number;      // ✅ Pas targetClicks !
  currentViews: number;     // ✅ Pas currentClicks !
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}