import React,{ createContext,useState,useEffect } from "react";
import { database } from "../misc/firebase";
import { transformToArrayWithId } from "../misc/helper";

const RoomsContext = createContext();

export const RoomsProvider = ({children}) => {
    const [rooms, setRooms] = useState(null);

    useEffect(() => {
        const roomListRef = database.ref('rooms');

        roomListRef.on('value', snap => {
            // console.log('snap.val()',snap.val());
            const data =transformToArrayWithId(snap.val());
            console.log({data})
        });
    
      return () => {
        roomListRef.off();
      }
    }, []);

    return(
    <RoomsContext.Provider value={rooms}>{children}</RoomsContext.Provider>
    );
};