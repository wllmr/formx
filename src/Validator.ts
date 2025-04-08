export enum ValidationState {
  VALID = "VALID",
  INVALID = "INVALID",
  PENDING = "PENDING",
}

export interface ValidatorResultValid {
  state: ValidationState.VALID;
}

export interface ValidatorResultInvalid {
  state: ValidationState.INVALID;
  error: string[];
  forceErrors?: boolean;
}

export interface ValidatorResultPending {
  state: ValidationState.PENDING;
}

export type ValidatorResult =
  | ValidatorResultValid
  | ValidatorResultInvalid
  | ValidatorResultPending;

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

  abstract validate(value: unknown): ValidatorResult | Promise<ValidatorResult>;
}
