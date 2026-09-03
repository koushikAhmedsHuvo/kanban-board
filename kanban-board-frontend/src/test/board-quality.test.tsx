import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BoardCard } from "@/features/boards/components/board-card";
import { TaskCard } from "@/features/tasks/components/task-card";
import { calculatePosition } from "@/features/columns/components/kanban-board";
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
describe("board quality", () => {
  it("renders board role and owner", () => {
    render(
      <BoardCard
        board={{
          id: "b1",
          name: "Roadmap",
          role: "OWNER",
          owner: { id: "u1", name: "Koushik" },
          createdAt: "2026-01-01",
          updatedAt: "2026-01-01",
        }}
      />,
    );
    expect(screen.getByText("Roadmap")).toBeInTheDocument();
    expect(screen.getByText("OWNER")).toBeInTheDocument();
  });
  it("renders task content", () => {
    render(
      <TaskCard
        task={{
          id: "t1",
          title: "Ship UI",
          description: "Review the board",
          position: 1000,
        }}
        onOpen={vi.fn()}
      />,
    );
    expect(screen.getByText("Ship UI")).toBeInTheDocument();
    expect(screen.getByText("Review the board")).toBeInTheDocument();
  });
  it("calculates positions for all insertion points", () => {
    expect(calculatePosition(1000, 2000)).toBe(1500);
    expect(calculatePosition(undefined, 1000)).toBe(500);
    expect(calculatePosition(2000, undefined)).toBe(3000);
  });
});
