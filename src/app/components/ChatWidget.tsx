"use client";
import { useState, useRef, useEffect } from "react";
import Button from "./ui-components/Button";

type Message = { role: "user" | "assistant"; content: string };

const INITIAL_MESSAGES: Message[] = [
  {
    role: "assistant",
    content:
      "Hi! I'm trained on this engineer's resume. Ask me about experience, skills, projects, or availability. 👋",
  },
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [warmingUp, setWarmingUp] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const apiUrl = process.env.NEXT_PUBLIC_CHAT_API_URL;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, [open]);

  const send = async () => {
    const msg = input.trim();
    if (!msg || loading || !apiUrl) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setLoading(true);

    const warmTimer = setTimeout(() => setWarmingUp(true), 3000);

    try {
      const response = await fetch(`${apiUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      clearTimeout(warmTimer);
      setWarmingUp(false);
      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer },
      ]);
    } catch {
      clearTimeout(warmTimer);
      setWarmingUp(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Something went wrong. Try again or reach out via email directly.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {open && (
        <div
          role="dialog"
          aria-label="AI chat"
          className="fixed bottom-[88px] right-6 z-[200] w-[clamp(300px,90vw,340px)] h-[clamp(400px,60vh,500px)] bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden animate-[slideUp_0.25s_ease] max-[400px]:right-2 max-[400px]:left-2 max-[400px]:w-auto"
        >
          <div className="px-[18px] py-3.5 border-b border-[var(--border)] flex items-center justify-between bg-[var(--bg-card2)] shrink-0">
            <div className="flex items-center gap-2.5">
              <div>
                <p className="font-display font-bold text-[13px] text-[var(--text)]">
                  Ask me anything about Karun Mourya
                </p>
                <p className="text-[10px] text-[var(--green)] flex items-center gap-1">
                  <span className="w-[5px] h-[5px] rounded-full bg-[var(--green)] inline-block" />
                  Powered by Gemini RAG
                </p>
              </div>
            </div>
            <Button
              variant="custom"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="bg-transparent border-none text-[var(--text-muted)] cursor-pointer text-lg leading-none p-1"
            >
              ✕
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2.5">
            {messages.map((message, messageIndex) => (
              <div
                key={messageIndex}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-[13px] py-[9px] text-[13px] leading-[1.6] whitespace-pre-wrap break-words ${
                    message.role === "user"
                      ? "bg-[var(--accent)] text-white rounded-[14px_14px_4px_14px]"
                      : "bg-[var(--bg-card2)] text-[var(--text-muted)] rounded-[14px_14px_14px_4px]"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-[var(--bg-card2)] px-[13px] py-[9px] rounded-[14px_14px_14px_4px]">
                  {warmingUp ? (
                    <span className="text-xs text-[var(--text-dim)]">
                      Warming up server...
                    </span>
                  ) : (
                    <span className="text-lg tracking-[3px] text-[var(--text-dim)]">
                      ●●●
                    </span>
                  )}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="px-3.5 py-2.5 border-t border-[var(--border)] flex gap-2 shrink-0">
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && !event.shiftKey && send()}
              placeholder="Ask me anything..."
              className="font-mono flex-1 bg-[var(--bg-card2)] border border-[var(--border)] rounded-lg px-3 py-[9px] text-[var(--text)] text-[13px] outline-none min-w-0"
              aria-label="Chat message"
            />
            <Button
              variant="custom"
              onClick={send}
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className={`border-none rounded-lg px-3.5 py-0 text-white text-base shrink-0 transition-colors duration-200 ${
                input.trim()
                  ? "bg-[var(--accent)] cursor-pointer"
                  : "bg-[var(--bg-card2)] cursor-default"
              }`}
            >
              →
            </Button>
          </div>
        </div>
      )}

      <Button
        variant="custom"
        onClick={() => setOpen((open) => !open)}
        aria-label={open ? "Close chat" : "Open AI chat"}
        className="fixed bottom-6 right-6 z-[200] w-[52px] h-[52px] rounded-full bg-[var(--accent)] border-none cursor-pointer text-[22px] shadow-[0_4px_20px_rgba(99,102,241,0.4)] transition-[transform,box-shadow] duration-200 hover:scale-110 hover:shadow-[0_6px_28px_rgba(99,102,241,0.6)]"
      >
        {open ? "✕" : "💬"}
      </Button>
    </>
  );
}
