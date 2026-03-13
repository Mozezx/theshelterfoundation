import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const DonationSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-8">
          <CheckCircle className="w-10 h-10 text-primary" />
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
          Obrigado pela sua doação!
        </h1>
        <p className="font-body text-lg text-muted-foreground mb-8 leading-relaxed">
          A sua contribuição faz a diferença. Recebemos o seu pagamento com sucesso
          e enviaremos um comprovativo para o seu email.
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

export default DonationSuccess;
