
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  options: string[];
  onSelect: (option: string) => void;
  disabled?: boolean;
}

const ActionButtons = ({ options, onSelect, disabled = false }: ActionButtonsProps) => {
  return (
    <div className="flex flex-wrap gap-2 mt-2 mb-4">
      {options.map((option) => (
        <Button
          key={option}
          onClick={() => onSelect(option)}
          variant="outline"
          className="bg-white border-realinvest-navy text-realinvest-navy hover:bg-realinvest-gold hover:text-realinvest-navy hover:border-realinvest-gold transition-colors"
          disabled={disabled}
        >
          {option}
        </Button>
      ))}
    </div>
  );
};

export default ActionButtons;
