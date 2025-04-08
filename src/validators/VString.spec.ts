import { describe, expect, it } from "vitest";
import { ValidationState } from "../Validator";
import { VString } from "./VString";

describe("VString", () => {
  it.each([
    ["string: normal", "hello", ValidationState.VALID],
    ["string: empty", "", ValidationState.VALID],
    ["undefined", undefined, ValidationState.VALID],
    ["null", null, ValidationState.VALID],
    ["number", 123, ValidationState.INVALID],
    ["boolean", true, ValidationState.INVALID],
    ["object", { key: "value" }, ValidationState.INVALID],
    ["array", ["a", "b"], ValidationState.INVALID],
  ])("should validate %s", (_label, value, expectedState) => {
    const validator = new VString();
    const result = validator.validate(value);
    expect(result.state).toBe(expectedState);
  });

  it("should use the provided error message on invalid input", () => {
    const validator = new VString("Not a string!");
    const result = validator.validate(123);
    if (result.state === ValidationState.INVALID) {
      expect(JSON.stringify(result.error)).toBe(
        JSON.stringify(["Not a string!"]),
      );
    }
  });

  it("should fallback to the default error message", () => {
    const validator = new VString();
    const result = validator.validate(123);
    if (result.state === ValidationState.INVALID) {
      expect(JSON.stringify(result.error)).toBe(
        JSON.stringify(["Value must be a text"]),
      );
    }
  });
});
