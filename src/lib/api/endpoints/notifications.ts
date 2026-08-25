import { apiClient } from "@/lib/api/client";
import type { Notification } from "@/types/models";

export const notificationsApi = {
  list: () => apiClient.get<{ data: Notification[]; unreadCount: number }>("/notifications").then((r) => r.data),
  markRead: (id: string) => apiClient.post(`/notifications/${id}/read`).then((r) => r.data),
};

