import React from 'react';
import TimeAgo from 'timeago-react';

const RoomItem = () => {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h3 className="text-disappear">Room Name</h3>
        <TimeAgo className='font-normal text-black' datetime={new Date()}/>
      </div>

      <div className="display-flex align-items-center text-black-70">
        <span>no message yet.........</span>
      </div>
    </div>
  );
};

export default RoomItem;
