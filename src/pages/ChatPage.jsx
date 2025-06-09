
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Send, Paperclip, Smile } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

// Dummy profiles for chat context - in a real app, this would come from a DB or state management
const dummyProfiles = [
  { id: 1, name: 'Sarah, 28', images: ['https://source.unsplash.com/random/400x600?woman,portrait'] },
  { id: 2, name: 'Mike, 32', images: ['https://source.unsplash.com/random/400x600?man,portrait'] },
  { id: 3, name: 'Alex, 25', images: ['https://source.unsplash.com/random/400x600?person,portrait'] },
  { id: 4, name: 'Jessica, 30', images: ['https://source.unsplash.com/random/400x600?woman,foodie'] },
  { id: 5, name: 'David, 27', images: ['https://source.unsplash.com/random/400x600?man,fitness'] },
];

const ChatPage = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [chatPartner, setChatPartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const chatType = chatId.startsWith('match-') ? 'match' : 'negative';
  const partnerId = parseInt(chatId.split('-')[1]);

  useEffect(() => {
    const partner = dummyProfiles.find(p => p.id === partnerId);
    setChatPartner(partner);

    if (currentUser && partner) {
      const storedMessages = JSON.parse(localStorage.getItem(`chat_${currentUser.id}_${partner.id}`)) || [];
      setMessages(storedMessages);
    }
  }, [chatId, currentUser, partnerId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !currentUser || !chatPartner) return;

    const messageData = {
      id: Date.now(),
      text: newMessage,
      senderId: currentUser.id,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, messageData];
    setMessages(updatedMessages);
    localStorage.setItem(`chat_${currentUser.id}_${chatPartner.id}`, JSON.stringify(updatedMessages));
    setNewMessage('');

    // Simulate a reply from chat partner after a short delay
    setTimeout(() => {
      const replyText = chatType === 'match' 
        ? `Hey! Thanks for messaging. How are you? 😊` 
        : `Well, this is awkward... but interesting! What's up? 🤔`;
      
      const replyData = {
        id: Date.now() + 1,
        text: replyText,
        senderId: chatPartner.id,
        timestamp: new Date().toISOString(),
      };
      const finalMessages = [...updatedMessages, replyData];
      setMessages(finalMessages);
      localStorage.setItem(`chat_${currentUser.id}_${chatPartner.id}`, JSON.stringify(finalMessages));
    }, 1500);
  };
  
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    return parts.map(part => part[0]).join('').toUpperCase();
  };

  if (!chatPartner) {
    return <div className="flex items-center justify-center h-screen"><div className="spinner"></div><p className="ml-2">Loading chat...</p></div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full max-h-[calc(100vh-128px)] md:max-h-[calc(100vh-64px)] bg-gradient-to-br from-pink-50 via-rose-50 to-amber-50 rounded-xl shadow-2xl overflow-hidden"
    >
      {/* Chat Header */}
      <header className="bg-white/80 backdrop-blur-md p-4 border-b border-pink-200 flex items-center space-x-3 sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={() => navigate('/matches')} className="text-pink-600 hover:bg-pink-100">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <Avatar className="h-10 w-10 border-2 border-pink-300">
          <AvatarImage src={chatPartner.images && chatPartner.images[0]} alt={chatPartner.name} />
          <AvatarFallback className="bg-pink-200 text-pink-700 font-semibold">{getInitials(chatPartner.name)}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold text-lg text-gray-800">{chatPartner.name.split(',')[0]}</h2>
          <p className={`text-xs ${chatType === 'match' ? 'text-green-600' : 'text-purple-600'}`}>
            {chatType === 'match' ? 'You matched!' : 'Negative Chat'}
          </p>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-grow p-4 space-y-4 overflow-y-auto">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              layout
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs md:max-w-md p-3 rounded-2xl shadow ${
                  msg.senderId === currentUser.id
                    ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-br-none'
                    : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.senderId === currentUser.id ? 'text-pink-100' : 'text-gray-400'} text-right`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Area */}
      <footer className="bg-white/80 backdrop-blur-md p-3 border-t border-pink-200 sticky bottom-0 z-10">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" type="button" className="text-pink-500 hover:bg-pink-100">
            <Smile className="w-5 h-5" />
          </Button>
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow border-pink-300 focus:border-pink-500 focus:ring-pink-500 rounded-full px-4 py-2"
            autoComplete="off"
          />
          <Button variant="ghost" size="icon" type="button" className="text-pink-500 hover:bg-pink-100">
            <Paperclip className="w-5 h-5" />
          </Button>
          <Button type="submit" size="icon" className="bg-pink-500 hover:bg-pink-600 text-white rounded-full w-10 h-10">
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </footer>
    </motion.div>
  );
};

export default ChatPage;
