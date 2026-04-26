import { useState } from "react";
import { BigDouble } from "../types/BigDouble";

const BigDoubleInput = (props: {
  label: string;
  value: BigDouble;
  onChange: (value: BigDouble) => void;
  isValid?: (value: BigDouble) => boolean;
}) => {
  const { label, value, onChange, isValid } = props;
  const [displayValue, setDisplayValue] = useState(value.toString());

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <label>{label}</label>
      <input
        type="text"
        value={displayValue}
        onChange={(e) => {
          const inputValue = e.target.value;
          const val = BigDouble.fromString(inputValue);
          setDisplayValue(inputValue);
          if (!val.isNaN() && (!isValid || isValid(val))) {
            onChange(val);
            return;
          }
        }}
        onEnded={(e) => {
          const inputValue = (e.target as HTMLInputElement).value
          const val = BigDouble.fromString(inputValue);
          if (val.isNaN()) {
            setDisplayValue(value.toString());
          }
        }}
      />
    </form>
  );
}

export default BigDoubleInput;