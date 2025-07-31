import { ComponentChildren } from "preact";
import { Button } from "../button/button";
import { useRef, useState } from "preact/hooks";
import { Anchor } from "../anchor/anchor";
import "./action-menu.scss";
import { useOutsideClick } from "../../hooks/use-outside-click";
import { TransparentButton } from "../transparent-button/transparent-button";

export interface IActionMenuItem {
  label: ComponentChildren;
  onClick: () => void;
}

export interface IActionMenuProps {
  btnLabel: ComponentChildren;
  items: IActionMenuItem[];
  variant: "regular" | "transparent";
}

export const ActionMenu = ({ btnLabel, items, variant }: IActionMenuProps) => {
  const [isOpen, setOpen] = useState(false);
  const ref = useRef(null);
  const actionRef = useRef(null);

  useOutsideClick(() => setOpen(false), [ref, actionRef]);

  const ButtonComponent =
    variant === "transparent" ? TransparentButton : Button;

  return (
    <>
      <ButtonComponent
        ref={ref}
        onClick={() => {
          setOpen((v) => !v);
        }}
      >
        {btnLabel}
      </ButtonComponent>
      {isOpen && (
        <Anchor anchorRef={ref} options={{ useChildWidth: true }}>
          <div ref={actionRef} class="item-container">
            {items.map((item) => {
              return (
                <div
                  class="item"
                  onClick={() => {
                    item.onClick();
                    setOpen(false);
                  }}
                >
                  {item.label}
                </div>
              );
            })}
          </div>
        </Anchor>
      )}
    </>
  );
};
