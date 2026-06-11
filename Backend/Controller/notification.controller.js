import Notification from "../Models/notification.model.js";

const getAdminNotifications = async (req, res) => {
  try {
    const adminId = req.user._id;

    const notifications = await Notification.find({ admin: adminId })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    const unreadCount = await Notification.countDocuments({
      admin: adminId,
      read: false,
    });

    res.json({ notifications, unreadCount });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to load notifications" });
  }
};

const markAdminNotificationsAsRead = async (req, res) => {
  try {
    const adminId = req.user._id;

    await Notification.updateMany({
      admin: adminId,
      read: false,
    }, { $set: { read: true } });

    res.json({ message: "Notifications marked as read" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to mark notifications" });
  }
};

export { getAdminNotifications, markAdminNotificationsAsRead };

