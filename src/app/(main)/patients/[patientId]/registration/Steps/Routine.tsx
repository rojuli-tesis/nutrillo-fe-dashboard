import React from "react";

const RoutineStep = ({ data }: { data: any }) => {
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
};

export default RoutineStep;
