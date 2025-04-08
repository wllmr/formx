/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  of,
  switchMap,
} from "rxjs";
import { Field, FieldResultInvalid } from "./Field";
import { ValidationState } from "./Validator";

export interface FormSubmitValid {
  valid: true;
  values: Record<string, string>;
}

export interface FormSubmitInvalid {
  valid: false;
  errors: Record<string, string[]>;
}

export class Form {
  #fields: Map<string, Field<any>>;
  #fields$: BehaviorSubject<Map<string, Field<any>>>;
  element: HTMLFormElement;
  submitted$: BehaviorSubject<FormSubmitValid | FormSubmitInvalid | undefined>;
  isSubmitted$: BehaviorSubject<boolean>;

  static create(element: string | HTMLFormElement) {
    const _element =
      typeof element === "string" ? document.getElementById(element) : element;

    if (_element === null) {
      throw new Error(`Element with id ${element} not found`);
    }

    if (!(_element instanceof HTMLFormElement)) {
      throw new Error(`Element with id ${element} is not a form`);
    }

    return new Form(_element);
  }

  private constructor(element: HTMLFormElement) {
    this.#fields = new Map<string, Field<any>>();
    this.#fields$ = new BehaviorSubject(this.#fields);
    this.element = element;
    this.submitted$ = new BehaviorSubject<
      FormSubmitValid | FormSubmitInvalid | undefined
    >(undefined);
    this.isSubmitted$ = new BehaviorSubject(false);

    this.element.addEventListener("submit", (e) => {
      e.preventDefault();
      this.submit();
    });
  }

  get #values() {
    const values: Record<string, any> = {};
    this.#fields.forEach((field, name) => {
      values[name] = field.value;
    });
    return values;
  }

  get #isValid() {
    for (const field of this.#fields.values()) {
      const { state } = field.result$.getValue();

      if (state !== ValidationState.VALID) {
        return false;
      }
    }
    return true;
  }

  get errors$(): Observable<Record<string, string[]>> {
    return this.#fields$.pipe(
      switchMap((fieldsMap) => {
        const entries = Array.from(fieldsMap.entries());

        if (entries.length === 0) {
          return of({});
        }

        return combineLatest(
          entries.map(([name, field]) =>
            field.result$.pipe(
              map(
                (result) =>
                  [name, (result as FieldResultInvalid).error ?? []] as const,
              ),
            ),
          ),
        ).pipe(
          map((pairs) => {
            const errorMap: Record<string, string[]> = {};
            for (const [name, errors] of pairs) {
              if (Array.isArray(errors) && errors.length) {
                errorMap[name] = errors;
              }
            }
            return errorMap;
          }),
        );
      }),
    );
  }

  registerField(field: Field<any>) {
    this.#fields.set(field.name, field);
    this.#fields$.next(new Map(this.#fields));
    field.form = this;
  }

  unregisterField(name: string) {
    this.#fields.delete(name);
    this.#fields$.next(new Map(this.#fields));
  }

  reset() {
    // this.#fields.forEach((field) => {
    //   field.setValue(field.getInitialValue());
    //   field.clearError();
    // });

    this.submitted$.next(undefined);
  }

  submit() {
    this.isSubmitted$.next(true);

    let errors = {};

    this.errors$.subscribe((_errors) => {
      errors = _errors;
    });

    if (this.#isValid) {
      this.submitted$.next({
        valid: true,
        values: this.#values,
      });
    } else {
      this.submitted$.next({
        valid: false,
        errors,
      });
    }
  }
}
