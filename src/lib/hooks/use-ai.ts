"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { aiApi } from "@/lib/api/endpoints/ai";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api/client";

export function useAiConversations() {
  return useQuery({ queryKey: ["ai", "conversations"], queryFn: aiApi.conversations });
}
export function useAiConversation(id: string | undefined) {
  return useQuery({
    queryKey: ["ai", "conversations", id],
    queryFn: () => aiApi.conversation(id as string),
    enabled: Boolean(id),
  });
}
export function useAiChat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { message: string; conversationId?: string }) => aiApi.chat(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ai", "conversations"] }),
    onError: (error) => toast.error(getApiErrorMessage(error, "The assistant couldn't respond. Check your plan's AI request limit.")),
  });
}
export function useAiRemediate() {
  return useMutation({
    mutationFn: (input: { issue: string; html?: string }) => aiApi.remediate(input),
    onError: (error) => toast.error(getApiErrorMessage(error, "Couldn't generate a fix suggestion.")),
  });
}

