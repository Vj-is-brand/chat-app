export const getNameInitials = name => {
  const splitName = name.toUpperCase().split(' ');

  if (splitName.length > 1) {
    return splitName[0][0] + splitName[1][0];
  }

  return splitName[0][0];
};

export function transformToArray(snapVal) {
  return snapVal ? Object.keys(snapVal) : [];
}

export function transformToArrayWithId(snapVal) {
  return snapVal
    ? Object.keys(snapVal).map(roomId => {
        return { ...snapVal[roomId], id: roomId };
      })
    : [];
}

export async function getUserUpdates(userId, keyToUpdate, value, db) {
  const updates = {};
  updates[`/profiles/${userId}/${keyToUpdate}`] = value;

  const getMsgs = db
    .ref('/messages')
    .orderByChild('author/uid')
    .equalTo(userId)
    .once('value');
  const getRooms = db
    .ref('/rooms')
    .orderByChild('lastmessage/author/uid')
    .equalTo(userId)
    .once('value');

  const [snapMsgs, snapRooms] = await Promise.all([getMsgs, getRooms]);

  snapMsgs.forEach(msgSnap => {
    updates[`/messages/${msgSnap.key}/author/${keyToUpdate}`] = value;
  });

  snapRooms.forEach(roomSnap => {
    updates[`/rooms/${roomSnap.key}/lastmessage/author/${keyToUpdate}`] = value;
  });

  return updates;
}

export function groupBy(array, groupingKeyFn) {
  return array.reduce((result, item) => {
    const groupingKey = groupingKeyFn(item);
    if(!result[groupingKey]){
      result[groupingKey] = [];
    }
    result[groupingKey].push(item);
    return result;
  }, {});
}
