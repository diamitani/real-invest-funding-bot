
import { useChatContext } from "@/contexts/ChatContext";
import ChatInput from "../ChatInput";

const ChatFooter = () => {
  const { handleSendMessage, isTyping, showLeadForm } = useChatContext();

  return (
    <>
      <ChatInput 
        onSendMessage={handleSendMessage} 
        disabled={isTyping || showLeadForm} 
      />
      
      <div className="mt-4 text-xs text-center text-muted-foreground">
        Need to talk to a human? Type "connect me" or email aattoh@realinvestfunding.com
      </div>
    </>
  );
};

export default ChatFooter;
