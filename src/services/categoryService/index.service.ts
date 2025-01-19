import { Category } from "@db/entities/Category.entity";
import { User } from "@db/entities/User.entity";
import { db } from "@db/index";
import { CreateCategoryPayload, EditCategoryPayload } from "@typeDeclarations/categories";
import { APIError } from "@utils/errors/apiError";

import { CategoryServiceInterface } from "./index.interface";

export class CategoryService implements CategoryServiceInterface {
  async getCategories(userId: string) {
    const categoriesRepository = db.getRepository(Category);

    return await categoriesRepository.find({
      where: {
        user: {
          id: userId
        }
      }
    });
  }

  async createCategory(payload: CreateCategoryPayload, user: User) {
    const categoriesRepository = db.getRepository(Category);

    const category = new Category();

    category.name = payload.name;
    category.user = user;

    return await categoriesRepository.save(category);
  }

  async editCategory(payload: EditCategoryPayload, categoryId: string) {
    const categoriesRepository = db.getRepository(Category);

    const category = await categoriesRepository.findOne({
      where: {
        id: categoryId
      }
    });

    if (!category) {
      throw new APIError("Category not found.", 404);
    }

    category.name = payload.name;
    await categoriesRepository.update(category.id, category);

    return category;
  }

  async deleteCategory(categoryId: string) {
    const categoriesRepository = db.getRepository(Category);

    const category = await categoriesRepository.findOne({
      where: {
        id: categoryId
      }
    });

    if (!category) {
      throw new APIError("Category not found.", 404);
    }

    await categoriesRepository.remove(category);

    return categoryId;
  }
}
