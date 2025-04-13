
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
  businessName?: string;
  investmentGoals?: string;
  propertyType?: string;
  targetLocation?: string;
  timeframe?: string;
  serviceRequested?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData: LeadFormData = await req.json();
    
    // Generate email content based on service requested
    let emailSubject = "New Lead from Real Invest Funding Website";
    if (formData.serviceRequested) {
      emailSubject = `New ${formData.serviceRequested} Request from Real Invest Funding Website`;
    }
    
    // Create appropriate email content based on service type
    let serviceSpecificContent = "";
    if (formData.serviceRequested) {
      switch(formData.serviceRequested) {
        case "CDNA":
          serviceSpecificContent = `
Property Address for CDNA Report: ${formData.propertyAddress || "Not provided"}
          `;
          break;
        case "DSR":
          serviceSpecificContent = `
Property Address for DSR Report: ${formData.propertyAddress || "Not provided"}
          `;
          break;
        case "ProofOfFunds":
          serviceSpecificContent = `
Business/Entity Name: ${formData.businessName || "Not provided"}
Investment Property Address: ${formData.propertyAddress || "Not provided"}
Expected Loan Amount: ${formData.loanAmount || "Not provided"}
          `;
          break;
        case "Leads":
          serviceSpecificContent = `
Target Location: ${formData.targetLocation || "Not provided"}
Property Type Preference: ${formData.propertyType || "Not provided"}
          `;
          break;
        default:
          if (formData.investmentGoals) {
            serviceSpecificContent = `
Investment Goals: ${formData.investmentGoals}
            `;
          }
      }
    }
    
    // Send the email
    const emailContent = `
      New Lead from Real Invest Funding Website:
      
      Full Name: ${formData.fullName}
      Email: ${formData.email}
      Phone: ${formData.phone}
      ${serviceSpecificContent}
      Property Address: ${formData.propertyAddress || "Not provided"}
      Loan Amount: ${formData.loanAmount || "Not provided"}
      Deal Type: ${formData.dealType || "Not specified"}
      Service Requested: ${formData.serviceRequested || "None specified"}
    `;
    
    // Log the form data that would be sent via email
    console.log("Form submission received:", emailContent);
    console.log(`Email would be sent to: aattoh@realinvestfunding.com with subject: ${emailSubject}`);
    
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
