import { describe, expect, it } from "vitest";
import { hasPermission } from "@/features/rbac/permissions";

describe("RBAC permissions", () => {
  it("allows owners to perform all board actions", () => {
    expect(hasPermission("OWNER", "BOARD_DELETE")).toBe(true);
    expect(hasPermission("OWNER", "MEMBER_REMOVE")).toBe(true);
  });

  it("allows editors to modify columns and tasks only", () => {
    expect(hasPermission("EDITOR", "COLUMN_CREATE")).toBe(true);
    expect(hasPermission("EDITOR", "TASK_MOVE")).toBe(true);
    expect(hasPermission("EDITOR", "BOARD_UPDATE")).toBe(false);
    expect(hasPermission("EDITOR", "MEMBER_INVITE")).toBe(false);
  });

  it("keeps viewers read-only", () => {
    expect(hasPermission("VIEWER", "TASK_UPDATE")).toBe(false);
    expect(hasPermission("VIEWER", "COLUMN_MOVE")).toBe(false);
  });
});
