
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Building, User } from "lucide-react";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  isLoading?: boolean;
}

const ChatMessage = ({ message, isUser, isLoading = false }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "flex w-full mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 mr-2 bg-realinvest-navy">
          <Building className="h-4 w-4 text-realinvest-gold" />
        </Avatar>
      )}
      <div
        className={cn(
          "max-w-[80%] rounded-lg p-4",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted",
          isLoading && "animate-pulse"
        )}
      >
        <p className="whitespace-pre-wrap">{message}</p>
      </div>
      {isUser && (
        <Avatar className="h-8 w-8 ml-2 bg-gray-200">
          <User className="h-4 w-4" />
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
