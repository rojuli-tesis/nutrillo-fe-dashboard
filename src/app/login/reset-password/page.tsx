"use client";

import React, { useState } from "react";
import {
  Flex,
  VStack,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import Button from "@/components/Button";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import CustomInput from "@/components/CustomInput";
import restClient from "@/utils/restClient";
import { useRouter } from "next/navigation";

const ValidationSchema = Yup.object().shape({
  email: Yup.string().email("Email inválido").required("Email es requerido"),
  code: Yup.number().required("Código es requerido"),
  // contraseña debe tener simbolos y numeros. minimo 8 caracteres
  newPassword: Yup.string()
    .matches(
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/,
      "La contraseña debe tener al menos 8 caracteres, un número y un símbolo",
    )
    .required("Contraseña es requerida"),
  confirmNewPassword: Yup.string().oneOf(
    [Yup.ref("newPassword")],
    "Las contraseñas no coinciden",
  ),
});

const ResetPasswordPage = () => {
  const router = useRouter();

  const [responseError, setResponseError] = useState("");

  const handleSubmit = async (data: { code: string; newPassword: string }) => {
    try {
      await restClient.post("/auth/reset-password", data);
      router.push("/login");
    } catch (e) {
      setResponseError((e as any).response.data);
    }
  };

  return (
    <Flex
      style={{
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        width: "60%",
      }}
    >
      <Formik
        initialValues={{
          email: "julietarey.lp+admin123@gmail.com",
          code: "",
          newPassword: "",
          confirmNewPassword: "",
        }}
        onSubmit={handleSubmit}
        validateOnMount
        validationSchema={ValidationSchema}
      >
        {({ isValid }) => (
          <Form style={{ width: "100%" }}>
            <VStack w="100%">
              <Text fontSize={"3xl"}>Recuperar contraseña</Text>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Field name="email" component={CustomInput} />
              </FormControl>
              <FormControl>
                <FormLabel>Código</FormLabel>
                <Field name="code" component={CustomInput} />
              </FormControl>
              <FormControl>
                <FormLabel>Contraseña</FormLabel>
                <Field
                  type={"password"}
                  name="newPassword"
                  component={CustomInput}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Confirmar Contraseña</FormLabel>
                <Field
                  type={"password"}
                  name="confirmNewPassword"
                  component={CustomInput}
                />
              </FormControl>
              <FormControl isInvalid={!!responseError}>
                <FormErrorMessage>{responseError}</FormErrorMessage>
              </FormControl>
              <Button disabled={!isValid} colorScheme={"teal"} type={"submit"}>
                Actualizar contraseña
              </Button>
            </VStack>
          </Form>
        )}
      </Formik>
    </Flex>
  );
};

export default ResetPasswordPage;
