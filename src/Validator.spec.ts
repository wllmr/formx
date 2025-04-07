import { describe, expect, it } from "vitest";
import { ValidationResult, ValidationState, Validator } from "./Validator";

// 🔧 A simple mock validator that always returns VALID
class AlwaysValidValidator extends Validator {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(_: unknown): ValidationResult {
    return { state: ValidationState.VALID };
  }
}

class AlwaysInvalidValidator extends Validator {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(_: unknown): ValidationResult {
    return {
      state: ValidationState.INVALID,
      error: this.error,
    };
  }
}

describe("Validator", () => {
  it("should store the error message", () => {
    const validator = new AlwaysValidValidator("Required field");
    expect(validator.error).toBe("Required field");
  });

  it("should generate a comparator based on class name and error", () => {
    const validator = new AlwaysValidValidator("Test error");
    expect(validator.getComparator()).toBe("AlwaysValidValidator_Test error");
  });

  it("should return VALID from AlwaysValidValidator", () => {
    const validator = new AlwaysValidValidator("Ignored");
    const result = validator.validate("anything");
    expect(result.state).toBe(ValidationState.VALID);
  });

  it("should return INVALID from AlwaysInvalidValidator with correct error", () => {
    const validator = new AlwaysInvalidValidator("This is invalid");
    const result = validator.validate("anything");
    expect(result.state).toBe(ValidationState.INVALID);
    if (result.state === ValidationState.INVALID) {
      expect(result.error).toBe("This is invalid");
    }
  });

  it("should use the class name as ID by default", () => {
    const validator = new AlwaysValidValidator("some error");
    expect(validator["id"]).toBe("AlwaysValidValidator");
  });
});
