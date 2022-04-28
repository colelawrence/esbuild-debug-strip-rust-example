export interface DevTool {
  invariant(x: boolean, message: string, found?: any): asserts x;
  hmm(message: string, found?: any): void;
}
export function createDevTool(): DevTool {
  return {
    invariant(x: unknown, message: string, found?: any): asserts x {
      if (!x) {
        if (found) {
          throw new Error(`Invariant: ${message}\n  found: ${found}`);
        } else {
          throw new Error(`Invariant: ${message}`);
        }
      }
    },
    hmm(message: string, found?: any) {
      console.log("Hmm", message, { found });
    },
  };
}
