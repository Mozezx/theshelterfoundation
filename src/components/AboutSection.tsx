import teamImg from "@/assets/team-photo.jpg";
import ScrollReveal from "@/components/ScrollReveal";

const AboutSection = () => (
  <section id="about" className="py-24 md:py-32 bg-background/90">
    <div className="container mx-auto px-6">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <ScrollReveal direction="left">
          <div className="relative group">
            <div className="absolute -left-3 -top-3 w-full h-full bg-[#00522D] -z-10 transition-transform duration-500 group-hover:-translate-x-1 group-hover:-translate-y-1" />
            <img
              src={teamImg}
              alt="Equipe SHELTER reunida"
              className="w-full aspect-[4/3] object-cover shadow-[0_4px_20px_-2px_rgba(0,0,0,0.3)]"
            />
          </div>
        </ScrollReveal>
        <div>
          <ScrollReveal direction="right">
            <span className="font-body text-sm uppercase tracking-[0.3em] text-primary font-semibold">
              Sobre Nós
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-4 mb-6 leading-tight">
              Pessoas movidas<br />por propósito
            </h2>
            <div className="section-divider mb-8" />
          </ScrollReveal>
          <ScrollReveal direction="right" delay={150}>
            <p className="font-body text-lg text-muted-foreground leading-relaxed mb-6">
              Somos uma equipe multicultural de profissionais apaixonados por impacto social, 
              unidos pela crença de que a tecnologia e a transparência podem transformar a forma 
              como o mundo apoia comunidades vulneráveis.
            </p>
          </ScrollReveal>
          <ScrollReveal direction="right" delay={300}>
            <p className="font-body text-muted-foreground leading-relaxed mb-6">
              Com experiência em desenvolvimento social, tecnologia, finanças e comunicação, 
              nossa equipe atua entre Europa e América Latina para construir pontes reais 
              entre quem quer ajudar e quem precisa de apoio.
            </p>
          </ScrollReveal>
          <ScrollReveal direction="right" delay={450}>
            <p className="font-body text-muted-foreground leading-relaxed">
              Acreditamos que cada projeto social merece visibilidade, e cada doador merece 
              saber exatamente como sua contribuição está gerando impacto.
            </p>
          </ScrollReveal>
        </div>
      </div>
    </div>
  </section>
);

export default AboutSection;
