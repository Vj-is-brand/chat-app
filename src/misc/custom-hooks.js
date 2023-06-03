import React, { useCallback, useEffect, useState } from "react";
import {database} from './firebase';


export function useModalState (defaultValue = false){
    const [isOpen,setIsOpen] = useState(defaultValue);

    const open = useCallback(()=>setIsOpen(true),[]);
    const close = useCallback (()=>setIsOpen(false),[]);

    return{isOpen,open,close};
}



export const useMediaQuery = query => {
    const [matches, setMatches] = useState(
      () => window.matchMedia(query).matches
    );
  
    useEffect(() => {
      const queryList = window.matchMedia(query);
      setMatches(queryList.matches);
  
      const listener = evt => setMatches(evt.matches);
  
      queryList.addListener(listener);
      return () => queryList.removeListener(listener);
    }, [query]);
  
    return matches;
  };
  
  export const usePresence= (uid) =>{
    const [presence,setPresence] = useState(null);
    useEffect(() => {
      const userStatusRef = database.ref(`/status/${uid}`);
      userStatusRef.on('value',snap=>{
        if(snap.exists()){
          const data = snap.val();
          // console.log(snap.val());
          setPresence(data);
        }
      })
    
      return () => {
        userStatusRef.off('value');
      }
    }, [uid])
    
    return presence;
  }  

  export const useHover = () => {
    const [isHovering, setIsHovering] = React.useState(false);
  
    const handleMouseOver = React.useCallback(() => setIsHovering(true), []);
    const handleMouseOut = React.useCallback(() => setIsHovering(false), []);
  
    const nodeRef = React.useRef();
  
    const callbackRef = React.useCallback(
      node => {
        if (nodeRef.current) {
          nodeRef.current.removeEventListener('mouseover', handleMouseOver);
          nodeRef.current.removeEventListener('mouseout', handleMouseOut);
        }
  
        nodeRef.current = node;
  
        if (nodeRef.current) {
          nodeRef.current.addEventListener('mouseover', handleMouseOver);
          nodeRef.current.addEventListener('mouseout', handleMouseOut);
        }
      },
      [handleMouseOver, handleMouseOut]
    );
  
    return [callbackRef, isHovering];
  };