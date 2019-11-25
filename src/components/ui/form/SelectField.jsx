import React, { useRef, useState } from "react";

// Material UI
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

// Custom option field
const SelectField = ({
  field,
  form: { touched, errors },
  option_list,
  ...props
}) => {
  const inputLabel = useRef(null);
  const [labelWidth, setLabelWidth] = useState(0);
  React.useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  return (
    <FormControl variant={props.variant} margin={props.margin} style={{ width: "100%" }}>
      <InputLabel ref={inputLabel}>{props.label}</InputLabel>
      <Select
        labelWidth={labelWidth}
        error={errors[field.name] && touched[field.name]}
        {...field}
      >
        {option_list.map((item, index) => (
          <MenuItem key={index} value={item.value}>
            {item.name}
          </MenuItem>
        ))}
      </Select>
      <div className="h-16 text-error">
        {errors[field.name] && touched[field.name] ? errors[field.name] : ""}
      </div>
    </FormControl>
  );
};

export default SelectField;
