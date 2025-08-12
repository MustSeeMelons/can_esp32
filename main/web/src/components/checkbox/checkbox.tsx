import { ComponentChild, FunctionComponent } from "preact";
import "./checkbox.scss";
import { useMemo } from "preact/hooks";
import { Check, Square } from "lucide-preact";

export interface ICheckboxProps {
  id?: string;
  name?: string;
  checked?: boolean;
  disabled?: boolean;
  label?: ComponentChild;
  onChange?: (checked: boolean) => void;
}

export const Checkbox: FunctionComponent<ICheckboxProps> & {
  Group: FunctionComponent<unknown>;
} = ({ id, name, onChange, disabled, label, checked }) => {
  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    onChange && onChange(target.checked);
  };

  const labelNode = useMemo(() => {
    if (typeof label === "string") {
      return <span>{label}</span>;
    }

    return label;
  }, [label]);

  return (
    <label
      class={`checkbox-container ${disabled ? "no-hover" : ""}`}
      for={name}
    >
      <input
        disabled={disabled}
        type="checkbox"
        id={id}
        name={name}
        onChange={handleChange}
        checked={checked}
      />
      <Square class="square" size="25px" />
      <Check class="mark" size="25px" />
      {labelNode}
    </label>
  );
};

// TODO implement this if we need it
Checkbox.Group = () => <div>not implemented!</div>;
