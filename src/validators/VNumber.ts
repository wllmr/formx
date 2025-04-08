import { ValidationState, Validator, ValidatorResult } from "../Validator";

export class VNumber extends Validator {
  constructor(error: string = "Value must be a number") {
    super(error);
  }

  validate(value: unknown): ValidatorResult {
    if (typeof value === "undefined" || value === null) {
      return { state: ValidationState.VALID };
    }

    if (
      (typeof value === "number" && !isNaN(value)) ||
      (typeof value === "string" && value.length && !isNaN(Number(value)))
    ) {
      return { state: ValidationState.VALID };
    }

    return {
      state: ValidationState.INVALID,
      error: this.error,
    };
  }
}
