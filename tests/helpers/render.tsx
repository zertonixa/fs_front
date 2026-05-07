import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach } from "vitest";

// React 18+/19 проверяет этот флаг и без него пишет warning про act(...).
// Vitest + jsdom сами его не выставляют.
(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const mounted: Array<{ root: Root; container: HTMLDivElement }> = [];

type RenderResult = {
  container: HTMLDivElement;
  rerender: (ui: React.ReactElement) => void;
  unmount: () => void;
};

export function render(ui: React.ReactElement): RenderResult {
  const container = document.createElement("div");
  document.body.appendChild(container);

  const root = createRoot(container);

  act(() => {
    root.render(ui);
  });

  mounted.push({ root, container });

  return {
    container,
    rerender: (nextUi: React.ReactElement) => {
      act(() => {
        root.render(nextUi);
      });
    },
    unmount: () => {
      act(() => {
        root.unmount();
      });
      container.remove();
    },
  };
}

export function click(element: Element): void {
  act(() => {
    element.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
  });
}

export function mouseDown(element: Element): void {
  act(() => {
    element.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true }));
  });
}

export async function flushPromises(): Promise<void> {
  await act(async () => {
    await Promise.resolve();
  });
}

export async function waitFor(assertion: () => void, timeout = 1000): Promise<void> {
  const startedAt = Date.now();
  let lastError: unknown;

  while (Date.now() - startedAt < timeout) {
    try {
      assertion();
      return;
    } catch (error) {
      lastError = error;
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
      });
    }
  }

  throw lastError;
}

export function byText(text: string | RegExp, root: ParentNode = document): HTMLElement {
  const matcher = typeof text === "string" ? (value: string) => value.includes(text) : (value: string) => text.test(value);
  const element = Array.from(root.querySelectorAll<HTMLElement>("body *"))
    .find((node) => matcher(node.textContent ?? ""));

  if (!element) throw new Error(`Element with text ${String(text)} not found`);
  return element;
}

export function byExactText(text: string, root: ParentNode = document): HTMLElement {
  const element = Array.from(root.querySelectorAll<HTMLElement>("body *"))
    .reverse()
    .find((node) => (node.textContent ?? "").trim() === text);

  if (!element) throw new Error(`Element with exact text ${text} not found`);
  return element;
}

afterEach(() => {
  for (const item of mounted.splice(0)) {
    act(() => {
      item.root.unmount();
    });
    item.container.remove();
  }
  document.body.innerHTML = "";
});
