
import React, { createContext, useContext, ReactNode } from 'react';
import { Message, ChatFormData } from '@/types/chat';
import { useChatState } from '@/hooks/useChatState';
import { useChatHandlers } from '@/hooks/useChatHandlers';

// Context type definition
interface ChatContextType {
  messages: Message[];
  isTyping: boolean;
  showLeadForm: boolean;
  buttonOptions: string[];
  showValueAddMenu: boolean;
  handleSendMessage: (message: string) => Promise<void>;
  handleFormSubmit: (formData: ChatFormData) => Promise<void>;
  handleButtonSelect: (option: string) => void;
  handleLeadFormSubmit: (formData: ChatFormData) => void;
  handleValueAddSelection: (service: string) => void;
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
  // Get state from custom hook
  const {
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
  } = useChatState();
  
  // Get handlers from custom hook
  const {
    handleSendMessage,
    handleFormSubmit,
    handleButtonSelect,
    handleLeadFormSubmit,
    handleValueAddSelection
  } = useChatHandlers({
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
  });

  return (
    <ChatContext.Provider
      value={{
        messages,
        isTyping,
        showLeadForm,
        buttonOptions,
        showValueAddMenu,
        handleSendMessage,
        handleFormSubmit,
        handleButtonSelect,
        handleLeadFormSubmit,
        handleValueAddSelection,
        selectedValueAddService,
        setSelectedValueAddService,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
