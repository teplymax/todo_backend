import _ from "lodash";
import { DataSource, type EntityTarget, type FindManyOptions, type ObjectLiteral } from "typeorm";

import { PaginationResult } from "@typeDeclarations/common";

export function withPagination<Service extends object, Entity extends ObjectLiteral>(entity: Entity, db: DataSource) {
  return function (_target: Service, _key: keyof Service, descriptor: PropertyDescriptor) {
    const originalValue = descriptor.value;
    descriptor.value = function (...args: unknown[]) {
      const paginationParams = args[args.length - 1] as object;

      async function enhancedFind(options?: FindManyOptions<Entity>) {
        const repository = db.getRepository(entity as unknown as EntityTarget<Entity>);

        if (
          typeof paginationParams === "object" &&
          "limit" in paginationParams &&
          "page" in paginationParams &&
          _.isNumber(paginationParams.limit) &&
          _.isNumber(paginationParams.page)
        ) {
          const { limit, page: currentPage } = paginationParams;
          const indexToStartFrom = currentPage > 0 ? (currentPage - 1) * limit : 0;

          const [data, total] = await repository.findAndCount({
            skip: indexToStartFrom,
            take: paginationParams.limit,
            ...options
          });

          const prevPage = currentPage > 1 ? currentPage - 1 : null;
          const nextPage = indexToStartFrom + limit < total ? currentPage + 1 : null;

          return {
            prevPage,
            nextPage,
            currentPage,
            total,
            data
          };
        } else {
          return await repository.find(options);
        }
      }

      // Call the original function
      return originalValue?.call?.(this, ...args, enhancedFind);
    };
  };
}

export function getPaginatedFind<Entity extends ObjectLiteral>(args: unknown[]) {
  return args[args.length - 1] as (options?: FindManyOptions<Entity>) => Promise<Entity[] | PaginationResult<Entity[]>>;
}
