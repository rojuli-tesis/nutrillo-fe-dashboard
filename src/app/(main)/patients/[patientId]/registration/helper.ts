interface StepData {
  notes: string | undefined;
  stepName: string;
  data?: StepInfo[];
}

interface StepInfo {
  [key: string]: string;
  stepName: string;
}

export function reduceRegistrationData(data: StepInfo[]): StepData[] {
  return data.reduce<StepData[]>((acc, info) => {
    const key = info.stepName.includes("diet")
      ? "diet"
      : info.stepName.includes("routine")
        ? "routine"
        : null;

    if (key) {
      let existing = acc.find((item) => item.stepName === key);
      if (existing) {
        existing.data?.push(info);
      } else {
        acc.push({ stepName: key, data: [info], notes: undefined });
      }
    } else {
      acc.push({ ...info, notes: undefined });
    }

    return acc;
  }, []);
}
