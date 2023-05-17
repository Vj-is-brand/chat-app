import React, { useEffect, useRef, useState } from 'react';
import { Divider } from 'rsuite';
import CreateRoomBtnModal from './Dashboard/CreateRoomBtnModal';
import DashboardToggle from './Dashboard/DashboardToggle';
import ChatRoomList from './rooms/ChatRoomList';

const Sidebar = () => {
  const topSideBarRef = useRef();
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (topSideBarRef.current) {
      setHeight(topSideBarRef.current.scrollHeight);
    }
  }, [topSideBarRef]);
  return (
    <div className="h-100 pt-2">
      <div ref={topSideBarRef}>
        <DashboardToggle />
        <CreateRoomBtnModal />
        <Divider> Join Conversatation </Divider>
      </div>
      <ChatRoomList aboveEleHeight={height}/>
    </div>
  );
};

export default Sidebar;
