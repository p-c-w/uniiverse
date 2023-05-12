import { Progress, Box, Text, Group, Paper, SimpleGrid, Title, useMantineColorScheme, Flex } from '@mantine/core';
import { IconDeviceAnalytics } from '@tabler/icons-react';
import { useRecoilValue } from 'recoil';
import styled from '@emotion/styled';
import { statsByProviderState } from '../../recoil/atom';

const ProgressLabel = styled(Progress)`
  .mantine-Progress-label {
    line-height: 1;
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }
`;

const Stat = styled(Box)`
  border-bottom: 0.1875rem solid ${props => props.color};
`;

const Diff = styled(Text)`
  align-items: center;
`;

const Icon = styled(IconDeviceAnalytics)`
  color: ${({ theme }) => (theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[4])};
`;

const getMaxProvider = datas => {
  let max = 0;
  let maxProvider = '';
  datas.forEach(data => {
    if (+data.count >= max) {
      max = +data.count;
      maxProvider = data.label;
    }
  });
  return maxProvider;
};

const StatsByProvider = () => {
  const { total, data } = useRecoilValue(statsByProviderState);
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  const maxProvider = getMaxProvider(data);

  const segments = data.map(segment => ({
    value: segment.part,
    color: segment.color,
    label: segment.part > 10 ? `${segment.part}%` : undefined,
    tooltip: `${`${segment.label} ${segment.part}`}%`,
  }));

  const descriptions = data.map(stat => (
    <Stat key={stat.label} color={stat.color} pb={5}>
      <Text tt="uppercase" fz="xs" c="dimmed" fw={700}>
        {stat.label}
      </Text>

      <Group position="apart" align="flex-end" spacing={0}>
        <Text fw={700} size="xs">
          {stat.count}
        </Text>
        <Text
          c={stat.label === 'Apple TV+' && !dark ? 'gray' : stat.label === 'Disney+' && dark ? 'indigo.5' : stat.color}
          fw={700}
          size="xs"
          lh="1.3">
          {stat.part}%
        </Text>
      </Group>
    </Stat>
  ));

  return (
    <Paper withBorder p={40} pt="sm" radius="md" h="100%">
      <Flex direction="column" justify="center" h="100%">
        <Title order={3} align="left">
          Universe 분석
        </Title>
        <Group position="apart" mt={7}>
          <Group align="flex-end" spacing="xs">
            <Text fz="lg" fw={700} align="left">
              지금까지 전체{' '}
              <Text fw={900} c={dark ? 'violet.2' : 'violet.9'} span>
                {total}
              </Text>
              건의 컨텐츠를 감상했어요.
            </Text>
          </Group>
          <Icon size="1.4rem" stroke={1.5} />
        </Group>
        <Diff c="teal" fz="sm" fw={700} display="flex">
          {maxProvider}를 가장 많이 사용했어요.
        </Diff>

        <ProgressLabel sections={segments} size={34} mt="md" />
        <SimpleGrid cols={3} breakpoints={[{ maxWidth: 'xs', cols: 1 }]} mt="md">
          {descriptions}
        </SimpleGrid>
      </Flex>
    </Paper>
  );
};

export default StatsByProvider;