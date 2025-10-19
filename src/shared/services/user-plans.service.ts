import restClient from "@/utils/restClient";
import { UserPlan, CreateUserPlanDto, UpdateUserPlanDto } from "../interfaces/user-plans";

export class UserPlansService {
  static async getAllPlans(): Promise<UserPlan[]> {
    return restClient.get<UserPlan[]>("/user-plans");
  }

  static async getActivePlan(): Promise<UserPlan | null> {
    return restClient.get<UserPlan | null>("/user-plans/active");
  }

  static async getPlanById(id: string): Promise<UserPlan> {
    return restClient.get<UserPlan>(`/user-plans/${id}`);
  }

  static async createPlan(planData: CreateUserPlanDto): Promise<UserPlan> {
    return restClient.post<UserPlan>("/user-plans", planData);
  }

  static async createPlanWithFile(
    planData: CreateUserPlanDto, 
    file: File
  ): Promise<UserPlan> {
    const formData = new FormData();
    
    // Add the file
    formData.append("file", file);
    
    // Add other form fields
    Object.entries(planData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    return restClient.post<UserPlan>("/user-plans/upload", formData);
  }

  static async updatePlan(id: string, planData: UpdateUserPlanDto): Promise<UserPlan> {
    return restClient.patch<UserPlan>(`/user-plans/${id}`, planData);
  }

  static async setActivePlan(id: string): Promise<UserPlan> {
    return restClient.patch<UserPlan>(`/user-plans/${id}/activate`, {});
  }

  static async deletePlan(id: string): Promise<void> {
    return restClient.delete<void>(`/user-plans/${id}`);
  }
}
