
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
  buttonOptions: string[];
  showValueAddMenu: boolean;
  handleSendMessage: (message: string) => Promise<void>;
  handleFormSubmit: (formData: any) => Promise<void>;
  handleButtonSelect: (option: string) => void;
  handleLeadFormSubmit: (formData: any) => void;
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
        
        // Show value-add menu after lead form is submitted
        if (!showValueAddMenu && !showLeadForm && messages.length > 6) {
          setTimeout(() => {
            setShowValueAddMenu(true);
          }, 1500);
        }
        
        // Dynamic button options based on conversation context
        if (message.toLowerCase().includes('loan') || message.toLowerCase().includes('funding')) {
          setButtonOptions(['Fix & Flip', 'Rental Property', 'New Construction', 'Bridge Loan']);
        } else if (message.toLowerCase().includes('rate') || message.toLowerCase().includes('interest')) {
          setButtonOptions(['See Current Rates', 'Get Pre-Qualified', 'Speak to Loan Officer']);
        } else if (message.toLowerCase().includes('service') || message.toLowerCase().includes('help')) {
          setButtonOptions(['CDNA Report', 'DSR Report', 'Proof of Funds', 'Off-Market Leads']);
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
        
        // Show value add menu after form submission
        setTimeout(() => {
          setShowValueAddMenu(true);
        }, 1500);
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

  // New handlers needed by ChatMessagesArea
  const handleButtonSelect = (option: string) => {
    handleSendMessage(option);
    setButtonOptions([]);
  };

  const handleLeadFormSubmit = (formData: any) => {
    handleFormSubmit(formData);
  };

  const handleValueAddSelection = (service: string) => {
    setSelectedValueAddService(service);
    setShowValueAddMenu(false);
    // Add a message about the selected service
    const serviceMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: `I'm interested in ${service}`,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, serviceMessage]);
    
    // Respond to the service selection
    setIsTyping(true);
    setTimeout(() => {
      let responseContent = "";
      
      switch(service) {
        case "CDNA":
          responseContent = "Great choice! Our CDNA Reports provide comprehensive property valuation data at just $34.97. This detailed analysis is nearly as thorough as a professional appraisal but at a fraction of the cost. Our team will follow up with details on accessing this service.";
          break;
        case "ProofOfFunds":
          responseContent = "Excellent! Our Proof of Funds letters cost only $19.97 and will give you the credibility you need when making offers. These letters are available nationwide except in AZ, MN, NV, OR, SD, UT, and VT. We'll reach out shortly with information on how to obtain your letter.";
          break;
        case "Leads":
          responseContent = "Smart decision! Our AI-scanned off-market leads service helps you find high-equity deals with absentee owners and properties showing distress signals. These exclusive opportunities come with much less competition than on-market listings. A member of our team will contact you to discuss your specific investment criteria.";
          break;
        case "DSR":
          responseContent = "Perfect! Our Debt Stack Reports reveal essential financial information including primary mortgages, secondary liens, and tax obligations that can give you powerful negotiation leverage. This critical due diligence tool helps you make well-informed offers. We'll be in touch soon with more details about this service.";
          break;
        default:
          responseContent = "Thanks for your interest. Our team will be in touch shortly to discuss how we can help with your investment needs. Is there anything specific about our services that you'd like to learn more about in the meantime?";
      }
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: Date.now(),
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

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
