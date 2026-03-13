const express = require("express");
const cors = require("cors");
const path = require("path");

// Load .env from the project root
require("dotenv").config({ path: path.resolve(__dirname, "../.env"), override: true });

const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.SERVER_PORT || 3001;

app.use(cors());
app.use(express.json());

// Map frequency labels to Stripe recurring intervals
const FREQUENCY_MAP = {
  "Mensal": { interval: "month", interval_count: 1 },
  "Trimestral": { interval: "month", interval_count: 3 },
  "Anual": { interval: "year", interval_count: 1 },
};

// Endpoint Unificado para Doações usando Checkout Sessions (Necessário para Adaptive Pricing)
app.post("/api/create-donation-session", async (req, res) => {
  try {
    const { amount, currency, frequency, donorInfo } = req.body;
    const isRecurring = frequency && frequency !== "Uma vez" && FREQUENCY_MAP[frequency];

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Valor de doação inválido" });
    }

    // Criar uma Checkout Session em modo embedded
    const sessionParams = {
      ui_mode: "embedded",
      mode: isRecurring ? "subscription" : "payment",
      customer_email: donorInfo?.email,
      line_items: [{
        price_data: {
          currency: currency || "eur",
          product_data: { 
            name: `Doação SHELTER - ${frequency || "Uma vez"}`,
            description: `Doador: ${donorInfo?.firstName} ${donorInfo?.lastName}`,
          },
          unit_amount: amount,
          ...(isRecurring && { recurring: FREQUENCY_MAP[frequency] })
        },
        quantity: 1,
      }],
      payment_method_types: ["card"], // Você pode adicionar mais métodos aqui
      return_url: `${req.headers.origin}/donation-success?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        donor_first_name: donorInfo?.firstName || "",
        donor_last_name: donorInfo?.lastName || "",
        donor_phone: donorInfo?.phone || "",
        donor_note: donorInfo?.note || "",
        frequency: frequency || "Uma vez",
      },
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    res.json({ 
      clientSecret: session.client_secret,
      sessionId: session.id 
    });
  } catch (error) {
    console.error("Erro ao criar sessão de doação:", error);
    res.status(500).json({ error: error.message });
  }
});

// Mantemos os endpoints antigos por um momento para evitar quebra imediata se houver cache,
// mas o frontend deve ser atualizado para usar o novo endpoint acima.
app.post("/api/create-payment-intent", async (req, res) => {
  // Redireciona internamente para manter compatibilidade temporária se necessário
  // mas idealmente deletaremos isso após atualizar o frontend.
  res.status(410).json({ error: "Este endpoint foi descontinuado em favor do Adaptive Pricing. Use /api/create-donation-session" });
});

app.post("/api/create-subscription", async (req, res) => {
  res.status(410).json({ error: "Este endpoint foi descontinuado em favor do Adaptive Pricing. Use /api/create-donation-session" });
});

// Mantemos o endpoint antigo de Checkout Session por retrocompatibilidade se necessário
app.post("/api/create-checkout-session", async (req, res) => {
  // ... (código anterior mantido ou removido se quiser limpar totalmente)
  try {
    const { amount, currency, frequency, donorInfo } = req.body;
    const isRecurring = frequency && frequency !== "Uma vez" && FREQUENCY_MAP[frequency];

    const sessionParams = {
      payment_method_types: ["card"],
      mode: isRecurring ? "subscription" : "payment",
      success_url: `${req.headers.origin}/donation-success`,
      cancel_url: `${req.headers.origin}/donation-cancel`,
      line_items: [{
        price_data: {
          // Se o Adaptive Pricing estiver ativo no Dashboard, o Stripe Checkout Sessions
          // cuidará da conversão se não forçado para uma moeda específica.
          currency: currency || "eur",
          product_data: { name: "Doação SHELTER" },
          unit_amount: amount,
          ...(isRecurring && { recurring: FREQUENCY_MAP[frequency] })
        },
        quantity: 1,
      }],
    };
    const session = await stripe.checkout.sessions.create(sessionParams);
    res.json({ url: session.url });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

if (process.env.NODE_ENV === "production") {
  const distPath = path.resolve(__dirname, "../dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => res.sendFile(path.join(distPath, "index.html")));
}

app.listen(PORT, () => {
  console.log(`✅ SHELTER API server running on http://localhost:${PORT}`);
});
