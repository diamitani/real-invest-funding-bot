
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, Key, PieChart, Search } from "lucide-react";
import { useState } from "react";

interface ValueAddMenuProps {
  onSelect: (option: string) => void;
}

const ValueAddMenu = ({ onSelect }: ValueAddMenuProps) => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const options = [
    {
      id: "CDNA",
      title: "CDNA Reports",
      price: "$34.97",
      description: "Property valuation reports",
      icon: <PieChart className="h-5 w-5 text-realinvest-gold" />,
      details: "CDNA (Comprehensive Digital Neighborhood Analysis) Reports provide in-depth valuation data for any property in the US. These reports go beyond basic comps to include neighborhood trends, historical price performance, and future value projections to help you make data-driven investment decisions."
    },
    {
      id: "ProofOfFunds",
      title: "Proof of Funds",
      price: "$19.97",
      description: "Nationwide availability*",
      icon: <Key className="h-5 w-5 text-realinvest-gold" />,
      details: "Our Proof of Funds letters give you immediate credibility with sellers and agents. Available nationwide for just $19.97, these letters verify your financial capability to close deals, allowing you to make offers with confidence and gain a competitive edge in negotiations."
    },
    {
      id: "Leads",
      title: "Off-Market Leads",
      price: "Varies",
      description: "AI-scanned high-equity deals",
      icon: <Search className="h-5 w-5 text-realinvest-gold" />,
      details: "Our proprietary AI technology scans thousands of properties daily to identify high-equity, motivated seller opportunities before they hit the market. These off-market leads give you first access to deals with less competition, allowing you to secure properties at better prices with higher potential returns."
    },
    {
      id: "DSR",
      title: "Debt Stack Reports",
      price: "Varies",
      description: "Tax liens + second mortgages",
      icon: <FileText className="h-5 w-5 text-realinvest-gold" />,
      details: "Debt Stack Reports reveal hidden financial encumbrances on properties, including tax liens, second mortgages, and other claims that may not appear in standard title searches. This intelligence gives you powerful negotiation leverage and helps you avoid deals with complicated title issues."
    },
  ];

  return (
    <Card className="w-full border border-realinvest-navy/20 mb-4">
      <CardHeader className="bg-realinvest-navy rounded-t-lg">
        <CardTitle className="text-center text-white">Value-Add Services</CardTitle>
        <CardDescription className="text-white/90 text-center font-medium">
          Want help making better offers?
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        {options.map((option) => (
          <div key={option.id} className="flex flex-col">
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center text-left border-2 border-realinvest-navy/20 hover:border-realinvest-gold hover:bg-realinvest-gold/10"
              onClick={() => expandedItem === option.id ? setExpandedItem(null) : setExpandedItem(option.id)}
            >
              <div className="flex items-center mb-1">
                {option.icon}
                <span className="ml-2 font-bold">{option.title}</span>
              </div>
              <div className="text-sm text-muted-foreground">{option.description}</div>
              <div className="text-sm font-semibold">{option.price}</div>
            </Button>
            
            {expandedItem === option.id && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-b-lg mt-1 mb-4">
                <p className="text-sm text-gray-700 mb-3">{option.details}</p>
                <Button 
                  onClick={() => onSelect(option.id)}
                  className="w-full bg-realinvest-navy text-white hover:bg-realinvest-navy/80"
                >
                  Select This Service
                </Button>
              </div>
            )}
          </div>
        ))}
        
        <Button
          variant="outline"
          className="h-24 flex flex-col items-center justify-center text-left border-2 border-realinvest-navy/20 hover:border-realinvest-navy hover:bg-realinvest-navy/10 md:col-span-2"
          onClick={() => onSelect("None")}
        >
          <BookOpen className="h-5 w-5 text-realinvest-navy mb-1" />
          <span className="font-bold">I'm Good For Now</span>
          <span className="text-sm text-muted-foreground">Continue without additional services</span>
        </Button>
      </CardContent>
    </Card>
  );
};

export default ValueAddMenu;
