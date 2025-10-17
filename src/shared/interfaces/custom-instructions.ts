export interface CustomInstructions {
  id: number;
  instructions: string;
  title?: string;
  description?: string;
  isActive: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomInstructionsRequest {
  instructions: string;
  title?: string;
  description?: string;
  isActive?: boolean;
  priority?: number;
}

export interface UpdateCustomInstructionsRequest {
  instructions?: string;
  title?: string;
  description?: string;
  isActive?: boolean;
  priority?: number;
}
