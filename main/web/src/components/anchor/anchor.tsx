import { ComponentChildren } from "preact";
import { forwardRef, useEffect, useRef } from "preact/compat";
import { MutableRef } from "preact/hooks";
import { Portal } from "../portal/portal";
import { mergeRefs } from "../../utils/merge-refs";

export interface IAnchorProps {
  anchorRef: MutableRef<HTMLElement | null>; // Parent from whom we anchor
  children: ComponentChildren;
  align?: "left" | "right" | "auto";
  options?: { useChildWidth?: boolean };
}

export const Anchor = forwardRef<HTMLElement, IAnchorProps>(
  ({ anchorRef, children, options, align = "auto" }, ref) => {
    const portalRef = useRef<HTMLDivElement & { updatePosition?: () => void }>(
      null
    );

    useEffect(() => {
      const updatePosition = () => {
        // Get the bounding rect of the 'parent'
        const initialAnchorBox = anchorRef.current?.getBoundingClientRect();

        if (!initialAnchorBox) {
          return;
        }

        // Get 'parent' position and size, used for positioning the portal
        const target = {
          x: initialAnchorBox.left,
          y: initialAnchorBox.bottom,
          width: initialAnchorBox.width,
          height: 0, // Initial height, will be updated after rendering
        };

        // Apply the initial styles to the anchored element
        const portal = portalRef.current;

        if (portal) {
          portal.style.margin = "0";
          portal.style.position = "fixed";
          portal.style.top = `${target.y}px`;
          portal.style.left = `${target.x}px`;

          if (!options?.useChildWidth) {
            portal.style.width = `${target.width}px`;
          }

          portal.style.height = "auto"; // Content sets the height
          portal.style.zIndex = "1000";
        }

        // Recalculate the height after rendering, once
        requestAnimationFrame(() => {
          const portalBox = portalRef.current?.getBoundingClientRect();
          const anchorBox = anchorRef?.current?.getBoundingClientRect();

          if (!portalBox || !anchorBox) {
            return;
          }

          // Determine target.x based on alignment preference
          if (align === "right") {
            target.x = anchorBox.right - portalBox.width;
          } else if (align === "auto") {
            const spaceOnRight = window.innerWidth - anchorBox.left;
            const spaceOnLeft = anchorBox.right;

            if (spaceOnRight >= portalBox.width) {
              // Enough space to align left
              target.x = anchorBox.left;
            } else if (spaceOnLeft >= portalBox.width) {
              // Align right if not enough room on the right
              target.x = anchorBox.right - portalBox.width;
            } else {
              // Not enough room on either side, clamp later
              target.x = anchorBox.left;
            }
          } else {
            // Default to left alignment
            target.x = anchorBox.left;
          }

          // Clamp to viewport right edge
          const rightEdge = target.x + portalBox.width;
          if (rightEdge > window.innerWidth) {
            target.x = window.innerWidth - portalBox.width;
            target.x = Math.max(target.x, 0);
          }

          // Clamp to the left edge
          if (target.x < 0) {
            target.x = 0;
          }

          target.width = anchorBox.width;

          if (portalBox) {
            target.height = portalBox.height;

            // Check if there is enough space below the 'parent' element
            const spaceBelow = window.innerHeight - anchorBox.bottom;
            const spaceAbove = anchorBox.top;

            if (spaceBelow < target.height && spaceAbove >= target.height) {
              // Position above the 'parent' element
              target.y = anchorBox.top - target.height;
            } else if (spaceBelow >= target.height) {
              // Position below the 'parent' element
              target.y = anchorBox.bottom;
            } else {
              // Adjust height to fit within the available space
              if (spaceBelow >= spaceAbove) {
                target.height = spaceBelow;
                target.y = anchorBox.bottom;
              } else {
                target.height = spaceAbove;
                target.y = anchorBox.top - target.height;
              }
            }

            // Apply the final styles to the options element
            if (portal) {
              portal.style.left = `${target.x}px`;
              portal.style.width = `${target.width}px`;
              portal.style.width = `${portalBox.width}px`;
              portal.style.top = `${target.y}px`;
              portal.style.height = `${target.height}px`;
            }
          }
        });
      };

      // Set the reposition function to the portal ref
      if (portalRef.current) {
        portalRef.current.updatePosition = updatePosition;
      }

      // Initial repositioning
      updatePosition();

      // Add event listeners for window resize and scroll
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition);

      // Cleanup event listeners on component unmount
      return () => {
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition);
      };
    }, [anchorRef, ref]);

    return <Portal ref={mergeRefs(ref, portalRef)}>{children}</Portal>;
  }
);
