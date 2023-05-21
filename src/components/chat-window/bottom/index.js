import React, { useCallback, useState } from 'react';
import { Alert, Avatar, Icon, Input, InputGroup } from 'rsuite';
import { useParams } from 'react-router';
import firebase from 'firebase/app';
import { useProfile } from '../../../context/profile.contex';
import { database } from '../../../misc/firebase';

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
    msgData.text=input;
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

  const onKeyDown = (ev) => {
    if(ev.keyCode === 13){
      ev.preventDefault();
      onSendClick();
    }
  }
    
  return (
    <div>
      <InputGroup>
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
