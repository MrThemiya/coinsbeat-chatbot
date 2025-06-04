
// Coinsbeat AI - Your Crypto Assistant UI - React + TailwindCSS
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, User } from "lucide-react";

export default function CoinsbeatAIChat() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Welcome! Ask me about today's crypto trends." }
  ]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);
    setInput("");

    const botResponse = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input })
    }).then(res => res.json());

    setMessages(prev => [...prev, { sender: "bot", text: botResponse.reply }]);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Coinsbeat AI - Your Crypto Assistant</h1>
      <Card className="h-[500px] overflow-y-auto p-4 space-y-4">
        <CardContent>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-2 mb-3 ${
                msg.sender === "bot" ? "justify-start" : "justify-end"
              }`}
            >
              {msg.sender === "bot" ? <Bot className="w-5 h-5 mt-1" /> : <User className="w-5 h-5 mt-1" />}
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-xl max-w-xs">
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <div className="flex mt-4 space-x-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about crypto trends..."
        />
        <Button onClick={handleSend}>Send</Button>
      </div>
    </div>
  );
}
