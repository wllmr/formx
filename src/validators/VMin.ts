import { ValidationResult, ValidationState, Validator } from "../Validator";

export class VMin extends Validator {
  min: number;

  constructor(min: number, error: string = `Value must be at least ${min}`) {
    super(error);
    this.min = min;
  }

  validate(value: unknown): ValidationResult {
    if (
      (typeof value !== "number" || isNaN(value)) &&
      (typeof value !== "string" || value === "" || isNaN(Number(value)))
    ) {
      return { state: ValidationState.VALID };
    }

    if (Number(value) >= this.min) {
      return { state: ValidationState.VALID };
    }

    return {
      state: ValidationState.INVALID,
      error: this.error,
    };
  }
}
