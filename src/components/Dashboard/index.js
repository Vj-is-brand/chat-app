import React from 'react';
import  {Drawer,Button} from 'rsuite';
import { useProfile } from '../../context/profile.contex';

const Dashboard = ({onSignOut}) => {

    const {profile} = useProfile();

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>
          <h3>Dashboard</h3>
        </Drawer.Title>
      </Drawer.Header>

      <Drawer.Body>
       Hey, {profile.name}
      </Drawer.Body>

      <Drawer.Footer>
        <Button block color='red' onClick={onSignOut}>
          signout
        </Button>
      </Drawer.Footer>
    </>
  )
}

export default Dashboard;