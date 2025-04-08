import { Field } from "../src/Field";
import { Form } from "../src/Form";
import { ValidationState } from "../src/Validator";
import { VEmail } from "../src/validators/VEmail";
import { VMax } from "../src/validators/VMax";
import { VMin } from "../src/validators/VMin";
import { VRequired } from "../src/validators/VRequired";
import { VString } from "../src/validators/VString";
import "./style.css";

const form = Form.create("my-form");

form.submitted$.subscribe((result) => {
  console.log(result);
});

function createErrorId(fieldId: string, str: string): string {
  return `${fieldId}-${str.toLocaleLowerCase().split(/\s/).join("-")}`;
}

[
  {
    id: "email",
    validators: [new VRequired(), new VEmail()],
  },
  { id: "name", validators: [new VRequired(), new VString(), new VMax(100)] },
  {
    id: "age",
    validators: [new VRequired(), new VMin(18), new VMax(100)],
  },
].forEach(({ id, validators }) => {
  const inputEl = document.getElementById(id);
  const errorContainerEl = document.getElementById(`${id}-errors`)!;

  if (!inputEl) {
    throw new Error(`Input with id ${id} not found`);
  }

  const field = Field.create(inputEl, id, "", validators);
  form.registerField(field);

  // Listen to input events and update the field value
  inputEl?.addEventListener("input", (e) => {
    const target = e.target as HTMLInputElement;
    field.value = target.value;
  });

  inputEl?.addEventListener("blur", () => {
    field.markAsTouched();
  });

  field.result$.subscribe((result) => {
    const currentErrors =
      (result.state === ValidationState.INVALID &&
        result.showErrors &&
        result.error) ||
      [];

    const currentIds = new Set(
      currentErrors.map((err) => createErrorId(id, err)),
    );

    // Remove errors that don't exist anymore
    errorContainerEl.querySelectorAll("span[data-error-id]").forEach((el) => {
      const errId = el.getAttribute("data-error-id");
      if (errId && !currentIds.has(errId)) {
        el.remove();
      }
    });

    // Add errors that don't exist yet
    currentErrors.forEach((err) => {
      const errId = createErrorId(id, err);
      if (!errorContainerEl.querySelector(`[data-error-id="${errId}"]`)) {
        const span = document.createElement("span");
        span.id = errId;
        span.dataset.errorId = errId;
        span.textContent = err;
        errorContainerEl.appendChild(span);
      }
    });
  });
});
