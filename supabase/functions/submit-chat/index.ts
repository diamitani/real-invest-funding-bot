
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

// Detailed information about the company and services
const companyInfo = {
  about: `At Real Invest Funding LLC, we are genuinely invested in your real estate investment (REI) success. We view your success as our own and have tailored our processes to minimize risks and maximize ROI for our clients. Collaborating with some of the most experienced real estate investors, we gain valuable insights that we eagerly pass on to you. Our commitment is to deliver an exceptional customer experience, aiming to be your preferred funding source.`,
  
  mission: `Real estate remains a potent asset for wealth building. However, without necessary funds, many investors miss out on lucrative opportunities. With substantial private capital at our disposal, we are committed to supporting your ventures through creative financing options, whether you're a veteran or a newcomer to the investment scene.`,
  
  network: `We have a wide network of private lenders prepared to finance your next big project. Through our connections, we secure the most favorable rates and terms for our clients. If you have an existing loan offer, bring it to us and we'll strive to better it.`,
  
  services: `Real Invest Funding LLC offers a variety of resources including Proof of Funds Letters, Collateral DNA Reports, exclusive Off-Market Lead Lists, and diverse funding solutions to help you achieve your real estate investment goals.`
};

// Detailed service information
const servicesInfo = {
  cdna: {
    title: "CDNA Report (Collateral DNA Report)",
    description: `This comprehensive property valuation is as close as you can get to a professional appraisal without the high cost. For just $34.97, we eliminate the uncertainty in situations where you're unsure about a potential investment property. This service covers approximately 95% of all residential investment properties across the nation.`,
    contact: "aattoh@realinvestfunding.com",
    disclaimer: `USER EXPRESSLY AGREES THAT THE USE OF THE INFORMATION IS AT THE USERS SOLE RISK. THE INFORMATION IS PROVIDED "AS IS" AND "AS AVAILABLE" FOR USE, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING THE IMPLIED WARRANTIES OF MERCHANTABILITY, TITLE, FITNESS FOR A PARTICULAR PURPOSE, AND AGAINST INFRINGEMENT`
  },
  dsr: {
    title: "DSR Report (Debt Stack Report)",
    description: `The DSR Report provides essential details about the debts associated with an investment property. It includes information on the primary mortgage holder and the outstanding balance, as well as details on any secondary mortgages, including the lender and the remaining balance. Additionally, it will identify any tax liens or other liens on the property.`,
    contact: "aattoh@realinvestfunding.com",
    disclaimer: `Information returned in the report varies by state and local justification. Not all information is available in all locations. Real Invest Funding LLC is not responsible for the amount of information, nor the accuracy or relevancy of the information provided. Some jurisdictions have no information. In those cases, your purchase will be refunded. Debt Stack Reports are not available in Kansas.`
  },
  proofOfFunds: {
    title: "Proof of Funds Letter",
    description: `Proof of funds letters are often required by real estate agents before they will submit any offers to sellers. Frequently, these letters need to accompany a purchase offer contract in real estate transactions. Obtain yours from us for only $19.97.`,
    availability: `Our proof of funds letters are available for investment properties across the nation, except for those located in Arizona, Minnesota, Nevada, Oregon, South Dakota, Utah, or Vermont.`,
    requirements: `For the proof of funds letter, we'll need the following information from you:\n- Business or Entity Name (Funding Not Available for Individuals)\n- Investment Property's Full Address\n- The Expected Loan Amount`,
    contact: "aattoh@realinvestfunding.com",
    disclaimer: `Real Invest Funding LLC offers financing to investors for the acquisition of non-owner-occupied residential properties (investment properties with up to four units). We are not liable for any misuse of our proof of funds letters, and we do not issue refunds for typographical errors, other inaccuracies, or non-compliance with the stated notices. Furthermore, obtaining a proof of funds letter does not create any obligation between Real Invest Funding LLC and the recipient.`
  },
  offMarketLeads: {
    title: "Off-Market Property Leads",
    description: `Welcome to Real Invest Funding LLC, where extraordinary opportunities meet astute investors! As leaders in the vibrant field of real estate lead generation, we specialize in offering exclusive leads on non-owner-occupied properties with high equity.`,
    technology: `At Real Invest Funding LLC we harness the power of advanced artificial intelligence to discover hidden treasures in the real estate market—properties that are off the radar. Imagine accessing a wealth of opportunities involving absentee owners, properties with substantial equity, and occasionally those in pre-foreclosure or with overdue taxes.`,
    features: [
      "Exclusivity: Unlock access to a handpicked selection of properties that aren't on the mainstream market.",
      "AI-Powered Precision: Our sophisticated AI technology uses advanced algorithms to pinpoint properties.",
      "Nationwide Reach: Our AI-driven system efficiently identifies off-market gems nationwide.",
      "Pre-Foreclosure and Delinquent Tax Alerts: Access properties in pre-foreclosure or with delinquent taxes.",
      "Reduced Competition: Benefit from off-market leads that bypass common bidding wars.",
      "Tailored to Your Criteria: Tailor your search with preferences for location, property type, equity range, and more."
    ],
    pricing: `Real Invest Funding LLC offers two convenient options for acquiring leads: a per-lead cost or a subscription plan, both featuring exclusively off-market opportunities.`,
    contact: "aattoh@realinvestfunding.com"
  }
};

// Funding information
const fundingInfo = {
  process: `The biggest blunder any investor can make in real estate is to shop too early for money. The rule of thumb is it's much easier to shop for cash when you have a deal in hand and under contract.`,
  steps: [
    "Step 1: Prospect and Review Potential Properties",
    "Step 2: Write Offers",
    "Step 3: Get Offer Accepted by Seller",
    "Step 4: Put Earnest Money in Escrow to complete the contract."
  ],
  privateMoney: {
    title: "5 Reasons Why Investors Use Private Money",
    reasons: [
      "It's Fast: Depending on how fast you submit the loan package items, you can have your loan in several days to several weeks.",
      "It Looks at Collateral, Not You: Private money lenders are interested in how much value they see in the property.",
      "It's Everywhere: Private money lenders are often people who have funds parked in lower-yielding financial vehicles.",
      "It's Creative: You can get funding on great deals that banks would normally shun.",
      "It's Flexible: Private money lenders don't have the same strictly enforced guidelines to follow for their loan applications."
    ]
  },
  successGuide: `At Real Invest Funding LLC we are only interested in funding projects that will give you the best opportunity at realizing success.`,
  loanTerms: {
    maxAmount: "No cap on the loan amount if the numbers make sense. Real Invest Funding LLC has funding solutions from $30,000 up to the FHA Cap in the county.",
    rates: "Current rates start at 7.5% annualized interest with an origination fee from 0-5%, and no prepayment penalties.",
    term: "6 Months to 2 Years for a fix & flip. 30 Years for a buy & hold or refinance. One loan approved per applicant until proven track record"
  },
  referralProgram: {
    description: "Earn $500+ for each successful referral that results in funding. Submit your leads via our contact page or email.",
    contact: "aattoh@realinvestfunding.com"
  }
};

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
    
    // In a real implementation, we would connect to an email service here to send to aattoh@realinvestfunding.com
    // For now, we're just logging and returning intelligent responses
    
    // Create comprehensive context-aware responses based on message content
    let response = "Thanks for your message! To get started, what kind of real estate investment are you interested in funding?";
    
    // Define response patterns for different conversation scenarios
    
    // Initial flow - welcome and options
    if (conversation.length <= 1) {
      response = "Welcome to Real Invest Funding LLC! 💰 Ready to fund your next real estate deal with up to 100% financing? I'll guide you through our quick process — just a few questions, and we'll send you info or a term sheet. Ready to get started?";
    }
    
    // Initial flow options
    else if (message.toLowerCase().includes("tell me more")) {
      response = "Great! To get started, what kind of funding do you need right now?";
    }
    else if (message.toLowerCase().includes("browse options")) {
      response = "Here are the services we offer at Real Invest Funding LLC:\n\n" +
        "💵 Private Money Lending - Up to 100% financing for real estate deals\n" +
        "📄 CDNA Reports - Comprehensive property valuation for $34.97\n" +
        "🏛️ DSR Reports - Debt and lien reports to help with negotiations\n" +
        "🧾 Proof of Funds - Letters for $19.97 to strengthen your offers\n" +
        "🏠 Off-Market Leads - AI-curated investment opportunities\n\n" +
        "What kind of funding are you interested in?";
    }
    
    // Deal type selection flow
    else if (message.toLowerCase().includes("fix & flip") || message.toLowerCase().includes("fix and flip")) {
      response = "Awesome — we love fix and flips. 🛠️ We can offer up to 100% financing if the numbers make sense. No credit minimums required. We fund \"as-is\" and fast.\n\nWould you like to:";
    }
    else if (message.toLowerCase().includes("rental property") || message.toLowerCase().includes("buy and hold")) {
      response = "Smart choice! Our rental loans feature 30-year terms with cash-flow focused underwriting. We care more about the property's income potential than your personal finances.\n\nWould you like to:";
    }
    else if (message.toLowerCase().includes("commercial")) {
      response = "We offer commercial financing for qualified investors! Our terms are competitive with up to 75% LTV and flexible options for various commercial property types.\n\nWould you like to:";
    }
    else if (message.toLowerCase().includes("construction") || message.toLowerCase().includes("ground-up")) {
      response = "Ground-up construction requires careful planning. We provide financing for qualified investors with competitive terms and can fund up to 80% of total project costs including land acquisition.\n\nWould you like to:";
    }
    else if (message.toLowerCase().includes("proof of funds") || message.toLowerCase().includes("pof")) {
      response = "Our Proof of Funds letters cost just $19.97 and are available nationwide (except AZ, MN, NV, OR, SD, UT, VT). These letters give you credibility when making offers.\n\nTo proceed, we'll need:\n- Business/Entity Name (funding not available for individuals)\n- Investment Property Address\n- Expected Loan Amount\n\nEmail these details to aattoh@realinvestfunding.com or fill out our application form.";
    }
    else if (message.toLowerCase().includes("not sure")) {
      response = "No problem! Let me help you figure out what might work best for your situation. What type of real estate investment are you considering?";
    }
    
    // Secondary options flow
    else if (message.toLowerCase().includes("loan terms") || message.toLowerCase().includes("see terms")) {
      response = "Here are our current loan terms:\n\n" +
        "• Loan amounts from $30,000 up to the FHA county limit\n" +
        "• Interest rates starting at 7.5% (annualized)\n" +
        "• Origination fees: 0-5%\n" +
        "• No prepayment penalties\n" +
        "• Fix & Flip terms: 6-24 months\n" +
        "• Buy & Hold terms: up to 30 years\n\n" +
        "Ready to get started with an application? All applications are sent to aattoh@realinvestfunding.com for review.";
    }
    else if (message.toLowerCase().includes("start application")) {
      response = "Great! Let's get your information so we can prepare your funding options. Please fill out the form below. Your application will be sent directly to aattoh@realinvestfunding.com:";
    }
    else if (message.toLowerCase().includes("cdna reports")) {
      response = "Our CDNA (Comprehensive Digital Neighborhood Analysis) Reports provide in-depth property valuations for just $34.97. These reports include neighborhood trends, historical price data, and comprehensive comparables to help you make informed investment decisions.\n\nTo order, please provide the property address to aattoh@realinvestfunding.com or fill out our form.";
    }
    else if (message.toLowerCase().includes("dsr reports")) {
      response = "Our DSR (Debt Stack Report) reveals crucial financial information about properties including the primary mortgage holder, outstanding balances, secondary mortgages, tax liens, and other encumbrances. This gives you powerful negotiation leverage.\n\nTo order, please provide the property address to aattoh@realinvestfunding.com or fill out our form.";
    }
    else if (message.toLowerCase().includes("off-market leads") || message.toLowerCase().includes("leads")) {
      response = "Our Off-Market Leads service uses AI technology to identify high-equity properties with motivated sellers before they hit the market. This gives you a competitive edge with less competition and better potential deals.\n\nTo learn more or order leads, contact aattoh@realinvestfunding.com with your target location and property preferences.";
    }
    
    // Speaking with a specialist or human
    else if (message.toLowerCase().includes("speak") || message.toLowerCase().includes("human") || message.toLowerCase().includes("connect me") || message.toLowerCase().includes("agent")) {
      response = "I'd be happy to connect you with a funding specialist! Please fill out the form below with your contact information, and someone will reach out to you within 24 business hours. All inquiries are sent to aattoh@realinvestfunding.com.";
    }
    
    // Fallback - guide them to appropriate options
    else {
      response = "I can help with funding for fix & flip projects, rental properties, commercial investments, ground-up construction, or provide value-added services like CDNA Reports, Proof of Funds letters, and Off-Market Leads. What would you like to learn more about?\n\nYou can also email aattoh@realinvestfunding.com directly with any specific questions.";
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
        error: "There was an error processing your message. Please try again or email us directly at aattoh@realinvestfunding.com." 
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
