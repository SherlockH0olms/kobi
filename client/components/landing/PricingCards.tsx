import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingTier {
  name: string;
  price: number;
  description: string;
  features: { text: string; included: boolean }[];
  cta: string;
  featured?: boolean;
}

interface PricingCardProps extends PricingTier {
  index: number;
}

function PricingCard({
  name,
  price,
  description,
  features,
  cta,
  featured = false,
  index,
}: PricingCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-border overflow-hidden transition-all duration-300",
        "hover:shadow-xl",
        featured &&
          "lg:scale-105 shadow-2xl lg:border-2 lg:border-success relative",
      )}
    >
      {featured && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Badge className="bg-gradient-to-r from-success to-emerald-600 text-white uppercase text-xs font-bold px-4 py-1 rounded-full">
            Ən Populyar
          </Badge>
        </div>
      )}

      <div className="p-8 space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-2xl font-heading font-bold text-foreground mb-2">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        {/* Price */}
        <div className="py-4">
          <div className="flex items-baseline gap-1">
            <span
              className={cn(
                "font-heading font-bold",
                featured
                  ? "text-6xl text-secondary"
                  : "text-5xl text-foreground",
              )}
            >
              ${price}
            </span>
            <span className="text-2xl text-muted-foreground">.00</span>
            <span className="text-base text-muted-foreground ml-2">/ay</span>
          </div>
        </div>

        {/* CTA Button */}
        <Button
          className={cn(
            "w-full h-12 font-heading font-semibold text-base",
            featured ? "bg-secondary hover:bg-secondary/90" : "",
          )}
          variant={featured ? "default" : "outline"}
        >
          {cta}
        </Button>

        {/* Features List */}
        <div className="border-t border-border pt-6 space-y-3">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-3">
              {feature.included ? (
                <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
              ) : (
                <X className="w-5 h-5 text-muted-foreground/30 flex-shrink-0 mt-0.5" />
              )}
              <span
                className={cn(
                  "text-sm",
                  feature.included
                    ? "text-muted-foreground"
                    : "text-muted-foreground/50",
                )}
              >
                {feature.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PricingCards() {
  const tiers: PricingTier[] = [
    {
      name: "Pulsuz Plan",
      price: 0,
      description: "Başlamaq üçün mükəmməl",
      cta: "Başlayın",
      features: [
        { text: "10 pulsuz kredit", included: true },
        { text: "1 təbəqə uçotu (Aylıq)", included: true },
        { text: "Əsas niş generatoru", included: true },
        { text: "Sadə AI cavabı", included: false },
        { text: "Ekspert dəstəyi", included: false },
        { text: "Xəbərdarlıqlar", included: false },
      ],
    },
    {
      name: "Biznes Planı",
      price: 39,
      description: "Böyümmə üçün əsas həllər",
      cta: "Başlayın",
      featured: true,
      features: [
        { text: "Limitsiz təhlil", included: true },
        { text: "10+ data mənbəyi", included: true },
        { text: "Gap/Niş vizual bazar xəritəsi", included: true },
        { text: "Trend Proqnozlaşdırma", included: true },
        { text: "Fürsət Radarı", included: true },
        { text: "Real-time xəbərdarlıqlar", included: true },
        { text: "PRD təbəqə generatoru", included: true },
        { text: "Rəqib analitikası", included: true },
        { text: "PDF/CSV eksport", included: true },
        { text: "10 təbəqə üzvləri", included: true },
      ],
    },
    {
      name: "Enterprise Planı",
      price: 99,
      description: "Korporativ tələblər üçün",
      cta: "Bizimlə əlaqə saxlayın",
      features: [
        { text: "Limitsiz hər şey", included: true },
        { text: "20+ təbəqə üzvləri", included: true },
        { text: "Çoxsəviyyəli məlumat", included: true },
        { text: "Xüsusi AI model", included: true },
        { text: "Aylıq müəssisə hesabatı", included: true },
        { text: "24/7 dəstək", included: true },
      ],
    },
  ];

  return (
    <div className="bg-white py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-foreground mb-4">
            Gələcəyi araşdırmağa başlayın
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Solopreneurlər, komandalar və fondlar üçün çevik seçimlər
          </p>

          {/* Toggle - Monthly/Yearly */}
          <div className="inline-flex gap-1 bg-muted rounded-lg p-1 w-max">
            <button className="px-6 py-2 bg-white rounded-md text-sm font-medium text-foreground shadow-sm transition-all">
              Aylıq
            </button>
            <button className="px-6 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all">
              İllik
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {tiers.map((tier, idx) => (
            <PricingCard key={idx} {...tier} index={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}
