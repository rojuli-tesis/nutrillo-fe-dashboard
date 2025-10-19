export interface UserPlan {
  id: string;
  userId: number;
  title: string;
  description?: string;
  fileName: string;
  fileUrl?: string;
  nutritionist?: string;
  isActive: boolean;
  uploadDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserPlanDto {
  title: string;
  description?: string;
  fileName?: string;
  fileUrl?: string;
  nutritionist?: string;
  isActive?: boolean;
  uploadDate: string;
}

export interface UpdateUserPlanDto {
  title?: string;
  description?: string;
  fileName?: string;
  fileUrl?: string;
  nutritionist?: string;
  isActive?: boolean;
  uploadDate?: string;
}
