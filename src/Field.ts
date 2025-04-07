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
import { ValidationResult, ValidationState, Validator } from "./Validator";

export class Field<T> {
  element: HTMLElement;
  name: string;
  value$: BehaviorSubject<T>;
  error$: BehaviorSubject<string | undefined>;
  touched$: BehaviorSubject<boolean>;

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
    this.error$ = new BehaviorSubject<string | undefined>(undefined);
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

  setValue(value: T) {
    this.value$.next(value);
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
                  error: validator.error,
                }),
              ),
            )
          : of(result);
      } catch {
        return of<ValidationResult>({
          state: ValidationState.INVALID,
          error: validator.error,
        });
      }
    });

    return from(observables).pipe(
      switchMap((v$) => v$),
      toArray(),
      map((results) => {
        const pending = results.find(
          (r) => r.state === ValidationState.PENDING,
        );
        if (pending) return pending;

        const invalid = results.find(
          (r) => r.state === ValidationState.INVALID,
        );
        if (invalid) return invalid;

        return { state: ValidationState.VALID };
      }),
    );
  }

  getValue(): T {
    return this.value$.getValue();
  }

  getError(): string | undefined {
    return this.error$.getValue();
  }
}
