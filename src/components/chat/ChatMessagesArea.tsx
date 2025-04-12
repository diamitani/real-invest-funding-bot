
import { useRef, useEffect } from "react";
import ChatMessage from "../ChatMessage";
import ActionButtons from "../ActionButtons";
import LeadCaptureForm from "../LeadCaptureForm";
import ValueAddMenu from "../ValueAddMenu";
import { useChatContext } from "@/contexts/ChatContext";

const ChatMessagesArea = () => {
  const { 
    messages, 
    isTyping, 
    buttonOptions, 
    showLeadForm, 
    showValueAddMenu, 
    handleButtonSelect, 
    handleLeadFormSubmit, 
    handleValueAddSelection 
  } = useChatContext();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, showLeadForm, showValueAddMenu]);

  return (
    <div className="max-h-[500px] overflow-y-auto mb-4">
      {messages.map((message, index) => (
        <ChatMessage 
          key={index} 
          message={message.content} 
          isUser={message.role === 'user'} 
        />
      ))}
      
      {isTyping && (
        <ChatMessage 
          message="Typing..." 
          isUser={false} 
          isLoading={true} 
        />
      )}
      
      {buttonOptions.length > 0 && !isTyping && (
        <ActionButtons 
          options={buttonOptions} 
          onSelect={handleButtonSelect} 
          disabled={isTyping} 
        />
      )}
      
      {showLeadForm && (
        <LeadCaptureForm onSubmit={handleLeadFormSubmit} />
      )}
      
      {showValueAddMenu && (
        <ValueAddMenu onSelect={handleValueAddSelection} />
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessagesArea;
