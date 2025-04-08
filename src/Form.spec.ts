import { beforeEach, describe, expect, it } from "vitest";
import { Field } from "./Field";
import { Form, FormSubmitInvalid, FormSubmitValid } from "./Form";
import { VRequired } from "./validators/VRequired";

describe("Form", () => {
  let inputEl: HTMLInputElement;
  let formEl: HTMLFormElement;
  let form: Form;

  beforeEach(() => {
    formEl = document.createElement("form");
    formEl.id = "test-form";

    inputEl = document.createElement("input");
    inputEl.id = "test-input";

    formEl.appendChild(inputEl);

    document.body.appendChild(formEl);
    form = Form.create("test-form");
  });

  it("registers and retrieves a field value", () => {
    const field = Field.create(inputEl, "name", "John");
    form.registerField(field);

    form.submit();

    form.submitted$.subscribe((result) => {
      expect((result as FormSubmitValid).values.name).toBe("John");
    });
  });

  it("removes a field on unregister", () => {
    const field = Field.create(inputEl, "name", "John");
    form.registerField(field);
    form.unregisterField("name");

    form.submit();

    form.submitted$.subscribe((result) => {
      expect((result as FormSubmitValid).values.name).toBeUndefined();
    });
  });

  it("submit returns correct invalid result", async () => {
    const field1 = Field.create(inputEl, "email", "", [new VRequired()]);
    const field2 = Field.create(inputEl, "username", "user123");
    form.registerField(field1);
    form.registerField(field2);

    form.submit();

    await new Promise((resolve) => setTimeout(resolve, 0)); // wait microtask

    form.submitted$.subscribe((result) => {
      expect((result as FormSubmitInvalid).valid).toBe(false);
      expect(JSON.stringify((result as FormSubmitInvalid).errors)).toEqual(
        JSON.stringify({
          email: ["Value is required"],
        }),
      );
    });
  });

  it("submit returns correct valid result", async () => {
    const field1 = Field.create(inputEl, "email", "test", [new VRequired()]);
    const field2 = Field.create(inputEl, "username", "user123");
    form.registerField(field1);
    form.registerField(field2);

    form.submit();

    form.submitted$.subscribe((result) => {
      expect((result as FormSubmitValid).valid).toBe(true);
      expect(JSON.stringify((result as FormSubmitValid).values)).toEqual(
        JSON.stringify({
          email: "test",
          username: "user123",
        }),
      );
    });
  });
});
