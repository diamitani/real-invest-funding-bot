
import { MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const ChatHeader = () => {
  return (
    <Card className="border-0 shadow-none mb-4">
      <CardContent className="flex items-center justify-center bg-realinvest-navy text-white p-4 rounded-t-lg">
        <div className="flex items-center justify-center w-full">
          <MessageSquare className="mr-2 text-realinvest-gold" size={28} />
          <h1 className="text-xl font-bold">Real Invest Funding LLC</h1>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatHeader;
