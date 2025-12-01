import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import heroCarbon from "@/assets/hero-carbon.jpg";
import amazonForest from "@/assets/amazon-forest.jpg";
import logoFortune from "@/assets/logo-fortune.png";
import { useSoundFeedback } from "@/hooks/useSoundFeedback";
type InvestorType = "PF" | "PJ" | "INST" | null;
type TicketRange = "0-100" | "100-500" | "500-2000" | "2000+" | null;
type Horizon = "2-" | "3-5" | "5+" | null;
interface LeadData {
  investorType: InvestorType;
  ticketRange: TicketRange;
  horizon: Horizon;
  name: string;
  email: string;
  whatsapp: string;
  country: string;
}
const INACTIVITY_TIMEOUT_MS = 90_000; // 90s sem tocar volta pra tela 0

const Index = () => {
  const [step, setStep] = useState<number>(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [lead, setLead] = useState<LeadData>({
    investorType: null,
    ticketRange: null,
    horizon: null,
    name: "",
    email: "",
    whatsapp: "",
    country: ""
  });
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const {
    playNext: playSoundNext,
    playBack: playSoundBack,
    playSelect,
    playSubmit
  } = useSoundFeedback();

  // --- Controle de inatividade para totem ---
  useEffect(() => {
    let timer: number;
    const resetTimer = () => {
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        setStep(0);
        setLead({
          investorType: null,
          ticketRange: null,
          horizon: null,
          name: "",
          email: "",
          whatsapp: "",
          country: ""
        });
        setQrUrl(null);
      }, INACTIVITY_TIMEOUT_MS);
    };
    resetTimer();
    const events = ["click", "touchstart", "keydown"];
    events.forEach(ev => window.addEventListener(ev, resetTimer));
    return () => {
      if (timer) window.clearTimeout(timer);
      events.forEach(ev => window.removeEventListener(ev, resetTimer));
    };
  }, []);
  const next = () => {
    playSoundNext();
    setDirection("forward");
    setStep(s => s + 1);
  };
  const back = () => {
    playSoundBack();
    setDirection("backward");
    setStep(s => Math.max(0, s - 1));
  };
  const handleSubmitLead = async () => {
    try {
      playSubmit();
      // Aqui você conecta com n8n ou sua API
      // const res = await fetch("https://sua-api.com/leads-totem", { 
      //   method: "POST",
      //   body: JSON.stringify(lead)
      // });
      // const data = await res.json();
      // setQrUrl(data.teaserUrl);

      const fakeTeaserUrl = "https://seusite.com/fundo/teaser-fortune-carbon";
      setQrUrl(fakeTeaserUrl);
    } catch (e) {
      console.error("Erro ao enviar lead", e);
      alert("Não foi possível enviar seus dados. Tente novamente.");
    }
  };
  const renderStep = () => {
    switch (step) {
      case 0:
        return <ScreenContainer>
            <div className="flex flex-col items-center justify-center text-center gap-8 relative animate-fade-in">
              <div className="absolute inset-0 bg-cover bg-center rounded-3xl animate-[zoom-pan_20s_ease-in-out_infinite]" style={{
              backgroundImage: `url(${amazonForest})`
            }} />
              
              {/* Logo Principal */}
              <div className="flex items-center justify-center mb-2 relative z-10 animate-scale-in pt-8 px-8">
                <img 
                  src={logoFortune} 
                  alt="Fortune Carbon Removal Fund" 
                  className="h-20 w-auto hover-scale"
                />
              </div>
              
              <div className="relative z-10 space-y-6">
                <div className="animate-fade-in" style={{
                animationDelay: '0.2s'
              }}>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-medium">
                    FortuneGroup S.A. &amp; SFI Investimentos
                  </p>
                  <h1 className="text-5xl md:text-6xl font-bold mt-6 mb-4 text-foreground">
                    Fortune Carbon Removal Fund
                  </h1>
                </div>
                
                <p className="text-2xl md:text-3xl font-semibold max-w-3xl mx-auto text-foreground leading-tight animate-fade-in" style={{
                animationDelay: '0.4s'
              }}>
                  Invista na transição climática com lastro em créditos de carbono reais da Amazônia
                </p>
                
                <p className="mt-4 text-base md:text-lg max-w-3xl mx-auto text-muted-foreground leading-relaxed animate-fade-in" style={{
                animationDelay: '0.6s'
              }}>
                  Fiagro focado em créditos de carbono e CPRs que conecta o
                  agronegócio brasileiro à economia de baixo carbono.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full relative z-10 animate-fade-in" style={{
              animationDelay: '0.8s'
            }}>
                <HighlightCard title="R$ 500 milhões" delay="100">
                  Tamanho alvo da oferta, com foco em ativos de alta integridade
                  climática.
                </HighlightCard>
                <HighlightCard title="Créditos certificados" delay="200">
                  Exposição a créditos de carbono certificados por padrões
                  reconhecidos globalmente.
                </HighlightCard>
                <HighlightCard title="Impacto climático real" delay="300">
                  Potencial de proteger florestas, remover CO₂ e beneficiar
                  milhares de famílias.
                </HighlightCard>
              </div>

              <button onClick={() => {
              playSoundNext();
              setStep(1);
            }} className="relative z-10 px-12 py-5 rounded-2xl text-xl font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 pulse animate-fade-in" style={{
              animationDelay: '1s'
            }}>
                Toque na tela para simular seu investimento
              </button>

              <p className="text-xs max-w-2xl mx-auto text-muted-foreground leading-relaxed relative z-10 animate-fade-in" style={{
              animationDelay: '1.2s'
            }}>
                Material publicitário. Não constitui oferta pública de valores
                mobiliários. Leia o regulamento e demais documentos oficiais
                antes de investir.
              </p>
            </div>
          </ScreenContainer>;
      case 1:
        return <ScreenContainer showBack={true} onBack={back}>
            <SectionTitle title="Bem-vindo ao Fortune Carbon Removal Fund" subtitle="Conheça em poucos passos como o fundo conecta agronegócio, créditos de carbono e impacto climático mensurável." />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mt-10">
              <InfoCard title="O que é o fundo" delay="0">
                Fiagro estruturado para investir em créditos de carbono
                certificados e CPRs, unindo retorno financeiro e impacto
                ambiental.
              </InfoCard>
              <InfoCard title="Papel do fundo" delay="100">
                Conectar produtores, projetos sustentáveis e capital
                institucional, ajudando empresas e investidores a viabilizar a
                transição para uma economia de baixo carbono.
              </InfoCard>
              <InfoCard title="Governança" delay="200">
                Gestão profissional da SFI Investimentos, com consultoria
                técnica da FortuneGroup S.A. em créditos de carbono e ESG.
              </InfoCard>
              <InfoCard title="Regulação e integridade" delay="300">
                Alinhado à regulação climática brasileira, SBCE e padrões
                internacionais de alta integridade.
              </InfoCard>
            </div>

            <FooterButtons onNext={next} />
          </ScreenContainer>;
      case 2:
        return <ScreenContainer showBack={true} onBack={back}>
            <SectionTitle title="Por que o Brasil e por que agora?" subtitle="A década decisiva da ação climática e o papel dos créditos de carbono na transição para uma economia de baixo carbono." />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-10">
              <InfoCard title="Brasil protagonista" delay="0">
                Capacidade única de geração de créditos de carbono, com
                biomas estratégicos e cadeias produtivas ligadas ao
                agronegócio sustentável.
              </InfoCard>
              <InfoCard title="Mercado em expansão" delay="150">
                À medida que empresas assumem compromissos Net Zero, cresce a
                demanda por créditos de carbono de alta integridade.
              </InfoCard>
              <InfoCard title="Fiagro como ponte" delay="300">
                O fundo conecta projetos, produtores e investidores,
                transformando ativos ambientais em retorno financeiro e impacto
                climático.
              </InfoCard>
            </div>

            <FooterButtons onNext={next} />
          </ScreenContainer>;
      case 3:
        return <ScreenContainer showBack={true} onBack={back}>
            <SectionTitle title="O que o fundo faz na prática?" subtitle="Uma carteira voltada a créditos de carbono certificados e CPRs ligados a projetos sustentáveis." />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mt-10">
              <InfoCard title="Créditos de carbono" delay="0">
                Exposição a créditos performados e em desenvolvimento, emitidos
                por padrões reconhecidos internacionalmente.
              </InfoCard>
              <InfoCard title="CPRs sustentáveis" delay="100">
                Direitos creditórios do agronegócio vinculados a cadeias
                produtivas de baixo carbono, reflorestamento e práticas
                regenerativas.
              </InfoCard>
              <InfoCard title="Retorno + impacto" delay="200">
                Combinação de geração de renda, potencial de valorização de
                ativos e impacto socioambiental com métricas claras.
              </InfoCard>
              <InfoCard title="Governança robusta" delay="300">
                Comitês, políticas de risco e diligência técnica para seleção e
                acompanhamento dos projetos e ativos da carteira.
              </InfoCard>
            </div>

            <FooterButtons onNext={next} />
          </ScreenContainer>;
      case 4:
        return <ScreenContainer showBack={true} onBack={back}>
            <SectionTitle title="Como estruturamos a carteira" subtitle="Equilíbrio entre ativos já performados e projetos em desenvolvimento." />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mt-10">
              <InfoCard title="Carteira performada" delay="0">
                Créditos de carbono já emitidos e certificados, com foco em
                liquidez e geração de renda recorrente por meio de operações de
                venda e recompra.
              </InfoCard>
              <InfoCard title="Carteira a performar" delay="150">
                Projetos REDD+, reflorestamento, carbono azul, biochar e
                agricultura regenerativa, com potencial de valorização no
                médio prazo.
              </InfoCard>
            </div>

            <div className="max-w-4xl mx-auto mt-12 p-8 rounded-2xl bg-card border border-border animate-fade-in" style={{
            animationDelay: "300ms"
          }}>
              <h3 className="text-2xl font-semibold mb-6 text-center text-foreground">
                Tipologias e frentes de atuação
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {["REDD+ e conservação florestal", "Reflorestamento e ARR", "Carbono azul", "Biochar", "Energia limpa", "Agricultura regenerativa"].map(item => <div key={item} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>)}
              </div>
            </div>

            <FooterButtons onNext={next} />
          </ScreenContainer>;
      case 5:
        return <ScreenContainer showBack={true} onBack={back}>
            <SectionTitle title="Simule seu perfil de investimento e impacto" subtitle="Selecione a faixa de aporte e horizonte de investimento que fazem sentido para você." />

            <div className="max-w-4xl mx-auto mt-10 space-y-10 animate-fade-in">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">
                  Você é:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ChoiceButton selected={lead.investorType === "PF"} onClick={() => {
                  playSelect();
                  setLead(l => ({
                    ...l,
                    investorType: "PF"
                  }));
                }}>
                    Pessoa Física
                  </ChoiceButton>
                  <ChoiceButton selected={lead.investorType === "PJ"} onClick={() => {
                  playSelect();
                  setLead(l => ({
                    ...l,
                    investorType: "PJ"
                  }));
                }}>
                    Pessoa Jurídica
                  </ChoiceButton>
                  <ChoiceButton selected={lead.investorType === "INST"} onClick={() => {
                  playSelect();
                  setLead(l => ({
                    ...l,
                    investorType: "INST"
                  }));
                }}>
                    Family office / Institucional
                  </ChoiceButton>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">
                  Faixa de aporte que você considera:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <ChoiceButton selected={lead.ticketRange === "0-100"} onClick={() => {
                  playSelect();
                  setLead(l => ({
                    ...l,
                    ticketRange: "0-100"
                  }));
                }}>
                    Até R$ 100 mil
                  </ChoiceButton>
                  <ChoiceButton selected={lead.ticketRange === "100-500"} onClick={() => {
                  playSelect();
                  setLead(l => ({
                    ...l,
                    ticketRange: "100-500"
                  }));
                }}>
                    R$ 100 mil – 500 mil
                  </ChoiceButton>
                  <ChoiceButton selected={lead.ticketRange === "500-2000"} onClick={() => {
                  playSelect();
                  setLead(l => ({
                    ...l,
                    ticketRange: "500-2000"
                  }));
                }}>
                    R$ 500 mil – 2 milhões
                  </ChoiceButton>
                  <ChoiceButton selected={lead.ticketRange === "2000+"} onClick={() => {
                  playSelect();
                  setLead(l => ({
                    ...l,
                    ticketRange: "2000+"
                  }));
                }}>
                    Acima de R$ 2 milhões
                  </ChoiceButton>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">
                  Horizonte de investimento:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ChoiceButton selected={lead.horizon === "2-"} onClick={() => {
                  playSelect();
                  setLead(l => ({
                    ...l,
                    horizon: "2-"
                  }));
                }}>
                    Até 2 anos
                  </ChoiceButton>
                  <ChoiceButton selected={lead.horizon === "3-5"} onClick={() => {
                  playSelect();
                  setLead(l => ({
                    ...l,
                    horizon: "3-5"
                  }));
                }}>
                    3 – 5 anos
                  </ChoiceButton>
                  <ChoiceButton selected={lead.horizon === "5+"} onClick={() => {
                  playSelect();
                  setLead(l => ({
                    ...l,
                    horizon: "5+"
                  }));
                }}>
                    Acima de 5 anos
                  </ChoiceButton>
                </div>
              </div>

              <div className="mt-8 p-6 rounded-2xl border border-primary/20 bg-accent/30">
                <p className="text-foreground leading-relaxed">
                  Com um investimento nessa faixa e horizonte, você pode se
                  expor a uma carteira que busca apoiar projetos com potencial
                  de remover e/ou evitar milhões de toneladas de CO₂e,
                  proteger grandes áreas de florestas e gerar benefícios
                  socioeconômicos a milhares de famílias.
                </p>
                <p className="mt-3 text-xs text-muted-foreground">
                  As projeções de impacto são indicativas e não representam
                  garantia de resultados ou de rentabilidade futura.
                </p>
              </div>
            </div>

            <FooterButtons onNext={next} />
          </ScreenContainer>;
      case 6:
        return <ScreenContainer showBack={true} onBack={back}>
            <SectionTitle title="Receba o teaser completo e próximos passos" subtitle="Preencha seus dados para receber o material do fundo e contato da nossa equipe." />

            <div className="max-w-2xl mx-auto mt-10 animate-fade-in">
              {!qrUrl ? <div className="space-y-6">
                  <InputField label="Nome completo" value={lead.name} onChange={e => setLead(l => ({
                ...l,
                name: e.target.value
              }))} />
                  <InputField label="E-mail" type="email" value={lead.email} onChange={e => setLead(l => ({
                ...l,
                email: e.target.value
              }))} />
                  <InputField label="WhatsApp (com DDI)" placeholder="+55 11 99999-9999" value={lead.whatsapp} onChange={e => setLead(l => ({
                ...l,
                whatsapp: e.target.value
              }))} />
                  <InputField label="País / Estado" value={lead.country} onChange={e => setLead(l => ({
                ...l,
                country: e.target.value
              }))} />

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Ao avançar, você autoriza o uso dos dados fornecidos para
                    contato sobre este fundo, em conformidade com a LGPD.
                  </p>

                  <div className="flex justify-center pt-4">
                    <button onClick={handleSubmitLead} className="px-12 py-5 rounded-2xl text-xl font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-xl">
                      Enviar dados e gerar acesso
                    </button>
                  </div>
                </div> : <div className="flex flex-col items-center gap-8">
                  <p className="text-center text-lg max-w-xl text-foreground leading-relaxed">
                    Obrigado! Escaneie o QR Code abaixo para acessar o teaser
                    e os próximos passos do Fortune Carbon Removal Fund.
                  </p>
                  
                  <div className="p-8 rounded-3xl bg-card border-2 border-primary/30 shadow-2xl">
                    <QRCodeSVG value={qrUrl} size={256} level="H" includeMargin={true} fgColor="hsl(var(--foreground))" bgColor="hsl(var(--card))" />
                  </div>

                  <p className="text-sm text-center text-muted-foreground max-w-md">
                    Você também receberá o material por e-mail nos próximos minutos.
                  </p>
                </div>}

              <p className="mt-10 text-[10px] text-center text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Material publicitário. Não constitui oferta ou recomendação de
                investimento. Qualquer decisão deve considerar exclusivamente o
                regulamento e demais documentos oficiais do fundo. Rentabilidade
                passada não representa garantia de rentabilidade futura.
              </p>
            </div>
          </ScreenContainer>;
      default:
        return null;
    }
  };
  return <div className="w-screen h-screen bg-background text-foreground overflow-hidden">
      <div key={step} className={`w-full h-full ${direction === "forward" ? "animate-fade-in" : "animate-fade-in"}`}>
        {renderStep()}
      </div>
    </div>;
};
export default Index;

/* ----------------- COMPONENTES DE APOIO ----------------- */

interface ScreenProps {
  children: React.ReactNode;
  showBack?: boolean;
  onBack?: () => void;
}
const ScreenContainer = ({
  children,
  showBack,
  onBack
}: ScreenProps) => {
  return <div className="w-full h-full flex flex-col">
      <header className="flex items-center justify-between px-8 py-6 border-b border-border bg-card/50 backdrop-blur">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground shadow-lg">
            FC
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-medium">
              FortuneGroup S.A. &amp; SFI Investimentos
            </p>
            <p className="text-base font-semibold text-foreground">
              Fortune Carbon Removal Fund
            </p>
          </div>
        </div>

        {showBack && onBack && <button onClick={onBack} className="text-sm px-6 py-3 rounded-xl border border-border hover:bg-accent transition-colors font-medium">
            ← Voltar
          </button>}
      </header>

      <main className="flex-1 px-6 md:px-12 py-8 overflow-auto">
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-full max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>;
};
interface SectionTitleProps {
  title: string;
  subtitle?: string;
}
const SectionTitle = ({
  title,
  subtitle
}: SectionTitleProps) => <div className="text-center max-w-4xl mx-auto mb-8 animate-fade-in">
    <h2 className="text-4xl md:text-5xl font-bold text-foreground">{title}</h2>
    {subtitle && <p className="mt-4 text-lg md:text-xl text-muted-foreground leading-relaxed">{subtitle}</p>}
  </div>;
interface HighlightCardProps {
  title: string;
  children: React.ReactNode;
  delay?: string;
}
const HighlightCard = ({
  title,
  children,
  delay = "0"
}: HighlightCardProps) => <div className="p-6 rounded-2xl border border-primary/30 bg-card/80 backdrop-blur shadow-lg hover:shadow-xl transition-all animate-fade-in hover-scale" style={{
  animationDelay: `${delay}ms`
}}>
    <h3 className="text-xl font-semibold mb-3 text-foreground">{title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed">{children}</p>
  </div>;
interface InfoCardProps {
  title: string;
  children: React.ReactNode;
  delay?: string;
}
const InfoCard = ({
  title,
  children,
  delay = "0"
}: InfoCardProps) => <div className="p-6 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all animate-fade-in hover-scale" style={{
  animationDelay: `${delay}ms`
}}>
    <h3 className="text-lg md:text-xl font-semibold mb-3 text-foreground">{title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed">{children}</p>
  </div>;
interface FooterButtonsProps {
  onNext: () => void;
}
const FooterButtons = ({
  onNext
}: FooterButtonsProps) => <div className="mt-12 flex justify-center">
    <button onClick={onNext} className="px-12 py-5 rounded-2xl text-xl font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105">
      Continuar →
    </button>
  </div>;
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}
const InputField = ({
  label,
  ...props
}: InputFieldProps) => <label className="block">
    <span className="block mb-2 text-sm font-medium text-foreground">{label}</span>
    <input {...props} className="w-full px-5 py-4 rounded-xl bg-card border border-input outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground" />
  </label>;
interface ChoiceButtonProps {
  selected?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}
const ChoiceButton = ({
  selected,
  onClick,
  children
}: ChoiceButtonProps) => <button onClick={onClick} className={`px-6 py-4 rounded-xl text-base font-medium text-left border-2 transition-all ${selected ? "border-primary bg-primary/10 text-foreground shadow-lg" : "border-border bg-card text-muted-foreground hover:bg-accent hover:border-primary/30"}`}>
    {children}
  </button>;