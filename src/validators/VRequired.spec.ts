import { describe, expect, it } from "vitest";
import { ValidationState } from "../Validator";
import { VRequired } from "./VRequired";

describe("VRequired", () => {
  it.each([
    ["non-empty string", "hello", ValidationState.VALID],
    ["empty string", "", ValidationState.VALID],
    ["zero", 0, ValidationState.VALID],
    ["false boolean", false, ValidationState.VALID],
    ["empty array", [], ValidationState.VALID],
    ["empty object", {}, ValidationState.VALID],
    ["undefined", undefined, ValidationState.INVALID],
    ["null", null, ValidationState.INVALID],
  ])("should validate %s", (_label, value, expectedState) => {
    const validator = new VRequired();
    const result = validator.validate(value);
    expect(result.state).toBe(expectedState);
  });

  it("should return the custom error message when invalid", () => {
    const validator = new VRequired("This field is required!");
    const result = validator.validate(undefined);
    if (result.state === ValidationState.INVALID) {
      expect(result.error).toBe("This field is required!");
    }
  });

  it("should use the default error message if none provided", () => {
    const validator = new VRequired();
    const result = validator.validate(null);
    if (result.state === ValidationState.INVALID) {
      expect(result.error).toBe("Value is required");
    }
  });
});
