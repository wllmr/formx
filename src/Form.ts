/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  of,
  switchMap,
} from "rxjs";
import { Field } from "./Field";

export interface FormSubmitValid {
  valid: true;
  values: Record<string, string>;
}

export interface FormSubmitInvalid {
  valid: false;
  errors: Record<string, string[]>;
}

export class Form {
  element: HTMLFormElement;
  #fields = new Map<string, Field<any>>();
  #fields$ = new BehaviorSubject(this.#fields);
  submitted$ = new BehaviorSubject<
    FormSubmitValid | FormSubmitInvalid | undefined
  >(undefined);

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
    this.element = element;
    this.element.addEventListener("submit", (e) => {
      e.preventDefault();
      this.submit();
    });
  }

  registerField(field: Field<any>) {
    this.#fields.set(field.name, field);
    this.#fields$.next(new Map(this.#fields));
    field.setForm(this);
  }

  unregisterField(name: string) {
    this.#fields.delete(name);
    this.#fields$.next(new Map(this.#fields));
  }

  getValue(name: string) {
    return this.#fields.get(name)?.getValue();
  }

  getAllValues() {
    const values: Record<string, any> = {};
    this.#fields.forEach((field, name) => {
      values[name] = field.getValue();
    });
    return values;
  }

  getAllErrors$(): Observable<Record<string, string[]>> {
    return this.#fields$.pipe(
      switchMap((fieldsMap) => {
        const entries = Array.from(fieldsMap.entries());

        if (entries.length === 0) {
          return of({});
        }

        return combineLatest(
          entries.map(([name, field]) =>
            field.error$.pipe(map((errors) => [name, errors] as const)),
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

  isValid() {
    for (const field of this.#fields.values()) {
      const errors = field.getErrors();

      if (Array.isArray(errors) && errors.length) {
        return false;
      }
    }
    return true;
  }

  reset() {
    // this.#fields.forEach((field) => {
    //   field.setValue(field.getInitialValue());
    //   field.clearError();
    // });

    this.submitted$.next(undefined);
  }

  submit() {
    let errors = {};

    this.getAllErrors$().subscribe((errorMap) => {
      errors = errorMap;
    });

    if (this.isValid()) {
      this.submitted$.next({
        valid: true,
        values: this.getAllValues(),
      });
    } else {
      this.submitted$.next({
        valid: false,
        errors,
      });
    }
  }
}
