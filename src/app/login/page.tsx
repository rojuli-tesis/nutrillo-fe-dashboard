"use client";

import restClient from "@/utils/restClient";
import { Flex, FormControl, FormLabel, Input, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React from "react";
import Button from "@/components/Button";
import { Form, Formik, Field } from "formik";
import * as Yup from "yup";

import LoginLayout from "./layout";
import CustomInput from "@/components/CustomInput";

const ValidationSchema = Yup.object().shape({
  email: Yup.string().email("Email inválido").required("Email es requerido"),
  password: Yup.string().required("Contraseña es requerida"),
});

const LoginPage = () => {
  const router = useRouter();

  const handleSubmit = async (data: { email: string; password: string }) => {
    await restClient.postWithCredentials("/admin/login", data);
    router.push("/dashboard");
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
          email: "julietarey.lp+admin@gmail.com",
          password: "1234.Abcdef",
        }}
        onSubmit={handleSubmit}
        validateOnMount
        validationSchema={ValidationSchema}
      >
        {({ isValid }) => (
          <Form style={{ width: "100%" }}>
            <VStack w="100%">
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Field name="email" component={CustomInput} />
              </FormControl>
              <FormControl>
                <FormLabel>Contraseña</FormLabel>
                <Field
                  name="password"
                  type="password"
                  component={CustomInput}
                />
              </FormControl>
              <Button disabled={!isValid} colorScheme="teal" type="submit">
                Ingresar
              </Button>
            </VStack>
          </Form>
        )}
      </Formik>
    </Flex>
  );
};

LoginPage.getLayout = (page: React.ReactNode) => {
  return <LoginLayout>{page}</LoginLayout>;
};

export default LoginPage;
