import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiMessageCircle } from 'react-icons/fi';

const DEMO_RESPONSES = [
  "Hi! I'm your Smart Tour Chatbot. How can I help you plan your Sri Lankan adventure?",
  "I can suggest places, create itineraries, and answer travel questions!",
  "Try asking: 'What are the top 5 places to visit in Kandy?' or 'Plan a 3-day trip for me.'"
];

const ChatBotDemo = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: DEMO_RESPONSES[0] }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (open && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(msgs => [...msgs, { sender: 'user', text: input }]);
    setLoading(true);
    setInput('');
    setTimeout(() => {
      const botMsg = DEMO_RESPONSES[(messages.length) % DEMO_RESPONSES.length];
      setMessages(msgs => [...msgs, { sender: 'bot', text: botMsg }]);
      setLoading(false);
    }, 900);
  };

  return (
    <>
      {/* Floating Chatbot Button */}
      <button
        className="fixed bottom-8 right-8 z-50 bg-teal-500 hover:bg-teal-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition-all duration-200"
        onClick={() => setOpen(o => !o)}
        aria-label="Open Chatbot"
        style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.18)' }}
      >
        <FiMessageCircle size={32} />
      </button>
      {/* Chatbot Modal */}
      {open && (
        <div className="fixed bottom-28 right-8 z-50 w-80 max-w-full bg-white rounded-xl shadow-2xl flex flex-col border border-gray-200 animate-fade-in">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-teal-500 rounded-t-xl">
            <span className="font-bold text-white text-lg">Smart Tour Chatbot</span>
            <button className="text-white text-2xl" onClick={() => setOpen(false)}>&times;</button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-gray-50" style={{ minHeight: 220, maxHeight: 320 }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'}`}>
                <div className={`rounded-lg px-3 py-2 text-sm max-w-[80%] ${msg.sender === 'bot' ? 'bg-teal-100 text-gray-800' : 'bg-teal-500 text-white'}`}>{msg.text}</div>
              </div>
            ))}
            {loading && <div className="text-xs text-gray-400">Typing...</div>}
            <div ref={chatEndRef} />
          </div>
          <form className="flex items-center border-t border-gray-200 px-2 py-2 bg-white rounded-b-xl" onSubmit={handleSend}>
            <input
              className="flex-1 px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm"
              placeholder="Type your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
              autoFocus
            />
            <button type="submit" className="ml-2 bg-teal-500 hover:bg-teal-600 text-white rounded-full p-2 transition-colors" disabled={loading || !input.trim()}>
              <FiSend size={20} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBotDemo;
