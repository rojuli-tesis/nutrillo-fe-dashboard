'use client';

import React, { useEffect, useState } from 'react';
import StatsCard from '@/components/dashboard/StatsCard';
import restClient from '@/utils/restClient';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Container, 
  SimpleGrid, 
  Heading, 
  Spinner, 
  Center 
} from '@chakra-ui/react';

const DashboardPage = () => {
  const router = useRouter();
  const [patientCount, setPatientCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);


const dashboardApi = {
  // Get patient count
  getPatientCount: async (): Promise<number> => {
    try {
      const response = await restClient.get<{ count: number }>("/patient/count");
      return response.count;
    } catch (error) {
      console.error("Error fetching patient count:", error);
      return 0;
    }
  },
  
};


  useEffect(() => {
    const loadData = async () => {
      try {
        const count = await dashboardApi.getPatientCount();
        setPatientCount(count);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Heading as="h1" size="xl" mb={8}>Dashboard</Heading>
      
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        <StatsCard
        // redirect to patient list
        onClick={() => router.push('/patients')}
          title="Total Patients" 
          value={patientCount} 
          color="bg-blue-500"
        />
        {/* Add more stats cards here as needed */}
      </SimpleGrid>
    </Container>
  );
};

export default DashboardPage;
