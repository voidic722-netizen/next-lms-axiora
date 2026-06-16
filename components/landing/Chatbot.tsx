"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, Send, User } from "lucide-react";
import knowledgeBase from "@/lib/knowledge-base.json";

interface KnowledgeItem {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
}

interface Message {
  id: string;
  text: string;
  sender: "bot" | "user";
  isTyping?: boolean;
}

const STOP_WORDS = new Set([
  "apa", "itu", "yang", "di", "ke", "dari", "dan", "atau", "adalah",
  "ada", "tidak", "dengan", "untuk", "ini", "itu", "saya", "kamu",
  "bisa", "bagaimana", "cara", "kenapa", "mengapa", "siapa", "kapan",
  "dimana", "apakah", "saja", "juga", "sudah", "belum", "akan",
  "tentang", "terkait", "seputar", "gimana", "dong", "yuk", "tolong",
  "mohon", "bisakah", "dapatkah", "jelaskan", "ceritakan", "beritahu",
  "axiora",
]);

const extractTokens = (text: string): string[] => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
};

const findBestMatch = (query: string): KnowledgeItem | null => {
  const lowerQuery = query.toLowerCase();
  const queryTokens = extractTokens(query);

  let bestMatch: KnowledgeItem | null = null;
  let highestScore = 0;

  for (const item of knowledgeBase as KnowledgeItem[]) {
    let score = 0;

    if (item.question.toLowerCase() === lowerQuery) {
      score += 200;
    }

    if (item.question.toLowerCase().includes(lowerQuery)) {
      score += 50;
    }

    if (lowerQuery.includes(item.question.toLowerCase())) {
      score += 40;
    }

    const questionTokens = extractTokens(item.question);
    for (const token of queryTokens) {
      if (questionTokens.some((qt) => qt.includes(token) || token.includes(qt))) {
        score += 15;
      }
    }

    const itemKeywords = item.keywords.map((k) => k.toLowerCase());
    for (const token of queryTokens) {
      for (const kw of itemKeywords) {
        if (kw.length > 4 && (kw.includes(token) || token.includes(kw))) {
          score += 8;
        }
      }
    }

    const answerTokens = extractTokens(item.answer);
    for (const token of queryTokens) {
      if (answerTokens.some((at) => at.includes(token) || token.includes(at))) {
        score += 3;
      }
    }

    if (score > highestScore && score >= 10) {
      highestScore = score;
      bestMatch = item;
    }
  }

  return bestMatch;
};

const getDynamicSuggestions = (inputText: string, usedQuestions: string[]): string[] => {
  const kb = knowledgeBase as KnowledgeItem[];
  const inputTokens = extractTokens(inputText);
  
  const scoredItems = kb.map(item => {
    let score = 0;
    const questionTokens = extractTokens(item.question);
    const itemKeywords = item.keywords.map(k => k.toLowerCase());
    
    for (const token of inputTokens) {
      if (questionTokens.some(qt => qt.includes(token) || token.includes(qt))) {
        score += 10;
      }
      if (itemKeywords.some(kw => kw.length > 4 && (kw.includes(token) || token.includes(kw)))) {
        score += 5;
      }
    }
    
    return { item, score };
  });
  
  return scoredItems
    .filter(si => si.score > 0 || inputText.length === 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(si => si.item.question)
    .filter(q => !usedQuestions.includes(q));
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [mounted, setMounted] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const usedQuestions = useMemo(() => {
    return messages.filter(m => m.sender === "user").map(m => m.text);
  }, [messages]);
  
  const dynamicSuggestions = useMemo(() => {
    return getDynamicSuggestions(input, usedQuestions);
  }, [input, usedQuestions]);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        setMessages([{
          id: Date.now().toString(),
          text: "Halo! Ada yang ingin ditanyakan seputar Axiora? 😊",
          sender: "bot",
        }]);
      }, 400);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    // FIX: Ubah tipe parameter menjadi Event agar kompatibel dengan touchstart
    const handleClickOutside = (event: Event) => {
      if (
        isOpen &&
        chatContainerRef.current &&
        !chatContainerRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest("button[aria-label='Buka chat']")
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, {
      id: Date.now().toString(),
      text,
      sender: "user",
    }]);
    setInput("");

    const bestMatch = findBestMatch(text);
    const typingId = (Date.now() + 1).toString();

    setMessages((prev) => [...prev, { id: typingId, text: "", sender: "bot", isTyping: true }]);

    setTimeout(() => {
      setMessages((prev) =>
        prev.filter((m) => m.id !== typingId).concat([{
          id: (Date.now() + 2).toString(),
          text: bestMatch
            ? bestMatch.answer
            : "Maaf, saya belum memiliki informasi tentang itu. Silakan hubungi admin Axiora untuk pertanyaan lebih lanjut.",
          sender: "bot",
        }])
      );
    }, 900);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(input);
    }
  };

  if (!mounted) return null;

  const chatUI = (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Buka chat"
        style={{
          position: "fixed", bottom: "24px", right: "24px",
          zIndex: 2147483647, height: "56px", width: "56px",
          borderRadius: "50%", backgroundColor: "#7c3aed",
          color: "white", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 8px 24px rgba(124,58,237,0.5)",
        }}
      >
        {isOpen ? <X size={24} /> : (
          <Image 
            src="/assets/img/mascot.png" 
            alt="Mascot Axiora" 
            width={40} 
            height={40} 
            style={{ objectFit: "contain" }}
          />
        )}
      </button>

      {isOpen && (
        <div
          ref={chatContainerRef}
          style={{
            position: "fixed", bottom: "92px", right: "24px",
            zIndex: 2147483646, width: "min(90vw, 380px)", maxHeight: "68vh",
            backgroundColor: "white", borderRadius: "16px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
            border: "1px solid #e2e8f0", display: "flex",
            flexDirection: "column", overflow: "hidden",
          }}
        >
          <div style={{
            backgroundColor: "#7c3aed", color: "white",
            padding: "12px 16px", display: "flex",
            alignItems: "center", gap: "12px", flexShrink: 0,
          }}>
            <div style={{
              height: "38px", width: "38px", borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden",
            }}>
              <Image src="/assets/img/mascot.png" alt="Axiora" width={32} height={32} style={{ objectFit: "contain" }} />
            </div>
            <div>
              <p style={{ fontWeight: 600, margin: 0, fontSize: "14px" }}>Axiora Assistant</p>
              <p style={{ fontSize: "11px", margin: 0, opacity: 0.8 }}>Online</p>
            </div>
            <button onClick={() => setIsOpen(false)} aria-label="Tutup chat"
              style={{ marginLeft: "auto", background: "none", border: "none", color: "white", cursor: "pointer", display: "flex", padding: 0 }}>
              <X size={18} />
            </button>
          </div>

          <div style={{
            flex: 1, overflowY: "auto", padding: "16px",
            display: "flex", flexDirection: "column", gap: "10px",
            backgroundColor: "#f8fafc", minHeight: 0,
          }}>
            {messages.map((message) => (
              <div key={message.id} style={{
                display: "flex", gap: "8px",
                justifyContent: message.sender === "user" ? "flex-end" : "flex-start",
                alignItems: "flex-end",
              }}>
                {message.sender === "bot" && (
                  <div style={{
                    height: "28px", width: "28px", borderRadius: "50%",
                    backgroundColor: "#ede9fe", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    flexShrink: 0, overflow: "hidden",
                  }}>
                    <Image src="/assets/img/mascot.png" alt="Axiora" width={20} height={20} style={{ objectFit: "contain" }} />
                  </div>
                )}
                <div style={{
                  maxWidth: "78%", padding: "8px 12px",
                  borderRadius: message.sender === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  backgroundColor: message.sender === "user" ? "#7c3aed" : "white",
                  color: message.sender === "user" ? "white" : "#1e293b",
                  border: message.sender === "bot" ? "1px solid #e2e8f0" : "none",
                  fontSize: "13px", lineHeight: "1.5",
                }}>
                  {message.isTyping
                    ? <span style={{ letterSpacing: "2px" }}>• • •</span>
                    : <p style={{ margin: 0 }}>{message.text}</p>
                  }
                </div>
                {message.sender === "user" && (
                  <div style={{
                    height: "28px", width: "28px", borderRadius: "50%",
                    backgroundColor: "#e2e8f0", display: "flex",
                    alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <User size={14} color="#64748b" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {dynamicSuggestions.length > 0 && (
            <div style={{ padding: "8px 12px", borderTop: "1px solid #e2e8f0", backgroundColor: "white", flexShrink: 0 }}>
              <p style={{ fontSize: "10px", fontWeight: 600, color: "#94a3b8", margin: "0 0 6px 0", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Coba tanya:
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                {dynamicSuggestions.map((q, i) => (
                  <button key={i} onClick={() => handleSendMessage(q)}
                    style={{
                      padding: "3px 10px", fontSize: "11px",
                      backgroundColor: "#f1f5f9", color: "#475569",
                      border: "1px solid #e2e8f0", borderRadius: "999px",
                      cursor: "pointer", whiteSpace: "nowrap",
                    }}>
                    {q.length > 38 ? q.slice(0, 38) + "…" : q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{
            padding: "10px 12px", borderTop: "1px solid #e2e8f0",
            backgroundColor: "white", display: "flex", gap: "8px", flexShrink: 0,
          }}>
            <input
              type="text" value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ketik pesan Anda..."
              aria-label="Ketik pesan Anda"
              style={{
                flex: 1, padding: "8px 14px", border: "1px solid #cbd5e1",
                borderRadius: "999px", fontSize: "13px", outline: "none",
                backgroundColor: "#f8fafc",
              }}
            />
            <button onClick={() => handleSendMessage(input)} aria-label="Kirim pesan"
              style={{
                height: "38px", width: "38px", borderRadius: "50%",
                backgroundColor: "#7c3aed", color: "white", border: "none",
                cursor: "pointer", display: "flex", alignItems: "center",
                justifyContent: "center", flexShrink: 0,
              }}>
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  );

  return createPortal(chatUI, document.body);
}