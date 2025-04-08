import { ValidationState, Validator, ValidatorResult } from "../Validator";

export class VMax extends Validator {
  max: number;

  constructor(max: number, error: string = `Value must be at most ${max}`) {
    super(error);
    this.max = max;
  }

  validate(value: unknown): ValidatorResult {
    if (
      (typeof value !== "number" || isNaN(value)) &&
      (typeof value !== "string" || value === "" || isNaN(Number(value)))
    ) {
      return { state: ValidationState.VALID };
    }

    if (Number(value) <= this.max) {
      return { state: ValidationState.VALID };
    }

    return {
      state: ValidationState.INVALID,
      error: this.error,
    };
  }
}
