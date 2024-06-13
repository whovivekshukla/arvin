"use client";

import { ToolInvocation } from "ai";
import { Message, useChat } from "ai/react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, addToolResult } =
    useChat({
      maxToolRoundtrips: 5,
    });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 overflow-auto">
        <div className="max-w-2xl mx-auto flex flex-col items-start gap-8 px-4 py-8">
          {messages?.map((m: Message) => (
            <div key={m.id} className="flex items-start gap-4">
              <Avatar className="border w-8 h-8">
                <AvatarImage
                  alt="Image"
                  src={
                    m.role === "user"
                      ? "/placeholder-user.jpg"
                      : "/placeholder-avatar.jpg"
                  }
                />
                <AvatarFallback>
                  {m.role === "user" ? "YO" : "AR"}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="font-bold">
                  {m.role === "user" ? "You" : "Arvin"}
                </div>
                <div className="prose prose-stone">
                  <p>{m.content}</p>
                  {m.toolInvocations?.map((toolInvocation: ToolInvocation) => {
                    const toolCallId = toolInvocation.toolCallId;
                    return <div key={toolCallId}>{toolInvocation.result}</div>;
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="max-w-2xl w-full sticky bottom-0 mx-auto py-2 flex flex-col gap-1.5 px-4 bg-white dark:bg-gray-950">
        <form onSubmit={handleSubmit} className="relative">
          <Textarea
            className="min-h-[48px] rounded-2xl resize-none p-4 border border-gray-200 border-neutral-400 shadow-sm pr-16 dark:border-gray-800 dark:border-gray-800"
            id="message"
            name="message"
            placeholder="Message Arvin..."
            rows={1}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <Button
            className="absolute top-3 right-3 w-8 h-8"
            size="icon"
            type="submit"
          >
            <ArrowUpIcon className="w-4 h-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
        <p className="text-xs text-center text-neutral-700 font-medium">
          Arvin is an AI assistant. Consider verifying important information.
        </p>
      </div>
    </div>
  );
}

function ArrowUpIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 12 7-7 7 7" />
      <path d="M12 19V5" />
    </svg>
  );
}
