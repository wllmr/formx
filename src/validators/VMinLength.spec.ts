import { describe, expect, it } from "vitest";
import { ValidationState } from "../Validator";
import { VMinLength } from "./VMinLength";

describe("VMinLength", () => {
  it.each([
    ["short string", "hi", ValidationState.INVALID],
    ["exact length string", "hey", ValidationState.VALID],
    ["long string", "hello", ValidationState.VALID],
    ["empty string", "", ValidationState.INVALID],
    ["short array", [1], ValidationState.INVALID],
    ["exact length array", [1, 2, 3], ValidationState.VALID],
    ["long array", [1, 2, 3, 4], ValidationState.VALID],
    ["number (not string or array)", 42, ValidationState.VALID],
    ["null", null, ValidationState.VALID],
    ["undefined", undefined, ValidationState.VALID],
  ])("should validate %s", (_label, value, expectedState) => {
    const validator = new VMinLength(3);
    const result = validator.validate(value);
    expect(result.state).toBe(expectedState);
  });

  it("should use the custom error message", () => {
    const validator = new VMinLength(5, "Too short!");
    const result = validator.validate("hey");
    if (result.state === ValidationState.INVALID) {
      expect(result.error).toBe("Too short!");
    }
  });
});
