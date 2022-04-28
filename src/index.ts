import { createDevTool, DevTool } from "./invariant";
import { OTHER } from "./other-dep";

export function hello() {
  const dev: DevTool = createDevTool();
  console.log("hello");
  dev.invariant(0 as any, "asdd");

  if (__DEV__) {
    Math.floor(12);
  }

  return OTHER;
}

hello();
