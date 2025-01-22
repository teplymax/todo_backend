import { CategoryServiceSingleton } from "@services/categoryService";
import { CategoryMapper } from "@services/categoryService/category.mapper";
import { TokenServiceSingleton } from "@services/tokenService";
import { UserServiceSingleton } from "@services/userService";
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
import { generateResponse } from "@utils/common/generateResponse";
import { extractTokenFromAuthHeader } from "@utils/stringUtils";

import { CategoryControllerInterface } from "./index.interface";

class CategoryController implements CategoryControllerInterface {
  private getUserId(authorization: string): string {
    const token = extractTokenFromAuthHeader(authorization);

    return TokenServiceSingleton.getInstance().decodeToken(token).id;
  }

  getCategories: AppRequestHandler<GetCategoriesResponse> = async (req, res, next) => {
    try {
      const userId = this.getUserId(req.headers.authorization ?? "");
      const categories = await CategoryServiceSingleton.getInstance().getCategories(userId);

      res.status(200).json(
        generateResponse({
          categories
        })
      );
    } catch (error) {
      next(error);
    }
  };

  createCategory: AppRequestHandler<CreateCategoryResponse, CreateCategoryPayload> = async (req, res, next) => {
    try {
      const userId = this.getUserId(req.headers.authorization ?? "");

      const user = await UserServiceSingleton.getInstance().getUserById(userId);
      const category = await CategoryServiceSingleton.getInstance().createCategory(req.body, user);

      res.status(201).json(
        generateResponse({
          category: CategoryMapper.getInstance().map(category)
        })
      );
    } catch (error) {
      next(error);
    }
  };

  editCategory: AppRequestHandler<EditCategoryResponse, EditCategoryPayload, CategoryIdParams> = async (
    req,
    res,
    next
  ) => {
    try {
      const category = await CategoryServiceSingleton.getInstance().editCategory(req.body, req.params.categoryId);

      res.status(200).json(
        generateResponse({
          category
        })
      );
    } catch (error) {
      next(error);
    }
  };

  deleteCategory: AppRequestHandler<DeleteCategoryResponse, unknown, CategoryIdParams> = async (req, res, next) => {
    try {
      const categoryId = await CategoryServiceSingleton.getInstance().deleteCategory(req.params.categoryId);

      res.status(200).json(
        generateResponse({
          categoryId
        })
      );
    } catch (error) {
      next(error);
    }
  };
}

export const categoryController = new CategoryController();
