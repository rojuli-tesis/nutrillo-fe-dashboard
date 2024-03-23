import {
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import Button from "@/components/Button";
import CustomInput from "@/components/CustomInput";
import restClient from "@/utils/restClient";

const ValidationSchema = Yup.object().shape({
  firstName: Yup.string().required("Nombre es requerido"),
  lastName: Yup.string().required("Apellido es requerido"),
  email: Yup.string().email("Email inválido").required("Email es requerido"),
});

interface Values {
  firstName: string;
  lastName: string;
  email: string;
}

const emptyInvitee = {
  firstName: "",
  lastName: "",
  email: "",
};

const InviteModal = ({ onClose }: { onClose: () => void }) => {
  const handleSubmit = async (values: Values) => {
    await restClient.post("/invite", values);
    onClose();
  };
  return (
    <Modal isOpen onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <Formik
          initialValues={emptyInvitee}
          validationSchema={ValidationSchema}
          onSubmit={handleSubmit}
          validateOnMount
        >
          {({ isValid, submitForm }) => {
            return (
              <>
                <ModalHeader>Invitar paciente</ModalHeader>
                <ModalCloseButton onClick={onClose} />
                <ModalBody>
                  <Form autoComplete="off">
                    <VStack>
                      <FormControl>
                        <FormLabel htmlFor="firstName">Nombre</FormLabel>
                        <Field name="firstName" component={CustomInput} />
                      </FormControl>
                      <FormControl>
                        <FormLabel htmlFor="lastName">Apellido</FormLabel>
                        <Field name="lastName" component={CustomInput} />
                      </FormControl>
                      <FormControl>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <Field name="email" component={CustomInput} />
                      </FormControl>
                    </VStack>
                  </Form>
                </ModalBody>
                <ModalFooter gap="16px">
                  <Button colorScheme="red" variant="outline" onClick={onClose}>
                    Cancelar
                  </Button>
                  <Button
                    colorScheme="teal"
                    disabled={!isValid}
                    onClick={submitForm}
                  >
                    Enviar
                  </Button>
                </ModalFooter>
              </>
            );
          }}
        </Formik>
      </ModalContent>
    </Modal>
  );
};

export default InviteModal;
