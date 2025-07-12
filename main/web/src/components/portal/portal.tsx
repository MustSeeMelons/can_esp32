import { createPortal, forwardRef, useEffect, useRef } from "preact/compat";
import { setRef } from "../../utils/set-ref";
import { ComponentChildren } from "preact";

export interface IPortalProps {
  children: ComponentChildren;
}

/**
 * Append an element to the document, outside the app hirearchy.
 */
export const Portal = forwardRef<HTMLDivElement, IPortalProps>(
  ({ children }, ref) => {
    const portalRef = useRef<HTMLDivElement>(document.createElement("div"));

    setRef(ref, portalRef.current);

    useEffect(() => {
      const { current } = portalRef;
      document.body.appendChild(current);

      return () => {
        if (current) {
          document.body.removeChild(current);
        }
      };
    }, []);

    // `createPortal` is declarative, a stable ref assures no extra elements are created
    return portalRef.current ? createPortal(children, portalRef.current) : null;
  }
);
