import { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Loader2, Heart } from "lucide-react";

interface PaymentFormProps {
  onSuccess: () => void;
  amountDisplay: string;
}

export const PaymentForm = ({ onSuccess, amountDisplay }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/donation-success`,
      },
      redirect: "if_required", // Evita redirecionar se o pagamento for imediato
    });

    if (error) {
      setErrorMessage(error.message || "Ocorreu um erro inesperado.");
      setIsProcessing(false);
    } else {
      // Sucesso sem redirecionamento
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement options={{ layout: "tabs" }} />
      
      {errorMessage && (
        <div className="p-3 rounded-[10px] bg-destructive/10 text-destructive text-sm font-body">
          {errorMessage}
        </div>
      )}

      <Button
        type="submit"
        variant="hero"
        size="lg"
        className="w-full gap-2"
        disabled={isProcessing || !stripe || !elements}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Processando...
          </>
        ) : (
          <>
            Confirmar Doação {amountDisplay} <Heart className="w-4 h-4" />
          </>
        )}
      </Button>
    </form>
  );
};
