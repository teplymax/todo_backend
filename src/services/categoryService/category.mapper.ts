import _ from "lodash";

import { Category } from "@db/entities/Category.entity";
import { MappedCategory } from "@typeDeclarations/category";
import { Mapper } from "@typeDeclarations/common";

export class CategoryMapper implements Mapper<Category, MappedCategory> {
  private static instance: CategoryMapper;

  static getInstance(): CategoryMapper {
    if (!this.instance) {
      this.instance = new CategoryMapper();
    }

    return this.instance;
  }

  map(data: Category): MappedCategory {
    return _.omit(data, ["user"]);
  }
}
