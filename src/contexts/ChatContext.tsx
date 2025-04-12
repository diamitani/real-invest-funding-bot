
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Types for chat messages and context
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface ChatContextType {
  messages: Message[];
  isTyping: boolean;
  showLeadForm: boolean;
  handleSendMessage: (message: string) => Promise<void>;
  handleFormSubmit: (formData: any) => Promise<void>;
  selectedValueAddService: string | null;
  setSelectedValueAddService: React.Dispatch<React.SetStateAction<string | null>>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi there! I'm here to help with your real estate funding needs. What type of property are you looking to finance?',
      timestamp: Date.now(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [selectedValueAddService, setSelectedValueAddService] = useState<string | null>(null);

  const handleSendMessage = async (message: string) => {
    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: Date.now(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    try {
      // Send message to the submit-chat edge function
      const { data, error } = await supabase.functions.invoke('submit-chat', {
        body: { 
          message, 
          conversation: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }
      });
      
      if (error) throw error;
      
      // Add assistant response
      setTimeout(() => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response || "I'm sorry, I couldn't process that request. Please try again.",
          timestamp: Date.now(),
        };
        
        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
        
        // Show lead form after a few messages
        if (messages.length >= 4 && !showLeadForm) {
          setTimeout(() => {
            setShowLeadForm(true);
          }, 1000);
        }
      }, 1000);
      
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Add error message
      setTimeout(() => {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "I'm having trouble connecting right now. Please try again or email us directly at aattoh@realinvestfunding.com",
          timestamp: Date.now(),
        };
        
        setMessages(prev => [...prev, errorMessage]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const handleFormSubmit = async (formData: any) => {
    setIsTyping(true);
    
    try {
      const { error } = await supabase.functions.invoke('submit-lead', {
        body: { ...formData }
      });
      
      if (error) throw error;
      
      // Add success message
      setTimeout(() => {
        const thankYouMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Thanks ${formData.fullName}! Our team will reach out to you shortly about your ${formData.loanAmount} loan request for ${formData.propertyAddress}.`,
          timestamp: Date.now(),
        };
        
        setMessages(prev => [...prev, thankYouMessage]);
        setIsTyping(false);
        setShowLeadForm(false);
      }, 1000);
      
    } catch (error) {
      console.error("Error submitting form:", error);
      
      // Add error message
      setTimeout(() => {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "I'm having trouble submitting your information. Please try again or email us directly at aattoh@realinvestfunding.com",
          timestamp: Date.now(),
        };
        
        setMessages(prev => [...prev, errorMessage]);
        setIsTyping(false);
      }, 1000);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        isTyping,
        showLeadForm,
        handleSendMessage,
        handleFormSubmit,
        selectedValueAddService,
        setSelectedValueAddService,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
