import { beforeEach, describe, expect, it } from "vitest";
import { Field } from "./Field";
import { VRequired } from "./validators/VRequired";

describe("Field", () => {
  let input: HTMLInputElement;

  beforeEach(() => {
    input = document.createElement("input");
    input.id = "test";
    document.body.appendChild(input);
  });

  it("should initialize with initial value and no error", () => {
    const field = Field.create(input, "username", "hello", []);
    expect(field.value).toBe("hello");
    expect(field.errors).toBeUndefined();
  });

  it("should validate with error on empty string", async () => {
    const field = Field.create(input, "username", "", [new VRequired()]);

    field.markAsTouched();

    expect(JSON.stringify(field.errors)).toBe(
      JSON.stringify(["Value is required"]),
    );
  });

  it("should clear error on valid input", async () => {
    const field = Field.create(input, "username", "", [new VRequired()]);
    field.markAsTouched();

    expect(JSON.stringify(field.errors)).toBe(
      JSON.stringify(["Value is required"]),
    );

    await new Promise((res) => setTimeout(res, 10));

    field.value = "hello";

    expect(JSON.stringify(field.errors)).toBeUndefined();
  });
});
