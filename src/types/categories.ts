import { Category } from "@db/entities/Category.entity";

import { ParamsDictionary } from "./common";

export interface GetCategoriesResponse {
  categories: Category[];
}

export interface CreateCategoryPayload {
  name: string;
}

export interface CreateCategoryResponse {
  category: Category;
}

export interface EditCategoryPayload {
  name: string;
}

export interface EditCategoryResponse {
  category: Category;
}

export interface DeleteCategoryResponse {
  categoryId: string;
}

export interface CategoryIdParams extends ParamsDictionary {
  categoryId: string;
}
