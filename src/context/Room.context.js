import React, { createContext, useContext, useEffect, useState } from 'react';
import { database } from '../misc/firebase';
import { transformToArrayWithId } from '../misc/helper';

const RoomContext = createContext();

export const RoomsProvider = ({ children }) => {
  const [rooms, setRooms] = useState(null);

  useEffect(() => {
    const roomLisRef = database.ref('rooms');

    roomLisRef.on('value', snap => {
        const data = transformToArrayWithId(snap.val());
        //   console.log('snap.val()', data);
        setRooms(data);
    });

    return () => {
        roomLisRef.off();
    };
  }, []);

  return <RoomContext.Provider value={rooms}>{children}</RoomContext.Provider>;
};

export const useRooms = ()=> useContext(RoomContext);
