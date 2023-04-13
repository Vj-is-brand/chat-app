import React, { useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { Alert, Button, Modal } from 'rsuite';
import { useModalState } from '../../misc/custom-hooks';

const FileInputTypes = '.png, .jpeg, jpg';
const accepetedFileType = ['image/png','image/jpeg','image/pjpeg'];
const isValidFile  = (file) => accepetedFileType.includes(file.type);

const AvatarUploadBtn = () => {
  const { isOpen, open, close } = useModalState();
  const [img,setImg] = useState(null);

  const onFileInputChange = (env) =>{
    const currFiles = env.target.files;

    if(currFiles.length === 1){
        const file = currFiles[0];
        
        if(isValidFile(file)){
            setImg(file); 

            open();
        }else{
         Alert.warning(`Wrong file type ${file.type}`,4000);
        }
    }
  }
  return (
    <div className="mt-3 text-center">
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
        <div className='d-flex justify-content-center align-items-center h-100'>
        { img && 
          <AvatarEditor
        image={img}
        width={200}
        height={200}
        border={10}
        borderRadius={200}
        // color={[255, 255, 255, 0.6]} // RGBA
        // scale={1.2}
        rotate={0}
      />}
        </div>
        </Modal.Body>
        <Modal.Footer>
          <Button block appearance="ghost">
            upload new avatar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AvatarUploadBtn;
