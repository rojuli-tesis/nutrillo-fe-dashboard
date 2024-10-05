"use client";

import restClient from "@/utils/restClient";
import {
  Flex,
  FormControl,
  FormLabel,
  VStack,
  FormErrorMessage,
  Link,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import React, { useState } from "react";
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
  const [responseError, setResponseError] = useState("");

  const handleSubmit = async (data: { email: string; password: string }) => {
    try {
      await restClient.postWithCredentials("/admin/login", data);
      router.push("/dashboard");
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
          password: "1234.Abcdef",
        }}
        onSubmit={handleSubmit}
        validateOnMount
        validationSchema={ValidationSchema}
      >
        {({ isValid }) => (
          <Form style={{ width: "100%" }}>
            <VStack w="100%">
              <Text fontSize={"3xl"}>Ingresar</Text>
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
              <FormControl isInvalid={!!responseError}>
                <FormErrorMessage>{responseError}</FormErrorMessage>
              </FormControl>
              <Flex>
                <Link
                  style={{
                    fontSize: "12px",
                  }}
                  as={NextLink}
                  href={"/login/forgot-password"}
                >
                  Olvide mi contraseña
                </Link>
              </Flex>
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
