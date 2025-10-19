'use client';

import { useState, useEffect, useRef } from 'react';
import Button from '@/components/Button';
import { OpenFoodFactsSearch } from './OpenFoodFactsSearch';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Image,
  Spinner,
  Box,
  Text,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Checkbox,
  VStack,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  Select,
} from '@chakra-ui/react';
import restClient from '@/utils/restClient';
import { FiUpload } from 'react-icons/fi';
import { Icon } from '@chakra-ui/react';

interface Ingredient {
  id?: number;
  name: string;
  type: {
    id: number;
    name: string;
    color: string;
  };
  subtype?: {
    id: number;
    name: string;
    type: {
      id: number;
      name: string;
    };
  };
  imageUrl: string;
  nutrients?: {
    energy?: number;
    protein?: number;
    fat?: number;
    saturatedFat?: number;
    carbs?: number;
    sugar?: number;
    fiber?: number;
    sodium?: number;
  };
  dietary: {
    isVegan: boolean;
    isVegetarian: boolean;
    allergens: string[];
  };
  metadata?: any;
  source?: string;
}

interface IngredientType {
  id: number;
  name: string;
  color: string;
  label: string;
}

interface IngredientSubtype {
  id: number;
  name: string;
  label: string;
  type: {
    id: number;
    name: string;
  };
}

interface IngredientModalProps {
  ingredient: Ingredient | null;
  onClose: () => void;
  onSave: (data: FormData) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export function IngredientModal({ ingredient, onClose, onSave, onDelete }: IngredientModalProps) {
  const [formData, setFormData] = useState<Partial<Ingredient>>({
    name: '',
    type: {
      id: 0,
      name: '',
      color: '',
    },
    subtype: undefined,
    imageUrl: '',
    nutrients: {},
    dietary: {
      isVegan: false,
      isVegetarian: false,
      allergens: [],
    },
    metadata: {},
    source: 'manual',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newAllergen, setNewAllergen] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [ingredientTypes, setIngredientTypes] = useState<IngredientType[]>([]);
  const [ingredientSubtypes, setIngredientSubtypes] = useState<IngredientSubtype[]>([]);

  useEffect(() => {
    if (ingredient) {
      setFormData(ingredient);
      setImagePreview(ingredient.imageUrl || null);
      if (ingredient.type) {
        fetchSubtypes(ingredient.type.name);
      }
    } else {
      setFormData({
        name: '',
        type: {
          id: 0,
          name: '',
          color: '',
        },
        subtype: undefined,
        imageUrl: '',
        nutrients: {},
        dietary: {
          isVegan: false,
          isVegetarian: false,
          allergens: [],
        },
        metadata: {},
        source: 'manual',
      });
      setImagePreview(null);
    }
  }, [ingredient]);

  useEffect(() => {
    // Fetch ingredient types when component mounts
    const fetchIngredientTypes = async () => {
      try {
        const response = await restClient.get<IngredientType[]>('/plate-ingredient/types');
        setIngredientTypes(response);
      } catch (error) {
        console.error('Error fetching ingredient types:', error);
      }
    };

    fetchIngredientTypes();
  }, []);

  const fetchSubtypes = async (typeName: string) => {
    try {
      const response = await restClient.get<IngredientSubtype[]>(`/plate-ingredient/subtypes?type=${typeName}`);
      setIngredientSubtypes(response);
    } catch (error) {
      console.error('Error fetching subtypes:', error);
    }
  };

  const handleTypeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = ingredientTypes.find(t => t.id === Number(e.target.value));
    if (selectedType) {
      setFormData(prev => ({
        ...prev,
        type: selectedType,
        subtype: undefined // Reset subtype when type changes
      }));
      await fetchSubtypes(selectedType.name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const submitData = new FormData();
      
      // Add the file if one was selected
      if (selectedFile) {
        console.log('Selected file:', selectedFile);
        submitData.append('file', selectedFile);
      }
      
      // Add all other form data
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'file' && key !== 'imageUrl') { // Skip file and imageUrl
          if (key === 'type') {
            // Send typeId instead of the entire type object
            submitData.append('typeId', (value as any).id.toString());
          } else if (typeof value === 'object') {
            submitData.append(key, JSON.stringify(value));
          } else {
            submitData.append(key, value as string);
          }
        }
      });

      Array.from(submitData.entries()).forEach(([key, value]) => {
        console.log(key, value);
      });

      await onSave(submitData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFoodFactsSelect = (product: any) => {
    setFormData({
      ...formData,
      ...product,
      type: {
        id: 0,
        name: 'food',
        color: '#000000',
      },
    });
    setImagePreview(product.imageUrl);
  };

  const addAllergen = () => {
    if (newAllergen.trim() && !formData.dietary?.allergens.includes(newAllergen.trim())) {
      setFormData((prev) => ({
        ...prev,
        dietary: {
          ...prev.dietary!,
          allergens: [...(prev.dietary?.allergens || []), newAllergen.trim()],
        },
      }));
      setNewAllergen('');
    }
  };

  const removeAllergen = (allergen: string) => {
    setFormData((prev) => ({
      ...prev,
      dietary: {
        ...prev.dietary!,
        allergens: prev.dietary?.allergens.filter((a) => a !== allergen) || [],
      },
    }));
  };

  return (
    <Modal isOpen onClose={onClose} isCentered size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{ingredient ? 'Editar Ingrediente' : 'Agregar Ingrediente'}</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody pb={6}>
            <Tabs>
              <TabList>
                <Tab>Manual</Tab>
                <Tab>Open Food Facts</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <VStack spacing={4} align="stretch">
                    <FormControl isRequired>
                      <FormLabel>Nombre</FormLabel>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Nombre"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Tipo</FormLabel>
                      <Select
                        value={formData.type?.id}
                        onChange={handleTypeChange}
                        placeholder="Selecciona un tipo"
                      >
                        {ingredientTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.label}
                          </option>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Subtipo</FormLabel>
                      <Select
                        value={formData.subtype?.id}
                        onChange={(e) => {
                          const selectedSubtype = ingredientSubtypes.find(s => s.id === Number(e.target.value));
                          if (selectedSubtype) {
                            setFormData(prev => ({
                              ...prev,
                              subtype: selectedSubtype
                            }));
                          }
                        }}
                        placeholder="Selecciona un subtipo"
                        isDisabled={!formData.type?.id}
                      >
                        {ingredientSubtypes.map((subtype) => (
                          <option key={subtype.id} value={subtype.id}>
                            {subtype.label}
                          </option>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Imagen</FormLabel>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        display="none"
                      />
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        leftIcon={<Icon as={FiUpload} />}
                        width="full"
                      >
                        Seleccionar Imagen
                      </Button>
                      {imagePreview && (
                        <Box mt={2}>
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            boxSize="200px"
                            objectFit="cover"
                            borderRadius="md"
                          />
                        </Box>
                      )}
                    </FormControl>

                    <FormControl>
                      <FormLabel>Nutrientes (por 100g)</FormLabel>
                      <VStack spacing={2} align="stretch">
                        <HStack>
                          <FormLabel width="120px">Energía (kcal)</FormLabel>
                          <NumberInput
                            value={formData.nutrients?.energy}
                            onChange={(_, value) =>
                              setFormData((prev) => ({
                                ...prev,
                                nutrients: { ...prev.nutrients, energy: value },
                              }))
                            }
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </HStack>
                        <HStack>
                          <FormLabel width="120px">Proteínas (g)</FormLabel>
                          <NumberInput
                            value={formData.nutrients?.protein}
                            onChange={(_, value) =>
                              setFormData((prev) => ({
                                ...prev,
                                nutrients: { ...prev.nutrients, protein: value },
                              }))
                            }
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </HStack>
                        <HStack>
                          <FormLabel width="120px">Grasas (g)</FormLabel>
                          <NumberInput
                            value={formData.nutrients?.fat}
                            onChange={(_, value) =>
                              setFormData((prev) => ({
                                ...prev,
                                nutrients: { ...prev.nutrients, fat: value },
                              }))
                            }
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </HStack>
                      </VStack>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Dieta</FormLabel>
                      <VStack spacing={2} align="stretch">
                        <Checkbox
                          isChecked={formData.dietary?.isVegan}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              dietary: {
                                ...prev.dietary!,
                                isVegan: e.target.checked,
                              },
                            }))
                          }
                        >
                          Vegano
                        </Checkbox>
                        <Checkbox
                          isChecked={formData.dietary?.isVegetarian}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              dietary: {
                                ...prev.dietary!,
                                isVegetarian: e.target.checked,
                              },
                            }))
                          }
                        >
                          Vegetariano
                        </Checkbox>
                      </VStack>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Alérgenos</FormLabel>
                      <HStack>
                        <Input
                          value={newAllergen}
                          onChange={(e) => setNewAllergen(e.target.value)}
                          placeholder="Agregar alérgeno"
                          onKeyPress={(e) => e.key === 'Enter' && addAllergen()}
                        />
                        <Button onClick={addAllergen}>Agregar</Button>
                      </HStack>
                      <HStack mt={2} wrap="wrap" spacing={1}>
                        {(formData.dietary?.allergens || []).map((allergen) => (
                          <Tag key={allergen} size="sm" colorScheme="red">
                            {allergen}
                            <TagCloseButton onClick={() => removeAllergen(allergen)} />
                          </Tag>
                        ))}
                      </HStack>
                    </FormControl>
                  </VStack>
                </TabPanel>

                <TabPanel>
                  <OpenFoodFactsSearch onSelect={handleOpenFoodFactsSelect} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>

          <ModalFooter>
            {ingredient && onDelete && (
              <Button
                colorScheme="red"
                mr={3}
                onClick={() => onDelete()}
              >
                Eliminar
              </Button>
            )}
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              isLoading={loading}
              loadingText="Guardando..."
            >
              Guardar
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
} 