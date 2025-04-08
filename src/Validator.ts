export enum ValidationState {
  VALID = "VALID",
  INVALID = "INVALID",
  PENDING = "PENDING",
}

export interface ValidationResultValid {
  state: ValidationState.VALID;
}

export interface ValidationResultInvalid {
  state: ValidationState.INVALID;
  error: string[];
  forceErrors?: boolean;
}

export interface ValidationResultPending {
  state: ValidationState.PENDING;
}

export type ValidationResult =
  | ValidationResultValid
  | ValidationResultInvalid
  | ValidationResultPending;

export abstract class Validator {
  protected id: string;
  error: string[];

  constructor(error: string) {
    this.error = [error];
    this.id = this.constructor.name;
  }

  public getComparator() {
    return this.id + "_" + this.error;
  }

  abstract validate(
    value: unknown,
  ): ValidationResult | Promise<ValidationResult>;
}
