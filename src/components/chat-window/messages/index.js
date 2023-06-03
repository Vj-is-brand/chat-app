import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Alert } from 'rsuite';
import { auth, database } from '../../../misc/firebase';
import { transformToArrayWithId } from '../../../misc/helper';
import MessageItem from './MessageItem';

const Message = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState(null);
  const isChatEmpty = messages && messages.length === 0;
  const canShowMessages = messages && messages.length > 0;

  useEffect(() => {
    const messagesRef = database.ref('/messages');
    messagesRef
      .orderByChild('roomId')
      .equalTo(chatId)
      .on('value', snap => {
        const data = transformToArrayWithId(snap.val());
        setMessages(data);
      });

    return () => {
      messagesRef.off('value');
    };
  }, [chatId]);

  const handleAdmin = useCallback(
    uid => {
      const adminRef = database.ref(`rooms/${chatId}/admins`);
      let alertMsg;
      adminRef.transaction(admins => {
        if (admins) {
          if (admins[uid]) {
            admins[uid] = null;
            alertMsg = 'admin permission removed';
          } else {
            admins[uid] = true;
            alertMsg = 'admin permission granted';
          }
        }
        return admins;
      });
    },
    [chatId]
  );
  const handleLikes = useCallback(async msgId => {
    const { uid } = auth.currentUser;
    const messageRef = database.ref(`/messages/${msgId}`);
    let alertMsg;
    await messageRef.transaction(msg => {
      if (msg) {
        if (msg.likes && msg.likes[uid]) {
          msg.likesCount -= 1;
          msg.likes[uid] = null;
          alertMsg = 'Like removed';
          // console.log(msg.likeCount)
          Alert.info(alertMsg,920);
        } else {
          msg.likesCount += 1;
          if (!msg.likes) {
            msg.likes = {};
          }
          msg.likes[uid] = true;
          alertMsg = 'like added';
          Alert.info(alertMsg,920);
        }
      }
      return msg;
    });
  }, []);

  return (
    <ul className="msg-list custom-scroll">
      {isChatEmpty && <span>no messages yet....</span>}
      {canShowMessages &&
        messages.map(msg => {
          return (
            <MessageItem
              key={msg.id}
              message={msg}
              handleAdmin={handleAdmin}
              handleLikes={handleLikes}
            />
          );
        })}
    </ul>
  );
};

export default Message;
