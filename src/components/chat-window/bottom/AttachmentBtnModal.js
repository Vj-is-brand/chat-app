import React, { useState } from 'react';
import { useParams } from 'react-router';
import { Alert, Button, Icon, InputGroup, Modal, Uploader } from 'rsuite';
import InputGroupButton from 'rsuite/lib/InputGroup/InputGroupButton';
import ModalBody from 'rsuite/lib/Modal/ModalBody';
import ModalFooter from 'rsuite/lib/Modal/ModalFooter';
import ModalHeader from 'rsuite/lib/Modal/ModalHeader';
import ModalTitle from 'rsuite/lib/Modal/ModalTitle';
import { useModalState } from '../../../misc/custom-hooks';
import { storage } from '../../../misc/firebase';

const MAX_FILE_SIZE = 1000 * 1024 * 5;

const AttachmentBtnModal = ({ afterUpload }) => {
  const { isOpen, close, open } = useModalState();
  const [fileList, setFileList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { chatId } = useParams();

  const onChange = fileArr => {
    const filtered = fileArr
      .filter(el => el.blobFile.size <= MAX_FILE_SIZE)
      .slice(0, 5);
    setFileList(filtered);
  };

  const onUpload = async () => {
    try {
      const uploadPromises = fileList.map(f => {
        return storage
          .ref(`/chat/${chatId}`)
          .child(Date.now() + f.name)
          .put(f.blobFile, { cacheControl: `Public,max-age=${3600 * 24 * 3}` });
      });

      const uploadSnapshots = await Promise.all(uploadPromises);

      const shapePromises = uploadSnapshots.map(async snap => {
        return {
          contentType: snap.metadata.contentType,
          name: snap.metadata.name,
          url: await snap.ref.getDownloadURL(),
        };
      });
      const files = await Promise.all(shapePromises);

      await afterUpload(files);
      setIsLoading(false);
      close();
    } catch (error) {
      setIsLoading(false);
      Alert.error(error.message, 4000);
    }
  };
  return (
    <>
      <InputGroup.Button onClick={open}>
        <Icon icon="attachment" />
      </InputGroup.Button>

      <Modal show={isOpen} onHide={close}>
        <ModalHeader>
          <ModalTitle>Upload Files</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <Uploader
            autoUpload={false}
            fileList={fileList}
            action=""
            onChange={onChange}
            multiple
            listType="picture-text"
            className="w-100"
            disabled={isLoading}
          />
        </ModalBody>
        <ModalFooter>
          <Button block disabled={isLoading} onClick={onUpload}>send to chat</Button>
          <div className="text-right mr-2">
            <small>* only files lessthan 5 Mb is allowed</small>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default AttachmentBtnModal;
