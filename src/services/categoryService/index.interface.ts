import { Category } from "@db/entities/Category.entity";
import { User } from "@db/entities/User.entity";
import { CreateCategoryPayload, EditCategoryPayload } from "@typeDeclarations/category";

export interface CategoryServiceInterface {
  getCategories: (userId: string) => Promise<Category[]>;
  getCategoriesByIds: (userId: string, categoryIds: string[]) => Promise<Category[]>;
  createCategory: (payload: CreateCategoryPayload, user: User) => Promise<Category>;
  editCategory: (payload: EditCategoryPayload, categoryId: string) => Promise<Category>;
  deleteCategory: (categoryId: string) => Promise<string>;
}
