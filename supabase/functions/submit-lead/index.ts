
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
  referralName?: string;
  referralEmail?: string;
  referralPhone?: string;
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
    } else if (formData.dealType) {
      emailSubject = `New ${formData.dealType} Funding Request from Real Invest Funding Website`;
    }
    
    // Create appropriate email content based on service type
    let serviceSpecificContent = "";
    if (formData.serviceRequested) {
      switch(formData.serviceRequested) {
        case "CDNA":
          serviceSpecificContent = `
Service Requested: CDNA Report
Property Address for CDNA Report: ${formData.propertyAddress || "Not provided"}
          `;
          break;
        case "DSR":
          serviceSpecificContent = `
Service Requested: Debt Stack Report
Property Address for DSR Report: ${formData.propertyAddress || "Not provided"}
          `;
          break;
        case "ProofOfFunds":
          serviceSpecificContent = `
Service Requested: Proof of Funds Letter
Business/Entity Name: ${formData.businessName || "Not provided"}
Investment Property Address: ${formData.propertyAddress || "Not provided"}
Expected Loan Amount: ${formData.loanAmount || "Not provided"}
          `;
          break;
        case "Leads":
          serviceSpecificContent = `
Service Requested: Off-Market Property Leads
Target Location: ${formData.targetLocation || "Not provided"}
Property Type Preference: ${formData.propertyType || "Not provided"}
Timeframe: ${formData.timeframe || "Not provided"}
          `;
          break;
        default:
          serviceSpecificContent = `
Service Requested: ${formData.serviceRequested}
          `;
          if (formData.investmentGoals) {
            serviceSpecificContent += `
Investment Goals: ${formData.investmentGoals}
            `;
          }
      }
    } else if (formData.dealType) {
      // For loan/funding requests
      serviceSpecificContent = `
Deal Type: ${formData.dealType}
Property Address: ${formData.propertyAddress || "Not provided"}
Loan Amount: ${formData.loanAmount || "Not provided"}
${formData.investmentGoals ? `Investment Goals: ${formData.investmentGoals}` : ""}
      `;
    }
    
    // Include referral information if provided
    let referralContent = "";
    if (formData.referralName || formData.referralEmail || formData.referralPhone) {
      referralContent = `
Referral Information:
Name: ${formData.referralName || "Not provided"}
Email: ${formData.referralEmail || "Not provided"}
Phone: ${formData.referralPhone || "Not provided"}
      `;
    }
    
    // Send the email
    const emailContent = `
      New Lead from Real Invest Funding Website:
      
      Full Name: ${formData.fullName}
      Email: ${formData.email}
      Phone: ${formData.phone}
      ${serviceSpecificContent}
      ${referralContent}
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
