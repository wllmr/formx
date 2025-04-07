import { describe, expect, it } from "vitest";
import { ValidationState } from "../Validator";
import { VMax } from "./VMax";

describe("VMax", () => {
  it.each([
    ["value below max", 5, ValidationState.VALID],
    ["value equal to max", 10, ValidationState.VALID],
    ["value above max", 11, ValidationState.INVALID],
    ["negative number", -5, ValidationState.VALID],
    ["NaN", NaN, ValidationState.VALID], // Not validated here
    ["non-number: string", "10", ValidationState.VALID],
    ["non-number: null", null, ValidationState.VALID],
    ["non-number: undefined", undefined, ValidationState.VALID],
    ["non-number: object", {}, ValidationState.VALID],
  ])("should validate %s", (_label, value, expectedState) => {
    const validator = new VMax(10);
    const result = validator.validate(value);
    expect(result.state).toBe(expectedState);
  });

  it("should use the custom error message", () => {
    const validator = new VMax(5, "Too high!");
    const result = validator.validate(6);
    if (result.state === ValidationState.INVALID) {
      expect(result.error).toBe("Too high!");
    }
  });

  it("should use the default error message", () => {
    const validator = new VMax(3);
    const result = validator.validate(4);
    if (result.state === ValidationState.INVALID) {
      expect(result.error).toBe("Value must be at most 3");
    }
  });
});
