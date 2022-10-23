const serverStore = require("../serverStore");
const friendsUpdate = require("../socketHandler/updates/friends");
const newConnectionHandler = async (socket, io) => {
  const userDetails = socket.user;
  serverStore.addNewConnectedUser({
    socketId: socket.id,
    userId: userDetails.userId,
  });
  // console.log(socket);
  // update pending invitation list
  friendsUpdate.updateFriendPendingInvitations(userDetails.userId);

  // update friend list
  friendsUpdate.updateFriends(userDetails.userId);
};

module.exports = newConnectionHandler;
