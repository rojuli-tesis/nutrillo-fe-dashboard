"use client";

import React, { useEffect, useState } from "react";
import restClient from "@/utils/restClient";
import { useParams, useRouter } from "next/navigation";
import { Patient } from "@/shared/interfaces/patients";
import { CustomInstructions, CreateCustomInstructionsRequest } from "@/shared/interfaces/custom-instructions";
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
  Grid,
  GridItem,
  Heading,
  IconButton,
  Text,
  useToast,
  Badge,
  Switch,
  FormControl,
  FormLabel,
  Textarea,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  VStack,
  HStack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";

const CustomInstructionsPage = () => {
  const params = useParams<{ patientId: string }>();
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [patientData, setPatientData] = useState<Patient>();
  const [instructions, setInstructions] = useState<CustomInstructions[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingInstruction, setEditingInstruction] = useState<CustomInstructions | null>(null);
  const [formData, setFormData] = useState<CreateCustomInstructionsRequest>({
    instructions: "",
    title: "",
    description: "",
    isActive: true,
    priority: 1,
  });

  const loadPatientData = async () => {
    try {
      const data = await restClient.get<Patient>(`/patient/${params.patientId}`);
      setPatientData(data);
    } catch (error) {
      console.error("Error loading patient data:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar la información del paciente",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const loadInstructions = async () => {
    try {
      const data = await restClient.get<CustomInstructions[]>(`/custom-instructions`);
      setInstructions(data);
    } catch (error) {
      console.error("Error loading custom instructions:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las instrucciones personalizadas",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([loadPatientData(), loadInstructions()]);
      setLoading(false);
    };
    loadData();
  }, [params.patientId]);

  const handleCreateInstruction = async () => {
    try {
      await restClient.post("/custom-instructions", formData);
      toast({
        title: "Éxito",
        description: "Instrucción personalizada creada correctamente",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      await loadInstructions();
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error creating custom instruction:", error);
      toast({
        title: "Error",
        description: "No se pudo crear la instrucción personalizada",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUpdateInstruction = async () => {
    if (!editingInstruction) return;

    try {
      await restClient.patch(`/custom-instructions/${editingInstruction.id}`, formData);
      toast({
        title: "Éxito",
        description: "Instrucción personalizada actualizada correctamente",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      await loadInstructions();
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error updating custom instruction:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la instrucción personalizada",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteInstruction = async (id: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta instrucción?")) return;

    try {
      await restClient.delete(`/custom-instructions/${id}`);
      toast({
        title: "Éxito",
        description: "Instrucción personalizada eliminada correctamente",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      await loadInstructions();
    } catch (error) {
      console.error("Error deleting custom instruction:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la instrucción personalizada",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEditInstruction = (instruction: CustomInstructions) => {
    setEditingInstruction(instruction);
    setFormData({
      instructions: instruction.instructions,
      title: instruction.title || "",
      description: instruction.description || "",
      isActive: instruction.isActive,
      priority: instruction.priority,
    });
    onOpen();
  };

  const resetForm = () => {
    setFormData({
      instructions: "",
      title: "",
      description: "",
      isActive: true,
      priority: 1,
    });
    setEditingInstruction(null);
  };

  const openCreateModal = () => {
    resetForm();
    onOpen();
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return "red";
    if (priority >= 6) return "orange";
    if (priority >= 4) return "yellow";
    return "green";
  };

  if (loading) {
    return (
      <Box p={8}>
        <Text>Cargando...</Text>
      </Box>
    );
  }

  if (!patientData) {
    return (
      <Box p={8}>
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Error!</AlertTitle>
          <AlertDescription>No se pudo cargar la información del paciente.</AlertDescription>
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={8}>
      <Breadcrumb mb={6}>
        <BreadcrumbItem>
          <BreadcrumbLink href={"/"}>Inicio</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href={"/patients"}>Pacientes</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href={`/patients/${params.patientId}`}>
            {patientData.firstName} {patientData.lastName}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>Instrucciones Personalizadas</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h1" size="xl" color="teal.500">
          Instrucciones Personalizadas
        </Heading>
        <Button leftIcon={<AddIcon />} colorScheme="teal" onClick={openCreateModal}>
          Agregar Instrucción
        </Button>
      </Flex>

      <Text mb={6} color="gray.600">
        Gestiona las instrucciones personalizadas para {patientData.firstName} {patientData.lastName}. 
        Estas instrucciones se incluirán automáticamente en las recomendaciones de recetas y evaluaciones de platos.
      </Text>

      {instructions.length === 0 ? (
        <Card>
          <CardBody textAlign="center" py={12}>
            <Text fontSize="lg" color="gray.500" mb={4}>
              No hay instrucciones personalizadas configuradas
            </Text>
            <Text color="gray.400" mb={6}>
              Agrega instrucciones específicas para este paciente, como alergias, preferencias dietéticas o condiciones médicas.
            </Text>
            <Button colorScheme="teal" onClick={openCreateModal}>
              Crear Primera Instrucción
            </Button>
          </CardBody>
        </Card>
      ) : (
        <Grid templateColumns="repeat(auto-fill, minmax(400px, 1fr))" gap={6}>
          {instructions.map((instruction) => (
            <Card key={instruction.id} variant="outline">
              <CardHeader>
                <Flex justify="space-between" align="start">
                  <VStack align="start" spacing={2}>
                    <HStack>
                      <Heading size="md">
                        {instruction.title || "Instrucción Personalizada"}
                      </Heading>
                      <Badge colorScheme={getPriorityColor(instruction.priority)}>
                        Prioridad: {instruction.priority}
                      </Badge>
                    </HStack>
                    {instruction.description && (
                      <Text fontSize="sm" color="gray.600">
                        {instruction.description}
                      </Text>
                    )}
                  </VStack>
                  <HStack>
                    <Switch
                      isChecked={instruction.isActive}
                      onChange={() => handleEditInstruction({
                        ...instruction,
                        isActive: !instruction.isActive
                      })}
                      colorScheme="teal"
                    />
                    <IconButton
                      aria-label="Editar instrucción"
                      icon={<EditIcon />}
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditInstruction(instruction)}
                    />
                    <IconButton
                      aria-label="Eliminar instrucción"
                      icon={<DeleteIcon />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => handleDeleteInstruction(instruction.id)}
                    />
                  </HStack>
                </Flex>
              </CardHeader>
              <CardBody pt={0}>
                <Text>{instruction.instructions}</Text>
                <Text fontSize="xs" color="gray.500" mt={4}>
                  Creado: {new Date(instruction.createdAt).toLocaleDateString()}
                  {instruction.updatedAt !== instruction.createdAt && (
                    <> • Actualizado: {new Date(instruction.updatedAt).toLocaleDateString()}</>
                  )}
                </Text>
              </CardBody>
            </Card>
          ))}
        </Grid>
      )}

      {/* Create/Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingInstruction ? "Editar Instrucción" : "Nueva Instrucción Personalizada"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Título (opcional)</FormLabel>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ej: Alergia a maní"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Descripción (opcional)</FormLabel>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Breve descripción de la instrucción"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Instrucciones</FormLabel>
                <Textarea
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  placeholder="Describe las instrucciones específicas para este paciente. Ej: 'Este paciente es alérgico a los maníes y debe evitarlos completamente. No recomendar recetas que contengan maníes o productos de maní.'"
                  rows={4}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Prioridad (1-10)</FormLabel>
                <NumberInput
                  value={formData.priority}
                  onChange={(_, value) => setFormData({ ...formData, priority: value || 1 })}
                  min={1}
                  max={10}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <Text fontSize="sm" color="gray.500" mt={1}>
                  Prioridad más alta = más importante (se enfatiza en las recomendaciones)
                </Text>
              </FormControl>

              <FormControl>
                <FormLabel>Estado</FormLabel>
                <Switch
                  isChecked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  colorScheme="teal"
                />
                <Text fontSize="sm" color="gray.500" mt={1}>
                  {formData.isActive ? "Activa (se incluye en recomendaciones)" : "Inactiva (no se incluye en recomendaciones)"}
                </Text>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button
              colorScheme="teal"
              onClick={editingInstruction ? handleUpdateInstruction : handleCreateInstruction}
              isDisabled={!formData.instructions.trim()}
            >
              {editingInstruction ? "Actualizar" : "Crear"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CustomInstructionsPage;
