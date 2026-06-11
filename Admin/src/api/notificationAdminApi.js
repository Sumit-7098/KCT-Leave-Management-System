export const fetchAdminNotifications = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:5000/api/notifications/admin", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.message || "Failed to fetch notifications");
  }

  return res.json();
};

export const markAdminNotificationsAsRead = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:5000/api/notifications/admin/mark-read", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.message || "Failed to mark notifications as read");
  }

  return res.json();
};

