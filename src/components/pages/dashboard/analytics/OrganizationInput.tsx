import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  SelectChangeEvent,
} from "@mui/material";

interface OrganizationInputProps {
  name: string;
  label: string;
  value: string | number;
  options?: { id: string | number; Name: string }[]; // Optional to allow default value
  error?: string | null;
  touched?: boolean;
  onChange: (event: SelectChangeEvent<string | number>) => void;
}

const OrganizationInput: React.FC<OrganizationInputProps> = ({
  name,
  label,
  value,
  options = [], // Default to empty array
  error,
  touched,
  onChange,
}) => {
 
  return (
    <FormControl fullWidth error={Boolean(touched && error)}>
      <InputLabel id={`${name}-label`}>{label}</InputLabel>
      <Select
        labelId={`${name}-label`}
        name={name}
        value={value}
        onChange={onChange}
        id={`${name}-select`}
      >
        {Array.isArray(options) &&
          options.length > 0 &&
          options.map((org, index) => (
            <MenuItem key={index} value={org?.id || ""}>
              {org?.Name || "Unknown Name"}
            </MenuItem>
          ))}
      </Select>
      <FormHelperText>{touched && error}</FormHelperText>
    </FormControl>
  );
};

export default OrganizationInput;
