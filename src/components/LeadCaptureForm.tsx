
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LeadFormData {
  fullName: string;
  propertyAddress: string;
  loanAmount: string;
  email: string;
  phone: string;
  dealType?: string;
}

interface LeadCaptureFormProps {
  onSubmit: (data: LeadFormData) => void;
  dealType?: string;
}

const LeadCaptureForm = ({ onSubmit, dealType }: LeadCaptureFormProps) => {
  const [formData, setFormData] = useState<LeadFormData>({
    fullName: "",
    propertyAddress: "",
    loanAmount: "",
    email: "",
    phone: "",
    dealType: dealType || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Submit to Supabase edge function
      const { data, error } = await supabase.functions.invoke("submit-lead", {
        body: formData,
      });
      
      if (error) throw new Error(error.message);
      
      // Show success state
      setIsSuccess(true);
      toast({
        title: "Application Submitted!",
        description: "We'll reach out within 24 business hours with your term sheet or details.",
        duration: 5000,
      });
      
      // Pass the data to the parent component
      onSubmit(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Submission Error",
        description: "There was a problem submitting your application. Please try again.",
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

  return (
    <Card className="w-full border border-realinvest-navy/20 mb-4 shadow-lg">
      <CardHeader className="bg-realinvest-navy text-white rounded-t-lg">
        <CardTitle className="text-center text-xl">Get Your Funding Started</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-6">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h3 className="text-xl font-bold text-center">Application Received!</h3>
            <p className="text-center mt-2 text-gray-600">
              We've received your info and will reach out within 24 business hours with your term sheet or details.
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
                "Submit Application"
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default LeadCaptureForm;
