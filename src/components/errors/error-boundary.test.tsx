import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "./error-boundary";
import { vi } from "vitest";

describe("ErrorBoundary", () => {
  it("renders children when no error occurs", () => {
    render(
      <ErrorBoundary>
        <div>Componente hijo sin error</div>
      </ErrorBoundary>
    );

    expect(screen.getByText("Componente hijo sin error")).toBeDefined();
  });

  it("catches errors and displays fallback UI", () => {
    // Mock console.error para no ensuciar la consola en test
    const consoleErrorMock = vi.spyOn(console, "error").mockImplementation(() => {});

    // Componente que lanza error
    const ProblemChild = () => {
      throw new Error("Error de prueba");
    };

    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(screen.getByText("Vaya... Algo salió mal!!")).toBeDefined();
    expect(screen.getByText("Error de prueba")).toBeDefined();

    consoleErrorMock.mockRestore();
  });
});