import { Card, CardBody, CardHeader, Heading, Text } from '@chakra-ui/react';
import React from 'react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  color?: string;
  onClick?: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, onClick, color = 'bg-blue-500' }) => {
  return (
    <Card onClick={onClick} cursor={onClick ? 'pointer' : 'default'}>
      <CardHeader >
        <Heading size="md">{title}</Heading>
      </CardHeader>
      <CardBody>
        <Text fontSize="2xl" fontWeight="bold">
          {value}
        </Text>
      </CardBody>
    </Card>
  );
};

export default StatsCard; 