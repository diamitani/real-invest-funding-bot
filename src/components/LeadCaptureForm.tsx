
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ChatFormData } from "@/types/chat";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";

interface LeadCaptureFormProps {
  onSubmit: (data: ChatFormData) => void;
  dealType?: string;
  serviceType?: string;
}

const LeadCaptureForm = ({ onSubmit, dealType, serviceType }: LeadCaptureFormProps) => {
  const [formData, setFormData] = useState<ChatFormData>({
    fullName: "",
    propertyAddress: "",
    loanAmount: "",
    email: "",
    phone: "",
    dealType: dealType || "",
    serviceRequested: serviceType || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getFormTitle = () => {
    if (serviceType === "CDNA") return "Request CDNA Report";
    if (serviceType === "DSR") return "Request Debt Stack Report";
    if (serviceType === "ProofOfFunds") return "Request Proof of Funds Letter";
    if (serviceType === "Leads") return "Request Off-Market Leads";
    return "Get Your Funding Started";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("submit-lead", {
        body: formData,
      });
      
      if (error) throw new Error(error.message);
      
      setIsSuccess(true);
      toast({
        title: "Application Submitted!",
        description: "We'll reach out within 24 business hours with more details.",
        duration: 5000,
      });
      
      onSubmit(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Submission Error",
        description: "There was a problem submitting your application. Please try again or email directly to aattoh@realinvestfunding.com.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.fullName.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.phone.trim() !== ""
    );
  };

  // Render specific fields based on service type
  const renderServiceSpecificFields = () => {
    switch (serviceType) {
      case "CDNA":
        return (
          <div>
            <Label htmlFor="propertyAddress">📍 Property Address (Required)</Label>
            <Input
              id="propertyAddress"
              name="propertyAddress"
              value={formData.propertyAddress}
              onChange={handleChange}
              required
              placeholder="Enter the property address for valuation"
            />
          </div>
        );
        
      case "DSR":
        return (
          <div>
            <Label htmlFor="propertyAddress">📍 Property Address (Required)</Label>
            <Input
              id="propertyAddress"
              name="propertyAddress"
              value={formData.propertyAddress}
              onChange={handleChange}
              required
              placeholder="Enter property address for debt stack analysis"
            />
          </div>
        );
        
      case "ProofOfFunds":
        return (
          <>
            <div>
              <Label htmlFor="businessName">🏢 Business or Entity Name (Required)</Label>
              <Input
                id="businessName"
                name="businessName"
                value={formData.businessName || ""}
                onChange={handleChange}
                required
                placeholder="Not available for individuals"
              />
            </div>
            <div>
              <Label htmlFor="propertyAddress">📍 Investment Property Address (Required)</Label>
              <Input
                id="propertyAddress"
                name="propertyAddress"
                value={formData.propertyAddress}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="loanAmount">💰 Expected Loan Amount (Required)</Label>
              <Input
                id="loanAmount"
                name="loanAmount"
                value={formData.loanAmount}
                onChange={handleChange}
                required
                placeholder="e.g., $250,000"
              />
            </div>
          </>
        );
        
      case "Leads":
        return (
          <>
            <div>
              <Label htmlFor="targetLocation">📍 Target Location</Label>
              <Input
                id="targetLocation"
                name="targetLocation"
                value={formData.targetLocation || ""}
                onChange={handleChange}
                placeholder="City, State or Zip Code"
              />
            </div>
            <div>
              <Label htmlFor="propertyType">🏠 Property Type Preference</Label>
              <Select 
                onValueChange={(value) => handleSelectChange("propertyType", value)}
                defaultValue={formData.propertyType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Single Family">Single Family</SelectItem>
                  <SelectItem value="Multi-Family">Multi-Family</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                  <SelectItem value="Land">Land</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="timeframe">⏱️ Investment Timeframe</Label>
              <Select 
                onValueChange={(value) => handleSelectChange("timeframe", value)}
                defaultValue={formData.timeframe}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Immediate">Ready to buy immediately</SelectItem>
                  <SelectItem value="1-3 Months">1-3 months</SelectItem>
                  <SelectItem value="3-6 Months">3-6 months</SelectItem>
                  <SelectItem value="6+ Months">6+ months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );
        
      default:
        return (
          <>
            <div>
              <Label htmlFor="propertyAddress">📍 Property Address (if available)</Label>
              <Input
                id="propertyAddress"
                name="propertyAddress"
                value={formData.propertyAddress}
                onChange={handleChange}
                placeholder="Optional"
              />
            </div>

            <div>
              <Label htmlFor="loanAmount">💰 Estimated Loan Amount</Label>
              <Input
                id="loanAmount"
                name="loanAmount"
                value={formData.loanAmount}
                onChange={handleChange}
                placeholder="e.g., $250,000"
              />
            </div>
            
            <div>
              <Label htmlFor="dealType">🏠 Deal Type</Label>
              <Select 
                onValueChange={(value) => handleSelectChange("dealType", value)}
                defaultValue={formData.dealType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select deal type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fix & Flip">Fix & Flip</SelectItem>
                  <SelectItem value="Rental Property">Rental Property</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                  <SelectItem value="New Construction">New Construction</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="investmentGoals">🎯 Investment Goals</Label>
              <Textarea
                id="investmentGoals"
                name="investmentGoals"
                value={formData.investmentGoals || ""}
                onChange={handleChange}
                placeholder="Brief description of your investment project"
                className="resize-none h-24"
              />
            </div>
          </>
        );
    }
  };

  return (
    <Card className="w-full border border-realinvest-navy/20 mb-4 shadow-lg">
      <CardHeader className="bg-realinvest-navy text-white rounded-t-lg">
        <CardTitle className="text-center text-xl">{getFormTitle()}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-6">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h3 className="text-xl font-bold text-center">Application Received!</h3>
            <p className="text-center mt-2 text-gray-600">
              We've received your info and will reach out within 24 business hours with more details. Your submission has been sent to aattoh@realinvestfunding.com.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="fullName">🧑 Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            {renderServiceSpecificFields()}

            <div>
              <Label htmlFor="email">📧 Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">📞 Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-realinvest-gold hover:bg-realinvest-lightGold text-realinvest-navy font-bold" 
              disabled={!isFormValid() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting
                </>
              ) : (
                `Submit Application (to aattoh@realinvestfunding.com)`
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default LeadCaptureForm;
