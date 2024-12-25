export function mockDB() {
  const mockFindOne = jest.fn();
  const mockSave = jest.fn().mockImplementation((value) => value);
  const mockCreate = jest.fn().mockImplementation((value) => value);
  const mockRemove = jest.fn();
  const mockUpdate = jest.fn();

  const mockGetRepository = jest.fn().mockReturnValue({
    findOne: mockFindOne,
    save: mockSave,
    create: mockCreate,
    update: mockUpdate,
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
    mockRemove,
    mockUpdate
  };
}
