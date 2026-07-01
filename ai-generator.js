function generateWebsiteCopy(data) {
  const { businessName, industry, goal } = data;

  const templates = {
    Restaurant: {
      headline: `${businessName} — Fresh Food, Local Flavor`,
      sub: "Delicious meals made daily with fresh ingredients.",
      services: ["Dine-in", "Takeout", "Catering"],
      cta: "View Menu"
    },

    Trades: {
      headline: `${businessName} — Trusted Local Professionals`,
      sub: "Reliable, affordable, and done right the first time.",
      services: ["Repairs", "Installations", "Free Estimates"],
      cta: "Request Service"
    },

    Retail: {
      headline: `${businessName} — Quality You Can Trust`,
      sub: "Local products, fair prices, friendly service.",
      services: ["In-store Shopping", "Pickup", "Special Orders"],
      cta: "Shop Now"
    },

    Services: {
      headline: `${businessName} — Solutions That Work for You`,
      sub: "Professional services tailored to your needs.",
      services: ["Consulting", "Support", "Custom Work"],
      cta: "Get Started"
    }
  };

  const t = templates[industry] || templates.Services;

  return {
    headline: t.headline,
    subheadline: t.sub,
    services: t.services,
    cta: t.cta,
    seoTitle: `${businessName} | ${industry} Services`,
    seoDescription: t.sub
  };
}
