import { test, expect } from "@playwright/experimental-ct-react";

import { Heading } from "./heading";

test("Heading renders text", async ({ mount }) => {
  const component = await mount(<Heading text="Hello World" />);
  await expect(component).toContainText("Hello World");
});
