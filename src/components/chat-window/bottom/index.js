import React, { useCallback, useState } from 'react';
import { Alert, Avatar, Icon, Input, InputGroup } from 'rsuite';
import { useParams } from 'react-router';
import firebase from 'firebase/app';
import { useProfile } from '../../../context/profile.contex';
import { database } from '../../../misc/firebase';
import AttachmentBtnModal from './AttachmentBtnModal';
import AudioMsgBtn from './AudioMsgBtn';

function assembleMessage(profile, chatId) {
  return {
    roomId: chatId,
    author: {
      uid: profile.uid,
      name: profile.name,
      createdAt: profile.createdAt,
      ...(profile.avatar ? { avatar: profile.avatar } : {}),
    },
    createdAt: firebase.database.ServerValue.TIMESTAMP,
    likesCount: 0,
  };
}

const ChatBottom = () => {
  const { chatId } = useParams();
  const { profile } = useProfile();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const onInputChange = useCallback(value => {
    setInput(value);
  }, []);

  const onSendClick = async () => {
    if (input.trim() === '') {
      return;
    }

    const msgData = assembleMessage(profile, chatId);
    msgData.text = input;
    const updates = {};

    const messageId = database.ref('messages').push().key;
    updates[`messages/${messageId}`] = msgData;
    updates[`rooms/${chatId}/lastmessage`] = {
      ...msgData,
      msgId: messageId,
    };
    setIsLoading(true);
    try {
      await database.ref().update(updates);
      setInput('');
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      Alert.error(error.message);
    }
  };

  const onKeyDown = ev => {
    if (ev.keyCode === 13) {
      ev.preventDefault();
      onSendClick();
    }
  };

  const afterUpload = useCallback(
    async files => {
      setIsLoading(true);
      const updates = {};

      files.forEach(file => {
        const msgData = assembleMessage(profile, chatId);
        msgData.file = file;

        const messageId = database.ref('messages').push().key;
        updates[`messages/${messageId}`] = msgData;
      });

      const lastMsgId = Object.keys(updates).pop();
      updates[`rooms/${chatId}/lastmessage`] = {
        ...updates[lastMsgId],
        msgId: lastMsgId,
      };

      try {
        await database.ref().update(updates);
        Alert.info("Files sent successfully");
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        Alert.error(error.message);
      }
    },
    [chatId, profile]
  );

  return (
    <div>
      <InputGroup>
        <AttachmentBtnModal  afterUpload={afterUpload}/>
        <AudioMsgBtn afterUpload={afterUpload}/>
        <Input
          placeholder="write a message..."
          value={input}
          onChange={onInputChange}
          onKeyDown={onKeyDown}
        />
        <InputGroup.Button
          color="blue"
          appearance="primary"
          onClick={onSendClick}
          disabled={isLoading}
        >
          <Icon icon="send" />
        </InputGroup.Button>
      </InputGroup>
    </div>
  );
};

export default ChatBottom;
