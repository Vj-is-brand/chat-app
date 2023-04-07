import React from 'react';
import  {Drawer,Button, Divider} from 'rsuite';
import { useProfile } from '../../context/profile.contex';
import EditableInput from '../EditableInput';

const Dashboard = ({onSignOut}) => {

    const {profile} = useProfile();
    const onSave = async newData => {
      console.log(newData);
    };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>
          <h3>Dashboard</h3>
        </Drawer.Title>
      </Drawer.Header>

      <Drawer.Body>
       Hey, {profile.name}
       <Divider/>
       <EditableInput
          name="Nickname"
          initialValue={profile.name}
          onSave={onSave}
          lable= {<h6 className='mb-2'>Nickname</h6>}
       />
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