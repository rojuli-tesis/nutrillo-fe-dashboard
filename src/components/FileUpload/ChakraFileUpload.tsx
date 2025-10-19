import React, { useRef, useState } from 'react';
import {
  Box,
  VStack,
  Text,
  Button,
  useToast,
  Progress,
  HStack,
  Icon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { AttachmentIcon, SmallCloseIcon } from '@chakra-ui/icons';

interface ChakraFileUploadProps {
  onFileSelect: (file: File) => void;
  acceptedFileTypes?: string;
  maxFileSize?: number; // in bytes
  isUploading?: boolean;
  uploadProgress?: number;
  disabled?: boolean;
  placeholder?: string;
  description?: string;
}

const ChakraFileUpload: React.FC<ChakraFileUploadProps> = ({
  onFileSelect,
  acceptedFileTypes = '.pdf',
  maxFileSize = 10 * 1024 * 1024, // 10MB default
  isUploading = false,
  uploadProgress = 0,
  disabled = false,
  placeholder = "Selecciona un archivo PDF",
  description = "Solo archivos PDF son permitidos"
}) => {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
      toast({
        title: 'Tipo de archivo no válido',
        description: 'Por favor selecciona un archivo PDF válido',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Validate file size
    if (file.size > maxFileSize) {
      toast({
        title: 'Archivo demasiado grande',
        description: `El archivo debe ser menor a ${Math.round(maxFileSize / 1024 / 1024)}MB`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    if (fileInputRef.current && !disabled && !isUploading) {
      fileInputRef.current.click();
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <Box
        w="full"
        p={8}
        border="2px dashed"
        borderColor={isDragOver ? 'teal.400' : 'gray.300'}
        borderRadius="lg"
        bg={isDragOver ? 'teal.50' : 'gray.50'}
        cursor={disabled || isUploading ? 'not-allowed' : 'pointer'}
        transition="all 0.2s"
        _hover={!disabled && !isUploading ? { borderColor: 'teal.400', bg: 'teal.50' } : {}}
        opacity={disabled || isUploading ? 0.6 : 1}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <Input
          ref={fileInputRef}
          type="file"
          accept={acceptedFileTypes}
          onChange={handleInputChange}
          display="none"
          disabled={disabled || isUploading}
        />
        
        <VStack spacing={4}>
          <Icon as={AttachmentIcon} boxSize={12} color="teal.500" />
          {selectedFile ? (
            <VStack spacing={2}>
              <Text color="teal.600" fontWeight="semibold">
                Archivo seleccionado: {selectedFile.name}
              </Text>
              <Text color="gray.500" fontSize="sm">
                Tamaño: {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
              </Text>
              <Button
                size="sm"
                variant="outline"
                colorScheme="red"
                leftIcon={<SmallCloseIcon />}
                onClick={(e) => {
                  e.stopPropagation();
                  clearFile();
                }}
              >
                Quitar archivo
              </Button>
            </VStack>
          ) : (
            <VStack spacing={2}>
              <Text color="gray.600" fontWeight="semibold" textAlign="center">
                {isDragOver ? 'Suelta el archivo aquí...' : placeholder}
              </Text>
              <Text color="gray.500" fontSize="sm" textAlign="center">
                {description}
              </Text>
              <Text color="gray.400" fontSize="xs" textAlign="center">
                Tamaño máximo: {Math.round(maxFileSize / 1024 / 1024)}MB
              </Text>
              <Button
                size="sm"
                colorScheme="teal"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  openFileDialog();
                }}
              >
                Seleccionar archivo
              </Button>
            </VStack>
          )}
        </VStack>
      </Box>

      {/* Upload Progress */}
      {isUploading && (
        <Box w="full">
          <HStack justify="space-between" mb={2}>
            <Text fontSize="sm" color="gray.600">Subiendo archivo...</Text>
            <Text fontSize="sm" color="gray.600">{uploadProgress}%</Text>
          </HStack>
          <Progress 
            value={uploadProgress} 
            colorScheme="teal" 
            size="sm" 
            borderRadius="full"
          />
        </Box>
      )}

      {/* File Requirements Alert */}
      <Alert status="info" size="sm">
        <AlertIcon />
        <Box>
          <AlertTitle fontSize="sm">Requisitos del archivo:</AlertTitle>
          <AlertDescription fontSize="xs">
            • Formato: PDF únicamente<br />
            • Tamaño máximo: {Math.round(maxFileSize / 1024 / 1024)}MB<br />
            • El archivo debe contener el plan nutricional completo
          </AlertDescription>
        </Box>
      </Alert>
    </VStack>
  );
};

export default ChakraFileUpload;
