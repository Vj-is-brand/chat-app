import React from 'react';
import  {Drawer,Button, Divider, Alert} from 'rsuite';
import { useProfile } from '../../context/profile.contex';
import { database } from '../../misc/firebase';
import EditableInput from '../EditableInput';

const Dashboard = ({onSignOut}) => {

    const {profile} = useProfile();
    const onSave = async newData => {
      // console.log(newData);
      const userNickNameRef = database.ref(`/profiles/${profile.uid}`).child('name');
      
      try {
        await userNickNameRef.set(newData);
        Alert.success('Nickname has been updated',4000);
      } catch (error) {
        Alert.error(error.message,4000);
      }
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