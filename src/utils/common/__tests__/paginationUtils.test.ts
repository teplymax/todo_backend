import { mockDB } from "@__mocks__/db";
import { Todo } from "@db/entities/Todo.entity";

import { getPaginatedFind, withPagination } from "../paginationUtils";

const { mockFind, mockFindAndCount } = mockDB();

const { db } = await import("@db/index");

class TestClass {
  @withPagination(Todo, db)
  async testMethod(userId: string, ...args: unknown[]): Promise<unknown> {
    const find = getPaginatedFind(args);

    return await find({
      where: {
        user: {
          id: userId
        }
      }
    });
  }
}

describe("Pagination utils test", () => {
  describe("withPagination", () => {
    let instance: TestClass;
    const mockArg = "mockArg";
    const mockData = ["mockData"];

    beforeEach(() => {
      instance = new TestClass();
    });

    it("should get all data correctly if there is no pagination config", async () => {
      mockFind.mockResolvedValue(mockData);

      const result = await instance.testMethod(mockArg);

      expect(db.getRepository).toHaveBeenCalledWith(Todo);
      expect(mockFind).toHaveBeenCalledWith({
        where: {
          user: {
            id: mockArg
          }
        }
      });
      expect(result).toEqual(mockData);
    });

    it.each([
      //First page
      {
        mockResult: [mockData, 20],
        paginationConfig: {
          limit: 10,
          page: 1
        },
        expectedPaginationResult: {
          prevPage: null,
          nextPage: 2,
          currentPage: 1,
          total: 20,
          data: mockData
        }
      },
      //Last page
      {
        mockResult: [mockData, 20],
        paginationConfig: {
          limit: 10,
          page: 2
        },
        expectedPaginationResult: {
          prevPage: 1,
          nextPage: null,
          currentPage: 2,
          total: 20,
          data: mockData
        }
      }
    ])(
      "should get paginated data correctly if there is no pagination config",
      async ({ mockResult, expectedPaginationResult, paginationConfig }) => {
        mockFindAndCount.mockResolvedValue(mockResult);

        const result = await instance.testMethod(mockArg, paginationConfig);

        expect(db.getRepository).toHaveBeenCalledWith(Todo);
        expect(mockFind).toHaveBeenCalledWith({
          where: {
            user: {
              id: mockArg
            }
          }
        });
        expect(result).toEqual(expectedPaginationResult);
      }
    );
  });

  describe("getPaginatedFind", () => {
    it("should return latests arg from array", () => {
      const arg = jest.fn();

      const result = getPaginatedFind([arg]);

      expect(result).toEqual(arg);
    });
  });
});
