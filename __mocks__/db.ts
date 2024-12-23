export function mockDB() {
  const mockFindOne = jest.fn();
  const mockSave = jest.fn();
  const mockCreate = jest.fn();
  const mockRemove = jest.fn();

  const mockGetRepository = jest.fn().mockReturnValue({
    findOne: mockFindOne,
    save: mockSave,
    create: mockCreate,
    remove: mockRemove
  });

  jest.mock("@db", () => ({
    db: {
      getRepository: mockGetRepository
    }
  }));

  return {
    mockFindOne,
    mockSave,
    mockCreate,
    mockRemove
  };
}
