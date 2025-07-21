const { UsersNotification } = require('../models');


module.exports.getUnreadNotification =  async (req, res) => {
  const userId = req.user.uuid
  try {
    const notifications = await UsersNotification.findAndCountAll({
        where: { isRead: false },
        order: [['createdAt', 'DESC']]
    });
    // console.log(notifications)
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch read notifications' });
  }
};
module.exports.getNotification =  async (req, res) => {
     const userId = req.user.uuid
     console.log("Getting users notifications \\\\\\\\\\\\\\\\")
    try {
      const notifications = await UsersNotification.findAndCountAll({
        where:{userId},
        order: [['createdAt', 'DESC']]
      });
      console.log(notifications)
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  };

module.exports.getNotificationRead =  async (req, res) => {
  const { id } = req.params;
  try {
    await Notification.update({ isRead: true }, { where: { id } });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

