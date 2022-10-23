const FriendInvitation = require("../../models/friendInvitation");
const friendsUpdates = require("../../socketHandler/updates/friends");
const postReject = async (req, res) => {
  try {
    const { id } = req.body;
    const { userId } = req.user;

    const invitationExists = await FriendInvitation.exists({ _id: id });
    if (invitationExists) {
      await FriendInvitation.findByIdAndDelete(id);
    }

    // update pending friend
    friendsUpdates.updateFriendPendingInvitations(userId);
    return res.status(200).send("Successfully rejected");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Spmething went wrong please try again");
  }
};

module.exports = postReject;
