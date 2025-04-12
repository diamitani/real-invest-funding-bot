import { useState } from "react";
import ChatContainer from "@/components/ChatContainer";
import { Button } from "@/components/ui/button";
import { ArrowDown, Banknote, Home, Building, Construction, FileCheck, HelpCircle, CheckCircle, ArrowRight } from "lucide-react";
import LeadCaptureForm from "@/components/LeadCaptureForm";

const Index = () => {
  const [showChat, setShowChat] = useState(false);
  const [showLearnMore, setShowLearnMore] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-realinvest-navy text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-realinvest-navy to-realinvest-navy/80 z-0"></div>
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="text-realinvest-gold">100% Financing</span> for Your Real Estate Investments
              </h1>
              <p className="text-xl mb-8">
                Fast funding, flexible terms, and personalized service for fix & flips, rentals, and commercial properties.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  onClick={() => setShowChat(true)}
                  className="bg-realinvest-gold hover:bg-realinvest-lightGold text-realinvest-navy font-bold px-8 py-6 text-lg"
                >
                  Chat With Us Now
                </Button>
                <Button 
                  onClick={() => {
                    const element = document.getElementById('funding-options');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-realinvest-navy px-8 py-6 text-lg font-bold"
                >
                  Explore Options <ArrowDown className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white p-6 rounded-lg shadow-xl">
                <LeadCaptureForm onSubmit={(data) => console.log(data)} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Funding Options Section */}
      <section id="funding-options" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-realinvest-navy mb-12">
            Funding Options for <span className="text-realinvest-gold">Every Strategy</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Banknote className="h-12 w-12 text-realinvest-gold" />,
                title: "Fix & Flip Loans",
                description: "Up to 100% financing for purchase and rehab. Fast closings in as little as 7 days.",
                features: ["No minimum credit score", "Interest rates from 9.9%", "Up to 24-month terms", "As-is valuation"],
                moreInfo: "Our Fix & Flip loans are designed for investors looking to purchase, renovate, and sell properties quickly. We offer flexible terms with up to 100% financing on both the purchase price and renovation costs. With no minimum credit score requirements and interest rates starting at 9.9%, we make it easy for investors to maximize their returns. Our streamlined process allows for closings in as little as 7 days, giving you a competitive edge in fast-moving markets."
              },
              {
                icon: <Home className="h-12 w-12 text-realinvest-gold" />,
                title: "Rental Property Loans",
                description: "Long-term financing for buy-and-hold investors looking to build passive income.",
                features: ["30-year terms available", "Cash-flow focused underwriting", "Portfolio loans", "Cash-out refinance"],
                moreInfo: "Our Rental Property Loans are perfect for buy-and-hold investors focusing on building long-term wealth through passive income. We offer 30-year terms with cash-flow focused underwriting that prioritizes the property's income potential over traditional qualification metrics. Our portfolio loans allow you to finance multiple properties under one loan, simplifying your investment strategy. We also provide cash-out refinance options, allowing you to tap into your equity to expand your portfolio or make improvements to existing properties."
              },
              {
                icon: <Building className="h-12 w-12 text-realinvest-gold" />,
                title: "Commercial Financing",
                description: "Funding solutions for multi-unit, mixed-use, and commercial real estate projects.",
                features: ["Up to 75% LTV", "Flexible terms", "Value-add projects", "Bridge to permanent"],
                moreInfo: "Our Commercial Financing solutions cater to investors focused on multi-unit, mixed-use, and commercial real estate projects. With up to 75% LTV financing available, we help you maximize your investment potential while maintaining manageable leverage. We specialize in value-add projects where your expertise can increase property value and returns. Our bridge-to-permanent financing options provide short-term capital for acquisitions and improvements, with the ability to convert to long-term financing once the property is stabilized, saving you time and refinancing costs."
              }
            ].map((option, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-8 transform transition-all hover:scale-105">
                <div className="flex justify-center mb-6">
                  {option.icon}
                </div>
                <h3 className="text-2xl font-bold text-center text-realinvest-navy mb-4">{option.title}</h3>
                <p className="text-gray-600 mb-6 text-center">{option.description}</p>
                <ul className="space-y-2">
                  {option.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 text-center">
                  {showLearnMore === option.title ? (
                    <div>
                      <p className="text-gray-700 text-left mb-4">{option.moreInfo}</p>
                      <Button 
                        onClick={() => setShowLearnMore(null)}
                        className="bg-realinvest-navy hover:bg-opacity-80 text-white"
                      >
                        Show Less
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Button 
                        onClick={() => setShowLearnMore(option.title)}
                        className="bg-realinvest-navy hover:bg-opacity-80 text-white w-full"
                      >
                        Learn More <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      <Button 
                        onClick={() => setShowChat(true)}
                        className="border border-realinvest-navy text-realinvest-navy hover:bg-realinvest-navy hover:text-white w-full"
                        variant="outline"
                      >
                        Get Started <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Add Services */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-realinvest-navy mb-4">
            Premium Investment <span className="text-realinvest-gold">Tools</span>
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Exclusive services to help you make better investment decisions and stay ahead of the competition.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "CDNA Reports",
                price: "$34.97",
                description: "Comprehensive property valuation reports to find the true value of any property.",
                icon: <FileCheck className="h-10 w-10 text-realinvest-navy" />
              },
              {
                title: "Proof of Funds",
                price: "$19.97",
                description: "Nationwide proof of funds letters to strengthen your offers.",
                icon: <FileCheck className="h-10 w-10 text-realinvest-navy" />
              },
              {
                title: "Debt Stack Reports",
                price: "Varies",
                description: "See tax liens and second mortgages to negotiate better deals.",
                icon: <FileCheck className="h-10 w-10 text-realinvest-navy" />
              },
              {
                title: "Off-Market Leads",
                price: "Custom",
                description: "AI-scanned, high-equity, low-competition property deals.",
                icon: <FileCheck className="h-10 w-10 text-realinvest-navy" />
              }
            ].map((service, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 flex flex-col">
                <div className="mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-realinvest-navy mb-2">{service.title}</h3>
                <div className="text-realinvest-gold font-bold text-lg mb-3">{service.price}</div>
                <p className="text-gray-600 mb-6 flex-grow">{service.description}</p>
                <Button 
                  onClick={() => setShowChat(true)}
                  variant="outline" 
                  className="border-realinvest-navy text-realinvest-navy hover:bg-realinvest-navy hover:text-white w-full"
                >
                  Learn More
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-realinvest-navy text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to <span className="text-realinvest-gold">Fund Your Next Deal?</span>
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Our team is standing by to help you get the financing you need. Get started now and receive your term sheet within 24 hours.
          </p>
          <Button 
            onClick={() => setShowChat(true)}
            className="bg-realinvest-gold hover:bg-realinvest-lightGold text-realinvest-navy font-bold px-8 py-6 text-lg"
          >
            Get Funded Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-realinvest-darkGray text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Real Invest Funding</h3>
              <p className="text-gray-300">
                Providing real estate investors with the capital they need to succeed.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Funding Options</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#funding-options" className="hover:text-realinvest-gold transition-colors">Fix & Flip</a></li>
                <li><a href="#funding-options" className="hover:text-realinvest-gold transition-colors">Rental Properties</a></li>
                <li><a href="#funding-options" className="hover:text-realinvest-gold transition-colors">Commercial</a></li>
                <li><a href="#funding-options" className="hover:text-realinvest-gold transition-colors">Ground-Up Construction</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" onClick={() => setShowChat(true)} className="hover:text-realinvest-gold transition-colors">CDNA Reports</a></li>
                <li><a href="#" onClick={() => setShowChat(true)} className="hover:text-realinvest-gold transition-colors">Proof of Funds</a></li>
                <li><a href="#" onClick={() => setShowChat(true)} className="hover:text-realinvest-gold transition-colors">Debt Stack Reports</a></li>
                <li><a href="#" onClick={() => setShowChat(true)} className="hover:text-realinvest-gold transition-colors">Off-Market Leads</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <p className="text-gray-300">
                Email: <a href="mailto:aattoh@realinvestfunding.com" className="hover:text-realinvest-gold transition-colors">aattoh@realinvestfunding.com</a>
              </p>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Real Invest Funding LLC. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Floating Chat Button */}
      {!showChat && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button 
            onClick={() => setShowChat(true)}
            className="bg-realinvest-gold hover:bg-realinvest-lightGold text-realinvest-navy rounded-full h-16 w-16 flex items-center justify-center shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </Button>
        </div>
      )}

      {/* Chat Container */}
      {showChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-[80vh] flex flex-col relative">
            <button 
              onClick={() => setShowChat(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex-1 overflow-hidden">
              <ChatContainer />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
