import { Ref } from "preact";

/**
 * Sets the value of a ref.
 *
 * @param ref - A Preact ref (object with `current`)
 * @param value - The value to set
 */
export function setRef<T = unknown>(
  ref: Ref<T> | undefined | null,
  value: T | null
) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref != null) {
    (ref as { current: T | null }).current = value;
  }
}
