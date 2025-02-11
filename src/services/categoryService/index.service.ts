import { Category } from "@db/entities/Category.entity";
import { User } from "@db/entities/User.entity";
import { db } from "@db/index";
import { CreateCategoryPayload, EditCategoryPayload } from "@typeDeclarations/category";
import { APIError } from "@utils/errors/apiError";

import { CategoryServiceInterface } from "./index.interface";

export class CategoryService implements CategoryServiceInterface {
  async getCategoriesByIds(userId: string, categoriesIds: string[]) {
    const categoryRepository = db.getRepository(Category);

    const categories = await categoryRepository.find({
      where: {
        user: {
          id: userId
        }
      }
    });

    return categories.filter((item) => JSON.stringify(categoriesIds).includes(item.id));
  }

  async getCategories(userId: string) {
    const categoryRepository = db.getRepository(Category);

    return await categoryRepository.find({
      where: {
        user: {
          id: userId
        }
      }
    });
  }

  async createCategory(payload: CreateCategoryPayload, user: User) {
    const categoryRepository = db.getRepository(Category);

    const categoryByName = await categoryRepository.findOne({
      where: {
        name: payload.name
      }
    });
    if (categoryByName) {
      throw new APIError("Category already exists.", 400);
    }

    const category = new Category();
    category.name = payload.name;
    category.user = user;

    return await categoryRepository.save(category);
  }

  async editCategory(payload: EditCategoryPayload, categoryId: string) {
    const categoryRepository = db.getRepository(Category);

    const category = await categoryRepository.findOne({
      where: {
        id: categoryId
      }
    });
    if (!category) {
      throw new APIError("Category not found.", 404);
    }

    category.name = payload.name;
    await categoryRepository.update(category.id, category);

    return category;
  }

  async deleteCategory(categoryId: string) {
    const categoryRepository = db.getRepository(Category);

    const category = await categoryRepository.findOne({
      where: {
        id: categoryId
      }
    });
    if (!category) {
      throw new APIError("Category not found.", 404);
    }

    await categoryRepository.remove(category);

    return categoryId;
  }
}
