import React, { useRef } from 'react';
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
} from '@chakra-ui/react';
import { AttachmentIcon } from '@chakra-ui/icons';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  acceptedFileTypes?: Record<string, string[]>;
  maxFileSize?: number; // in bytes
  isUploading?: boolean;
  uploadProgress?: number;
  disabled?: boolean;
  placeholder?: string;
  description?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  acceptedFileTypes = { 'application/pdf': ['.pdf'] },
  maxFileSize = 10 * 1024 * 1024, // 10MB default
  isUploading = false,
  uploadProgress = 0,
  disabled = false,
  placeholder = "Arrastra y suelta un archivo aquí, o haz clic para seleccionar",
  description = "Solo archivos PDF son permitidos"
}) => {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDrop = (acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        toast({
          title: 'Archivo demasiado grande',
          description: `El archivo debe ser menor a ${Math.round(maxFileSize / 1024 / 1024)}MB`,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        toast({
          title: 'Tipo de archivo no válido',
          description: 'Por favor selecciona un archivo PDF válido',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Error al procesar archivo',
          description: 'Hubo un problema con el archivo seleccionado',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxSize: maxFileSize,
    multiple: false,
    disabled: disabled || isUploading,
  });

  return (
    <VStack spacing={4} align="stretch">
      <Box
        {...getRootProps()}
        w="full"
        p={8}
        border="2px dashed"
        borderColor={isDragActive ? 'teal.400' : 'gray.300'}
        borderRadius="lg"
        bg={isDragActive ? 'teal.50' : 'gray.50'}
        cursor={disabled || isUploading ? 'not-allowed' : 'pointer'}
        transition="all 0.2s"
        _hover={!disabled && !isUploading ? { borderColor: 'teal.400', bg: 'teal.50' } : {}}
        opacity={disabled || isUploading ? 0.6 : 1}
      >
        <input {...getInputProps()} ref={fileInputRef} />
        <VStack spacing={4}>
          <Icon as={AttachmentIcon} boxSize={12} color="teal.500" />
          {isDragActive ? (
            <Text color="teal.600" fontWeight="semibold">
              Suelta el archivo aquí...
            </Text>
          ) : (
            <VStack spacing={2}>
              <Text color="gray.600" fontWeight="semibold" textAlign="center">
                {placeholder}
              </Text>
              <Text color="gray.500" fontSize="sm" textAlign="center">
                {description}
              </Text>
              <Text color="gray.400" fontSize="xs" textAlign="center">
                Tamaño máximo: {Math.round(maxFileSize / 1024 / 1024)}MB
              </Text>
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

export default FileUpload;
