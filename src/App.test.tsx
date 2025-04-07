import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "./App";

describe("App.tsx", () => {
  it("renders the component with text", () => {
    render(<App />);
    expect(screen.getByText("Formx")).toBeDefined();
  });
});
