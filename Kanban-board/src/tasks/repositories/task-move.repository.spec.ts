import { Prisma } from "@prisma/client";
import { TaskMoveRepository } from "./task-move.repository";

describe("TaskMoveRepository", () => {
  it("exposes serializable transactions", async () => {
    const prisma = {
      $transaction: jest.fn((callback) => callback({})),
    } as unknown as Prisma.TransactionClient;
    const repository = new TaskMoveRepository(prisma as never);
    await repository.transaction(async () => "ok");
    expect(
      (prisma as unknown as { $transaction: jest.Mock }).$transaction,
    ).toHaveBeenCalledWith(expect.any(Function), {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    });
  });
});
