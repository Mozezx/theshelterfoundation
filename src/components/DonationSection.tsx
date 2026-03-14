import { useState, useEffect } from "react";
import { ArrowRight, Heart, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import donationBg from "@/assets/WEB-06.png";
import donationBgMobile from "@/assets/cut.png";
import ScrollReveal from "@/components/ScrollReveal";
import { detectCurrency, toStripeAmount, type CurrencyInfo } from "@/lib/currency";
import { getStripe } from "@/lib/stripe";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { API_BASE_URL } from "@/lib/api";

const frequencies = ["Uma vez", "Mensal", "Trimestral", "Anual"];
const defaultAmounts = [200, 100, 50, 25, 10];

const DonationSection = () => {
  const [frequency, setFrequency] = useState("Uma vez");
  const [selectedAmount, setSelectedAmount] = useState(200);
  const [customAmount, setCustomAmount] = useState("");
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [currencyInfo, setCurrencyInfo] = useState<CurrencyInfo>({
    code: "eur",
    symbol: "€",
    country: "unknown",
  });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    note: "",
  });

  const { toast } = useToast();

  useEffect(() => {
    detectCurrency().then(setCurrencyInfo);
  }, []);

  const activeAmount = customAmount ? null : selectedAmount;
  const donationValue = customAmount ? Number(customAmount) : selectedAmount;

  const handleAmountClick = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setCustomAmount(val);
  };

  const handleInitPayment = async () => {
    if (donationValue <= 0) {
      toast({ title: "Valor inválido", variant: "destructive" });
      return;
    }
    if (!formData.email) {
      toast({ title: "Email obrigatório", variant: "destructive" });
      return;
    }

    setIsLoading(true);

    try {
      const stripeAmount = toStripeAmount(donationValue, currencyInfo.code);
      const endpoint = "/api/create-donation-session";

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: stripeAmount,
          currency: currencyInfo.code,
          frequency,
          donorInfo: formData,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setClientSecret(data.clientSecret);
      setStep(3);
    } catch (error) {
      toast({
        title: "Erro ao iniciar pagamento",
        description: error instanceof Error ? error.message : "Tente novamente",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const stripePromise = getStripe();

  return (
    <section id="donate" className="relative min-h-[600px] md:min-h-[700px] flex items-center">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[-1]">
        <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat bg-fixed hidden md:block" style={{ backgroundImage: `url(${donationBg})` }} />
        <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat bg-fixed md:hidden" style={{ backgroundImage: `url(${donationBgMobile})` }} />
      </div>
      <div className="absolute inset-0 bg-foreground/60" />

      <div className="relative z-10 container mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <ScrollReveal direction="left">
            <span className="font-body text-sm uppercase tracking-[0.3em] text-primary-foreground/80 font-semibold mb-4 block">Faça a diferença</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground leading-tight mb-6">Agora, mais do que nunca, o seu apoio é importante.</h2>
          </ScrollReveal>
          <ScrollReveal direction="left" delay={150}>
            <p className="font-body text-primary-foreground/80 text-lg leading-relaxed mb-8 max-w-lg">Sua doação ajuda a transformar vidas ao redor do mundo. Doe para onde for mais necessário.</p>
          </ScrollReveal>
          <ScrollReveal direction="left" delay={300}>
            <Button variant="hero" size="lg" className="gap-2">Saber mais <ArrowRight className="w-4 h-4" /></Button>
          </ScrollReveal>
        </div>

          <div className="bg-background rounded-[10px] shadow-xl max-w-md ml-auto w-full min-h-[500px]">
            <div className="bg-primary px-6 py-4 flex items-center justify-between rounded-t-[10px]">
              <h3 className="font-body text-primary-foreground font-semibold text-lg">
                {step === 1 ? "Escolha a quantia" : step === 2 ? "Informações" : step === 3 ? "Pagamento" : "Concluído"}
              </h3>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-primary-foreground/70" />
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map(s => (
                    <span key={s} className={`w-2 h-2 rounded-full ${step === s ? "bg-primary-foreground" : "bg-primary-foreground/40"}`} />
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6">
              {step === 1 && (
                <div className="space-y-6">
                  <div className="flex gap-2 flex-wrap">
                    {frequencies.map((f) => (
                      <button key={f} onClick={() => setFrequency(f)} className={`px-4 py-2 text-sm font-body font-semibold rounded-[10px] border transition-colors ${frequency === f ? "bg-primary text-primary-foreground border-primary" : "bg-background text-foreground border-border hover:border-primary"}`}>{f}</button>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {defaultAmounts.map((amount) => (
                      <button key={amount} onClick={() => handleAmountClick(amount)} className={`py-3 text-center font-body font-semibold text-lg rounded-[10px] border-2 transition-colors ${activeAmount === amount ? "border-primary text-primary bg-primary/5" : "border-border text-foreground hover:border-primary/50"}`}>{currencyInfo.symbol}{amount}</button>
                    ))}
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-body font-semibold">{currencyInfo.symbol}</span>
                    <input type="text" placeholder="Valor personalizado" value={customAmount} onChange={handleCustomChange} className="w-full pl-10 pr-4 py-3 border-2 border-border rounded-[10px] font-body text-foreground focus:outline-none focus:border-primary bg-background" />
                  </div>
                  <Button variant="hero" size="lg" className="w-full gap-2" onClick={() => donationValue > 0 && setStep(2)}>Próximo <ArrowRight className="w-4 h-4" /></Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="bg-card rounded-[10px] p-4 text-center">
                    <p className="font-body text-sm text-muted-foreground">Doação {frequency.toLowerCase()}</p>
                    <p className="font-display text-3xl font-bold text-primary">{currencyInfo.symbol}{donationValue}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="Primeiro Nome" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="px-4 py-3 border border-border rounded-[10px] font-body bg-background" />
                    <input type="text" placeholder="Último Nome" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="px-4 py-3 border border-border rounded-[10px] font-body bg-background" />
                  </div>
                  <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 border border-border rounded-[10px] font-body bg-background" />
                  <input type="tel" placeholder="Telefone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 border border-border rounded-[10px] font-body bg-background" />
                  <textarea placeholder="Nota (opcional)" value={formData.note} onChange={(e) => setFormData({ ...formData, note: e.target.value })} className="w-full px-4 py-2 border border-border rounded-[10px] font-body bg-background h-20 resize-none" />
                  <div className="flex gap-3 pt-2">
                    <Button variant="outline" size="lg" className="flex-1" onClick={() => setStep(1)} disabled={isLoading}>Voltar</Button>
                    <Button variant="hero" size="lg" className="flex-1 gap-2" onClick={handleInitPayment} disabled={isLoading}>
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Continuar"}
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && clientSecret && (
                <div className="min-h-[400px]">
                  <EmbeddedCheckoutProvider
                    stripe={stripePromise}
                    options={{ clientSecret }}
                  >
                    <EmbeddedCheckout />
                  </EmbeddedCheckoutProvider>
                  <Button variant="ghost" size="sm" className="w-full mt-4 text-muted-foreground" onClick={() => setStep(2)}>Voltar para dados</Button>
                </div>
              )}

              {step === 4 && (
                <div className="text-center py-10 space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
                    <CheckCircle className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="font-display text-2xl font-bold text-foreground">Obrigado!</h4>
                  <p className="font-body text-muted-foreground">Sua doação de {currencyInfo.symbol}{donationValue} foi processada com sucesso. Você receberá um recibo por email em instantes.</p>
                  <Button variant="hero" className="w-full" onClick={() => { setStep(1); setCustomAmount(""); setFormData({firstName: "", lastName: "", email: "", phone: "", note: ""}); }}>Fazer nova doação</Button>
                </div>
              )}
            </div>
          </div>
      </div>
    </section>
  );
};

export default DonationSection;
