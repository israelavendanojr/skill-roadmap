import React, { useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { generateAgentResponse } from '../utils/chatUtils';

interface ChatWidgetProps {
  showChat: boolean;
  minimizeChat: boolean;
  setMinimizeChat: (minimize: boolean) => void;
  chatMessages: ChatMessage[];
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  chatInput: string;
  setChatInput: React.Dispatch<React.SetStateAction<string>>;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({
  showChat,
  minimizeChat,
  setMinimizeChat,
  chatMessages,
  setChatMessages,
  chatInput,
  setChatInput,
}) => {
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  
  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);
  
  // Handle sending a chat message
  const handleSendMessage = () => {
    if (chatInput.trim()) {
      // Add user message
      const userMessage: ChatMessage = {
        sender: 'user',
        text: chatInput,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, userMessage]);
      setChatInput(''); // Clear input
      
      // Simulate agent response after a short delay
      setTimeout(() => {
        const responseText = generateAgentResponse(chatInput);
        
        const agentMessage: ChatMessage = {
          sender: 'agent',
          text: responseText,
          timestamp: new Date()
        };
        
        setChatMessages(prev => [...prev, agentMessage]);
      }, 1000);
    }
  };

  // Handle chat input keypress (for Enter key)
  const handleChatKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!showChat) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: minimizeChat ? '200px' : '280px',
        height: minimizeChat ? '50px' : '400px',
        backgroundColor: '#fff',
        borderRadius: minimizeChat ? '25px' : '16px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
        overflow: 'hidden',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        border: '1px solid #d1e4ff',
        maxWidth: '25%',
      }}
    >
      {/* Chat Header or Bar */}
      <div
        style={{
          backgroundColor: '#2563eb',
          padding: minimizeChat ? '10px 16px' : '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: 'white',
          cursor: 'pointer',
          height: minimizeChat ? '100%' : 'auto',
        }}
        onClick={() => setMinimizeChat(!minimizeChat)}
      >
        {minimizeChat ? (
          /* Minimized bar with greeting */
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ 
                backgroundColor: '#1d4ed8', 
                borderRadius: '50%', 
                width: '26px', 
                height: '26px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {'📍'}
              </span>
              <span style={{ 
                fontWeight: 500, 
                fontSize: '14px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                Venture Guide
              </span>
            </div>
            <button
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '4px',
                fontSize: '18px',
                fontWeight: 'bold',
                lineHeight: 1,
                flexShrink: 0
              }}
              onClick={(e) => {
                e.stopPropagation();
                setMinimizeChat(false);
              }}
            >
              ↗
            </button>
          </div>
        ) : (
          /* Expanded header */
          <>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ 
                backgroundColor: '#1d4ed8', 
                borderRadius: '50%', 
                width: '32px', 
                height: '32px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginRight: '12px',
              }}>
                {'📍'}
              </span>
              <span style={{ 
                fontWeight: 600, 
                fontSize: '16px', 
                whiteSpace: 'nowrap'
              }}>
                Venture Assistant
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  padding: '4px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  lineHeight: 1,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setMinimizeChat(true);
                }}
              >
                ↘
              </button>
            </div>
          </>
        )}
      </div>

      {/* Chat Messages */}
      {!minimizeChat && (
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            backgroundColor: '#f8fafc',
          }}
        >
          {chatMessages.map((message, index) => (
            <div
              key={index}
              style={{
                alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
                backgroundColor: message.sender === 'user' ? '#2563eb' : 'white',
                color: message.sender === 'user' ? 'white' : '#374151',
                padding: '12px 16px',
                borderRadius: message.sender === 'user' 
                  ? '16px 16px 4px 16px' 
                  : '16px 16px 16px 4px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                border: message.sender === 'user' 
                  ? 'none' 
                  : '1px solid #e2e8f0',
                fontSize: '13px',
                lineHeight: 1.5,
              }}
            >
              {message.text}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      )}

      {/* Chat Input */}
      {!minimizeChat && (
        <div
          style={{
            padding: '12px 16px',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            gap: '8px',
            backgroundColor: 'white',
          }}
        >
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={handleChatKeyPress}
            placeholder="Ask about the places..."
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '20px',
              border: '1px solid #d1d5db',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: 'white',
              color: '#333',
            }}
          />
          <button
            onClick={handleSendMessage}
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatWidget; 