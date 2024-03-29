import React from 'react';
import { Drawer, Button, Divider, Alert } from 'rsuite';
import { useProfile } from '../../context/profile.contex';
import { database } from '../../misc/firebase';
import EditableInput from '../EditableInput';
import ProviderBlock from './ProviderBlock';
import AvatarUploadBtn from './AvatarUploadBtn';
import { getUserUpdates } from '../../misc/helper';

const Dashboard = ({ onSignOut }) => {
  const { profile } = useProfile();
  const onSave = async newData => {
    // console.log(newData);
    // const userNickNameRef = database
    //   .ref(`/profiles/${profile.uid}`)
    //   .child('name');

    try {
      // await userNickNameRef.set(newData);

      const updates = await getUserUpdates(
        profile.uid,
        'name',
        newData,
        database
      );
      await database.ref().update(updates);
      Alert.success('Nickname has been updated', 4000);
    } catch (error) {
      Alert.error(error.message, 4000);
    }
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Dashboard</Drawer.Title>
      </Drawer.Header>

      <Drawer.Body>
        <h3>Hey, {profile.name}</h3>
        <ProviderBlock />
        <Divider />
        <EditableInput
          name="Nickname"
          initialValue={profile.name}
          onSave={onSave}
          lable={<h6 className="mb-2">Nickname</h6>}
        />
        <AvatarUploadBtn />
      </Drawer.Body>

      <Drawer.Footer>
        <Button block color="red" onClick={onSignOut}>
          signout
        </Button>
      </Drawer.Footer>
    </>
  );
};

export default Dashboard;
