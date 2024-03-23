import { FormHelperText, Input } from "@chakra-ui/react";
import { FormikProps } from "formik";
import React from "react";

// Accept generic type
const CustomInput = <Values extends object>({
  field,
  form,
  ...props
}: {
  field: any;
  form: FormikProps<Values>;
}) => {
  const hasError =
    form.touched[field.name as keyof Values] &&
    form.errors[field.name as keyof Values];
  return (
    <>
      <Input
        autoComplete={field.name}
        {...field}
        {...props}
        isInvalid={hasError}
      />
      {hasError && (
        <FormHelperText color="red.500">
          {form.errors[field.name as keyof Values]?.toString()}
        </FormHelperText>
      )}
    </>
  );
};

export default CustomInput;
