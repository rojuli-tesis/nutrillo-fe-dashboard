import { useState } from 'react';
import {
  Box,
  Input,
  Button,
  VStack,
  Text,
  Image,
  Spinner,
  useToast,
  Card,
  CardBody,
  Stack,
  StackDivider,
  Badge,
} from '@chakra-ui/react';

interface OpenFoodFactsProduct {
  product_name_es: string;
  image_url: string;
  nutriments: {
    energy_100g?: number;
    proteins_100g?: number;
    fat_100g?: number;
    'saturated-fat_100g'?: number;
    carbohydrates_100g?: number;
    sugars_100g?: number;
    fiber_100g?: number;
    sodium_100g?: number;
  };
  labels_tags?: string[];
  allergens_tags?: string[];
}

interface NormalizedProduct {
  name: string;
  imageUrl: string;
  nutrients: {
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
  metadata: OpenFoodFactsProduct;
  source: string;
}

interface OpenFoodFactsSearchProps {
  onSelect: (product: NormalizedProduct) => void;
}

export function OpenFoodFactsSearch({ onSelect }: OpenFoodFactsSearchProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<OpenFoodFactsProduct[]>([]);
  const toast = useToast();

  const searchProducts = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
          query
        )}&search_simple=1&json=1&page_size=5`
      );
      const data = await response.json();
      setResults(data.products || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo buscar en Open Food Facts',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const normalizeProduct = (product: OpenFoodFactsProduct) => {
    const normalized: NormalizedProduct = {
      name: product.product_name_es || '',
      imageUrl: product.image_url || '',
      nutrients: {
        energy: product.nutriments.energy_100g,
        protein: product.nutriments.proteins_100g,
        fat: product.nutriments.fat_100g,
        saturatedFat: product.nutriments['saturated-fat_100g'],
        carbs: product.nutriments.carbohydrates_100g,
        sugar: product.nutriments.sugars_100g,
        fiber: product.nutriments.fiber_100g,
        sodium: product.nutriments.sodium_100g,
      },
      dietary: {
        isVegan: product.labels_tags?.includes('en:vegan') || false,
        isVegetarian: product.labels_tags?.includes('en:vegetarian') || false,
        allergens: product.allergens_tags || [],
      },
      metadata: product,
      source: 'open_food_facts',
    };

    onSelect(normalized);
  };

  return (
    <VStack spacing={4} align="stretch">
      <Box>
        <Input
          placeholder="Buscar ingrediente..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && searchProducts()}
        />
        <Button
          mt={2}
          colorScheme="teal"
          onClick={searchProducts}
          isLoading={loading}
          width="full"
        >
          Buscar
        </Button>
      </Box>

      {loading && (
        <Box textAlign="center" py={4}>
          <Spinner />
        </Box>
      )}

      {results.length > 0 && (
        <VStack spacing={4} align="stretch">
          {results.map((product, index) => (
            <Card key={index} cursor="pointer" onClick={() => normalizeProduct(product)}>
              <CardBody>
                <Stack divider={<StackDivider />} spacing={4}>
                  <Box>
                    <Text fontSize="lg" fontWeight="bold">
                      {product.product_name_es}
                    </Text>
                    {product.image_url && (
                      <Image
                        src={product.image_url}
                        alt={product.product_name_es}
                        boxSize="100px"
                        objectFit="cover"
                        borderRadius="md"
                        mt={2}
                      />
                    )}
                  </Box>
                  <Box>
                    <Text fontSize="sm" fontWeight="bold" mb={2}>
                      Nutrientes (por 100g):
                    </Text>
                    <VStack align="start" spacing={1}>
                      {product.nutriments.energy_100g && (
                        <Text>Energía: {product.nutriments.energy_100g} kcal</Text>
                      )}
                      {product.nutriments.proteins_100g && (
                        <Text>Proteínas: {product.nutriments.proteins_100g}g</Text>
                      )}
                      {product.nutriments.fat_100g && (
                        <Text>Grasas: {product.nutriments.fat_100g}g</Text>
                      )}
                    </VStack>
                  </Box>
                  <Box>
                    <Text fontSize="sm" fontWeight="bold" mb={2}>
                      Etiquetas:
                    </Text>
                    <Stack direction="row" spacing={2}>
                      {product.labels_tags?.includes('en:vegan') && (
                        <Badge colorScheme="green">Vegano</Badge>
                      )}
                      {product.labels_tags?.includes('en:vegetarian') && (
                        <Badge colorScheme="green">Vegetariano</Badge>
                      )}
                    </Stack>
                  </Box>
                </Stack>
              </CardBody>
            </Card>
          ))}
        </VStack>
      )}
    </VStack>
  );
} 