"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Text,
  Badge,
  Stack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useToast,
  Spinner,
  Center,
  IconButton,
  Textarea,
} from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { FiUpload } from "react-icons/fi";
import { Patient } from "@/shared/interfaces/patients";
import restClient from "@/utils/restClient";

interface NutritionPlanDoc {
  _id: string;
  fileName: string;
  url: string;
  uploadedAt: string;
}

const NutritionPlanPage = () => {
  const params = useParams<{ patientId: string }>();
  const [patientData, setPatientData] = useState<Patient>();
  const [docs, setDocs] = useState<NutritionPlanDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [notes, setNotes] = useState("");
  const toast = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const [patient, plans] = await Promise.all([
        restClient.get<Patient>(`/patient/${params.patientId}`),
        restClient.get<NutritionPlanDoc[]>(`/nutrition-plan/patient/${params.patientId}`),
      ]);
      setPatientData(patient);
      setDocs(plans.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()));
    } catch (e) {
      toast({ title: "Error cargando datos", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, [params.patientId]);

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    await uploadFile(file);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("document", file);
      formData.append("notes", notes);
      console.log(formData);
      await restClient.post(`/nutrition-plan/patient/${params.patientId}/upload`, formData);
      toast({ title: "Plan subido exitosamente", status: "success" });
      onClose();
      loadData();
    } catch (e) {
      toast({ title: "Error subiendo el plan", status: "error" });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="teal.500" />
      </Center>
    );
  }

  return (
    <Box p={8}>
      <Breadcrumb mb={4}>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/patients">Pacientes</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href={`/patients/${params.patientId}`}>
            {patientData?.firstName} {patientData?.lastName}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>Plan nutricional</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading color="teal.500" size="lg">
          Plan nutricional de {patientData?.firstName} {patientData?.lastName}
        </Heading>
        <Button leftIcon={<FiUpload />} colorScheme="teal" onClick={onOpen}>
          Agregar nuevo plan
        </Button>
      </Flex>
      <Stack spacing={4}>
        {docs.length === 0 ? (
          <Card><CardBody><Text>No hay planes subidos aún.</Text></CardBody></Card>
        ) : (
          docs.map((doc, idx) => (
            <Card key={doc._id} borderColor={idx === 0 ? "teal.400" : undefined} borderWidth={idx === 0 ? 2 : 1}>
              <CardBody>
                <Flex justify="space-between" align="center">
                  <Box>
                    <Text fontWeight="bold">{doc.fileName}</Text>
                    <Text fontSize="sm" color="gray.500">{new Date(doc.uploadedAt).toLocaleString()}</Text>
                  </Box>
                  <Flex align="center" gap={2}>
                    {idx === 0 && <Badge colorScheme="teal">Activo</Badge>}
                    <Button as="a" href={doc.url} target="_blank" size="sm" colorScheme="teal" variant="outline">Ver</Button>
                  </Flex>
                </Flex>
              </CardBody>
            </Card>
          ))
        )}
      </Stack>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Agregar nuevo plan nutricional</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box
              border="2px dashed #319795"
              borderRadius="md"
              p={8}
              textAlign="center"
              bg={dragActive ? "teal.50" : "white"}
              onDragOver={e => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={e => { e.preventDefault(); setDragActive(false); }}
              onDrop={handleDrop}
              cursor="pointer"
            >
              <FiUpload size={32} color="#319795" style={{ marginBottom: 8 }} />
              <Text mb={2}>Arrastra y suelta el archivo aquí</Text>
              <Text fontSize="sm" color="gray.500">o haz clic para seleccionar</Text>
              <input
                type="file"
                accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                style={{ display: "none" }}
                id="file-upload-input"
                onChange={handleFileChange}
                disabled={uploading}
              />
              <label htmlFor="file-upload-input">
                <Button as="span" mt={4} colorScheme="teal" isLoading={uploading}>
                  Seleccionar archivo
                </Button>
              </label>
            </Box>
              <Textarea
                placeholder="Notas"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                mt={4}
              />
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} variant="ghost">Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default NutritionPlanPage; 