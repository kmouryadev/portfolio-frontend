import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ChatWidget from "./ChatWidget";

async function openChatAndSend(message: string) {
  const user = userEvent.setup();
  render(<ChatWidget />);
  await user.click(screen.getByRole("button", { name: /open ai chat/i }));
  await user.type(screen.getByLabelText(/chat message/i), message);
  await user.click(screen.getByRole("button", { name: /send message/i }));
  return user;
}

describe("ChatWidget", () => {
  const originalApiUrl = process.env.NEXT_PUBLIC_CHAT_API_URL;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_CHAT_API_URL = "https://api.example.com";
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_CHAT_API_URL = originalApiUrl;
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("renders the launcher closed by default", () => {
    render(<ChatWidget />);
    expect(
      screen.getByRole("button", { name: /open ai chat/i }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("sends a message and renders the assistant's reply", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ answer: "Karun knows FastAPI." }),
      }),
    );

    await openChatAndSend("What does Karun know?");

    expect(await screen.findByText("Karun knows FastAPI.")).toBeInTheDocument();
  });

  it("shows a graceful fallback when the API responds with an error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));

    await openChatAndSend("Tell me something");

    expect(
      await screen.findByText(/couldn't process that request/i),
    ).toBeInTheDocument();
  });

  it("shows a timeout-specific message when the request is aborted", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new DOMException("Aborted", "AbortError")),
    );

    await openChatAndSend("Are you slow?");

    expect(
      await screen.findByText(/took too long to respond/i),
    ).toBeInTheDocument();
  });

  it("shows a not-configured message instead of failing silently when the API URL is missing", async () => {
    delete process.env.NEXT_PUBLIC_CHAT_API_URL;
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    await openChatAndSend("Anyone home?");

    expect(
      await screen.findByText(/isn't configured for this environment/i),
    ).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("sends only the current message, with no conversation history", async () => {
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ answer: "Karun knows FastAPI." }),
    });
    vi.stubGlobal("fetch", fetchSpy);

    await openChatAndSend("What does Karun know?");
    await screen.findByText("Karun knows FastAPI.");

    const callBody = JSON.parse(fetchSpy.mock.calls[0][1].body);
    expect(callBody).toEqual({ message: "What does Karun know?" });
  });

  it("clears the conversation back to the greeting", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ answer: "Karun knows FastAPI." }),
      }),
    );

    const user = await openChatAndSend("What does Karun know?");
    await screen.findByText("Karun knows FastAPI.");

    await user.click(screen.getByRole("button", { name: /clear chat/i }));

    expect(screen.queryByText("Karun knows FastAPI.")).not.toBeInTheDocument();
    expect(screen.getByText(/i'm trained on this engineer's resume/i)).toBeInTheDocument();
  });

  it("does not retain the conversation across a remount", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ answer: "Karun knows FastAPI." }),
      }),
    );

    await openChatAndSend("What does Karun know?");
    await screen.findByText("Karun knows FastAPI.");
    cleanup();

    const user = userEvent.setup();
    render(<ChatWidget />);
    await user.click(screen.getByRole("button", { name: /open ai chat/i }));

    expect(screen.queryByText("Karun knows FastAPI.")).not.toBeInTheDocument();
    expect(screen.getByText(/i'm trained on this engineer's resume/i)).toBeInTheDocument();
  });
});
