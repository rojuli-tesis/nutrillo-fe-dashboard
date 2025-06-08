export type MealType = 'breakfast' | 'morningSnack' | 'lunch' | 'afternoonSnack' | 'dinner' | 'eveningSnack';

export interface MealLog {
  _id: string;
  userId: string;
  date: string;
  mealType: MealType;
  description?: string;
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
} 