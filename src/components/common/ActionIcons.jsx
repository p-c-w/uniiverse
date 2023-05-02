import { useRecoilValue } from 'recoil';
import { Group, ThemeIcon } from '@mantine/core';
import { IconHistory, IconMovie, IconThumbUp } from '@tabler/icons-react';
import styled from '@emotion/styled';
import { userState } from '../../recoil/atom';
import { useUserQuery } from '../../hooks/queries';
import { useAddUserContentMutation, useDeleteUserContentMutation } from '../../hooks/mutations';

const getUserInfo = userInfo => ({
  watchlist: userInfo.watch_list,
  likelist: userInfo.like_list,
  historylist: userInfo.history_list,
});

const CategoryIcon = styled(ThemeIcon)`
  cursor: pointer;
`;

const ActionIcons = ({ size, id, type }) => {
  const userEmail = useRecoilValue(userState);

  const { data } = useUserQuery({ select: getUserInfo, enabled: !!userEmail });

  const { mutate: addUserContent } = useAddUserContentMutation();
  const { mutate: deleteUserContent } = useDeleteUserContentMutation();

  const { watchlist = [], likelist = [], historylist = [] } = data || {};

  const isItemInList = list => list.some(item => item.id === id && item.type === type);

  const handleClick = (list, listName) => {
    if (!userEmail) return;

    const now = new Date();
    const contentData = { id, type, modified_at: now.toISOString() };

    if (isItemInList(list)) {
      deleteUserContent({ email: userEmail, list: listName, id });
    } else {
      addUserContent({ email: userEmail, list: listName, value: contentData });
    }
  };

  const getIconVariant = (list, color) =>
    isItemInList(list) ? { variant: 'filled', color } : { variant: 'outline', color };

  return (
    <Group spacing={8}>
      <CategoryIcon
        role="button"
        aria-label={`to ${watchlist}`}
        {...getIconVariant(watchlist, 'yellow')}
        onClick={() => handleClick(watchlist, 'watch_list')}>
        <IconMovie size={size} />
      </CategoryIcon>
      <CategoryIcon
        role="button"
        aria-label={likelist}
        {...getIconVariant(likelist, 'red')}
        onClick={() => handleClick(likelist, 'like_list')}>
        <IconThumbUp size={size} />
      </CategoryIcon>
      <CategoryIcon
        role="button"
        aria-label={historylist}
        {...getIconVariant(historylist, 'blue')}
        onClick={() => handleClick(historylist, 'history_list')}>
        <IconHistory size={size} />
      </CategoryIcon>
    </Group>
  );
};

export default ActionIcons;
