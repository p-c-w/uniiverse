// import React from 'react';
// import { Modal } from '@mantine/core';

// const ModalSkeleton = () => (
//   <Modal.Root opened={true} size={1000} centered zIndex="9999">
//     <Modal.Overlay />
//   </Modal.Root>
// );

// export default ModalSkeleton;

import React from 'react';
import { Skeleton, Modal, Overlay } from '@mantine/core';

const ModalSkeleton = () => (
  <>
    <Modal.Root opened={true} size={1000} m={0} p={0} centered zIndex="1001">
      <Modal.Overlay />
      <Modal.Content zIndex="1000">
        <Overlay c="#000000" opacity={0.5} zIndex="1" />
        <Modal.Body bg="none" m={0} p={0}>
          <Skeleton width={1000} height={562} />
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  </>
);

export default ModalSkeleton;
