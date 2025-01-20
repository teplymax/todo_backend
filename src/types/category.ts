import { Category } from "@db/entities/Category.entity";

import { ParamsDictionary } from "./common";

export interface GetCategoriesResponse {
  categories: Category[];
}

export interface CreateCategoryPayload {
  name: string;
}

export interface CreateCategoryResponse {
  category: MappedCategory;
}

export interface EditCategoryPayload {
  name: string;
}

export interface EditCategoryResponse {
  category: MappedCategory;
}

export interface DeleteCategoryResponse {
  categoryId: string;
}

export interface CategoryIdParams extends ParamsDictionary {
  categoryId: string;
}

export type MappedCategory = Omit<Category, "user">;
