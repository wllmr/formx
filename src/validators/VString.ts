import { ValidationResult, ValidationState, Validator } from "../Validator";

export class VString extends Validator {
  constructor(error: string = "Value must be a text") {
    super(error);
  }

  validate(value: unknown): ValidationResult {
    if (typeof value === "undefined" || value === null) {
      return { state: ValidationState.VALID };
    }

    if (typeof value === "string") {
      return { state: ValidationState.VALID };
    }

    return {
      state: ValidationState.INVALID,
      error: this.error,
    };
  }
}
