const FriendInvitation = require("../../models/friendInvitation");
const User = require("../../models/user");
const friendsUpdates = require("../../socketHandler/updates/friends");

const postAccept = async (req, res) => {
  try {
    const { id } = req.body;
    const invitation = await FriendInvitation.findById(id);
    if (!invitation) {
      return res.status(401).send("Error occured. please try again");
    }

    const { senderId, receiverId } = invitation;
    //add friends to both users
    const senderUser = await User.findById(senderId);
    senderUser.friends = [...senderUser.friends, receiverId];

    const receiverUser = await User.findById(receiverId);
    receiverUser.friends = [...receiverUser.friends, senderId];
    await senderUser.save();
    await receiverUser.save();

    // delete invitation after added friend

    await FriendInvitation.findByIdAndDelete(id);

    //update list of the friend if the users are online
    friendsUpdates.updateFriends(senderId.toString());
    friendsUpdates.updateFriends(receiverId.toString());
    //update list of the fried pending invitation
    friendsUpdates.updateFriendPendingInvitations(receiverId.toString());

    return res.status(200).send("Friend Successfully addeded");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Spmething went wrong please try again");
  }
};

module.exports = postAccept;
