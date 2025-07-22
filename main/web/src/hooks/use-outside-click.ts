import { useCallback, useEffect } from "preact/hooks";

/**
 * Executes the callback if clicked outside the ref array
 * @param onOuterClick
 * @param refs
 */
export const useOutsideClick = (
  onOuterClick: () => void,
  refs: Array<preact.RefObject<HTMLElement>>
) => {
  const handleClickOutside = useCallback(
    (event: Event) => {
      const el = event.target as Element;

      const isInside = refs
        .map((ref) => ref.current && ref.current.contains(el))
        .some((contained) => !!contained);

      if (!isInside) {
        onOuterClick();
      }
    },
    [onOuterClick, refs]
  );

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [handleClickOutside]);
};
