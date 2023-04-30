import { IconLayersLinked } from '@tabler/icons-react';
import {
  Container,
  Card,
  Image,
  Text,
  Badge,
  Group,
  Flex,
  useMantineTheme,
  SimpleGrid,
  rem,
  Button,
  useMantineColorScheme,
  Title,
  Overlay,
  Transition,
  ThemeIcon,
  Tooltip,
} from '@mantine/core';
import styled from '@emotion/styled';
import { useCallback, useState, Suspense } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { useSortByPopularityInfinityQuery } from '../../hooks/queries';
import useObserver from '../../hooks/useObserver';
import { ActionIcons, ScrollObserver } from '../common';
import genres from '../../constants/genres';
import PosterSkeleton from './PosterSkeleton';
import DetailModal from '../common/Detail/DetailModal';

const CardGrid = styled(SimpleGrid)`
  position: relative;
  grid-template-columns: repeat(5, 15.75rem);
  margin: 0 auto;
`;

const Footer = styled(Group)`
  margin-top: var(--mantine-spacing-md);
  align-items: flex-start;
  flex-direction: column;
`;

const Poster = ({ id, title, originalTitle, posterPath, backdropPath, overview, date, genreIds, mediaType }) => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const [hovered, setHovered] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const dark = colorScheme === 'dark';

  return (
    <>
      <Card
        w={252}
        h={355}
        p="0"
        radius="md"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}>
        <Image
          src={posterPath ? `https://image.tmdb.org/t/p/w342${posterPath}` : 'https://placehold.co/252x378?text=TDB'}
        />
        <Transition mounted={hovered} transition="fade" duration={400} timingFunction="ease">
          {styles => (
            <Overlay
              style={styles}
              display="flex"
              color={dark ? theme.colors.dark[9] : theme.colors.gray[1]}
              p={'xl'}
              opacity={0.85}>
              <Flex direction={'column'} align="baseline" justify="space-between" opacity="none">
                <Tooltip
                  label="더보기"
                  position="bottom-end"
                  color={dark ? theme.colors.gray[1] : theme.colors.dark[9]}
                  withArrow
                  withinPortal>
                  <Button
                    p="xs"
                    variant="transparent"
                    pos="absolute"
                    top={theme.spacing.sm}
                    right={theme.spacing.sm}
                    onClick={open}
                    fz={12}
                    aria-label="more">
                    {'more'}
                    <ThemeIcon variant="transparent">
                      <IconLayersLinked size={16} />
                    </ThemeIcon>
                  </Button>
                </Tooltip>
                <Container m={0} mt="xl" p={0} mb={'md'}>
                  <Title fz="lg" fw={600} lineClamp={1}>
                    {title}
                  </Title>
                  <Text fz="sm" color="dimmed" lineClamp={1}>
                    {originalTitle}
                  </Text>
                  <Text fw={200} fz={'xs'}>
                    {date}
                  </Text>
                  <Text w="100%" mt="md" fz="xs" color="dimmed" lineClamp={5}>
                    {overview}
                  </Text>
                </Container>
                <Flex wrap={'wrap'}>
                  {genreIds.map(id => (
                    <Badge color={genres[mediaType][id].color} key={id}>
                      {genres[mediaType][id].name}
                    </Badge>
                  ))}
                </Flex>
                <Footer position="apart">
                  <Suspense fallback={<div>...loading</div>}>
                    <ActionIcons size={16} id={id} type={mediaType} />
                  </Suspense>
                </Footer>
              </Flex>
            </Overlay>
          )}
        </Transition>
      </Card>
      {opened && (
        <Suspense
          fallback={
            <div style={{ position: 'absolute', width: '100px', height: '200px', backgroundColor: '#fff' }}></div>
          }>
          <DetailModal
            opened={opened}
            close={close}
            id={id}
            title={title}
            backdropPath={backdropPath}
            posterPath={posterPath}
            overview={overview}
            genreIds={genreIds}
            mediaType={mediaType}
          />
        </Suspense>
      )}
    </>
  );
};

const observeOption = { rootMargin: '50%' };

const Posters = ({ mediaType }) => {
  const { data: content, hasNextPage, fetchNextPage } = useSortByPopularityInfinityQuery(mediaType);

  const getNextPage = useCallback(() => {
    if (hasNextPage) fetchNextPage();
  }, [hasNextPage, fetchNextPage]);

  const observerRef = useObserver(getNextPage, hasNextPage, observeOption);

  const movie = mediaType === 'movie';

  return (
    <>
      <CardGrid
        cols={5}
        w={rem(1324)}
        verticalSpacing="sm"
        breakpoints={[
          { maxWidth: '100rem', cols: 5 },
          { maxWidth: '48rem', cols: 2 },
          { maxWidth: '36rem', cols: 1 },
        ]}>
        {content.map(
          ({
            id,
            title,
            name,
            original_title: originalTitle,
            original_name: originalName,
            poster_path: posterPath,
            backdrop_path: backdropPath,
            genre_ids: genreIds,
            overview,
            release_date: releaseDate,
            first_air_date: firstAirDate,
          }) => (
            <Poster
              key={id}
              id={id}
              title={movie ? title : name}
              originalTitle={movie ? originalTitle : originalName}
              posterPath={posterPath}
              backdropPath={backdropPath}
              genreIds={genreIds}
              overview={overview}
              date={movie ? releaseDate : firstAirDate}
              mediaType={mediaType}
            />
          )
        )}
      </CardGrid>
      <ScrollObserver loader={<PosterSkeleton />} hasNextPage={hasNextPage} observer={observerRef} />
    </>
  );
};
export default Posters;
