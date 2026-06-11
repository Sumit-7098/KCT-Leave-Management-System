import React, { useEffect, useState } from "react";
import { fetchAdminNotifications } from "../api/notificationAdminApi";

export default function NotificationsList() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetchAdminNotifications();
        if (!mounted) return;
        setNotifications(Array.isArray(res?.notifications) ? res.notifications : []);
      } catch (e) {
        if (!mounted) return;
        setError(e?.message || "Failed to load notifications");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div className="text-sm text-gray-500">Loading...</div>;
  if (error) return <div className="text-sm text-red-600">{error}</div>;
  if (!notifications.length) {
    return <div className="text-sm text-gray-600">No notifications.</div>;
  }

  return (
    <div className="space-y-2">
      {notifications.map((n) => (
        <div
          key={n._id || `${n.title}-${n.createdAt}`}
          className={`rounded-xl border p-3 ${n.read ? "bg-gray-50" : "bg-white"}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm font-semibold text-gray-800 truncate">
                {n.title}
              </div>
              {n.message ? (
                <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {n.message}
                </div>
              ) : null}
            </div>
            {!n.read && (
              <span className="shrink-0 text-[10px] px-2 py-1 rounded-full bg-red-100 text-red-600">
                New
              </span>
            )}
          </div>
          <div className="text-[11px] text-gray-400 mt-2">
            {n.createdAt ? new Date(n.createdAt).toLocaleString() : ""}
          </div>
        </div>
      ))}
    </div>
  );
}

