export const translateSectionName = (section: string) => {
  switch (section) {
    case "liquids":
      return "Líquidos";
    case "sweets":
      return "Dulces";
    case "snacks":
      return "Snacks";
    case "sweeteners":
      return "Endulzantes";
    case "fats":
      return "Grasas";
    case "dairy":
      return "Lácteos";
    default:
      return section;
  }
};

export const translateRoutineStep = (step: string) => {
  const dictionary: {
    [key: string]: string;
  } = {
    mealsADay: "Comidas por día",
    householdShopper: "Comprador del hogar",
    starvingHours: "Horas de ayuno",
    preferredFoods: "Comidas preferidas",
    dislikedFoods: "Comidas no gustadas",
    breakfastTime: "Hora de desayuno",
    breakfastDetails: "Detalles del desayuno",
    midMorningSnackTime: "Hora de refrigerio de media mañana",
    midMorningSnackDetails: "Detalles del refrigerio de media mañana",
    lunchTime: "Hora de almuerzo",
    lunchDetails: "Detalles del almuerzo",
    afternoonSnackTime: "Hora de refrigerio de la tarde",
    afternoonSnackDetails: "Detalles del refrigerio de la tarde",
    meriendaTime: "Hora de merienda",
    meriendaDetails: "Detalles de la merienda",
    dinnerTime: "Hora de la cena",
    dinnerDetails: "Detalles de la cena",
    sleepTime: "Hora de sueño",
  };

  return dictionary[step] || step;
};

export const translateRoutineValue = (value: string) => {
  const dictionary: {
    [key: string]: string;
  } = {
    1: "Una",
    2: "Dos",
    3: "Tres",
    4: "Cuatro",
    5: "Más de cuatro",
    patient: "Consultante",
    partner: "Pareja",
    family: "Familia",
    other: "Otro",
    "waking-up": "Al levantarse",
    "mid-morning": "Media mañana",
    lunch: "Almuerzo",
    "mid-afternoon": "Media tarde",
    dinner: "Cena",
    bedtime: "Antes de dormir",
    none: "No hago esta comida",
    "4-6": "4:00 a 6:00",
    "6-8": "6:00 a 8:00",
    "8-10": "8:00 a 10:00",
    "10-12": "10:00 a 12:00",
    "12+": "Después de las 12:00",
    "11-13": "11:00 a 13:00",
    "13-15": "13:00 a 15:00",
    "15+": "Después de las 15:00",
    "15-17": "15:00 a 17:00",
    "17+": "Después de las 17:00",
  };

  return dictionary[value] || value;
};

export const translateFoodItem = (item: string) => {
  const dictionary: {
    [key: string]: string;
  } = {
    water: "agua",
    "sparkling-water": "soda",
    soda: "gaseosas",
    juice: "jugos",
    "flavored-water": "aguas saborizadas",
    chocolate: "chocolate",
    "ice-cream": "helado",
    cookies: "galletas",
    candies: "caramelos",
    "french-fries": "papas fritas",
    popcorn: "pochoclos",
    nuts: "frutos secos",
    "rice-snacks": "snacks de arroz",
    yoghurt: "yoghurt",
    fruit: "fruta",
    "cereal-bars": "barritas de cereal",
    granola: "granola",
    "white-sugar": "azúcar blanco",
    honey: "miel",
    "brown-sugar": "azúcar moreno",
    butter: "manteca",
    oil: "aceite",
    margarine: "margarina",
    "animal-fat": "grasa animal",
    "vegetable-spray": "rocío vegetal",
    "extra-virgin-olive-oil": "aceite de oliva virgen extra",
    whole: "enteros",
    skimmed: "descremados",
    creams: "cremas",
    mayonnaise: "mayonesas o aderezos",
  };
  return dictionary[item] || item;
};

export const renderStepName = (stepName: string) => {
  switch (stepName) {
    case "personalData":
      return "Datos personales";
    case "currentStatus":
      return "Estado actual";
    case "healthStatus":
      return "Estado de salud";
    case "diet":
      return "Dieta";
    case "routine":
      return "Rutina";
    case "exercise":
      return "Ejercicio";
    case "lifestyle":
      return "Estilo de vida";

    default:
      return stepName;
  }
};

export const getActivityLevelLabel = (level: number): string => {
  const dictionary: {
    [key: string]: string;
  } = {
    0: "Sedentario",
    1: "1-3 días/semana",
    2: "3-5 días/semana",
    3: "Alta intensidad",
  };
  return dictionary[level] || "";
};

export const translateFrequency = (frequency: string) => {
  const dictionary: {
    [key: string]: string;
  } = {
    never: "Nunca",
    rarely: "Raramente",
    sometimes: "A veces",
    frecuently: "Frecuentemente",
    always: "Siempre",
    social: "Socialmente",
    no: "No",
  };
  return dictionary[frequency] || frequency;
};
