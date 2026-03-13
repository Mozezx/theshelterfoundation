import { ArrowRight, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const DonationCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 mb-8">
          <XCircle className="w-10 h-10 text-destructive" />
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
          Doação cancelada
        </h1>
        <p className="font-body text-lg text-muted-foreground mb-8 leading-relaxed">
          A sua doação foi cancelada. Se mudou de ideia, pode voltar
          e tentar novamente a qualquer momento.
        </p>
        <Button
          variant="hero"
          size="lg"
          className="gap-2"
          onClick={() => navigate("/")}
        >
          Voltar ao início <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default DonationCancel;
