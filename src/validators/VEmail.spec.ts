import { describe, expect, it } from "vitest";
import { ValidationState } from "../Validator";
import { VEmail } from "./VEmail";

describe("VEmail", () => {
  it.each([
    ["valid email", "test@example.com", ValidationState.VALID],
    ["subdomain email", "john@sub.domain.com", ValidationState.VALID],
    ["numeric domain", "user@123.com", ValidationState.VALID],
    ["email with dot in name", "first.last@domain.co", ValidationState.VALID],
    ["missing @", "testexample.com", ValidationState.INVALID],
    ["missing domain", "test@", ValidationState.INVALID],
    ["missing username", "@domain.com", ValidationState.INVALID],
    ["invalid TLD", "test@domain", ValidationState.INVALID],
    ["empty string", "", ValidationState.INVALID],
    ["null", null, ValidationState.VALID],
    ["undefined", undefined, ValidationState.VALID],
    ["number", 123, ValidationState.VALID],
  ])("should validate %s", (_label, value, expectedState) => {
    const validator = new VEmail();
    const result = validator.validate(value);
    expect(result.state).toBe(expectedState);
  });

  it("should use the custom error message", () => {
    const validator = new VEmail("Invalid email!");
    const result = validator.validate("not-an-email");
    if (result.state === ValidationState.INVALID) {
      expect(result.error).toBe("Invalid email!");
    }
  });

  it("should use the default error message", () => {
    const validator = new VEmail();
    const result = validator.validate("nope");
    if (result.state === ValidationState.INVALID) {
      expect(result.error).toBe("Value must be a valid email address");
    }
  });
});
