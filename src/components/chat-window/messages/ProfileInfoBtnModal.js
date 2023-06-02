import React from 'react';
import { Button,Modal } from 'rsuite';
import { useModalState } from '../../../misc/custom-hooks';
import ProfileAvatar from '../../ProfileAvatar';

const ProfileInfoBtnModal = ({ profile,children,...btnProps }) => {
  const { isOpen, close, open } = useModalState();
  const { name, avatar, createdAt } = profile;
  const shortName = profile.name.split(' ')[0];
  // console.log(profile.name);
  // console.log(shortName);
  const memeberSince = new Date(createdAt).toLocaleDateString();

  return (
    <>
      <Button {...btnProps} onClick={open}>
        {shortName}
      </Button>
      <Modal show={isOpen} onHide={close}>
        <Modal.Header>
          <Modal.Title>{shortName} profile</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <ProfileAvatar src={profile.avatar} name={profile.name} className='
          width-200 height-200 img-fullsize font-huge' />
          <h4>{name}</h4>
          <p>Joined on {memeberSince}</p>
        </Modal.Body>
        <Modal.Footer>
        {children}
          <Button onClick={close} block >close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProfileInfoBtnModal;
