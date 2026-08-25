"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Plus, Send, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAiChat,
  useAiConversation,
  useAiConversations,
} from "@/lib/hooks/use-ai";
import { cn, formatDateTime } from "@/lib/utils";

export default function AiChatPage() {
  const { data: conversations, isLoading: loadingConversations } =
    useAiConversations();

  const [activeId, setActiveId] = useState<string | undefined>();
  const { data: activeConversation } = useAiConversation(activeId);
  const chat = useAiChat();

  const [message, setMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const messages = activeId ? activeConversation?.messages ?? [] : [];

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length, chat.isPending]);

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed) return;

    setMessage("");

    chat.mutate(
      {
        message: trimmed,
        conversationId: activeId,
      },
      {
        onSuccess: (data) => setActiveId(data.conversationId),
      },
    );
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-5xl gap-6">
      {/* Conversations */}
      <Card className="hidden w-64 shrink-0 flex-col overflow-hidden md:flex">
        <div className="flex items-center justify-between border-b border-border p-3">
          <span className="text-sm font-medium text-ink">
            Conversations
          </span>

          <Button
            variant="ghost"
            size="icon"
            aria-label="New conversation"
            onClick={() => setActiveId(undefined)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {loadingConversations ? (
            <div className="space-y-2 p-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : !conversations || conversations.length === 0 ? (
            <p className="p-3 text-xs text-ink-faint">
              No conversations yet. Ask a question to start one.
            </p>
          ) : (
            conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={cn(
                  "mb-1 block w-full truncate rounded-[var(--radius-sm)] px-3 py-2 text-left text-sm",
                  activeId === c.id
                    ? "bg-brand-tint text-brand-ink"
                    : "text-ink-muted hover:bg-surface-raised",
                )}
              >
                {c.title || "Untitled conversation"}
              </button>
            ))
          )}
        </div>
      </Card>

      {/* Chat */}
      <Card className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2 border-b border-border p-4">
          <Sparkles className="h-4 w-4 text-brand" />
          <span className="text-sm font-medium text-ink">
            Accessibility Assistant
          </span>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 sm:p-6"
        >
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center text-sm text-ink-muted">
              <Sparkles className="h-8 w-8 text-ink-faint" />

              <p>
                Ask about a WCAG criterion, or paste a snippet of HTML
                for remediation ideas.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((m) => {
                const isUser = m.role === "user";

                return (
                  <div
                    key={m.id}
                    className={cn(
                      "flex w-full flex-col gap-1",
                      isUser ? "items-end" : "items-start",
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-[var(--radius-lg)] text-sm leading-6",
                        isUser
                          ? "max-w-[80%] bg-brand px-4 py-2.5 text-white"
                          : "w-full max-w-[90%] bg-surface-raised px-5 py-4 text-ink",
                      )}
                    >
                      {isUser ? (
                        <div className="whitespace-pre-wrap break-words">
                          {m.content}
                        </div>
                      ) : (
                        <div className="min-w-0 overflow-hidden">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              p: ({ children }) => (
                                <p className="mb-4 last:mb-0">
                                  {children}
                                </p>
                              ),

                              ul: ({ children }) => (
                                <ul className="mb-4 list-disc space-y-2 pl-6 last:mb-0">
                                  {children}
                                </ul>
                              ),

                              ol: ({ children }) => (
                                <ol className="mb-4 list-decimal space-y-2 pl-6 last:mb-0">
                                  {children}
                                </ol>
                              ),

                              li: ({ children }) => (
                                <li className="pl-1">
                                  {children}
                                </li>
                              ),

                              h1: ({ children }) => (
                                <h1 className="mb-4 text-xl font-semibold">
                                  {children}
                                </h1>
                              ),

                              h2: ({ children }) => (
                                <h2 className="mb-3 text-lg font-semibold">
                                  {children}
                                </h2>
                              ),

                              h3: ({ children }) => (
                                <h3 className="mb-3 text-base font-semibold">
                                  {children}
                                </h3>
                              ),

                              strong: ({ children }) => (
                                <strong className="font-semibold">
                                  {children}
                                </strong>
                              ),

                              code: ({ className, children, ...props }) => {
                                const isBlock =
                                  className?.includes("language-");

                                if (isBlock) {
                                  return (
                                    <pre className="my-4 max-w-full overflow-x-auto rounded-lg border border-border bg-surface p-4">
                                      <code
                                        className={cn(
                                          "text-xs leading-5",
                                          className,
                                        )}
                                        {...props}
                                      >
                                        {children}
                                      </code>
                                    </pre>
                                  );
                                }

                                return (
                                  <code
                                    className="rounded bg-surface px-1.5 py-0.5 text-xs"
                                    {...props}
                                  >
                                    {children}
                                  </code>
                                );
                              },

                              blockquote: ({ children }) => (
                                <blockquote className="my-4 border-l-2 border-brand pl-4 text-ink-muted">
                                  {children}
                                </blockquote>
                              ),

                              table: ({ children }) => (
                                <div className="my-4 w-full overflow-x-auto rounded-lg border border-border">
                                  <table className="w-full min-w-[600px] border-collapse text-left text-xs">
                                    {children}
                                  </table>
                                </div>
                              ),

                              thead: ({ children }) => (
                                <thead className="bg-surface">
                                  {children}
                                </thead>
                              ),

                              th: ({ children }) => (
                                <th className="border-b border-border px-3 py-2 font-semibold whitespace-nowrap">
                                  {children}
                                </th>
                              ),

                              td: ({ children }) => (
                                <td className="border-b border-border px-3 py-2 align-top">
                                  {children}
                                </td>
                              ),

                              hr: () => (
                                <hr className="my-5 border-border" />
                              ),

                              a: ({ children, href }) => (
                                <a
                                  href={href}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-brand underline underline-offset-2"
                                >
                                  {children}
                                </a>
                              ),
                            }}
                          >
                            {m.content}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>

                    <span className="px-1 text-[10px] text-ink-faint">
                      {formatDateTime(m.createdAt)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {chat.isPending && (
            <div className="mt-5 flex items-center gap-2 text-sm text-ink-muted">
              <Loader2 className="h-4 w-4 animate-spin" />
              Thinking...
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 border-t border-border p-3">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask about an accessibility issue..."
            className="flex-1 rounded-[var(--radius-md)] border border-border-strong bg-surface px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          />

          <Button
            size="icon"
            onClick={handleSend}
            disabled={chat.isPending || !message.trim()}
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
