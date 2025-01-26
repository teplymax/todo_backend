export function mockPagination() {
  const mockPaginatedFind = jest.fn();

  jest.mock("@utils/common/paginationUtils", () => ({
    getPaginatedFind: (args: unknown[]) => {
      return args[args.length - 1];
    },
    withPagination: () => {
      return function (_target: object, _key: string, descriptor: PropertyDescriptor) {
        const originalValue = descriptor.value;
        descriptor.value = function (...args: unknown[]) {
          // Call the original function
          return originalValue?.call?.(this, ...args, mockPaginatedFind);
        };
      };
    }
  }));

  return {
    mockPaginatedFind
  };
}
