import { describe, expect, it } from "vitest";
import { ValidationState } from "../Validator";
import { VMin } from "./VMin";

describe("VMin", () => {
  it.each([
    ["value below min", 3, ValidationState.INVALID],
    ["value equal to min", 5, ValidationState.VALID],
    ["value above min", 10, ValidationState.VALID],
    ["negative number", -5, ValidationState.INVALID],
    ["NaN", NaN, ValidationState.VALID], // Skipped by typeof check
    ["non-number: string", "5", ValidationState.VALID],
    ["non-number: null", null, ValidationState.VALID],
    ["non-number: undefined", undefined, ValidationState.VALID],
  ])("should validate %s", (_label, value, expectedState) => {
    const validator = new VMin(5);
    const result = validator.validate(value);
    expect(result.state).toBe(expectedState);
  });

  it("should return the custom error message", () => {
    const validator = new VMin(10, "Too small!");
    const result = validator.validate(1);
    if (result.state === ValidationState.INVALID) {
      expect(result.error).toBe("Too small!");
    }
  });

  it("should return the default error message", () => {
    const validator = new VMin(3);
    const result = validator.validate(0);
    if (result.state === ValidationState.INVALID) {
      expect(result.error).toBe("Value must be at least 3");
    }
  });
});
