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
  Input,
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
  VStack,
  HStack,
  SimpleGrid,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Progress,
} from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { 
  FiUpload, 
  FiDownload, 
  FiEye, 
  FiTrash2, 
  FiCalendar,
  FiFileText,
  FiUser
} from "react-icons/fi";
import { Patient } from "@/shared/interfaces/patients";
import restClient from "@/utils/restClient";
import ChakraFileUpload from "@/components/FileUpload/ChakraFileUpload";

interface NutritionPlanDoc {
  _id: string;
  fileName: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  fileSize?: string;
  notes?: string;
  isActive?: boolean;
}

const NutritionPlanPage = () => {
  const params = useParams<{ patientId: string }>();
  const [patientData, setPatientData] = useState<Patient>();
  const [docs, setDocs] = useState<NutritionPlanDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [notes, setNotes] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const toast = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const [patient, plans] = await Promise.all([
        restClient.get<Patient>(`/patient/${params.patientId}`),
        restClient.get<NutritionPlanDoc[]>(`/nutrition-plan/patient/${params.patientId}`),
      ]);
      setPatientData(patient);
      console.log('Nutrition plans received:', plans);
      setDocs(plans.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
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

  const handleFileSelect = (file: File | null) => {
    if (file) {
      setSelectedFile(file);
      setFileName(file.name.replace(/\.[^/.]+$/, "")); // Remove extension for editing
    } else {
      setSelectedFile(null);
      setFileName("");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Por favor selecciona un archivo antes de subir",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const formData = new FormData();
      
      // Create a new File object with the custom filename
      const customFileName = fileName.trim() ? `${fileName.trim()}.pdf` : selectedFile.name;
      const customFile = new File([selectedFile], customFileName, { type: selectedFile.type });
      
      formData.append("document", customFile);
      formData.append("notes", notes);
      
      await restClient.post(`/nutrition-plan/patient/${params.patientId}/upload`, formData);
      
      toast({ 
        title: "Plan subido exitosamente", 
        description: `El plan "${customFileName}" ha sido subido correctamente`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      onClose();
      setNotes("");
      setSelectedFile(null);
      setFileName("");
      loadData();
    } catch (e) {
      toast({ 
        title: "Error subiendo el plan", 
        description: "Hubo un problema al subir el archivo. Inténtalo de nuevo.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
      clearInterval(progressInterval);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setFileName("");
    setNotes("");
    onClose();
  };

  const handleDeletePlan = async (planId: string) => {
    try {
      await restClient.delete(`/nutrition-plan/${planId}`);
      toast({
        title: "Plan eliminado",
        description: "El plan ha sido eliminado correctamente",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      loadData();
    } catch (e) {
      toast({
        title: "Error eliminando el plan",
        description: "No se pudo eliminar el plan. Inténtalo de nuevo.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const formatDate = (dateString: string) => {
    console.log('Formatting date:', dateString, 'Type:', typeof dateString);
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error('Invalid date string:', dateString);
      return 'Fecha inválida';
    }
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
      <VStack spacing={6} align="stretch">
        <Flex justify="space-between" align="center">
          <VStack align="start" spacing={1}>
            <Heading color="teal.500" size="lg">
              Planes Nutricionales
            </Heading>
            <Text color="gray.600" fontSize="md">
              Gestiona los planes nutricionales de {patientData?.firstName} {patientData?.lastName}
            </Text>
          </VStack>
          <Button leftIcon={<FiUpload />} colorScheme="teal" onClick={onOpen}>
            Agregar nuevo plan
          </Button>
        </Flex>

        {/* Active Plan Alert */}
        {docs.length > 0 && (
          <Alert status="info">
            <AlertIcon />
            <Box>
              <AlertTitle>Plan Activo</AlertTitle>
              <AlertDescription>
                El plan más reciente es: <strong>{docs[0].fileName}</strong>. 
                Este es el plan actual que debe seguir el paciente.
              </AlertDescription>
            </Box>
          </Alert>
        )}

        {/* Plans List */}
        <Box>
          <Text fontSize="lg" fontWeight="semibold" mb={4}>
            Planes Existentes ({docs.length})
          </Text>
          
          {docs.length === 0 ? (
            <Card>
              <CardBody>
                <Center py={8}>
                  <VStack spacing={4}>
                    <FiFileText size={48} color="#A0AEC0" />
                    <Text color="gray.500" fontSize="lg">
                      No hay planes nutricionales disponibles
                    </Text>
                    <Text color="gray.400" fontSize="sm">
                      Sube el primer plan usando el botón &quot;Agregar nuevo plan&quot;
                    </Text>
                  </VStack>
                </Center>
              </CardBody>
            </Card>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {docs.map((doc, idx) => (
                <Card 
                  key={doc._id} 
                  variant="outline"
                  borderColor={idx === 0 ? "teal.400" : undefined}
                  borderWidth={idx === 0 ? 2 : 1}
                  position="relative"
                >
                  {idx === 0 && (
                    <Box
                      position="absolute"
                      top={2}
                      right={2}
                      zIndex={1}
                    >
                      <Badge colorScheme="teal" variant="solid">
                        Activo
                      </Badge>
                    </Box>
                  )}
                  
                  <CardHeader pb={2}>
                    <VStack align="start" spacing={1} flex={1}>
                      <HStack>
                        <FiFileText color="#319795" />
                        <Text fontWeight="bold" fontSize="md" noOfLines={2}>
                          {doc.fileName}
                        </Text>
                      </HStack>
                    </VStack>
                  </CardHeader>
                  
                  <CardBody pt={0}>
                    <VStack spacing={3} align="stretch">
                      <HStack justify="space-between" fontSize="sm" color="gray.600">
                        <HStack>
                          <FiCalendar />
                          <Text>{formatDate(doc.createdAt)}</Text>
                        </HStack>
                        {doc.fileSize && <Text>{doc.fileSize}</Text>}
                      </HStack>
                      
                      {doc.notes && (
                        <Text fontSize="xs" color="gray.500" noOfLines={2}>
                          <strong>Notas:</strong> {doc.notes}
                        </Text>
                      )}

                      <HStack spacing={2}>
                        <Button
                          size="sm"
                          leftIcon={<FiEye />}
                          colorScheme="blue"
                          variant="outline"
                          as="a"
                          href={doc.url}
                          target="_blank"
                          flex={1}
                        >
                          Ver
                        </Button>
                        <Button
                          size="sm"
                          leftIcon={<FiDownload />}
                          colorScheme="green"
                          variant="outline"
                          as="a"
                          href={doc.url}
                          download
                          flex={1}
                        >
                          Descargar
                        </Button>
                        <IconButton
                          size="sm"
                          icon={<FiTrash2 />}
                          colorScheme="red"
                          variant="outline"
                          aria-label="Eliminar plan"
                          onClick={() => handleDeletePlan(doc._id)}
                        />
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          )}
        </Box>
      </VStack>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <VStack align="start" spacing={1}>
              <Text fontSize="lg" fontWeight="bold">
                Agregar nuevo plan nutricional
              </Text>
              <Text fontSize="sm" color="gray.600">
                Para {patientData?.firstName} {patientData?.lastName}
              </Text>
            </VStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={6} align="stretch">
              <Alert status="info">
                <AlertIcon />
                <Box>
                  <AlertTitle>Instrucciones:</AlertTitle>
                  <AlertDescription>
                    1. Selecciona un archivo PDF con el plan nutricional<br />
                    2. Edita el nombre del archivo si es necesario<br />
                    3. Agrega notas opcionales sobre el plan<br />
                    4. Haz clic en &quot;Subir Plan&quot; para completar la carga
                  </AlertDescription>
                </Box>
              </Alert>

              {/* File Upload Area */}
              <ChakraFileUpload
                onFileSelect={handleFileSelect}
                isUploading={uploading}
                uploadProgress={uploadProgress}
                placeholder="Arrastra y suelta un archivo PDF aquí, o haz clic para seleccionar"
                description="Solo archivos PDF son permitidos"
                selectedFile={selectedFile}
              />

              {/* Filename Section */}
              {selectedFile && (
                <Box>
                  <Text mb={2} fontWeight="semibold">Nombre del archivo:</Text>
                  <Input
                    placeholder="Ingresa el nombre del archivo"
                    value={fileName}
                    onChange={e => setFileName(e.target.value)}
                    size="md"
                  />
                  <Text fontSize="sm" color="gray.500" mt={1}>
                    El archivo se guardará como: {fileName.trim() ? `${fileName.trim()}.pdf` : selectedFile.name}
                  </Text>
                </Box>
              )}

              {/* Notes Section */}
              <Box>
                <Text mb={2} fontWeight="semibold">Notas del plan (opcional):</Text>
                <Textarea
                  placeholder="Agrega notas sobre este plan nutricional, objetivos específicos, recomendaciones especiales, etc."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={4}
                  resize="vertical"
                />
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleClose} variant="ghost" mr={3} disabled={uploading}>
              Cancelar
            </Button>
            <Button 
              colorScheme="teal" 
              onClick={handleUpload}
              disabled={uploading || !selectedFile}
              leftIcon={uploading ? undefined : <FiUpload />}
            >
              {uploading ? 'Subiendo...' : 'Subir Plan'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default NutritionPlanPage; 