import { describe, expect, it } from "vitest";
import { ValidationState } from "../Validator";
import { VNumber } from "./VNumber";

describe("VNumber", () => {
  it.each([
    ["valid number", 123, ValidationState.VALID],
    ["zero", 0, ValidationState.VALID],
    ["negative number", -42, ValidationState.VALID],
    ["decimal", 3.14, ValidationState.VALID],
    ["NaN", NaN, ValidationState.INVALID],
    ["string number", "123", ValidationState.INVALID],
    ["empty string", "", ValidationState.INVALID],
    ["boolean true", true, ValidationState.INVALID],
    ["boolean false", false, ValidationState.INVALID],
    ["array", [1, 2, 3], ValidationState.INVALID],
    ["object", { num: 5 }, ValidationState.INVALID],
    ["undefined", undefined, ValidationState.VALID],
    ["null", null, ValidationState.VALID],
  ])("should validate %s", (_label, value, expectedState) => {
    const validator = new VNumber();
    const result = validator.validate(value);
    expect(result.state).toBe(expectedState);
  });

  it("should return the custom error message for invalid values", () => {
    const validator = new VNumber("Must be numeric!");
    const result = validator.validate("abc");
    if (result.state === ValidationState.INVALID) {
      expect(result.error).toBe("Must be numeric!");
    }
  });

  it("should use the default error message", () => {
    const validator = new VNumber();
    const result = validator.validate("not a number");
    if (result.state === ValidationState.INVALID) {
      expect(result.error).toBe("Value must be a number");
    }
  });
});
