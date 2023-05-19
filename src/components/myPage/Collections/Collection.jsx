import { useRef, useState } from 'react';
import { Accordion } from '@mantine/core';
import { useRecoilValue } from 'recoil';
import { useCollectionQueries } from '../../../hooks/queries';
import { useSelectedItem } from '../../../hooks';
import { sideNavState } from '../../../recoil/atom';
import { Item } from '.';

const Collection = ({ collection, setIsItemSelected, setImgSrc, page }) => {
  const isNavOpened = useRecoilValue(sideNavState);

  const collectionQueries = useCollectionQueries(collection);

  const [selectedItem, setSelectedItem] = useState(null);

  const collectionList = collectionQueries.map(
    ({ data }) =>
      data !== undefined && {
        ...data,
        modified_at: collection?.filter(item => item.id === data?.id)[0]?.modified_at,
      }
  );

  const screenToClose = useSelectedItem(setSelectedItem, setIsItemSelected, selectedItem, page);

  const itemRef = useRef(null);

  const selectItem = e => {
    setSelectedItem(e);
    itemRef.current = e;
    setImgSrc(
      itemRef.current && `https://image.tmdb.org/t/p/w300${collectionList.find(item => item.title === e)?.posterPath}`
    );

    if (isNavOpened && screenToClose) {
      setIsItemSelected(null);
      return;
    }

    setIsItemSelected(itemRef.current !== null);
  };

  return (
    <>
      <Accordion variant="separated" w="100%" onChange={selectItem} value={selectedItem}>
        {collectionList?.map(item => (
          <Item key={item.id} item={item} setSelectedItem={setSelectedItem} setIsItemSelected={setIsItemSelected} />
        ))}
      </Accordion>
    </>
  );
};

export default Collection;