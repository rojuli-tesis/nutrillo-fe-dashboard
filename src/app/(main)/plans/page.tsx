"use client";

import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Text,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Badge,
  Card,
  CardBody,
  CardHeader,
  Heading,
  VStack,
  HStack,
  Divider,
  Alert,
  AlertIcon,
  Spinner,
  Center,
} from "@chakra-ui/react";
import React, { useEffect, useState, useCallback } from "react";
import { UserPlansService } from "@/shared/services/user-plans.service";
import { UserPlan, CreateUserPlanDto } from "@/shared/interfaces/user-plans";
import { AddIcon, DownloadIcon, ViewIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { FileUpload } from "@/components/FileUpload";

const PlansPage = () => {
  const [plans, setPlans] = useState<UserPlan[]>([]);
  const [activePlan, setActivePlan] = useState<UserPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<CreateUserPlanDto>({
    title: "",
    description: "",
    nutritionist: "",
    uploadDate: new Date().toISOString().split('T')[0],
    isActive: false,
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const loadPlans = useCallback(async () => {
    try {
      setLoading(true);
      const [allPlans, active] = await Promise.all([
        UserPlansService.getAllPlans(),
        UserPlansService.getActivePlan(),
      ]);
      setPlans(allPlans);
      setActivePlan(active);
    } catch (error) {
      console.error("Error loading plans:", error);
      toast({
        title: "Error",
        description: "Failed to load plans",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    // Auto-fill filename if not provided
    if (!formData.title) {
      setFormData(prev => ({
        ...prev,
        title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
      }));
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setUploading(true);
      await UserPlansService.createPlanWithFile(formData, selectedFile);
      toast({
        title: "Success",
        description: "Plan uploaded successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
      setSelectedFile(null);
      setFormData({
        title: "",
        description: "",
        nutritionist: "",
        uploadDate: new Date().toISOString().split('T')[0],
        isActive: false,
      });
      loadPlans();
    } catch (error) {
      console.error("Error uploading plan:", error);
      toast({
        title: "Error",
        description: "Failed to upload plan",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSetActive = async (planId: string) => {
    try {
      await UserPlansService.setActivePlan(planId);
      toast({
        title: "Success",
        description: "Plan set as active",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      loadPlans();
    } catch (error) {
      console.error("Error setting active plan:", error);
      toast({
        title: "Error",
        description: "Failed to set active plan",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (planId: string) => {
    if (!confirm("Are you sure you want to delete this plan?")) return;

    try {
      await UserPlansService.deletePlan(planId);
      toast({
        title: "Success",
        description: "Plan deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      loadPlans();
    } catch (error) {
      console.error("Error deleting plan:", error);
      toast({
        title: "Error",
        description: "Failed to delete plan",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const PlanCard = ({ plan, isActive = false }: { plan: UserPlan; isActive?: boolean }) => (
    <Card 
      border={isActive ? "2px solid" : "1px solid"}
      borderColor={isActive ? "teal.500" : "gray.200"}
      position="relative"
    >
      {isActive && (
        <Badge
          position="absolute"
          top={2}
          right={2}
          colorScheme="teal"
          variant="solid"
        >
          Activo
        </Badge>
      )}
      
      <CardHeader>
        <Heading size="md">{plan.title}</Heading>
        {plan.nutritionist && (
          <Text fontSize="sm" color="gray.600">
            Por: {plan.nutritionist}
          </Text>
        )}
      </CardHeader>
      
      <CardBody>
        <VStack align="stretch" spacing={3}>
          {plan.description && (
            <Text fontSize="sm" color="gray.600">
              {plan.description}
            </Text>
          )}
          
          <Text fontSize="xs" color="gray.500">
            Subido: {formatDate(plan.uploadDate)}
          </Text>
          
          <Text fontSize="xs" color="gray.500">
            Archivo: {plan.fileName}
          </Text>
          
          <Divider />
          
          <HStack spacing={2}>
            {plan.fileUrl && (
              <IconButton
                aria-label="Download"
                icon={<DownloadIcon />}
                size="sm"
                variant="outline"
                onClick={() => window.open(plan.fileUrl, '_blank')}
              />
            )}
            
            {!isActive && (
              <Button
                size="sm"
                colorScheme="teal"
                variant="outline"
                onClick={() => handleSetActive(plan.id)}
              >
                Activar
              </Button>
            )}
            
            <IconButton
              aria-label="Delete"
              icon={<DeleteIcon />}
              size="sm"
              colorScheme="red"
              variant="outline"
              onClick={() => handleDelete(plan.id)}
            />
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );

  if (loading) {
    return (
      <Center h="400px">
        <Spinner size="xl" color="teal.500" />
      </Center>
    );
  }

  return (
    <Box p={6}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Planes Nutricionales</Heading>
        <Button
          leftIcon={<AddIcon />}
          colorScheme="teal"
          onClick={onOpen}
        >
          Subir Plan
        </Button>
      </Flex>

      {plans.length === 0 ? (
        <Alert status="info">
          <AlertIcon />
          No hay planes disponibles. Sube tu primer plan nutricional.
        </Alert>
      ) : (
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
          {activePlan && (
            <GridItem>
              <PlanCard plan={activePlan} isActive={true} />
            </GridItem>
          )}
          
          {plans
            .filter(plan => !plan.isActive)
            .map((plan) => (
              <GridItem key={plan.id}>
                <PlanCard plan={plan} />
              </GridItem>
            ))}
        </Grid>
      )}

      {/* Upload Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Subir Nuevo Plan Nutricional</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Archivo del Plan</FormLabel>
                <FileUpload onFileSelect={handleFileSelect} />
                {selectedFile && (
                  <Text fontSize="sm" color="green.500" mt={2}>
                    Archivo seleccionado: {selectedFile.name}
                  </Text>
                )}
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Título del Plan</FormLabel>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ej: Plan Nutricional - Enero 2024"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Descripción</FormLabel>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descripción del plan nutricional..."
                  rows={3}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Nutricionista</FormLabel>
                <Input
                  value={formData.nutritionist}
                  onChange={(e) => setFormData(prev => ({ ...prev, nutritionist: e.target.value }))}
                  placeholder="Nombre del nutricionista"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Fecha de Subida</FormLabel>
                <Input
                  type="date"
                  value={formData.uploadDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, uploadDate: e.target.value }))}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Estado</FormLabel>
                <Select
                  value={formData.isActive ? "active" : "inactive"}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value === "active" }))}
                >
                  <option value="inactive">Inactivo</option>
                  <option value="active">Activo</option>
                </Select>
              </FormControl>

              <HStack spacing={4} pt={4}>
                <Button
                  colorScheme="teal"
                  onClick={handleSubmit}
                  isLoading={uploading}
                  loadingText="Subiendo..."
                  isDisabled={!selectedFile || !formData.title}
                >
                  Subir Plan
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PlansPage;
