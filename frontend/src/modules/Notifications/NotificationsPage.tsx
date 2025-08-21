import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const mockNotifications = [
  {
    id: 1,
    user: "John Doe",
    avatar: "https://i.pravatar.cc/40?img=1",
    message: "Invoice #INV-001 was viewed",
    time: "2m ago",
    read: false,
  },
  {
    id: 2,
    user: "Jane Smith",
    avatar: "https://i.pravatar.cc/40?img=2",
    message: "Payment received for Invoice #INV-002 ($250)",
    time: "1h ago",
    read: false,
  },
  {
    id: 3,
    user: "System",
    avatar: "https://i.pravatar.cc/40?img=3",
    message: "Invoice #INV-003 is overdue",
    time: "1d ago",
    read: true,
  },
];

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Notifications</h1>
        <Button variant="ghost" onClick={markAllAsRead}>
          Mark all as read
        </Button>
      </div>
      <Separator />

      {/* Notification List */}
      <div className="mt-4 space-y-3">
        {notifications.length === 0 ? (
          <p className="text-center text-gray-500">No notifications yet</p>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg border transition hover:bg-gray-50 cursor-pointer",
                !n.read && "bg-blue-50 border-blue-200"
              )}
            >
              <img
                src={n.avatar}
                alt={n.user}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-semibold">{n.user}</span> {n.message}
                </p>
                <span className="text-xs text-gray-500">{n.time}</span>
              </div>
              {!n.read && (
                <span className="w-2 h-2 rounded-full bg-blue-500 mt-2"></span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
