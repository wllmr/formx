import { ValidationResult, ValidationState, Validator } from "../Validator";

export class VRequired extends Validator {
  constructor(error: string = "Value is required") {
    super(error);
  }

  validate(value: unknown): ValidationResult {
    if (typeof value !== "undefined" && value !== null) {
      return { state: ValidationState.VALID };
    }

    return {
      state: ValidationState.INVALID,
      error: this.error,
    };
  }
}
