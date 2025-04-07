import { describe, expect, it } from "vitest";
import { getSum } from "./getSum";

describe("getSum", () => {
  it("should return total sum", () => {
    const sum = getSum(1, 2);
    expect(sum).toBe(3);
  });
});
