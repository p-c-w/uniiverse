import { Box, Container, SimpleGrid } from '@mantine/core';
import { Suspense } from 'react';
import { ThemeButton, GlobalShell, BarLoader } from '../components/common';
import {
  Collections,
  MypageTitle,
  Statistics,
  CurrentSubscriptionInfo,
  PredictedSubscription,
} from '../components/myPage';

const MyPage = () => (
  <GlobalShell>
    <Container mt="1rem" mx="auto" size={'100%'} w={1240}>
      <MypageTitle />
      <SimpleGrid cols={2} mt={32} spacing="xl">
        <Box>
          <Suspense fallback={<BarLoader />}>
            <PredictedSubscription />
            <CurrentSubscriptionInfo />
          </Suspense>
        </Box>
        <Statistics />
      </SimpleGrid>
      <Collections />
      <ThemeButton />
    </Container>
  </GlobalShell>
);
export default MyPage;
