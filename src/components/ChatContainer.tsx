
import { Card, CardContent } from "@/components/ui/card";
import ChatHeader from "./ChatHeader";
import ChatMessagesArea from "./chat/ChatMessagesArea";
import ChatFooter from "./chat/ChatFooter";
import { ChatProvider } from "@/contexts/ChatContext";

const ChatContainer = () => {
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Card className="shadow-lg border-realinvest-navy/20">
        <ChatProvider>
          <ChatHeader />
          <CardContent className="p-4">
            <ChatMessagesArea />
            <ChatFooter />
          </CardContent>
        </ChatProvider>
      </Card>
    </div>
  );
};

export default ChatContainer;
