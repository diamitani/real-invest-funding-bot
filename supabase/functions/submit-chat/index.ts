
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
    // For now, we're just logging and returning intelligent responses
    
    // Create context-aware responses based on message content
    let response = "Thanks for your message! Our team will get back to you shortly. What specific type of property are you interested in financing?";
    
    if (message.toLowerCase().includes("single family")) {
      response = "Single-family homes are a great investment! We offer fix & flip loans with up to 100% financing for purchase and rehab. What's your timeline for this project?";
    } else if (message.toLowerCase().includes("multi-family")) {
      response = "Multi-family properties can provide excellent returns! Our rental property loans feature 30-year terms with cash-flow focused underwriting. How many units are you looking at?";
    } else if (message.toLowerCase().includes("commercial")) {
      response = "For commercial properties, we offer financing up to 75% LTV with flexible terms for value-add projects. What type of commercial property are you interested in?";
    } else if (message.toLowerCase().includes("land")) {
      response = "Land development can be very profitable. We provide ground-up construction financing for qualified investors with competitive terms. Do you already own the land or are you looking to purchase?";
    } else if (message.toLowerCase().includes("rate") || message.toLowerCase().includes("interest")) {
      response = "Our rates start at 9.9% for fix & flip loans and vary based on property type, loan amount, and your experience. Would you like us to send you our current rate sheet?";
    } else if (message.toLowerCase().includes("down payment") || message.toLowerCase().includes("qualify")) {
      response = "We can finance up to 100% of the purchase and renovation costs for the right deals! Our qualification process focuses more on the property's potential than traditional borrower metrics. What's your investment experience?";
    } else if (message.toLowerCase().includes("fix & flip")) {
      response = "Our fix & flip loans are designed for short-term projects with terms up to 24 months. We can fund up to 100% of purchase and rehab costs for the right deals. What's the purchase price and estimated renovation budget for your project?";
    } else if (message.toLowerCase().includes("rental property")) {
      response = "Our rental property loans offer 30-year terms with cash-flow focused underwriting. We look at the property's income potential rather than just your personal finances. What's the expected monthly rent for the property you're considering?";
    } else if (message.toLowerCase().includes("new construction")) {
      response = "We provide ground-up construction financing with competitive terms. We can fund up to 80% of total project costs including land acquisition. Do you have architectural plans and permits in place?";
    } else if (message.toLowerCase().includes("bridge loan")) {
      response = "Our bridge loans provide short-term financing for acquisitions and refinances with flexible terms. They're perfect for when you need capital quickly before securing long-term financing. What's your exit strategy for the bridge loan?";
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        response: response 
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
