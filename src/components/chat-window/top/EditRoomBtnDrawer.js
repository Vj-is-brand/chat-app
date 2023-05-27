import React, { memo } from 'react';
import { useParams } from 'react-router';
import { Alert, Button, Drawer } from 'rsuite';
import { database } from '../../../misc/firebase';
import { useCurrentRoom } from '../../../context/create-room.context';
import { useMediaQuery, useModalState } from '../../../misc/custom-hooks';
import EditableInput from '../../EditableInput';

const EditRoomBtnDrawer = () => {
  const { isOpen, open, close } = useModalState();
  const { chatId } = useParams();
  const isMobile = useMediaQuery('(max-width:992px)');

  const name = useCurrentRoom(v => v.name);
  const description = useCurrentRoom(v => v.description);

  const updateData = (key, value) => {
    database
      .ref(`rooms/${chatId}`)
      .child(key)
      .set(value)
      .then(() => {
        Alert.success('successfully updated', 4000);
      })
      .catch(error => {
        Alert.error(error.message, 4000);
      });
  };

  const onNameSave = value => {
    updateData('name', value);
  };
  const onDescriptionSave = value => {
    updateData('description', value);
  };

  return (
    <div>
      <Button className="br-circle" size="sm" color="red" onClick={open}>
        A
      </Button>
      <Drawer show={isOpen} onHide={close} full={isMobile} placement='right'>
        <Drawer.Header>
          <Drawer.Title>Edit room</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <EditableInput
            initialValue={name}
            onSave={onNameSave}
            label={<h6 className='mb-2'>Name</h6>}
            emptyMsg="message cannot be empty"
          />
          <EditableInput
            componentClass="textarea"
            rows={5}
            initialValue={description}
            onSave={onDescriptionSave}
            wrapperClassName="mt-3"
          />
        </Drawer.Body>
        <Drawer.Footer>
          <Button block onClick={close} />
          close
        </Drawer.Footer>
      </Drawer>
    </div>
  );
};

export default memo(EditRoomBtnDrawer);
