import { ValidationState, Validator, ValidatorResult } from "../Validator";

export class VMinLength extends Validator {
  minLength: number;

  constructor(
    minLength: number,
    error: string = `Value must be at least ${minLength} characters`,
  ) {
    super(error);
    this.minLength = minLength;
  }

  validate(value: unknown): ValidatorResult {
    if (typeof value === "string") {
      if (value.length < this.minLength) {
        return {
          state: ValidationState.INVALID,
          error: this.error,
        };
      }
      return { state: ValidationState.VALID };
    }

    if (Array.isArray(value)) {
      if (value.length < this.minLength) {
        return {
          state: ValidationState.INVALID,
          error: this.error,
        };
      }
      return { state: ValidationState.VALID };
    }

    return { state: ValidationState.VALID };
  }
}
