
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, Key, PieChart, Search } from "lucide-react";

interface ValueAddMenuProps {
  onSelect: (option: string) => void;
}

const ValueAddMenu = ({ onSelect }: ValueAddMenuProps) => {
  const options = [
    {
      id: "CDNA",
      title: "CDNA Reports",
      price: "$34.97",
      description: "Property valuation reports",
      icon: <PieChart className="h-5 w-5 text-realinvest-gold" />,
    },
    {
      id: "ProofOfFunds",
      title: "Proof of Funds",
      price: "$19.97",
      description: "Nationwide availability*",
      icon: <Key className="h-5 w-5 text-realinvest-gold" />,
    },
    {
      id: "Leads",
      title: "Off-Market Leads",
      price: "Varies",
      description: "AI-scanned high-equity deals",
      icon: <Search className="h-5 w-5 text-realinvest-gold" />,
    },
    {
      id: "DSR",
      title: "Debt Stack Reports",
      price: "Varies",
      description: "Tax liens + second mortgages",
      icon: <FileText className="h-5 w-5 text-realinvest-gold" />,
    },
  ];

  return (
    <Card className="w-full border border-realinvest-navy/20 mb-4">
      <CardHeader className="bg-realinvest-navy text-white rounded-t-lg">
        <CardTitle className="text-center">Value-Add Services</CardTitle>
        <CardDescription className="text-white/80 text-center">
          Want help making better offers?
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        {options.map((option) => (
          <Button
            key={option.id}
            variant="outline"
            className="h-24 flex flex-col items-center justify-center text-left border-2 border-realinvest-navy/20 hover:border-realinvest-gold hover:bg-realinvest-gold/10"
            onClick={() => onSelect(option.id)}
          >
            <div className="flex items-center mb-1">
              {option.icon}
              <span className="ml-2 font-bold">{option.title}</span>
            </div>
            <div className="text-sm text-muted-foreground">{option.description}</div>
            <div className="text-sm font-semibold">{option.price}</div>
          </Button>
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
