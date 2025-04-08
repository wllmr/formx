import { ValidationState, Validator, ValidatorResult } from "../Validator";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class VEmail extends Validator {
  constructor(error: string = `Value must be a valid email address`) {
    super(error);
  }

  validate(value: unknown): ValidatorResult {
    if (typeof value !== "string") {
      return { state: ValidationState.VALID };
    }

    if (emailRegex.test(value)) {
      return { state: ValidationState.VALID };
    }

    return {
      state: ValidationState.INVALID,
      error: this.error,
    };
  }
}
