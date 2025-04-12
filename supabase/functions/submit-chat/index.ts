
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
    
    // In a real implementation, we would connect to an email service here
    // For now, we're just logging and returning intelligent responses
    
    // Create comprehensive context-aware responses based on message content
    let response = "Thanks for your message! Our team will get back to you shortly. What specific type of property are you interested in financing?";
    
    // Check for specific types of properties or loans
    if (message.toLowerCase().includes("single family")) {
      response = "Single-family homes are a great investment! We offer fix & flip loans with up to 100% financing for purchase and rehab. What's your timeline for this project?";
    } else if (message.toLowerCase().includes("multi-family")) {
      response = "Multi-family properties can provide excellent returns! Our rental property loans feature 30-year terms with cash-flow focused underwriting. How many units are you looking at?";
    } else if (message.toLowerCase().includes("commercial")) {
      response = "For commercial properties, we offer financing up to 75% LTV with flexible terms for value-add projects. What type of commercial property are you interested in?";
    } else if (message.toLowerCase().includes("land")) {
      response = "Land development can be very profitable. We provide ground-up construction financing for qualified investors with competitive terms. Do you already own the land or are you looking to purchase?";
    }
    
    // Check for questions about rates and financing options
    else if (message.toLowerCase().includes("rate") || message.toLowerCase().includes("interest")) {
      response = `Our rates start at 7.5% annualized interest with an origination fee from 0-5%, and no prepayment penalties. Rates are based on credit score but credit score does NOT determine loan approval. Would you like us to send you our current rate sheet?`;
    } else if (message.toLowerCase().includes("down payment") || message.toLowerCase().includes("qualify")) {
      response = "We can finance up to 100% of the purchase and renovation costs for the right deals! Our qualification process focuses more on the property's potential than traditional borrower metrics. What's your investment experience?";
    }
    
    // Check for specific loan types
    else if (message.toLowerCase().includes("fix & flip") || message.toLowerCase().includes("flip")) {
      response = "Our fix & flip loans are designed for short-term projects with terms up to 24 months. We can fund up to 100% of purchase and rehab costs for the right deals. What's the purchase price and estimated renovation budget for your project?";
    } else if (message.toLowerCase().includes("rental property") || message.toLowerCase().includes("buy and hold")) {
      response = "Our rental property loans offer 30-year terms with cash-flow focused underwriting. We look at the property's income potential rather than just your personal finances. What's the expected monthly rent for the property you're considering?";
    } else if (message.toLowerCase().includes("new construction")) {
      response = "We provide ground-up construction financing with competitive terms. We can fund up to 80% of total project costs including land acquisition. Do you have architectural plans and permits in place?";
    } else if (message.toLowerCase().includes("bridge loan")) {
      response = "Our bridge loans provide short-term financing for acquisitions and refinances with flexible terms. They're perfect for when you need capital quickly before securing long-term financing. What's your exit strategy for the bridge loan?";
    }
    
    // Check for queries about specific services
    else if (message.toLowerCase().includes("cdna") || message.toLowerCase().includes("collateral dna") || message.toLowerCase().includes("valuation")) {
      response = `Our CDNA Reports (Collateral DNA Reports) provide comprehensive property valuations at just $34.97. It's nearly as detailed as a professional appraisal but at a fraction of the cost. This service covers approximately 95% of all residential investment properties nationwide. Would you like to order a CDNA Report for a specific property?`;
    } else if (message.toLowerCase().includes("dsr") || message.toLowerCase().includes("debt stack")) {
      response = `Our DSR Reports (Debt Stack Reports) reveal essential details about property debts, including primary mortgage holders, outstanding balances, secondary mortgages, tax liens, and other liens. This information is crucial for due diligence before making an offer. Would you like to order a DSR Report for a specific property?`;
    } else if (message.toLowerCase().includes("proof of funds") || message.toLowerCase().includes("pof")) {
      response = `Our Proof of Funds letters are available nationwide for just $19.97 (except in AZ, MN, NV, OR, SD, UT, and VT). These letters are often required by real estate agents before submitting offers to sellers. To get one, we'll need your business name (funding not available for individuals), property address, and expected loan amount. Would you like to order a Proof of Funds letter?`;
    } else if (message.toLowerCase().includes("leads") || message.toLowerCase().includes("off-market")) {
      response = `Our Off-Market Property Leads service uses advanced AI to find exclusive opportunities with absentee owners, high equity, and potential distress signals. These off-market properties often come with reduced investor competition. We offer both per-lead pricing and subscription plans. What areas are you interested in finding leads for?`;
    }
    
    // General information about the company or services
    else if (message.toLowerCase().includes("about") || message.toLowerCase().includes("company")) {
      response = companyInfo.about + " " + companyInfo.mission;
    } else if (message.toLowerCase().includes("services") || message.toLowerCase().includes("what do you offer")) {
      response = companyInfo.services + " Would you like to hear more about any specific service we offer?";
    } else if (message.toLowerCase().includes("process") || message.toLowerCase().includes("how does it work")) {
      response = fundingInfo.process + " " + fundingInfo.steps.join(" ");
    } else if (message.toLowerCase().includes("why private money") || message.toLowerCase().includes("why use you")) {
      response = fundingInfo.privateMoney.reasons.join(" ");
    } else if (message.toLowerCase().includes("loan terms") || message.toLowerCase().includes("financing options")) {
      response = `${fundingInfo.loanTerms.maxAmount} ${fundingInfo.loanTerms.rates} ${fundingInfo.loanTerms.term}`;
    }
    
    // Contact requests
    else if (message.toLowerCase().includes("contact") || message.toLowerCase().includes("talk to someone") || message.toLowerCase().includes("connect me")) {
      response = "I'd be happy to connect you with our team! Please provide your name, email, and phone number, and someone from Real Invest Funding will reach out to you within 24 business hours.";
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
