var User = require("../models/user");
module.exports = async (userId) => {
  // Users you have blocked
  const usersYouBlocked = await User.findOne(
    { _id: userId }
  ).lean().select('blockedList');

  // Users who have blocked you
  const usersWhoBlockedYou = await User.find(
    { blockedList: userId }
  ).lean().select('_id');

  return [
    ...(usersYouBlocked?.blockedList || []),
    ...usersWhoBlockedYou.map((user) => user._id) || [],
  ];
};
