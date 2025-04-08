import {
  BehaviorSubject,
  Observable,
  catchError,
  combineLatest,
  distinctUntilChanged,
  from,
  map,
  of,
  switchMap,
  toArray,
} from "rxjs";
import { type Form } from "./Form";
import {
  ValidationState,
  Validator,
  ValidatorResult,
  ValidatorResultInvalid,
} from "./Validator";

export interface FieldResultValid {
  state: ValidationState.VALID;
}

export interface FieldResultInvalid {
  state: ValidationState.INVALID;
  error: string[];
  showErrors: boolean;
}

export interface FieldResultPending {
  state: ValidationState.PENDING;
}

export type FieldResult =
  | FieldResultValid
  | FieldResultInvalid
  | FieldResultPending;

export class Field<T> {
  #form$: BehaviorSubject<Form | undefined>;
  #touched$: BehaviorSubject<boolean>;
  #showErrors$: BehaviorSubject<boolean>;
  #validators: Validator[];
  element: HTMLElement;
  name: string;
  value$: BehaviorSubject<T>;
  result$: BehaviorSubject<FieldResult>;

  static create<T>(
    element: string | HTMLElement,
    name: string,
    initialValue: T,
    validators: Validator[] = [],
  ) {
    const _element =
      typeof element === "string" ? document.getElementById(element) : element;

    if (_element === null) {
      throw new Error(`Element with id ${element} not found`);
    }

    return new Field(_element, name, initialValue, validators);
  }

  private constructor(
    element: HTMLElement,
    name: string,
    initialValue: T,
    validators: Validator[] = [],
  ) {
    this.#form$ = new BehaviorSubject<Form | undefined>(undefined);
    this.#touched$ = new BehaviorSubject(false);
    this.#showErrors$ = new BehaviorSubject(false);
    this.#validators = validators;
    this.element = element;
    this.name = name;
    this.value$ = new BehaviorSubject(initialValue);
    this.result$ = new BehaviorSubject<FieldResult>({
      state: ValidationState.PENDING,
    });

    combineLatest([
      this.#touched$,
      this.#form$.pipe(switchMap((form) => form?.submitted$ ?? of(false))),
    ])
      .pipe(distinctUntilChanged((a, b) => a[0] === b[0] && a[1] === b[1]))
      .subscribe(() => this.#evaluateShowErrors());

    this.value$
      .pipe(switchMap((value) => this.runValidators(value)))
      .subscribe((result) => this.result$.next(result));
  }

  #evaluateShowErrors() {
    let showErrors = this.#showErrors$.getValue();

    if (showErrors) {
      return;
    }

    const form = this.#form$.getValue();

    if (
      (typeof form !== "undefined" && form.isSubmitted$.getValue()) ||
      (typeof form === "undefined" && this.#touched$.getValue())
    ) {
      showErrors = true;
    }

    if (showErrors) {
      this.#showErrors$.next(true);
      this.runValidators(this.value).subscribe((result) =>
        this.result$.next(result),
      );
    }
  }

  runValidators(value: T): Observable<FieldResult> {
    if (this.#validators.length === 0) {
      return of({ state: ValidationState.VALID });
    }

    const observables = this.#validators.map((validator) => {
      try {
        const result = validator.validate(value);

        return result instanceof Promise
          ? from(result).pipe(
              catchError(() =>
                of<ValidatorResult>({
                  state: ValidationState.INVALID,
                  error: ["VALIDATION_ERROR"],
                }),
              ),
            )
          : of(result);
      } catch {
        return of<ValidatorResult>({
          state: ValidationState.INVALID,
          error: ["VALIDATION_ERROR"],
        });
      }
    });

    return from(observables).pipe(
      switchMap((v$) => v$),
      toArray(),
      map((results) => {
        const pendingResult = results.find(
          (result) => result?.state === ValidationState.PENDING,
        );

        if (typeof pendingResult !== "undefined") {
          return pendingResult;
        }

        const invalidResult =
          results.find(
            (result): result is ValidatorResultInvalid =>
              result?.state === ValidationState.INVALID && !!result.forceErrors,
          ) ||
          results.find(
            (result): result is ValidatorResultInvalid =>
              result?.state === ValidationState.INVALID,
          );

        if (typeof invalidResult !== "undefined") {
          if (invalidResult.forceErrors) {
            this.#showErrors$.next(true);
          }

          const showErrors =
            invalidResult.forceErrors || this.#showErrors$.getValue();

          return {
            state: ValidationState.INVALID,
            error: invalidResult.error,
            showErrors,
          };
        }

        return { state: ValidationState.VALID };
      }),
    );
  }

  set form(form: Form) {
    this.#form$.next(form);
  }

  get errors(): string[] | undefined {
    const result = this.result$.getValue();
    return result.state === ValidationState.INVALID ? result.error : undefined;
  }

  get value(): T {
    return this.value$.getValue();
  }

  set value(value: T) {
    this.value$.next(value);
  }

  set validators(validators: Validator[]) {
    this.#validators = validators;
    this.runValidators(this.value).subscribe((result) =>
      this.result$.next(result),
    );
  }

  markAsTouched() {
    this.#touched$.next(true);
  }
}
