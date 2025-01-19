import {
  CategoryIdParams,
  CreateCategoryPayload,
  CreateCategoryResponse,
  DeleteCategoryResponse,
  EditCategoryPayload,
  EditCategoryResponse,
  GetCategoriesResponse
} from "@typeDeclarations/category";
import { AppRequestHandler } from "@typeDeclarations/common";

export interface CategoryControllerInterface {
  getCategories: AppRequestHandler<GetCategoriesResponse>;
  createCategory: AppRequestHandler<CreateCategoryResponse, CreateCategoryPayload>;
  editCategory: AppRequestHandler<EditCategoryResponse, EditCategoryPayload, CategoryIdParams>;
  deleteCategory: AppRequestHandler<DeleteCategoryResponse, unknown, CategoryIdParams>;
}
