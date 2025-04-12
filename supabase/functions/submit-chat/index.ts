
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ChatMessage {
  role: string;
  content: string;
}

interface ChatRequest {
  message: string;
  conversation: ChatMessage[];
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversation } = await req.json() as ChatRequest;
    
    // Format the conversation for the email
    const formattedConversation = conversation
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n\n');
    
    // Format email content
    const emailContent = `
      New Chat Message from Real Invest Funding Website:
      
      Latest Message: ${message}
      
      Conversation History:
      ${formattedConversation}
    `;
    
    console.log("Chat submission received, sending to aattoh@realinvestfunding.com");
    console.log(emailContent);
    
    // In a real implementation, we would connect to an email service here
    // For now, we're just logging and returning success
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        response: "Thanks for your message! Our team will get back to you shortly. What specific type of property are you interested in financing?" 
      }),
      {
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        },
      }
    );
  } catch (error) {
    console.error("Error processing chat submission:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "There was an error processing your message. Please try again." 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        },
      }
    );
  }
};

serve(handler);
