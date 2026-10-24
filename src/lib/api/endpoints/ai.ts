import { apiClient } from "@/lib/api/client";
import type { AIConversation } from "@/types/models";

export type RemediateResponse = { configured: false; recommendation: string } | { configured: true; response: string };

export const aiApi = {
  remediate: (input: { issue: string; html?: string }) => apiClient.post<RemediateResponse>("/ai/remediate", input).then((r) => r.data),
  chat: (input: { message: string; conversationId?: string }) =>
    apiClient.post<{ conversationId: string; reply: string }>("/ai/chat", input).then((r) => r.data),
  conversations: () => apiClient.get<{ data: AIConversation[] }>("/ai/conversations").then((r) => r.data.data),
  conversation: (id: string) => apiClient.get<AIConversation>(`/ai/conversations/${id}`).then((r) => r.data),
};

