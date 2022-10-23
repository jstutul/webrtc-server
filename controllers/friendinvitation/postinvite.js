const User = require("../../models/user");
const FriendInvitation = require("../../models/friendInvitation");
const friendsUpdate = require("../../socketHandler/updates/friends");
const postInvite = async (req, res) => {
  const { targetMailAddress } = req.body;
  const { userId, mail } = req.user;

  // check if friend that we would like to invite is not user

  if (mail.toString().toLowerCase() === targetMailAddress.toLowerCase()) {
    return res
      .status(409)
      .send("Sorry, you can not become friend with yourself");
  }

  const targetuser = await User.findOne({
    mail: targetMailAddress.toLowerCase(),
  });

  if (!targetuser) {
    return res
      .status(404)
      .send(`Friend of ${targetMailAddress} has not been found mail address`);
  }

  //check if invitation has been already send

  const invitationAlreadyReceived = await FriendInvitation.findOne({
    senderId: userId,
    receiverId: targetuser._id,
  });
  if (invitationAlreadyReceived) {
    return res.status(409).send("Invitation has been already sent");
  }

  // check if the user which would like to invite is already our friend
  const usersAlreadyFriends = targetuser.friends.find(
    (friendId) => friendId.toString() === userId.toString()
  );
  if (usersAlreadyFriends) {
    return res
      .status(409)
      .send("Friend already added. Please check friend list");
  }
  //create new invitation
  const newInvitation = await FriendInvitation.create({
    senderId: userId,
    receiverId: targetuser._id,
  });

  //send peding invitation update to specific user
  friendsUpdate.updateFriendPendingInvitations(targetuser._id.toString());
  return res.status(201).send("Invitation has been sent");
};

module.exports = postInvite;
