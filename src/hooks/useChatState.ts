
import { useState } from 'react';
import { Message } from '@/types/chat';

export const useChatState = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Welcome to Real Invest Funding LLC! 💰 Ready to fund your next real estate deal with up to 100% financing? I'll guide you through our quick process — just a few questions, and we'll send you info or a term sheet. Ready to get started?",
      timestamp: Date.now(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [buttonOptions, setButtonOptions] = useState<string[]>([
    'Yes, Tell Me More', 
    'Browse Options'
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
