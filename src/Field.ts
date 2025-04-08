import {
  BehaviorSubject,
  Observable,
  catchError,
  from,
  map,
  of,
  switchMap,
  toArray,
} from "rxjs";
import { type Form } from "./Form";
import { ValidationResult, ValidationState, Validator } from "./Validator";

export class Field<T> {
  form?: Form;
  element: HTMLElement;
  name: string;
  value$: BehaviorSubject<T>;
  error$: BehaviorSubject<string[] | undefined>;
  touched$: BehaviorSubject<boolean>;
  forceErrors = false;

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
    private validators: Validator[] = [],
  ) {
    this.element = element;
    this.name = name;
    this.value$ = new BehaviorSubject(initialValue);
    this.error$ = new BehaviorSubject<string[] | undefined>(undefined);
    this.touched$ = new BehaviorSubject(false);

    this.value$
      .pipe(switchMap((value) => this.runValidators(value)))
      .subscribe((result) => {
        if (result.state === ValidationState.INVALID) {
          this.error$.next(result.error);
        } else {
          this.error$.next(undefined);
        }
      });
  }

  setForm(form: Form) {
    this.form = form;
  }

  getValue(): T {
    return this.value$.getValue();
  }

  setValue(value: T) {
    this.value$.next(value);
  }

  setValidators(validators: Validator[]) {
    this.validators = validators;
    this.runValidators(this.getValue()).subscribe((result) => {
      if (result.state === ValidationState.INVALID) {
        this.error$.next(result.error);
      } else {
        this.error$.next(undefined);
      }
    });
  }

  markTouched() {
    this.touched$.next(true);
  }

  runValidators(value: T): Observable<ValidationResult> {
    if (this.validators.length === 0) {
      return of({ state: ValidationState.VALID });
    }

    const observables = this.validators.map((validator) => {
      try {
        const result = validator.validate(value);

        return result instanceof Promise
          ? from(result).pipe(
              catchError(() =>
                of<ValidationResult>({
                  state: ValidationState.INVALID,
                  error: ["VALIDATION_ERROR"],
                }),
              ),
            )
          : of(result);
      } catch {
        return of<ValidationResult>({
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

        // const invalidResults = results.filter(
        //   (result) => result?.state === ValidationState.INVALID
        // );

        // if (invalidResults) {
        //   return {
        //     state: ValidationState.INVALID,
        //     error: invalidResults.flatMap((result) => result.error),
        //     forceError: invalidResults.some(
        //       (result) => result.forceErrors === true
        //     ),
        //   };
        // }

        const invalidResult =
          results.find(
            (result) =>
              result?.state === ValidationState.INVALID && result.forceErrors,
          ) ||
          results.find((result) => result?.state === ValidationState.INVALID);

        if (typeof invalidResult !== "undefined") {
          return invalidResult;
        }

        return { state: ValidationState.VALID };
      }),
    );
  }

  getErrors(): string[] | undefined {
    return this.error$.getValue();
  }
}
