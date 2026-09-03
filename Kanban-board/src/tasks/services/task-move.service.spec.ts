import { TaskMoveService } from "./task-move.service";

describe("TaskMoveService", () => {
  const repository = {
    transaction: jest.fn(),
    findTask: jest.fn(),
    findColumn: jest.fn(),
    lockColumns: jest.fn(),
    lockColumnTasks: jest.fn(),
    findColumnTasks: jest.fn(),
    updateTaskPosition: jest.fn(),
    rebalanceColumn: jest.fn(),
  };
  const service = new TaskMoveService(repository as never);

  beforeEach(() => jest.clearAllMocks());

  it.each([
    [undefined, undefined, 1000],
    [undefined, 1000, 500],
    [1000, undefined, 2000],
    [1000, 2000, 1500],
  ])("calculates position %p, %p -> %p", (previous, next, expected) => {
    expect(service.calculatePosition(previous, next)).toBe(expected);
  });

  it("moves a task across columns", async () => {
    repository.transaction.mockImplementation(
      async (callback: (tx: unknown) => Promise<void>) => callback({}),
    );
    repository.findTask.mockResolvedValue({
      id: "task-b",
      columnId: "todo",
      position: 2000,
    });
    repository.findColumn.mockResolvedValue({ id: "doing" });
    repository.findColumnTasks
      .mockResolvedValueOnce([
        { id: "task-a", position: 1000 },
        { id: "task-b", position: 2000 },
      ])
      .mockResolvedValueOnce([
        { id: "task-x", position: 1000 },
        { id: "task-y", position: 2000 },
      ]);

    await service.moveTask("task-b", "doing", 1);

    expect(repository.updateTaskPosition).toHaveBeenLastCalledWith(
      {},
      "task-b",
      "doing",
      1500,
    );
  });

  it("does not update a task for a no-op", async () => {
    repository.transaction.mockImplementation(
      async (callback: (tx: unknown) => Promise<void>) => callback({}),
    );
    repository.findTask.mockResolvedValue({
      id: "task-a",
      columnId: "todo",
      position: 1000,
    });
    repository.findColumn.mockResolvedValue({ id: "todo" });
    repository.findColumnTasks.mockResolvedValue([
      { id: "task-a", position: 1000 },
      { id: "task-b", position: 2000 },
    ]);

    await service.moveTask("task-a", "todo", 0);

    expect(repository.updateTaskPosition).not.toHaveBeenCalled();
  });
});
