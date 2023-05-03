import { useProviderQueries, useUserQuery } from './queries';
import { PROVIDERS } from '../constants';

const defaultData = {
  total: '0',
  data: [
    {
      id: 8,
      label: 'Netflix',
      count: 0,
      part: 0,
      // color: `${PROVIDERS[8].color}`,
      color: '#FF515E',
    },
    {
      id: 97,
      label: 'Watcha',
      count: 0,
      part: 0,
      // color: `${PROVIDERS[97].color}`,
      color: '#FF8A99',
    },
    {
      id: 119,
      label: 'Amazon Prime',
      count: 0,
      part: 0,
      color: `${PROVIDERS[119].color}`,
    },
    {
      id: 337,
      label: 'Disney+',
      count: 0,
      part: 0,
      // color: `${PROVIDERS[337].color}`,
      color: '#0046AB',
    },
    {
      id: 350,
      label: 'Apple TV+',
      count: 0,
      part: 0,
      // color: `${PROVIDERS[350].color}`,
      color: '#DADDE2',
    },
    {
      id: 356,
      label: 'Wavve',
      count: 0,
      part: 0,
      color: `${PROVIDERS[356].color}`,
    },
  ],
};

const getCountByProvider = (providerId, providerIds) => providerIds?.filter(Id => Id === providerId).length;

const getNewData = (providers, newTotal) => {
  const providerIds = providers.flatMap(Ids => Ids.providers);

  const newData = defaultData.data
    .map(item => ({ ...item, count: getCountByProvider(item.id, providerIds) }))
    .map(item => ({ ...item, part: +((item.count / newTotal) * 100).toFixed() }));
  return newData;
};

const useStatisticsByProvider = () => {
  const { data } = useUserQuery({ select: userInfo => userInfo.history_list });
  const historyList = data || [];
  const newTotal = historyList.length;

  let newData = [];

  const queries = useProviderQueries(historyList, {
    select: data => ({
      id: data.id,
      providers: data.results.KR
        ? data.results.KR.flatrate
            ?.map(provider => provider.provider_id)
            ?.filter(id => Object.prototype.hasOwnProperty.call(PROVIDERS, id))
        : [],
    }),
    enabled: !!newTotal,
  });

  const providers = queries.map(({ isSuccess, data }) => isSuccess && data);

  if (providers[0]) {
    newData = getNewData(providers, newTotal);
  }
  return { newTotal, newData };
};

export default useStatisticsByProvider;
