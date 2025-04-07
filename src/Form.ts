/* eslint-disable @typescript-eslint/no-explicit-any */
import { Field } from "./Field";

export class Form {
  #fields = new Map<string, Field<any>>();

  registerField(field: Field<any>) {
    this.#fields.set(field.name, field);
  }

  unregisterField(name: string) {
    this.#fields.delete(name);
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

  isValid() {
    for (const field of this.#fields.values()) {
      if (field.getError() != null) return false;
    }
    return true;
  }

  submit(): { valid: boolean; values: Record<string, any> } {
    return {
      valid: this.isValid(),
      values: this.getAllValues(),
    };
  }
}
