import { ValidationResult, ValidationState, Validator } from "../Validator";

export class VMax extends Validator {
  max: number;

  constructor(max: number, error: string = `Value must be at most ${max}`) {
    super(error);
    this.max = max;
  }

  validate(value: unknown): ValidationResult {
    if (typeof value !== "number" || isNaN(value)) {
      return { state: ValidationState.VALID };
    }

    if (value <= this.max) {
      return { state: ValidationState.VALID };
    }

    return {
      state: ValidationState.INVALID,
      error: this.error,
    };
  }
}
