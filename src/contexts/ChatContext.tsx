
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  text: string;
  isUser: boolean;
}

interface LeadFormData {
  fullName: string;
  propertyAddress: string;
  loanAmount: string;
  email: string;
  phone: string;
}

interface ChatContextType {
  messages: Message[];
  isTyping: boolean;
  currentStage: string;
  buttonOptions: string[];
  showLeadForm: boolean;
  showValueAddMenu: boolean;
  userDealType: string;
  isFormSubmitted: boolean;
  handleSendMessage: (message: string) => void;
  handleButtonSelect: (option: string) => void;
  handleLeadFormSubmit: (data: LeadFormData) => void;
  handleValueAddSelection: (option: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStage, setCurrentStage] = useState<string>("intro");
  const [isTyping, setIsTyping] = useState(false);
  const [buttonOptions, setButtonOptions] = useState<string[]>([]);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showValueAddMenu, setShowValueAddMenu] = useState(false);
  const [userDealType, setUserDealType] = useState<string>("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  
  const { toast } = useToast();

  // Initial welcome message
  useEffect(() => {
    const timer = setTimeout(() => {
      const welcomeMessage = 
        "Welcome to Real Invest Funding LLC! 💰 Ready to fund your next real estate deal with up to 100% financing? I'll guide you through our quick process — just a few questions, and we'll send you info or a term sheet. Ready to get started?";
      
      setMessages([{ text: welcomeMessage, isUser: false }]);
      setButtonOptions(["Yes, Tell Me More", "Browse Options"]);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const simulateBotTyping = (response: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { text: response, isUser: false }]);
      setIsTyping(false);
    }, 1000); // Simulating bot typing time
  };

  const handleSendMessage = (message: string) => {
    // Add user message to chat
    setMessages((prev) => [...prev, { text: message, isUser: true }]);
    
    // Check for special commands
    if (message.toLowerCase().includes("connect me")) {
      handleConnectToHuman();
      return;
    }
    
    // Process message based on current stage
    processUserMessage(message);
  };

  const handleButtonSelect = (option: string) => {
    // Add user's selection to chat as if they typed it
    setMessages((prev) => [...prev, { text: option, isUser: true }]);
    
    // Process the selected option
    processUserMessage(option);
  };

  const processUserMessage = (message: string) => {
    // Clear button options after selection
    setButtonOptions([]);
    
    switch (currentStage) {
      case "intro":
        handleIntroStage(message);
        break;
      case "dealType":
        handleDealTypeStage(message);
        break;
      case "options":
        handleOptionsStage(message);
        break;
      case "valueAdd":
        handleValueAddStage(message);
        break;
      default:
        // Default fallback
        const fallbackResponse = "I can help with funding, reports, proof of funds, leads, or referrals. Which would you like to learn more about?";
        simulateBotTyping(fallbackResponse);
        setButtonOptions(["Funding Options", "Reports & Services", "Talk to Human"]);
        setCurrentStage("intro");
    }
  };

  const handleIntroStage = (message: string) => {
    if (message.toLowerCase().includes("yes") || message.toLowerCase().includes("tell me more")) {
      const response = "What kind of funding do you need right now?";
      simulateBotTyping(response);
      setButtonOptions([
        "Fix & Flip", 
        "Rental Property", 
        "Commercial", 
        "Ground-Up Construction", 
        "Proof of Funds",
        "I'm Not Sure Yet"
      ]);
      setCurrentStage("dealType");
    } else if (message.toLowerCase().includes("browse")) {
      const response = "Here are the funding options we offer:\n\n" +
        "• Fix & Flip: Up to 100% financing, fast closing\n" +
        "• Rental Property: Long-term financing solutions\n" +
        "• Commercial: Flexible terms for commercial projects\n" +
        "• Ground-Up Construction: Funding for new builds\n" +
        "• Proof of Funds: Quick letters for making offers\n\n" +
        "Which one interests you most?";
      
      simulateBotTyping(response);
      setButtonOptions([
        "Fix & Flip", 
        "Rental Property", 
        "Commercial", 
        "Ground-Up Construction", 
        "Proof of Funds",
        "I'm Not Sure Yet"
      ]);
      setCurrentStage("dealType");
    } else {
      // Default response
      const response = "I can help with funding your real estate investments. Let's get started - what kind of property funding do you need?";
      simulateBotTyping(response);
      setButtonOptions([
        "Fix & Flip", 
        "Rental Property", 
        "Commercial", 
        "Ground-Up Construction", 
        "Proof of Funds"
      ]);
      setCurrentStage("dealType");
    }
  };

  const handleDealTypeStage = (message: string) => {
    // Store the user's deal type selection
    setUserDealType(message);
    
    let response = "";
    
    if (message.toLowerCase().includes("fix") || message.toLowerCase().includes("flip")) {
      response = "Awesome — we love fix and flips. 🛠️ We can offer up to 100% financing if the numbers make sense. No credit minimums required. We fund \"as-is\" and fast.";
    } else if (message.toLowerCase().includes("rental")) {
      response = "Great choice! 🏠 Our rental property loans offer competitive rates and flexible terms. We can fund properties in any condition and don't have minimum credit requirements.";
    } else if (message.toLowerCase().includes("commercial")) {
      response = "Perfect! 🏢 We specialize in commercial property funding with quick closings and competitive terms. Our commercial loans are asset-based, making approval easier.";
    } else if (message.toLowerCase().includes("construction")) {
      response = "Excellent! 🏗️ We offer ground-up construction loans with staged funding options. Our experienced team understands construction timelines and budget requirements.";
    } else if (message.toLowerCase().includes("proof of funds")) {
      response = "Certainly! 📄 For a Proof of Funds Letter ($19.97), we need: Business Name, Property Address, and Expected Loan Amount. Would you like to proceed with this request?";
    } else {
      response = "No problem! We offer various funding solutions for real estate investors. Let me help you determine the best option based on your needs.";
    }
    
    simulateBotTyping(response);
    
    setTimeout(() => {
      if (message.toLowerCase().includes("proof of funds")) {
        setButtonOptions(["Request Proof of Funds", "Explore Other Options"]);
      } else {
        setButtonOptions(["See Loan Terms", "Start Application", "Learn About CDNA Reports"]);
      }
      setCurrentStage("options");
    }, 1500);
  };

  const handleOptionsStage = (message: string) => {
    if (message.toLowerCase().includes("see loan terms")) {
      let loanTerms = "";
      
      if (userDealType.toLowerCase().includes("fix") || userDealType.toLowerCase().includes("flip")) {
        loanTerms = "📋 Fix & Flip Loan Terms:\n\n" +
          "• Up to 100% financing (purchase + rehab)\n" +
          "• 12-month terms\n" +
          "• No credit score minimums\n" +
          "• Asset-based approval\n" +
          "• Rates from 9.9%\n" +
          "• Closing in as little as 10 days\n\n" +
          "Ready to apply for funding?";
      } else if (userDealType.toLowerCase().includes("rental")) {
        loanTerms = "📋 Rental Property Loan Terms:\n\n" +
          "• Up to 80% LTV\n" +
          "• 30-year terms available\n" +
          "• No pre-payment penalties\n" +
          "• Non-recourse options\n" +
          "• Rates from 7.5%\n" +
          "• Portfolio loans available\n\n" +
          "Ready to apply for funding?";
      } else if (userDealType.toLowerCase().includes("commercial")) {
        loanTerms = "📋 Commercial Loan Terms:\n\n" +
          "• Up to 75% LTV\n" +
          "• 1-10 year terms\n" +
          "• Interest-only options\n" +
          "• Asset-based approval\n" +
          "• Rates from 8.9%\n" +
          "• Various property types accepted\n\n" +
          "Ready to apply for funding?";
      } else {
        loanTerms = "📋 Standard Loan Terms:\n\n" +
          "• Competitive financing options\n" +
          "• Flexible terms based on project\n" +
          "• Quick closing timeframes\n" +
          "• Asset-based lending\n" +
          "• Personalized rate quotes\n\n" +
          "Ready to apply for funding?";
      }
      
      simulateBotTyping(loanTerms);
      setButtonOptions(["Start Application", "Learn About CDNA Reports"]);
      
    } else if (message.toLowerCase().includes("start application")) {
      const response = "Let's get your funding started. Please complete the following form, and we'll send a term sheet or next steps within 24 hours!";
      simulateBotTyping(response);
      setShowLeadForm(true);
      setButtonOptions([]);
      
    } else if (message.toLowerCase().includes("learn about cdna")) {
      const response = "📊 CDNA Reports ($34.97) provide detailed property valuations to help you make better investment decisions.\n\n" +
        "These reports include:\n" +
        "• Comp-based valuation\n" +
        "• Potential ARV (After Repair Value)\n" +
        "• Local market trends\n" +
        "• Risk assessment metrics\n\n" +
        "Would you like to order a CDNA report or start your funding application?";
      
      simulateBotTyping(response);
      setButtonOptions(["Order CDNA Report", "Start Application"]);
      
    } else if (message.toLowerCase().includes("request proof")) {
      const response = "To issue a Proof of Funds Letter ($19.97), we need:\n\n" +
        "• Business Name\n" +
        "• Property Address\n" +
        "• Expected Loan Amount\n\n" +
        "Please provide this information in the application form.";
      
      simulateBotTyping(response);
      setTimeout(() => {
        setShowLeadForm(true);
        setButtonOptions([]);
      }, 1500);
      
    } else if (message.toLowerCase().includes("explore other")) {
      const response = "What other funding options would you like to explore?";
      simulateBotTyping(response);
      setButtonOptions([
        "Fix & Flip", 
        "Rental Property", 
        "Commercial", 
        "Ground-Up Construction"
      ]);
      setCurrentStage("dealType");
      
    } else if (message.toLowerCase().includes("order cdna")) {
      const response = "Great choice! To order a CDNA Report, please complete the form with your contact information and property details. We'll process your request within 24 hours.";
      simulateBotTyping(response);
      setTimeout(() => {
        setShowLeadForm(true);
        setButtonOptions([]);
      }, 1500);
      
    } else {
      // Default response
      const response = "Would you like to start your application now?";
      simulateBotTyping(response);
      setButtonOptions(["Start Application", "Explore Other Options"]);
    }
  };

  const handleLeadFormSubmit = (data: LeadFormData) => {
    setShowLeadForm(false);
    setIsFormSubmitted(true);
    
    console.log("Lead form submitted:", data);
    
    // Thank you message
    const thankYouMessage = "Thanks! ✅ We've received your information and will reach out within 24 business hours with your term sheet or details. Keep an eye on your inbox!";
    simulateBotTyping(thankYouMessage);
    
    // After a delay, show value add options
    setTimeout(() => {
      const valueAddMessage = "Want help making better offers? We also offer additional services that might interest you:";
      simulateBotTyping(valueAddMessage);
      
      setTimeout(() => {
        setShowValueAddMenu(true);
        setCurrentStage("valueAdd");
      }, 1000);
    }, 2000);
  };

  const handleValueAddStage = (option: string) => {
    setShowValueAddMenu(false);
    
    let response = "";
    
    if (option === "CDNA") {
      response = "Great choice! CDNA Reports help you make better investment decisions with accurate property valuations.\n\n" +
        "To order your CDNA Report ($34.97), simply email the property address to aattoh@realinvestfunding.com.";
    } else if (option === "ProofOfFunds") {
      response = "To issue a Proof of Funds Letter ($19.97), we need:\n\n" +
        "• Business Name\n" +
        "• Property Address\n" +
        "• Expected Loan Amount\n\n" +
        "Email this information to aattoh@realinvestfunding.com.\n\n" +
        "Note: Not available in AZ, MN, NV, OR, SD, UT, VT";
    } else if (option === "Leads") {
      response = "Our Off-Market Leads service provides AI-curated, high-equity property opportunities tailored to your criteria.\n\n" +
        "Email your location preferences and property criteria to aattoh@realinvestfunding.com for pricing options.";
    } else if (option === "DSR") {
      response = "Debt Stack Reports help you identify properties with tax liens and second mortgages - perfect for negotiating better deals.\n\n" +
        "To order your DSR, email the property address to aattoh@realinvestfunding.com.\n\n" +
        "Note: Not available in Kansas. Refunds provided if data is unavailable.";
    } else {
      response = "Thanks again! Want to refer a friend and earn a bonus? 💸 Our referral program offers $500+ for each successful deal. Just let your network know about us!";
    }
    
    simulateBotTyping(response);
    
    // Final message
    setTimeout(() => {
      const finalMessage = "Is there anything else I can help you with today?";
      simulateBotTyping(finalMessage);
      setButtonOptions(["Explore Funding Options", "Talk to a Human", "No, I'm All Set"]);
      setCurrentStage("intro");
    }, 3000);
  };

  const handleConnectToHuman = () => {
    const response = "Sure, I'll connect you with someone from our team. Please email us at aattoh@realinvestfunding.com or call our office directly. A representative will get back to you within 24 business hours.";
    simulateBotTyping(response);
    
    toast({
      title: "Contact Request Received",
      description: "We'll connect you with a team member soon.",
    });
  };

  const value = {
    messages,
    isTyping,
    currentStage,
    buttonOptions,
    showLeadForm,
    showValueAddMenu,
    userDealType,
    isFormSubmitted,
    handleSendMessage,
    handleButtonSelect,
    handleLeadFormSubmit,
    handleValueAddSelection: handleValueAddStage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
