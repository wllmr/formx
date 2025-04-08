import { ValidationResult, ValidationState, Validator } from "../Validator";

export class VRequired extends Validator {
  constructor(error: string = "Value is required") {
    super(error);
  }

  validate(value: unknown): ValidationResult {
    if (!isEmptyValue(value)) {
      return { state: ValidationState.VALID };
    }

    return {
      state: ValidationState.INVALID,
      error: this.error,
    };
  }
}

function isEmptyValue(value: unknown): boolean {
  return (
    value === "" ||
    value === null ||
    value === undefined ||
    (typeof value === "number" && isNaN(value))
  );
}
