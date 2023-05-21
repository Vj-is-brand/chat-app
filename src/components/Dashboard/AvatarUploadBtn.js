import React, { useRef, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { Alert, Button, Modal } from 'rsuite';
import { useProfile } from '../../context/profile.contex';
import { useModalState } from '../../misc/custom-hooks';
import { database, storage } from '../../misc/firebase';
import { getUserUpdates } from '../../misc/helper';
import ProfileAvatar from '../ProfileAvatar';

const FileInputTypes = '.png, .jpeg, jpg';
const accepetedFileType = ['image/png', 'image/jpeg', 'image/pjpeg'];
const isValidFile = file => accepetedFileType.includes(file.type);

const getBlob = canvas => {
  return new Promise((resolveFn, rejectFn) => {
    canvas.toBlob(blob => {
      if (blob) {
        resolveFn(blob);
      } else {
        rejectFn(new Error('File process error'));
      }
    });
  });
};

const AvatarUploadBtn = () => {
  const { isOpen, open, close } = useModalState();
  const [img, setImg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { profile } = useProfile();
  const avatarEditorRef = useRef();

  const onFileInputChange = env => {
    const currFiles = env.target.files;

    if (currFiles && currFiles.length === 1) {
      const file = currFiles[0];

      if (isValidFile(file)) {
        setImg(file);

        open();
      } else {
        Alert.warning(`Wrong file type ${file.type}`, 4000);
      }
    }
  };

  const onUploadClick = async () => {
    const canvas = avatarEditorRef.current.getImageScaledToCanvas();
    setIsLoading(true);
    try {
      const blob = await getBlob(canvas);
      const avatarFileRef = storage
        .ref(`/profile/${profile.uid}`)
        .child('avatar');
      const uploadAvatarResult = await avatarFileRef.put(blob, {
        cacheControl: `public , max-age=${3600 * 24 * 3}`,
      });

      const downloadUrl = await uploadAvatarResult.ref.getDownloadURL();
      // const useAvatarRef = database.ref(`/profiles/${profile.uid}`).child('avatar');

      // useAvatarRef.set(downloadUrl);

      const updates = await getUserUpdates(
        profile.uid,
        'avatar',
        downloadUrl,
        database
      );
      await database.ref().update(updates);

      setIsLoading(false);

      Alert.success('uploaded image successfully', 4000);
    } catch (error) {
      setIsLoading(false);
      Alert.error(error.message, 4000);
    }
  };

  return (
    <div className="mt-3 text-center">
      <ProfileAvatar
        src={profile.avatar}
        name={profile.name}
        className="height-200 width-200 img-fullsize font-huge"
      />
      <div>
        <label
          htmlFor="avatar-upload"
          className="d-block cursor-pointed padded "
        >
          upload avatar
          <input
            id="avatar-upload"
            type="file"
            className="d-none"
            accept={FileInputTypes}
            onChange={onFileInputChange}
          />
        </label>
      </div>
      <Modal show={isOpen} onHide={close}>
        <Modal.Header>
          <Modal.Title>Adjust and upload new avatar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-center align-items-center h-100">
            {img && (
              <AvatarEditor
                ref={avatarEditorRef}
                image={img}
                width={200}
                height={200}
                border={10}
                borderRadius={200}
                // color={[255, 255, 255, 0.6]} // RGBA
                // scale={1.2}
                rotate={0}
              />
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            block
            appearance="ghost"
            onClick={onUploadClick}
            disabled={isLoading}
          >
            upload new avatar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AvatarUploadBtn;
