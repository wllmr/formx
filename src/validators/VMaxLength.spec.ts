import { describe, expect, it } from "vitest";
import { ValidationState } from "../Validator";
import { VMaxLength } from "./VMaxLength";

describe("VMaxLength", () => {
  it.each([
    ["short string", "hi", ValidationState.VALID],
    ["exact string", "hey", ValidationState.VALID],
    ["long string", "hello", ValidationState.INVALID],
    ["empty string", "", ValidationState.VALID],
    ["short array", [1], ValidationState.VALID],
    ["exact array", [1, 2, 3], ValidationState.VALID],
    ["long array", [1, 2, 3, 4], ValidationState.INVALID],
    ["number (not length-aware)", 123, ValidationState.VALID],
    ["null", null, ValidationState.VALID],
    ["undefined", undefined, ValidationState.VALID],
  ])("should validate %s", (_label, value, expectedState) => {
    const validator = new VMaxLength(3);
    const result = validator.validate(value);
    expect(result.state).toBe(expectedState);
  });

  it("should use the custom error message", () => {
    const validator = new VMaxLength(2, "Too long!");
    const result = validator.validate("hello");
    if (result.state === ValidationState.INVALID) {
      expect(result.error).toBe("Too long!");
    }
  });

  it("should use the default error message", () => {
    const validator = new VMaxLength(2);
    const result = validator.validate("abc");
    if (result.state === ValidationState.INVALID) {
      expect(result.error).toBe("Value must be at most 2 characters");
    }
  });
});
