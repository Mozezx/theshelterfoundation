import { useState, useEffect } from "react";
import { Heart, ShoppingBag, Play, MapPin, ArrowRight, Menu, X } from "lucide-react";
import shelterLogoFull from "@/assets/shelter-logo-full.png";
import { Button } from "@/components/ui/button";
import missionImg from "@/assets/WEB-10.png";
import marketplaceImg from "@/assets/marketplace.jpg";
import europeImg from "@/assets/europe-impact.jpg";
import communityImg from "@/assets/community-project.jpg";
import AboutSection from "@/components/AboutSection";
import DonationSection from "@/components/DonationSection";
import ScrollReveal from "@/components/ScrollReveal";
import web02 from "@/assets/WEB-02.png";
import web03 from "@/assets/WEB-03.png";
import web04 from "@/assets/WEB-04.png";
import web05 from "@/assets/WEB-05.png";
import web07 from "@/assets/WEB-07.png";
import web08 from "@/assets/WEB-08.png";
import web09 from "@/assets/WEB-09.png";
import web11 from "@/assets/WEB-11.png";
import web12 from "@/assets/WEB-12.png";
import web13 from "@/assets/WEB-13.png";

const backgroundImages = [
  web02,
  web03,
  web04,
  web05,
  web07,
  web08,
  web09,
  web11,
  web12,
  web13
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const SCROLL_ACTIVATION_OFFSET = 220;

  const toggleMenu = () => {
    if (open) {
      setClosing(true);
      setTimeout(() => {
        setOpen(false);
        setVisible(false);
        setClosing(false);
      }, 300);
    } else {
      setOpen(true);
      setVisible(true);
    }
  };

  const closeMenu = () => {
    if (open) {
      setClosing(true);
      setTimeout(() => {
        setOpen(false);
        setVisible(false);
        setClosing(false);
      }, 300);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      const isScrollingDown = currentY > lastScrollY;
      const pastActivationOffset = currentY > SCROLL_ACTIVATION_OFFSET;

      setHidden(isScrollingDown && pastActivationOffset);
      setScrolled(!isScrollingDown && pastActivationOffset);
      setLastScrollY(currentY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 overflow-hidden ${scrolled && !hidden ? "bg-primary backdrop-blur-md shadow-[0_8px_30px_0px_rgba(0,0,0,0.5)]" : "bg-gradient-to-b from-primary-foreground via-primary-foreground to-transparent"} ${hidden ? "-translate-y-full" : "translate-y-0"}`}>
      <div className={`absolute inset-0 pointer-events-none animate-nav-shimmer ${scrolled ? "bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent" : "bg-gradient-to-r from-transparent via-foreground/5 to-transparent"}`} />
      <div className="container mx-auto flex items-center justify-between px-4 py-2">
        <div className="flex items-center">
          <img src={shelterLogoFull} alt="SHELTER" className={`object-contain h-[35px] md:h-[40px] my-[3px] transition-all duration-300 ${scrolled ? "" : "invert"}`} />
        </div>
        <div className={`hidden md:flex items-center gap-8 font-body text-sm uppercase tracking-widest transition-colors duration-300 ${scrolled ? "text-primary-foreground" : "text-foreground"}`}>
          <a href="#mission" className={`transition-colors ${scrolled ? "hover:text-primary-foreground/70" : "hover:text-foreground/60"}`}>Missão</a>
          <a href="#features" className={`transition-colors ${scrolled ? "hover:text-primary-foreground/70" : "hover:text-foreground/60"}`}>Plataforma</a>
          <a href="#about" className={`transition-colors ${scrolled ? "hover:text-primary-foreground/70" : "hover:text-foreground/60"}`}>Sobre Nós</a>
          <a href="#regions" className={`transition-colors ${scrolled ? "hover:text-primary-foreground/70" : "hover:text-foreground/60"}`}>Regiões</a>
        </div>
        <Button variant="hero" size="sm" className={`hidden md:inline-flex transition-colors duration-300 ${scrolled ? "!bg-primary-foreground !text-primary hover:!bg-primary-foreground/90" : ""}`}>
          Apoiar Agora
        </Button>
        <button
          className={`md:hidden transition-colors duration-300 ${scrolled ? "text-primary-foreground" : "text-foreground"}`}
          onClick={toggleMenu}
          aria-label="Menu">
          {visible ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
      {visible &&
      <div className={`md:hidden backdrop-blur-md border-t px-6 py-6 flex flex-col gap-4 ${closing ? "animate-slide-up" : "animate-slide-down"} ${scrolled ? "bg-primary/95 border-primary-foreground/10" : "bg-primary-foreground/95 border-foreground/10"}`}>
          <a href="#mission" onClick={closeMenu} className={`font-body text-sm uppercase tracking-widest transition-colors ${scrolled ? "text-primary-foreground/80 hover:text-primary-foreground" : "text-foreground/80 hover:text-foreground"}`}>Missão</a>
          <a href="#features" onClick={closeMenu} className={`font-body text-sm uppercase tracking-widest transition-colors ${scrolled ? "text-primary-foreground/80 hover:text-primary-foreground" : "text-foreground/80 hover:text-foreground"}`}>Plataforma</a>
          <a href="#about" onClick={closeMenu} className={`font-body text-sm uppercase tracking-widest transition-colors ${scrolled ? "text-primary-foreground/80 hover:text-primary-foreground" : "text-foreground/80 hover:text-foreground"}`}>Sobre Nós</a>
          <a href="#regions" onClick={closeMenu} className={`font-body text-sm uppercase tracking-widest transition-colors ${scrolled ? "text-primary-foreground/80 hover:text-primary-foreground" : "text-foreground/80 hover:text-foreground"}`}>Regiões</a>
          <Button variant="hero" size="sm" className={`mt-2 w-full ${scrolled ? "" : "!bg-foreground !text-primary-foreground"}`} onClick={closeMenu}>
            Apoiar Agora
          </Button>
        </div>
      }
    </nav>);

};

const HeroSection = () => {
  const [hidden, setHidden] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
    const handleScroll = () => {
      setHidden(window.scrollY > 150);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
    };
  }, []);

  return (
    <section className="relative h-screen min-h-[700px]">
      <div className="fixed inset-0 w-full h-screen min-h-[700px] -z-10 bg-black">
        {backgroundImages.map((img, index) => (
          <img
            key={img}
            src={img}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-black/20" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center md:justify-end mt-[200px] md:mt-[350px]">
        <div className={`text-center md:text-right w-full md:w-auto bg-gradient-to-r from-transparent via-[#00522D]/85 to-[#00522D]/85 p-10 py-3.5 md:p-[15px] md:pr-16 lg:pr-24 transition-all duration-1000 ease-in-out ${!isLoaded || hidden ? "-translate-y-full md:translate-x-full md:translate-y-0 opacity-0" : "translate-y-0 md:translate-x-0 opacity-100"}`}>
          <h1 className="font-display text-[2.2rem] sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] italic">
            {[
              { text: "O futuro também", break: true },
              { text: "pode", break: true },
              { text: "flutuar.", break: false }
            ].map((item, i) => (
              <span
                key={i}
                className={`${item.break ? "block" : "inline-block"} md:inline-block animate-river-wave md:mr-[0.3em]`}
                style={{ animationDelay: `${i * 0.4}s` }}
              >
                {item.text}
              </span>
            ))}
          </h1>
          <p className="font-body text-xs sm:text-base md:text-lg text-primary-foreground/80 mt-4 leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] text-center">
            Soluções habitacionais pensadas para viver em harmonia com os rios da Amazônia.
          </p>
        </div>
      </div>
    </section>
  );
};


const MissionSection = () =>
<section id="mission" className="relative py-24 md:py-32">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent from-0% via-background/90 via-30% to-background/90 to-100% -z-10" />
    <div className="container mx-auto px-6">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div>
          <ScrollReveal direction="left">
            <span className="font-body text-sm uppercase tracking-[0.3em] text-primary font-semibold">Nossa Missão</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-4 mb-6 leading-tight">
              Transparência que<br />transforma vidas
            </h2>
            <div className="section-divider mb-8" />
          </ScrollReveal>
          <ScrollReveal direction="left" delay={150}>
            <p className="font-body text-lg text-muted-foreground leading-relaxed mb-6">
              A SHELTER é uma startup social internacional que facilita apoio financeiro 
              para projetos sociais entre Europa, América do Norte e América do Sul, 
              criando um ecossistema de impacto sustentável.
            </p>
          </ScrollReveal>
          <ScrollReveal direction="left" delay={300}>
            <p className="font-body text-muted-foreground leading-relaxed">
              Com estrutura jurídica na Bélgica e Holanda, garantimos total conformidade 
              com regulamentos europeus de captação e programas sociais internacionais.
            </p>
          </ScrollReveal>
        </div>
        <ScrollReveal direction="right">
          <div className="relative group">
            <div className="absolute -left-3 -top-3 w-full h-full bg-[#00522D] -z-10 transition-transform duration-500 group-hover:-translate-x-1 group-hover:-translate-y-1" />
            <img
            src={missionImg}
            alt="Missão Shelter"
            className="w-full aspect-[4/5] md:aspect-[4/4] object-cover md:max-h-[500px] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.3)]" />
          
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/80 to-transparent p-8">
              <p className="font-display text-2xl text-primary-foreground italic">
                "Cada doação conta uma história de transformação"
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  </section>;


const features = [
{
  icon: MapPin,
  title: "Mapa Global",
  description: "Visualize projetos sociais ao redor do mundo com transparência geográfica total do seu impacto."
},
{
  icon: Heart,
  title: "Doações Internacionais",
  description: "Sistema seguro de doações com taxa administrativa mínima (5–7%) e total rastreabilidade."
},
{
  icon: ShoppingBag,
  title: "Marketplace Solidário",
  description: "Compre produtos de comunidades e projetos sociais. Cada compra gera impacto direto."
},
{
  icon: Play,
  title: "Streaming de Impacto",
  description: "Conteúdo audiovisual documentário mostrando o impacto real dos projetos apoiados."
}];


const FeaturesSection = () =>
<section id="features" className="relative py-24 md:py-32">
    <div className="absolute inset-0 bg-gradient-to-t from-transparent from-0% via-card/90 via-30% to-card/90 to-100% -z-10" />
    <div className="container mx-auto px-6">
      <ScrollReveal direction="right">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="font-body text-sm uppercase tracking-[0.3em] text-primary font-semibold">Plataforma</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-4 mb-6">
            Tecnologia a serviço<br />do impacto social
          </h2>
          <div className="section-divider mx-auto" />
        </div>
      </ScrollReveal>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, i) =>
        <ScrollReveal key={feature.title} direction={i % 2 === 0 ? "left" : "right"} delay={i * 100}>
          <div className="relative group h-full">
            <div className="absolute -left-2 -top-2 w-full h-full bg-[#00522D] -z-10 transition-transform duration-500 group-hover:-translate-x-1 group-hover:-translate-y-1" />
            <div
              className="p-8 bg-background border border-border hover:border-primary transition-all duration-300 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.3)] h-full">
                <feature.icon className="w-8 h-8 text-primary mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="font-display text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="font-body text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </div>
          </div>
        </ScrollReveal>
        )}
      </div>
    </div>
  </section>;




const regions = [
{ name: "Europa", flag: "🌎", description: "Sede operacional na Bélgica e fundação social na Holanda" },
{ name: "América do Sul", flag: "🌎", description: "Projetos comunitários de educação, saúde e sustentabilidade" },
{ name: "América do Norte", flag: "🌎", description: "Parcerias corporativas e captação de recursos" }];


const RegionsSection = () =>
<section id="regions" className="relative py-24 md:py-32 overflow-hidden">
    <img
    src={europeImg}
    alt="Vista aérea da Europa"
    className="absolute inset-0 w-full h-full object-cover" />
  
    <div className="absolute inset-0 bg-foreground/85" />
    <div className="relative z-10 container mx-auto px-6">
      <ScrollReveal direction="left">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-body text-sm uppercase tracking-[0.3em] font-semibold text-primary-foreground">Alcance Global</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mt-4 mb-6">
            Três continentes,<br />um propósito
          </h2>
          <div className="section-divider mx-auto text-primary-foreground" />
        </div>
      </ScrollReveal>
      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {regions.map((region, i) =>
        <ScrollReveal key={region.name} direction={i % 2 === 0 ? "right" : "left"} delay={i * 150}>
          <div className="text-center p-8 border border-primary-foreground/20 hover:border-primary transition-colors">
            <span className="text-4xl mb-4 block">{region.flag}</span>
            <h3 className="font-display text-xl font-bold text-primary-foreground mb-3">{region.name}</h3>
            <p className="font-body text-primary-foreground/60 text-sm leading-relaxed">{region.description}</p>
          </div>
        </ScrollReveal>
        )}
      </div>
    </div>
  </section>;


const stats = [
{ value: "3", label: "Continentes" },
{ value: "5–7%", label: "Taxa administrativa" },
{ value: "€10K", label: "Investimento inicial" },
{ value: "100%", label: "Transparência" }];


const StatsSection = () =>
<section className="py-16 bg-primary">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, i) =>
        <ScrollReveal key={stat.label} direction={i % 2 === 0 ? "left" : "right"} delay={i * 100}>
          <div className="text-center">
            <div className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">{stat.value}</div>
            <div className="font-body text-xs uppercase tracking-[0.2em] text-primary-foreground/70 mt-2">{stat.label}</div>
          </div>
        </ScrollReveal>
        )}
      </div>
    </div>
  </section>;


const CTASection = () =>
<section className="py-24 md:py-32 bg-background">
    <div className="container mx-auto px-6 text-center max-w-3xl">
      <ScrollReveal direction="right">
        <span className="font-body text-sm uppercase tracking-[0.3em] text-primary font-semibold">Junte-se a nós</span>
        <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mt-4 mb-6">
          Faça parte desta<br />transformação global
        </h2>
        <div className="section-divider mx-auto mb-8" />
      </ScrollReveal>
      <ScrollReveal direction="left" delay={150}>
        <p className="font-body text-lg text-muted-foreground leading-relaxed mb-10">
          Seja como doador, parceiro empresarial ou projeto social — 
          a SHELTER é a ponte entre sua vontade de ajudar e o impacto real no mundo.
        </p>
      </ScrollReveal>
      <ScrollReveal direction="right" delay={300}>
        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="hero" size="lg" className="gap-2">
            Começar Agora <ArrowRight className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="lg" className="uppercase tracking-widest text-xs font-body font-semibold">
            Saiba Mais
          </Button>
        </div>
      </ScrollReveal>
    </div>
  </section>;


const Footer = () =>
<footer className="bg-foreground py-16">
    <div className="container mx-auto px-6">
      <div className="grid md:grid-cols-4 gap-12">
        <div>
          <div className="mb-4">
            <img src={shelterLogoFull} alt="SHELTER" className="object-contain h-[35px]" />
          </div>
          <p className="font-body text-primary-foreground/90 text-sm leading-relaxed">
            Infraestrutura digital global para apoio e visibilidade de projetos sociais.
          </p>
        </div>
        <div>
          <h4 className="font-body text-xs uppercase tracking-[0.3em] text-primary md:text-primary-foreground font-semibold bg-primary-foreground md:bg-transparent px-3 md:px-0 py-2 md:py-0 mb-4 block -mx-6 md:mx-0 pl-6 md:pl-0">Plataforma</h4>
          <ul className="space-y-2 font-body text-sm text-primary-foreground/90">
            <li><a href="#" className="hover:text-primary transition-colors">Mapa de Projetos</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Doações</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Marketplace</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Streaming</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-body text-xs uppercase tracking-[0.3em] text-primary md:text-primary-foreground font-semibold bg-primary-foreground md:bg-transparent px-3 md:px-0 py-2 md:py-0 mb-4 block -mx-6 md:mx-0 pl-6 md:pl-0">Endereços</h4>
          <ul className="space-y-3 font-body text-sm text-primary-foreground/90">
            <li>🇧🇪 Ter Heydelaan 430, Antwerpen</li>
            <li>🇳🇱 Zeeburgerdijk 367, 1095 AD Amsterdam</li>
          </ul>
        </div>
        <div>
          <h4 className="font-body text-xs uppercase tracking-[0.3em] text-primary md:text-primary-foreground font-semibold bg-primary-foreground md:bg-transparent px-3 md:px-0 py-2 md:py-0 mb-4 block -mx-6 md:mx-0 pl-6 md:pl-0">Contato</h4>
          <ul className="space-y-3 font-body text-sm text-primary-foreground/90">
            <li><a href="mailto:Info@theshelter.foundation" className="hover:text-primary transition-colors">Info@theshelter.foundation</a></li>
            <li><a href="mailto:Donate@theshelter.foundation" className="hover:text-primary transition-colors">Donate@theshelter.foundation</a></li>
            <li><a href="https://wa.me/32492801353" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">+32 492 80 13 53</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center">
        <p className="font-body text-xs text-primary-foreground/70 uppercase tracking-widest">
          © 2026 SHELTER. Todos os direitos reservados.
        </p>
      </div>
    </div>
  </footer>;


const Index = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <MissionSection />
      <AboutSection />
      <FeaturesSection />
      <StatsSection />
      
      <RegionsSection />
      <DonationSection />
      <CTASection />
      <Footer />
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <Button variant="hero" size="sm" className="shadow-lg relative overflow-hidden">
          Doar Agora
          <span className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </Button>
      </div>
    </div>);

};

export default Index;