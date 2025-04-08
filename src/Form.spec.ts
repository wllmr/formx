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

    expect(form.getValue("name")).toBe("John");
  });

  it("returns all values", () => {
    const field1 = Field.create(inputEl, "a", 123);
    const field2 = Field.create(inputEl, "b", "hello");

    form.registerField(field1);
    form.registerField(field2);

    expect(form.getAllValues()).toEqual({
      a: 123,
      b: "hello",
    });
  });

  it("removes a field on unregister", () => {
    const field = Field.create(inputEl, "name", "John");
    form.registerField(field);
    form.unregisterField("name");

    expect(form.getValue("name")).toBeUndefined();
  });

  it("isValid returns false if any field has an error", async () => {
    const field = Field.create(inputEl, "email", "", [new VRequired()]);
    form.registerField(field);

    // wait for validation to propagate
    await new Promise((r) => setTimeout(r, 10));

    expect(form.isValid()).toBe(false);
  });

  it("submit returns correct invalid result", async () => {
    const field1 = Field.create(inputEl, "email", "", [new VRequired()]);
    const field2 = Field.create(inputEl, "username", "user123");
    form.registerField(field1);
    form.registerField(field2);

    await new Promise((r) => setTimeout(r, 10));

    form.submit();

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

    await new Promise((r) => setTimeout(r, 10));

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
