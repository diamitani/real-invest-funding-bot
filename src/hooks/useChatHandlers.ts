
import { supabase } from '@/integrations/supabase/client';
import { Message, ChatFormData } from '@/types/chat';

interface ChatStateProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isTyping: boolean;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  showLeadForm: boolean;
  setShowLeadForm: React.Dispatch<React.SetStateAction<boolean>>;
  buttonOptions: string[];
  setButtonOptions: React.Dispatch<React.SetStateAction<string[]>>;
  showValueAddMenu: boolean;
  setShowValueAddMenu: React.Dispatch<React.SetStateAction<boolean>>;
  selectedValueAddService: string | null;
  setSelectedValueAddService: React.Dispatch<React.SetStateAction<string | null>>;
}

export const useChatHandlers = ({
  messages,
  setMessages,
  setIsTyping,
  showLeadForm,
  setShowLeadForm,
  buttonOptions,
  setButtonOptions,
  showValueAddMenu,
  setShowValueAddMenu,
  setSelectedValueAddService,
}: ChatStateProps) => {

  const handleSendMessage = async (message: string) => {
    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: Date.now(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    try {
      // Send message to the submit-chat edge function
      const { data, error } = await supabase.functions.invoke('submit-chat', {
        body: { 
          message, 
          conversation: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }
      });
      
      if (error) throw error;
      
      // Handle specific conversation paths based on user input
      setTimeout(() => {
        let botResponse = data.response;
        let newButtons: string[] = [];
        
        // Initial flow options
        if (message === "Yes, Tell Me More") {
          botResponse = "Great! To get started, what kind of funding do you need right now?";
          newButtons = ["Fix & Flip", "Rental Property", "Commercial", "Ground-Up Construction", "Proof of Funds", "I'm Not Sure Yet"];
        }
        else if (message === "Browse Options") {
          botResponse = "Here are the services we offer at Real Invest Funding LLC:\n\n" +
            "💵 Private Money Lending - Up to 100% financing for real estate deals\n" +
            "📄 CDNA Reports - Comprehensive property valuation for $34.97\n" +
            "🏛️ DSR Reports - Debt and lien reports to help with negotiations\n" +
            "🧾 Proof of Funds - Letters for $19.97 to strengthen your offers\n" +
            "🏠 Off-Market Leads - AI-curated investment opportunities\n\n" +
            "What kind of funding are you interested in?";
          newButtons = ["Fix & Flip", "Rental Property", "Commercial", "Ground-Up Construction", "Proof of Funds", "Other Services"];
        }

        // Deal type selection flow
        else if (message === "Fix & Flip") {
          botResponse = "Awesome — we love fix and flips. 🛠️ We can offer up to 100% financing if the numbers make sense. No credit minimums required. We fund \"as-is\" and fast.\n\nWould you like to:";
          newButtons = ["See Loan Terms", "Start Application", "Learn About CDNA Reports"];
        }
        else if (message === "Rental Property") {
          botResponse = "Smart choice! Our rental loans feature 30-year terms with cash-flow focused underwriting. We care more about the property's income potential than your personal finances.\n\nWould you like to:";
          newButtons = ["See Loan Terms", "Start Application", "Learn About DSR Reports"];
        }
        else if (message === "Commercial") {
          botResponse = "We offer commercial financing for qualified investors! Our terms are competitive with up to 75% LTV and flexible options for various commercial property types.\n\nWould you like to:";
          newButtons = ["See Loan Terms", "Start Application", "Speak With a Specialist"];
        }
        else if (message === "Ground-Up Construction") {
          botResponse = "Ground-up construction requires careful planning. We provide financing for qualified investors with competitive terms and can fund up to 80% of total project costs including land acquisition.\n\nWould you like to:";
          newButtons = ["See Loan Terms", "Start Application", "Learn More"];
        }
        else if (message === "Proof of Funds") {
          botResponse = "Our Proof of Funds letters cost just $19.97 and are available nationwide (except AZ, MN, NV, OR, SD, UT, VT). These letters give you credibility when making offers.\n\nTo proceed, we'll need:\n- Business/Entity Name (funding not available for individuals)\n- Investment Property Address\n- Expected Loan Amount\n\nAll requests will be sent to aattoh@realinvestfunding.com for processing.";
          newButtons = ["Start Application", "Learn More", "See Other Services"];
          setSelectedValueAddService("ProofOfFunds");
        }
        else if (message === "I'm Not Sure Yet") {
          botResponse = "No problem! Let me help you figure out what might work best for your situation. What type of real estate investment are you considering?";
          newButtons = ["Buying to Renovate", "Buying to Rent", "Commercial Property", "Raw Land", "Just Exploring"];
        }

        // Secondary options flow
        else if (message === "See Loan Terms") {
          botResponse = "Here are our current loan terms:\n\n" +
            "• Loan amounts from $30,000 up to the FHA county limit\n" +
            "• Interest rates starting at 7.5% (annualized)\n" +
            "• Origination fees: 0-5%\n" +
            "• No prepayment penalties\n" +
            "• Fix & Flip terms: 6-24 months\n" +
            "• Buy & Hold terms: up to 30 years\n\n" +
            "Ready to get started with an application? All applications are sent to aattoh@realinvestfunding.com for processing.";
          newButtons = ["Start Application", "Ask a Question", "Not Right Now"];
        }
        else if (message === "Start Application" || message === "Learn About CDNA Reports" || message === "Learn About DSR Reports") {
          botResponse = "Great! Let's get your information so we can prepare your funding options. Please fill out the form below. Your application will be sent to aattoh@realinvestfunding.com:";
          newButtons = [];
          
          // Select appropriate service based on previous selection
          if (message === "Learn About CDNA Reports") {
            setSelectedValueAddService("CDNA");
          } else if (message === "Learn About DSR Reports") {
            setSelectedValueAddService("DSR");
          }
          
          // Show lead form
          setShowLeadForm(true);
        }
        else if (message === "Learn More" || message === "See Other Services" || message === "Other Services") {
          botResponse = "We offer several value-added services to help real estate investors make better decisions:\n\n" +
            "• CDNA Reports ($34.97): Comprehensive property valuations\n" +
            "• DSR Reports: Details on property debts and liens\n" +
            "• Proof of Funds ($19.97): Letters to strengthen your offers\n" +
            "• Off-Market Leads: AI-curated investment opportunities\n\n" +
            "Which service would you like to learn more about? All inquiries are handled by aattoh@realinvestfunding.com.";
          newButtons = ["CDNA Reports", "DSR Reports", "Proof of Funds", "Off-Market Leads", "Back to Funding"];
        }
        else if (message === "Speak With a Specialist" || message === "connect me" || message.toLowerCase().includes("speak") || message.toLowerCase().includes("human") || message.toLowerCase().includes("agent")) {
          botResponse = "I'd be happy to connect you with a funding specialist! Please fill out the form below, and someone will reach out to you within 24 business hours. Your information will be sent to aattoh@realinvestfunding.com.";
          newButtons = [];
          setShowLeadForm(true);
        }

        // Value-add services flow
        else if (message === "CDNA Reports") {
          botResponse = "Our CDNA (Comprehensive Digital Neighborhood Analysis) Reports provide in-depth property valuations for just $34.97. These reports include neighborhood trends, historical price data, and comprehensive comparables to help you make informed investment decisions.\n\nWould you like to order a CDNA Report? Orders are processed by aattoh@realinvestfunding.com.";
          newButtons = ["Yes, Order CDNA", "No Thanks"];
          setSelectedValueAddService("CDNA");
        }
        else if (message === "DSR Reports") {
          botResponse = "Our DSR (Debt Stack Report) reveals crucial financial information about properties including the primary mortgage holder, outstanding balances, secondary mortgages, tax liens, and other encumbrances. This gives you powerful negotiation leverage.\n\nWould you like to order a DSR Report? Orders are processed by aattoh@realinvestfunding.com.";
          newButtons = ["Yes, Order DSR", "No Thanks"];
          setSelectedValueAddService("DSR");
        }
        else if (message === "Off-Market Leads") {
          botResponse = "Our Off-Market Leads service uses AI technology to identify high-equity properties with motivated sellers before they hit the market. This gives you a competitive edge with less competition and better potential deals.\n\nWould you like to learn more about our leads service? Inquiries are handled by aattoh@realinvestfunding.com.";
          newButtons = ["Yes, Get Leads Info", "No Thanks"];
          setSelectedValueAddService("Leads");
        }
        else if (message === "Yes, Order CDNA" || message === "Yes, Order DSR" || message === "Yes, Get Leads Info") {
          botResponse = "Great choice! To proceed with your order, please fill out the form below. Your order will be sent to aattoh@realinvestfunding.com:";
          newButtons = [];
          setShowLeadForm(true);
        }
        else if (message === "No Thanks") {
          botResponse = "No problem! Is there something else I can help you with regarding real estate investment funding?";
          newButtons = ["Fix & Flip", "Rental Property", "Commercial", "Ground-Up Construction", "Proof of Funds", "Other Services"];
        }

        // Add assistant response
        const botResponseMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: botResponse,
          timestamp: Date.now(),
        };
        
        setMessages(prev => [...prev, botResponseMsg]);
        setIsTyping(false);
        
        // Update button options
        if (newButtons.length > 0) {
          setButtonOptions(newButtons);
        }
        
        // Show value-add menu after lead form is submitted
        if (!showValueAddMenu && !showLeadForm && messages.length > 5 && !message.toLowerCase().includes("no thanks")) {
          setTimeout(() => {
            setShowValueAddMenu(true);
          }, 1500);
        }
      }, 1000);
      
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Add error message
      setTimeout(() => {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "I'm having trouble connecting right now. Please try again or email us directly at aattoh@realinvestfunding.com",
          timestamp: Date.now(),
        };
        
        setMessages(prev => [...prev, errorMessage]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const handleFormSubmit = async (formData: ChatFormData) => {
    setIsTyping(true);
    
    try {
      const { error } = await supabase.functions.invoke('submit-lead', {
        body: { ...formData }
      });
      
      if (error) throw error;
      
      // Add success message
      setTimeout(() => {
        let thankYouMessage: Message;
        
        if (formData.serviceRequested) {
          // Service-specific thank you message
          switch(formData.serviceRequested) {
            case "CDNA":
              thankYouMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `Thanks ${formData.fullName}! We've received your CDNA Report request for ${formData.propertyAddress || "your property"}. Our team will reach out to you at ${formData.email} within 24 business hours with payment instructions and next steps. Your request has been forwarded to aattoh@realinvestfunding.com.`,
                timestamp: Date.now(),
              };
              break;
            case "DSR":
              thankYouMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `Thanks ${formData.fullName}! We've received your DSR Report request for ${formData.propertyAddress || "your property"}. Our team will reach out to you at ${formData.email} within 24 business hours with payment instructions and next steps. Your request has been forwarded to aattoh@realinvestfunding.com.`,
                timestamp: Date.now(),
              };
              break;
            case "ProofOfFunds":
              thankYouMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `Thanks ${formData.fullName}! We've received your Proof of Funds request for ${formData.businessName || "your business"} regarding ${formData.propertyAddress || "your property"} with an expected loan amount of ${formData.loanAmount || "$0"}. Our team will reach out to you at ${formData.email} within 24 business hours with payment instructions and next steps. Your request has been forwarded to aattoh@realinvestfunding.com.`,
                timestamp: Date.now(),
              };
              break;
            case "Leads":
              thankYouMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `Thanks ${formData.fullName}! We've received your Off-Market Leads request for ${formData.targetLocation || "your target location"}. Our team will reach out to you at ${formData.email} within 24 business hours to discuss available lead options in your area. Your request has been forwarded to aattoh@realinvestfunding.com.`,
                timestamp: Date.now(),
              };
              break;
            default:
              thankYouMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `Thanks ${formData.fullName}! Our team will reach out to you shortly about your request for ${formData.serviceRequested}. Your information has been sent to aattoh@realinvestfunding.com.`,
                timestamp: Date.now(),
              };
          }
        } else {
          // Standard funding thank you message
          thankYouMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `Thanks ${formData.fullName}! Our team will reach out to you shortly about your ${formData.loanAmount || ""} loan request for ${formData.propertyAddress || "your property"}. Your application has been sent to aattoh@realinvestfunding.com. Would you like to learn about our value-added services that can help strengthen your real estate deals?`,
            timestamp: Date.now(),
          };
        }
        
        setMessages(prev => [...prev, thankYouMessage]);
        setIsTyping(false);
        setShowLeadForm(false);
        
        // Show value add menu after form submission
        setTimeout(() => {
          const referralMessage: Message = {
            id: (Date.now() + 2).toString(),
            role: 'assistant',
            content: "✅ We've received your info and will reach out within 24 business hours with your term sheet or details. Keep an eye on your inbox!\n\nWant to refer a friend and earn a bonus? 💸 Just let us know and we can tell you about our referral program! Contact aattoh@realinvestfunding.com with referral details.",
            timestamp: Date.now() + 100,
          };
          
          setMessages(prev => [...prev, referralMessage]);
          
          // Only show value add menu if it's not a value-add service already
          if (!formData.serviceRequested) {
            setTimeout(() => {
              setShowValueAddMenu(true);
            }, 1500);
          } else {
            // For value-add services, suggest other options
            setTimeout(() => {
              setButtonOptions(["Learn About Other Services", "Refer a Friend", "I'm All Set"]);
            }, 500);
          }
        }, 2000);
      }, 1000);
      
    } catch (error) {
      console.error("Error submitting form:", error);
      
      // Add error message
      setTimeout(() => {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "I'm having trouble submitting your information. Please try again or email us directly at aattoh@realinvestfunding.com",
          timestamp: Date.now(),
        };
        
        setMessages(prev => [...prev, errorMessage]);
        setIsTyping(false);
      }, 1000);
    }
  };

  // New handlers needed by ChatMessagesArea
  const handleButtonSelect = (option: string) => {
    handleSendMessage(option);
    setButtonOptions([]);
  };

  const handleLeadFormSubmit = (formData: ChatFormData) => {
    handleFormSubmit(formData);
  };

  const handleValueAddSelection = (service: string) => {
    setSelectedValueAddService(service);
    setShowValueAddMenu(false);
    // Add a message about the selected service
    const serviceMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: `I'm interested in ${service}`,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, serviceMessage]);
    
    // Respond to the service selection
    setIsTyping(true);
    setTimeout(() => {
      let responseContent = "";
      
      switch(service) {
        case "CDNA":
          responseContent = "Great choice! Our CDNA Reports provide comprehensive property valuation data at just $34.97. This detailed analysis is nearly as thorough as a professional appraisal but at a fraction of the cost. Please provide your property address and contact information so our team can follow up with details on accessing this service.";
          break;
        case "ProofOfFunds":
          responseContent = "Excellent! Our Proof of Funds letters cost only $19.97 and will give you the credibility you need when making offers. To proceed, we need your business/entity name, the investment property's full address, and the expected loan amount. Please provide this information so we can prepare your letter.";
          break;
        case "Leads":
          responseContent = "Smart decision! Our AI-scanned off-market leads service helps you find high-equity deals with absentee owners and properties showing distress signals. To customize your leads list, please share your target location, property type preferences, and budget range so we can prepare the most relevant opportunities for you.";
          break;
        case "DSR":
          responseContent = "Perfect! Our Debt Stack Reports reveal essential financial information including primary mortgages, secondary liens, and tax obligations that can give you powerful negotiation leverage. To generate your report, we need the property address and your contact details. Please provide this information to proceed.";
          break;
        case "Loan Options":
          responseContent = "We offer competitive funding options for your real estate investments! To provide you with a personalized term sheet, we need some details about your project. Please complete the form that will appear shortly with your contact information and property details.";
          setTimeout(() => {
            setShowLeadForm(true);
          }, 1500);
          break;
        case "None":
          responseContent = "Thanks for chatting with us! Is there anything else we can help you with regarding real estate investment funding? Remember, we offer Fix & Flip loans, Rental Property loans, New Construction financing, and Bridge loans.";
          // Show loan options buttons
          setTimeout(() => {
            setButtonOptions(['Fix & Flip', 'Rental Property', 'New Construction', 'Bridge Loan']);
          }, 500);
          break;
        default:
          responseContent = "Thanks for your interest. Our team will be in touch shortly to discuss how we can help with your investment needs. Please provide your contact information in the form below so we can reach out with more details.";
          setTimeout(() => {
            setShowLeadForm(true);
          }, 1500);
      }
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: Date.now(),
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  return {
    handleSendMessage,
    handleFormSubmit,
    handleButtonSelect,
    handleLeadFormSubmit,
    handleValueAddSelection
  };
};
