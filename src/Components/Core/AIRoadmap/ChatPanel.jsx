import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { chatWithRoadmap } from "../../../services/operations/aiRoadmapAPI";
import { setActiveRoadmap } from "../../../slices/aiRoadmapSlice";
import { VscSend, VscSparkle } from "react-icons/vsc";

export default function ChatPanel() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { activeRoadmap } = useSelector((state) => state.aiRoadmap);

  const [inputMessage, setInputMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const chatHistory = activeRoadmap?.chatHistory || [];

  // Scroll chat window to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeRoadmap?.chatHistory, sending]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || sending) return;

    const userMessageText = inputMessage.trim();
    setInputMessage("");
    setSending(true);

    // 1. Temporarily append user message to local state for instant feedback
    const tempHistory = [
      ...chatHistory,
      { _id: "temp-user", role: "user", content: userMessageText, timestamp: new Date() },
    ];
    dispatch(setActiveRoadmap({ ...activeRoadmap, chatHistory: tempHistory }));

    // 2. Call backend chat API
    const reply = await chatWithRoadmap(activeRoadmap._id, userMessageText, token);

    if (reply) {
      // 3. Append AI response to local history
      const finalHistory = [
        ...chatHistory,
        { _id: Date.now() + "-user", role: "user", content: userMessageText, timestamp: new Date() },
        { _id: Date.now() + 1 + "-assistant", role: "assistant", content: reply, timestamp: new Date() },
      ];
      dispatch(setActiveRoadmap({ ...activeRoadmap, chatHistory: finalHistory }));
    } else {
      // Fallback: Remove temporary message on failure
      dispatch(setActiveRoadmap({ ...activeRoadmap, chatHistory }));
    }
    setSending(false);
  };

  if (!activeRoadmap) return null;

  return (
    <div className="flex flex-col h-[520px] rounded-lg border border-richblack-700 bg-richblack-800 text-richblack-5 overflow-hidden shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3.5 bg-richblack-750 border-b border-richblack-700">
        <VscSparkle className="text-yellow-50 text-lg animate-pulse" />
        <div>
          <h3 className="font-bold text-sm text-richblack-5">AI Learning Coach</h3>
          <p className="text-[10px] text-caribbeangreen-200 font-semibold tracking-wide uppercase">
            Active Mentor for {activeRoadmap.skillName}
          </p>
        </div>
      </div>

      {/* Messages list */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {chatHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-richblack-400 px-4">
            <VscSparkle className="text-3xl text-richblack-600 mb-2" />
            <p className="text-sm">Get stuck? Need resources or tips?</p>
            <p className="text-xs text-richblack-500 mt-1">
              Ask any question about milestones, study tactics, or concepts here!
            </p>
          </div>
        ) : (
          chatHistory.map((msg) => (
            <div
              key={msg._id}
              className={`flex flex-col max-w-[85%] rounded-lg px-3.5 py-2 text-sm leading-relaxed
                ${
                  msg.role === "user"
                    ? "self-end bg-yellow-50 text-richblack-900 rounded-tr-none"
                    : "self-start bg-richblack-900 text-richblack-100 border border-richblack-700 rounded-tl-none"
                }`}
            >
              <span>{msg.content}</span>
              <span
                className={`text-[9px] mt-1 text-right block
                  ${msg.role === "user" ? "text-richblack-600" : "text-richblack-400"}`}
              >
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))
        )}

        {sending && (
          <div className="self-start bg-richblack-900 text-richblack-300 border border-richblack-700 rounded-lg rounded-tl-none px-3.5 py-3 text-xs flex items-center gap-2">
            <div className="flex gap-1">
              <span className="h-1.5 w-1.5 bg-richblack-400 rounded-full animate-bounce"></span>
              <span className="h-1.5 w-1.5 bg-richblack-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="h-1.5 w-1.5 bg-richblack-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
            <span>Coach is typing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input container */}
      <form
        onSubmit={handleSendMessage}
        className="p-3 border-t border-richblack-700 bg-richblack-750 flex gap-2 items-center"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask a question..."
          disabled={sending}
          className="flex-1 rounded-md border border-richblack-650 bg-richblack-900 px-3 py-2 text-sm text-richblack-5 placeholder-richblack-500 focus:outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || sending}
          className={`rounded-md p-2 flex items-center justify-center transition-all
            ${
              inputMessage.trim() && !sending
                ? "bg-yellow-50 text-richblack-900 hover:scale-95 cursor-pointer"
                : "bg-richblack-700 text-richblack-400 cursor-not-allowed"
            }`}
        >
          <VscSend className="text-base" />
        </button>
      </form>
    </div>
  );
}
