"use client";

import React, { useState } from "react";
import { Flex, VStack, Text, FormControl, FormLabel } from "@chakra-ui/react";
import Button from "@/components/Button";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import CustomInput from "@/components/CustomInput";
import restClient from "@/utils/restClient";
import { useRouter } from "next/navigation";

const ValidationSchema = Yup.object().shape({
  email: Yup.string().email("Email inválido").required("Email es requerido"),
});

const ForgotPasswordPage = () => {
  const router = useRouter();

  const [responseError, setResponseError] = useState("");

  const handleSubmit = async (data: { email: string }) => {
    try {
      await restClient.post("/auth/forgot-password", data);
      router.push("/login/reset-password");
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
              <Button disabled={!isValid} colorScheme={"teal"} type={"submit"}>
                Recuperar
              </Button>
            </VStack>
          </Form>
        )}
      </Formik>
    </Flex>
  );
};

export default ForgotPasswordPage;
