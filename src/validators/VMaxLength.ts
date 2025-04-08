import { ValidationState, Validator, ValidatorResult } from "../Validator";

export class VMaxLength extends Validator {
  maxLength: number;

  constructor(
    maxLength: number,
    error: string = `Value must be at most ${maxLength} characters`,
  ) {
    super(error);
    this.maxLength = maxLength;
  }

  validate(value: unknown): ValidatorResult {
    if (typeof value === "string") {
      if (value.length > this.maxLength) {
        return {
          state: ValidationState.INVALID,
          error: this.error,
          forceErrors: true,
        };
      }
      return { state: ValidationState.VALID };
    }

    if (Array.isArray(value)) {
      if (value.length > this.maxLength) {
        return {
          state: ValidationState.INVALID,
          error: this.error,
          forceErrors: true,
        };
      }
      return { state: ValidationState.VALID };
    }

    return { state: ValidationState.VALID };
  }
}
