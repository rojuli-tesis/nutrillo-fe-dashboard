'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/Button';
import { IngredientModal } from '@/app/(main)/ingredients/components/IngredientModal';
import { DeleteConfirmationModal } from '@/app/(main)/ingredients/components/DeleteConfirmationModal';
import restClient from '@/utils/restClient';
import {
  Box,
  Flex,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  Text,
  Spacer,
  Badge,
  HStack,
  VStack,
  Tag,
} from '@chakra-ui/react';

interface Ingredient {
  id: number;
  name: string;
  type: {
    id: number;
    name: string;
    color: string;
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

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchIngredients = async () => {
    try {
      const data = await restClient.get<Ingredient[]>('/plate-ingredient');
      setIngredients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  const handleDelete = async (id: number) => {
    await restClient.delete(`/plate-ingredient/${id}`);
    await fetchIngredients();
  };

  return (
    <Box p={8}>
      <Flex justify="space-between" align="center" mb={8}>
        <Heading size="lg">Gestion de Ingredientes</Heading>
        <Button
          onClick={() => {
            setSelectedIngredient(null);
            setIsModalOpen(true);
          }}
          colorScheme="teal"
          size="md"
        >
          Agregar Ingrediente
        </Button>
      </Flex>

      {loading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : ingredients.length === 0 ? (
        <Box textAlign="center" py={20}>
          <Text fontSize="xl" color="gray.500">No se encontraron ingredientes.</Text>
          <Button
            mt={4}
            colorScheme="teal"
            onClick={() => {
              setSelectedIngredient(null);
              setIsModalOpen(true);
            }}
          >
            Agregar tu primer ingrediente
          </Button>
        </Box>
      ) : (
        <Box bg="white" rounded="lg" shadow="md" overflowX="auto">
          <Table variant="simple">
            <Thead bg="gray.50">
              <Tr>
                <Th>Nombre</Th>
                <Th>Tipo</Th>
                <Th>Imagen</Th>
                <Th>Nutrientes</Th>
                <Th>Dieta</Th>
                <Th>Fuente</Th>
                <Th>Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {ingredients.map((ingredient) => (
                <Tr key={ingredient.id}>
                  <Td fontWeight="medium">{ingredient.name}</Td>
                  <Td>
                    <Badge colorScheme="blue" bg={ingredient.type?.color}>
                      {ingredient.type?.name}
                    </Badge>
                  </Td>
                  <Td>
                    <Image
                      src={ingredient.imageUrl}
                      alt={ingredient.name}
                      boxSize="48px"
                      objectFit="cover"
                      borderRadius="md"
                      fallbackSrc="https://via.placeholder.com/48"
                    />
                  </Td>
                  <Td>
                    <VStack align="start" spacing={1}>
                      {ingredient.nutrients?.energy && (
                        <Text fontSize="sm">Energía: {ingredient.nutrients.energy} kcal</Text>
                      )}
                      {ingredient.nutrients?.protein && (
                        <Text fontSize="sm">Proteínas: {ingredient.nutrients.protein}g</Text>
                      )}
                      {ingredient.nutrients?.fat && (
                        <Text fontSize="sm">Grasas: {ingredient.nutrients.fat}g</Text>
                      )}
                    </VStack>
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      {ingredient.dietary?.isVegan && (
                        <Badge colorScheme="green">Vegano</Badge>
                      )}
                      {ingredient.dietary?.isVegetarian && (
                        <Badge colorScheme="green">Vegetariano</Badge>
                      )}
                    </HStack>
                    {ingredient.dietary?.allergens && ingredient.dietary.allergens.length > 0 && (
                      <HStack mt={2} wrap="wrap" spacing={1}>
                        {ingredient.dietary.allergens.map((allergen) => (
                          <Tag key={allergen} size="sm" colorScheme="red">
                            {allergen}
                          </Tag>
                        ))}
                      </HStack>
                    )}
                  </Td>
                  <Td>
                    <Badge colorScheme={ingredient.source === 'open_food_facts' ? 'blue' : 'gray'}>
                      {ingredient.source === 'open_food_facts' ? 'Open Food Facts' : 'Manual'}
                    </Badge>
                  </Td>
                  <Td>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      onClick={() => {
                        setSelectedIngredient(ingredient);
                        setIsModalOpen(true);
                      }}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => {
                        setIsDeleteModalOpen(true);
                        setSelectedIngredient(ingredient);
                      }}
                    >
                      Eliminar
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      {isModalOpen && (
        <IngredientModal
          ingredient={selectedIngredient}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedIngredient(null);
          }}
          onSave={async (formData: FormData) => {
            try {
              if (selectedIngredient) {
                await restClient.put(`/plate-ingredient/${selectedIngredient.id}`, formData);
              } else {
                await restClient.post('/plate-ingredient', formData);
              }
              await fetchIngredients();
              setIsModalOpen(false);
              setSelectedIngredient(null);
            } catch (err) {
              setError(err instanceof Error ? err.message : 'An error occurred');
            }
          }}
          onDelete={selectedIngredient ? async () => {
            setIsDeleteModalOpen(true);
            return Promise.resolve();
          } : undefined}
        />
      )}

      {selectedIngredient && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setIsModalOpen(false);
            setSelectedIngredient(null);
          }}
          onConfirm={async () => {
            await handleDelete(selectedIngredient.id);
          }}
        />
      )}
    </Box>
  );
} 