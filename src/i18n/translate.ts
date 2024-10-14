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
