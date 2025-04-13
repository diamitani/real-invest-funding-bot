
import { useState } from 'react';
import { Message } from '@/types/chat';

export const useChatState = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi there! I'm here to help with your real estate funding needs. What type of property are you looking to finance?",
      timestamp: Date.now(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [buttonOptions, setButtonOptions] = useState<string[]>([
    'Single Family', 
    'Multi-Family', 
    'Commercial', 
    'Land'
  ]);
  const [showValueAddMenu, setShowValueAddMenu] = useState(false);
  const [selectedValueAddService, setSelectedValueAddService] = useState<string | null>(null);

  return {
    messages,
    setMessages,
    isTyping,
    setIsTyping,
    showLeadForm,
    setShowLeadForm,
    buttonOptions,
    setButtonOptions,
    showValueAddMenu,
    setShowValueAddMenu,
    selectedValueAddService,
    setSelectedValueAddService,
  };
};
