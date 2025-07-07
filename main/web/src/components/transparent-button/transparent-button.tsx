import { Button, IButtonProps } from "../button/button";
import "./transparent-button.scss";

export const TransparentButton = (props: IButtonProps) => {
  return <Button class="transparent-button" {...props} />;
};
