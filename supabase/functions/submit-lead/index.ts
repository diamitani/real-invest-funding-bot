
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface LeadFormData {
  fullName: string;
  propertyAddress: string;
  loanAmount: string;
  email: string;
  phone: string;
  dealType?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData: LeadFormData = await req.json();
    
    // Send the email
    const emailContent = `
      New Lead from Real Invest Funding Website:
      
      Full Name: ${formData.fullName}
      Property Address: ${formData.propertyAddress || "Not provided"}
      Loan Amount: ${formData.loanAmount || "Not provided"}
      Email: ${formData.email}
      Phone: ${formData.phone}
      Deal Type: ${formData.dealType || "Not specified"}
    `;
    
    // Log the form data that would be sent via email
    console.log("Form submission received:", emailContent);
    
    // Here you would typically connect to an email service
    // For now, we're just logging and returning success
    console.log(`Email would be sent to: aattoh@realinvestfunding.com`);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Lead information received. We'll reach out shortly!" 
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
    console.error("Error processing form submission:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "There was an error processing your submission. Please try again." 
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
