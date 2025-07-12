import { Ref } from "preact";
import { setRef } from "./set-ref";

/**
 * Merges multiple refs into one callback ref
 */
export function mergeRefs<T = unknown>(
  ...refs: Array<Ref<T> | undefined | null>
): (value: T | null) => void {
  return (value) => {
    refs.forEach((ref) => {
      setRef(ref, value);
    });
  };
}
