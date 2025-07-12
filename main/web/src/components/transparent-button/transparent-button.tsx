import { forwardRef } from "preact/compat";
import { Button, IButtonProps } from "../button/button";
import "./transparent-button.scss";

export const TransparentButton = forwardRef<HTMLButtonElement, IButtonProps>(
  (props, ref) => {
    return <Button ref={ref} class="transparent-button" {...props} />;
  }
);
