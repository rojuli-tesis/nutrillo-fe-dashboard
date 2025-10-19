"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Card,
  CardBody,
  CardHeader,
  Grid,
  GridItem,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  Image,
  Badge,
  Flex,
  Spinner,
  Center,
  Button,
  VStack,
  Divider,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  List,
  ListItem,
  ListIcon,
  HStack,
  Icon,
  Switch,
  FormControl,
  FormLabel,
  useToast,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useParams } from "next/navigation";
import restClient from "@/utils/restClient";
import { Patient } from "@/shared/interfaces/patients";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { StarIcon, TimeIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

// Data interfaces matching backend response
interface PlateEvaluation {
  id: number;
  ingredients: Array<{
    name: string;
    type: string;
    subtype?: string;
  }>;
  score: number;
  positives: string[];
  issues: string[];
  suggestions: string;
  isVisibleToUser: boolean;
  isHiddenFromNutritionist: boolean;
  userNotes?: string;
  nutritionistNotes?: string;
  pointsEarned: number;
  createdAt: string;
}

interface RecipeRecommendation {
  id: number;
  plateEvaluationId?: number;
  ingredients: string[];
  evaluationScore?: number;
  evaluationIssues: string[];
  recipes: Array<{
    name: string;
    description: string;
    ingredients: string[];
    instructions: string[];
    cookingTime: string;
    difficulty: string;
    nutritionalBenefits: string[];
  }>;
  pointsSpent: number;
  isHiddenFromNutritionist: boolean;
  createdAt: string;
}

const SavedPlatesPage = () => {
  const params = useParams<{ patientId: string }>();
  const [patientData, setPatientData] = useState<Patient>();
  const [plateEvaluations, setPlateEvaluations] = useState<PlateEvaluation[]>([]);
  const [recipeRecommendations, setRecipeRecommendations] = useState<RecipeRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [includeHidden, setIncludeHidden] = useState(false);
  const [selectedPlate, setSelectedPlate] = useState<PlateEvaluation | null>(null);
  const [nutritionistNotes, setNutritionistNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const loadData = async () => {
    try {
      const [patientResponse, plateEvaluationsResponse, recipeRecommendationsResponse] = await Promise.all([
        restClient.get<Patient>(`/patient/${params.patientId}`),
        restClient.get<PlateEvaluation[]>(`/plate-evaluator/patient/${params.patientId}?includeHidden=${includeHidden}`),
        restClient.get<RecipeRecommendation[]>(`/recipe-recommendations/patient/${params.patientId}?includeHidden=${includeHidden}`)
      ]);
      
      setPatientData(patientResponse);
      setPlateEvaluations(plateEvaluationsResponse);
      setRecipeRecommendations(recipeRecommendationsResponse);
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error cargando datos",
        description: "No se pudieron cargar los platos y recetas del paciente",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [params.patientId, includeHidden]);

  const togglePlateHide = async (plateId: number) => {
    try {
      await restClient.put(`/plate-evaluator/${plateId}/toggle-nutritionist-hide`, {});
      toast({
        title: "Estado actualizado",
        description: "El estado de visibilidad del plato ha sido actualizado",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      await loadData(); // Reload data to reflect changes
    } catch (error) {
      console.error("Error toggling plate hide status:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del plato",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const toggleRecipeHide = async (recipeId: number) => {
    try {
      await restClient.put(`/recipe-recommendations/${recipeId}/toggle-nutritionist-hide`, {});
      toast({
        title: "Estado actualizado",
        description: "El estado de visibilidad de la receta ha sido actualizado",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      await loadData(); // Reload data to reflect changes
    } catch (error) {
      console.error("Error toggling recipe hide status:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado de la receta",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const openPlateDetails = (plate: PlateEvaluation) => {
    setSelectedPlate(plate);
    setNutritionistNotes(plate.nutritionistNotes || "");
    onOpen();
  };

  const saveNutritionistNotes = async () => {
    if (!selectedPlate) return;
    
    setSavingNotes(true);
    try {
      await restClient.put(`/plate-evaluator/${selectedPlate.id}/nutritionist-notes`, {
        notes: nutritionistNotes
      });
      
      toast({
        title: "Notas guardadas",
        description: "Las notas del nutricionista han sido guardadas exitosamente",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      // Update the local state
      setPlateEvaluations(prev => 
        prev.map(plate => 
          plate.id === selectedPlate.id 
            ? { ...plate, nutritionistNotes }
            : plate
        )
      );
      
      onClose();
    } catch (error) {
      console.error("Error saving nutritionist notes:", error);
      toast({
        title: "Error",
        description: "No se pudieron guardar las notas",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSavingNotes(false);
    }
  };

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="teal.500" />
      </Center>
    );
  }

  if (!patientData) {
    return null;
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return "green";
    if (score >= 6) return "yellow";
    return "red";
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "green";
      case "medium": return "yellow";
      case "hard": return "red";
      default: return "gray";
    }
  };

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
          <BreadcrumbLink>Platos y recetas guardados</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <Flex justify="space-between" align="center" mb={6}>
        <Heading color="teal.500" size="lg">
          Platos y recetas guardados - {patientData?.firstName} {patientData?.lastName}
        </Heading>
        <FormControl display="flex" alignItems="center" w="auto">
          <FormLabel htmlFor="include-hidden" mb="0" fontSize="sm">
            Incluir elementos ocultos
          </FormLabel>
          <Switch
            id="include-hidden"
            isChecked={includeHidden}
            onChange={(e) => setIncludeHidden(e.target.checked)}
            colorScheme="teal"
          />
        </FormControl>
      </Flex>

      <Tabs variant="enclosed" colorScheme="teal">
        <TabList>
          <Tab>Platos Evaluados</Tab>
          <Tab>Recetas Recomendadas</Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={0}>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {plateEvaluations.length === 0 ? (
                <GridItem colSpan={{ base: 1, md: 2, lg: 3 }}>
                  <Card>
                    <CardBody>
                      <Text textAlign="center" color="gray.500">
                        No hay platos evaluados guardados para este paciente.
                      </Text>
                    </CardBody>
                  </Card>
                </GridItem>
              ) : (
                plateEvaluations.map((evaluation) => (
                  <Card key={evaluation.id} variant="outline" cursor="pointer" _hover={{ shadow: "md" }}>
                    <CardBody>
                      <VStack align="stretch" spacing={3}>
                        <Flex justify="space-between" align="center">
                          <Badge colorScheme={getScoreColor(evaluation.score)} fontSize="lg" px={3} py={1}>
                            {evaluation.score}/10
                          </Badge>
                          <HStack spacing={1}>
                            {evaluation.isVisibleToUser && (
                              <Icon as={StarIcon} color="purple.500" />
                            )}
                            {evaluation.isHiddenFromNutritionist && (
                              <Icon as={ViewOffIcon} color="red.500" />
                            )}
                            {evaluation.nutritionistNotes && (
                              <Icon as={ViewIcon} color="blue.500" />
                            )}
                          </HStack>
                        </Flex>

                        <Box>
                          <Text fontSize="sm" color="gray.600" mb={2}>Ingredientes:</Text>
                          <HStack wrap="wrap" spacing={1}>
                            {evaluation.ingredients.map((ingredient, index) => (
                              <Badge key={index} colorScheme="teal" variant="subtle" fontSize="xs">
                                {ingredient.name}
                              </Badge>
                            ))}
                          </HStack>
                        </Box>

                        <Text fontSize="xs" color="gray.500">
                          {dayjs(evaluation.createdAt).locale("es").format("DD/MM/YYYY HH:mm")}
                        </Text>

                        <Button
                          size="sm"
                          colorScheme="teal"
                          variant="outline"
                          onClick={() => openPlateDetails(evaluation)}
                        >
                          Ver detalles
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                ))
              )}
            </SimpleGrid>
          </TabPanel>

          <TabPanel px={0}>
            <Stack spacing={6}>
              {recipeRecommendations.length === 0 ? (
                <Card>
                  <CardBody>
                    <Text textAlign="center" color="gray.500">
                      No hay recetas recomendadas guardadas para este paciente.
                    </Text>
                  </CardBody>
                </Card>
              ) : (
                recipeRecommendations.map((recommendation) => (
                  <Card key={recommendation.id} variant="outline">
                    <CardHeader>
                      <Flex justify="space-between" align="center">
                        <HStack>
                          <Badge colorScheme="green">
                            Exitoso
                          </Badge>
                          <Badge colorScheme="blue" variant="outline">
                            {recommendation.pointsSpent} puntos gastados
                          </Badge>
                          {recommendation.isHiddenFromNutritionist && (
                            <Badge colorScheme="red" variant="outline">
                              <Icon as={ViewOffIcon} mr={1} />
                              Oculto
                            </Badge>
                          )}
                        </HStack>
                        <Text fontSize="sm" color="gray.500">
                          {dayjs(recommendation.createdAt).locale("es").format("DD/MM/YYYY HH:mm")}
                        </Text>
                      </Flex>
                    </CardHeader>
                    <CardBody>
                      <VStack align="stretch" spacing={4}>
                        <Box>
                          <Text fontWeight="bold" mb={2}>Ingredientes base:</Text>
                          <HStack wrap="wrap" spacing={2}>
                            {recommendation.ingredients.map((ingredient, index) => (
                              <Badge key={index} colorScheme="teal" variant="subtle">
                                {ingredient}
                              </Badge>
                            ))}
                          </HStack>
                        </Box>

                        {recommendation.evaluationScore && (
                          <Box>
                            <Text fontWeight="bold" mb={2}>Puntuación de evaluación base:</Text>
                            <Badge colorScheme={getScoreColor(recommendation.evaluationScore)} fontSize="md" px={3} py={1}>
                              {recommendation.evaluationScore}/10
                            </Badge>
                          </Box>
                        )}

                        <Divider />

                        <Text fontWeight="bold" fontSize="lg" color="teal.600">
                          Recetas recomendadas ({recommendation.recipes.length})
                        </Text>

                        {recommendation.recipes.map((recipe, index) => (
                          <Card key={index} variant="filled" bg="gray.50">
                            <CardHeader pb={2}>
                              <Flex justify="space-between" align="center">
                                <Heading size="md" color="teal.600">
                                  {recipe.name}
                                </Heading>
                                <HStack>
                                  <Badge colorScheme={getDifficultyColor(recipe.difficulty)}>
                                    {recipe.difficulty === "easy" ? "Fácil" : 
                                     recipe.difficulty === "medium" ? "Medio" : "Difícil"}
                                  </Badge>
                                  <Badge colorScheme="blue" variant="outline">
                                    <Icon as={TimeIcon} mr={1} />
                                    {recipe.cookingTime}
                                  </Badge>
                                </HStack>
                              </Flex>
                            </CardHeader>
                            <CardBody pt={0}>
                              <VStack align="stretch" spacing={3}>
                                <Text>{recipe.description}</Text>

                                <Box>
                                  <Text fontWeight="bold" mb={2}>Ingredientes:</Text>
                                  <HStack wrap="wrap" spacing={2}>
                                    {recipe.ingredients.map((ingredient, idx) => (
                                      <Badge key={idx} colorScheme="blue" variant="outline">
                                        {ingredient}
                                      </Badge>
                                    ))}
                                  </HStack>
                                </Box>

                                <Accordion allowMultiple>
                                  <AccordionItem>
                                    <h2>
                                      <AccordionButton>
                                        <Box as="span" flex="1" textAlign="left" fontWeight="bold">
                                          Instrucciones ({recipe.instructions.length} pasos)
                                        </Box>
                                        <AccordionIcon />
                                      </AccordionButton>
                                    </h2>
                                    <AccordionPanel pb={4}>
                                      <List spacing={2}>
                                        {recipe.instructions.map((instruction, idx) => (
                                          <ListItem key={idx}>
                                            <ListIcon as={TimeIcon} color="teal.500" />
                                            {instruction}
                                          </ListItem>
                                        ))}
                                      </List>
                                    </AccordionPanel>
                                  </AccordionItem>

                                  <AccordionItem>
                                    <h2>
                                      <AccordionButton>
                                        <Box as="span" flex="1" textAlign="left" fontWeight="bold">
                                          Beneficios nutricionales ({recipe.nutritionalBenefits.length})
                                        </Box>
                                        <AccordionIcon />
                                      </AccordionButton>
                                    </h2>
                                    <AccordionPanel pb={4}>
                                      <List spacing={1}>
                                        {recipe.nutritionalBenefits.map((benefit, idx) => (
                                          <ListItem key={idx}>
                                            <ListIcon as={StarIcon} color="green.500" />
                                            {benefit}
                                          </ListItem>
                                        ))}
                                      </List>
                                    </AccordionPanel>
                                  </AccordionItem>
                                </Accordion>
                              </VStack>
                            </CardBody>
                          </Card>
                        ))}

                        <Divider />

                        <Flex justify="space-between" align="center" pt={2}>
                          <Text fontSize="sm" color="gray.600">
                            {recommendation.isHiddenFromNutritionist ? "Esta receta está oculta de la vista principal" : "Visible en la vista principal"}
                          </Text>
                          <Button
                            size="sm"
                            colorScheme={recommendation.isHiddenFromNutritionist ? "green" : "red"}
                            variant="outline"
                            leftIcon={<Icon as={recommendation.isHiddenFromNutritionist ? ViewIcon : ViewOffIcon} />}
                            onClick={() => toggleRecipeHide(recommendation.id)}
                          >
                            {recommendation.isHiddenFromNutritionist ? "Mostrar" : "Ocultar"}
                          </Button>
                        </Flex>
                      </VStack>
                    </CardBody>
                  </Card>
                ))
              )}
            </Stack>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Detailed Plate Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Detalles del Plato - {selectedPlate && dayjs(selectedPlate.createdAt).locale("es").format("DD/MM/YYYY HH:mm")}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedPlate && (
              <VStack align="stretch" spacing={6}>
                {/* Score and Basic Info */}
                <Flex justify="space-between" align="center">
                  <Badge colorScheme={getScoreColor(selectedPlate.score)} fontSize="lg" px={4} py={2}>
                    Puntuación: {selectedPlate.score}/10
                  </Badge>
                  <HStack>
                    <Badge colorScheme="blue" variant="outline">
                      {selectedPlate.pointsEarned} puntos
                    </Badge>
                    {selectedPlate.isVisibleToUser && (
                      <Badge colorScheme="purple" variant="outline">
                        <Icon as={StarIcon} mr={1} />
                        Favorito del paciente
                      </Badge>
                    )}
                  </HStack>
                </Flex>

                {/* Ingredients */}
                <Box>
                  <Text fontWeight="bold" mb={2}>Ingredientes:</Text>
                  <HStack wrap="wrap" spacing={2}>
                    {selectedPlate.ingredients.map((ingredient, index) => (
                      <Badge key={index} colorScheme="teal" variant="subtle">
                        {ingredient.name}
                      </Badge>
                    ))}
                  </HStack>
                </Box>

                {/* Patient Notes */}
                {selectedPlate.userNotes && (
                  <Box>
                    <Text fontWeight="bold" mb={2}>Notas del paciente:</Text>
                    <Text bg="gray.50" p={3} borderRadius="md" fontStyle="italic">
                      &quot;{selectedPlate.userNotes}&quot;
                    </Text>
                  </Box>
                )}

                {/* Nutritionist Notes */}
                <Box>
                  <Text fontWeight="bold" mb={2}>Notas del nutricionista:</Text>
                  <Textarea
                    value={nutritionistNotes}
                    onChange={(e) => setNutritionistNotes(e.target.value)}
                    placeholder="Agregar notas para el paciente..."
                    rows={4}
                    resize="vertical"
                  />
                </Box>

                {/* Evaluation Details */}
                <Accordion allowMultiple>
                  <AccordionItem>
                    <h2>
                      <AccordionButton>
                        <Box as="span" flex="1" textAlign="left" fontWeight="bold">
                          Aspectos positivos ({selectedPlate.positives.length})
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <List spacing={1}>
                        {selectedPlate.positives.map((positive, index) => (
                          <ListItem key={index}>
                            <ListIcon as={StarIcon} color="green.500" />
                            {positive}
                          </ListItem>
                        ))}
                      </List>
                    </AccordionPanel>
                  </AccordionItem>

                  {selectedPlate.issues.length > 0 && (
                    <AccordionItem>
                      <h2>
                        <AccordionButton>
                          <Box as="span" flex="1" textAlign="left" fontWeight="bold">
                            Aspectos a mejorar ({selectedPlate.issues.length})
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>
                        <List spacing={1}>
                          {selectedPlate.issues.map((issue, index) => (
                            <ListItem key={index}>
                              <ListIcon as={ViewIcon} color="orange.500" />
                              {issue}
                            </ListItem>
                          ))}
                        </List>
                      </AccordionPanel>
                    </AccordionItem>
                  )}

                  <AccordionItem>
                    <h2>
                      <AccordionButton>
                        <Box as="span" flex="1" textAlign="left" fontWeight="bold">
                          Sugerencias
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <Text>{selectedPlate.suggestions}</Text>
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>

                {/* Hide/Show Controls */}
                <Divider />
                <Flex justify="space-between" align="center">
                  <Text fontSize="sm" color="gray.600">
                    {selectedPlate.isHiddenFromNutritionist ? "Este plato está oculto de la vista principal" : "Visible en la vista principal"}
                  </Text>
                  <Button
                    size="sm"
                    colorScheme={selectedPlate.isHiddenFromNutritionist ? "green" : "red"}
                    variant="outline"
                    leftIcon={<Icon as={selectedPlate.isHiddenFromNutritionist ? ViewIcon : ViewOffIcon} />}
                    onClick={() => {
                      togglePlateHide(selectedPlate.id);
                      onClose();
                    }}
                  >
                    {selectedPlate.isHiddenFromNutritionist ? "Mostrar" : "Ocultar"}
                  </Button>
                </Flex>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              colorScheme="teal" 
              onClick={saveNutritionistNotes}
              isLoading={savingNotes}
              loadingText="Guardando..."
            >
              Guardar notas
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default SavedPlatesPage;
