export interface ThemePalette {
  id: string;
  name: string;
  /** Preview swatch colors (hex) */
  swatches: [string, string, string];
  /** CSS variable overrides (HSL values only, no hsl() wrapper) */
  vars: {
    "--background": string;
    "--foreground": string;
    "--card": string;
    "--card-foreground": string;
    "--popover": string;
    "--popover-foreground": string;
    "--primary": string;
    "--primary-foreground": string;
    "--secondary": string;
    "--secondary-foreground": string;
    "--muted": string;
    "--muted-foreground": string;
    "--accent": string;
    "--accent-foreground": string;
    "--border": string;
    "--input": string;
    "--ring": string;
    "--sidebar-background": string;
    "--sidebar-foreground": string;
    "--sidebar-primary": string;
    "--sidebar-primary-foreground": string;
    "--sidebar-accent": string;
    "--sidebar-accent-foreground": string;
    "--sidebar-border": string;
    "--sidebar-ring": string;
  };
}

export const THEME_PALETTES: ThemePalette[] = [
  {
    id: "default",
    name: "Calm Blue",
    swatches: ["#4A90D9", "#FAFBFC", "#E8ECF1"],
    vars: {
      "--background": "210 20% 98%",
      "--foreground": "210 29% 18%",
      "--card": "0 0% 100%",
      "--card-foreground": "210 29% 18%",
      "--popover": "0 0% 100%",
      "--popover-foreground": "210 29% 18%",
      "--primary": "213 58% 57%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "210 25% 95%",
      "--secondary-foreground": "210 29% 18%",
      "--muted": "210 20% 96%",
      "--muted-foreground": "210 15% 46%",
      "--accent": "210 25% 95%",
      "--accent-foreground": "210 29% 18%",
      "--border": "210 20% 91%",
      "--input": "210 20% 91%",
      "--ring": "213 58% 57%",
      "--sidebar-background": "0 0% 100%",
      "--sidebar-foreground": "210 15% 55%",
      "--sidebar-primary": "213 58% 57%",
      "--sidebar-primary-foreground": "0 0% 100%",
      "--sidebar-accent": "210 25% 95%",
      "--sidebar-accent-foreground": "210 29% 18%",
      "--sidebar-border": "210 20% 91%",
      "--sidebar-ring": "213 58% 57%",
    },
  },
  {
    id: "forest",
    name: "Forest",
    swatches: ["#2D6A4F", "#F0F5F1", "#D4E7D9"],
    vars: {
      "--background": "140 18% 97%",
      "--foreground": "150 30% 16%",
      "--card": "140 20% 100%",
      "--card-foreground": "150 30% 16%",
      "--popover": "140 20% 100%",
      "--popover-foreground": "150 30% 16%",
      "--primary": "153 44% 30%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "140 22% 94%",
      "--secondary-foreground": "150 30% 16%",
      "--muted": "140 16% 95%",
      "--muted-foreground": "150 12% 46%",
      "--accent": "140 22% 94%",
      "--accent-foreground": "150 30% 16%",
      "--border": "140 18% 90%",
      "--input": "140 18% 90%",
      "--ring": "153 44% 30%",
      "--sidebar-background": "140 20% 100%",
      "--sidebar-foreground": "150 12% 50%",
      "--sidebar-primary": "153 44% 30%",
      "--sidebar-primary-foreground": "0 0% 100%",
      "--sidebar-accent": "140 22% 94%",
      "--sidebar-accent-foreground": "150 30% 16%",
      "--sidebar-border": "140 18% 90%",
      "--sidebar-ring": "153 44% 30%",
    },
  },
  {
    id: "sunset",
    name: "Sunset",
    swatches: ["#E07A5F", "#FFF8F4", "#F2DDD5"],
    vars: {
      "--background": "20 50% 98%",
      "--foreground": "15 30% 18%",
      "--card": "20 60% 100%",
      "--card-foreground": "15 30% 18%",
      "--popover": "20 60% 100%",
      "--popover-foreground": "15 30% 18%",
      "--primary": "14 64% 62%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "20 40% 94%",
      "--secondary-foreground": "15 30% 18%",
      "--muted": "20 30% 95%",
      "--muted-foreground": "15 15% 46%",
      "--accent": "20 40% 94%",
      "--accent-foreground": "15 30% 18%",
      "--border": "20 30% 90%",
      "--input": "20 30% 90%",
      "--ring": "14 64% 62%",
      "--sidebar-background": "20 60% 100%",
      "--sidebar-foreground": "15 15% 50%",
      "--sidebar-primary": "14 64% 62%",
      "--sidebar-primary-foreground": "0 0% 100%",
      "--sidebar-accent": "20 40% 94%",
      "--sidebar-accent-foreground": "15 30% 18%",
      "--sidebar-border": "20 30% 90%",
      "--sidebar-ring": "14 64% 62%",
    },
  },
  {
    id: "lavender",
    name: "Lavender",
    swatches: ["#7C5CBF", "#F8F5FF", "#E8E0F5"],
    vars: {
      "--background": "264 30% 98%",
      "--foreground": "264 25% 18%",
      "--card": "264 40% 100%",
      "--card-foreground": "264 25% 18%",
      "--popover": "264 40% 100%",
      "--popover-foreground": "264 25% 18%",
      "--primary": "264 42% 55%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "264 25% 95%",
      "--secondary-foreground": "264 25% 18%",
      "--muted": "264 20% 96%",
      "--muted-foreground": "264 12% 46%",
      "--accent": "264 25% 95%",
      "--accent-foreground": "264 25% 18%",
      "--border": "264 20% 91%",
      "--input": "264 20% 91%",
      "--ring": "264 42% 55%",
      "--sidebar-background": "264 40% 100%",
      "--sidebar-foreground": "264 12% 52%",
      "--sidebar-primary": "264 42% 55%",
      "--sidebar-primary-foreground": "0 0% 100%",
      "--sidebar-accent": "264 25% 95%",
      "--sidebar-accent-foreground": "264 25% 18%",
      "--sidebar-border": "264 20% 91%",
      "--sidebar-ring": "264 42% 55%",
    },
  },
  {
    id: "slate",
    name: "Slate",
    swatches: ["#64748B", "#F8FAFC", "#E2E8F0"],
    vars: {
      "--background": "210 20% 98%",
      "--foreground": "222 20% 18%",
      "--card": "0 0% 100%",
      "--card-foreground": "222 20% 18%",
      "--popover": "0 0% 100%",
      "--popover-foreground": "222 20% 18%",
      "--primary": "215 16% 47%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "214 20% 95%",
      "--secondary-foreground": "222 20% 18%",
      "--muted": "214 18% 96%",
      "--muted-foreground": "215 14% 46%",
      "--accent": "214 20% 95%",
      "--accent-foreground": "222 20% 18%",
      "--border": "214 18% 90%",
      "--input": "214 18% 90%",
      "--ring": "215 16% 47%",
      "--sidebar-background": "0 0% 100%",
      "--sidebar-foreground": "215 14% 52%",
      "--sidebar-primary": "215 16% 47%",
      "--sidebar-primary-foreground": "0 0% 100%",
      "--sidebar-accent": "214 20% 95%",
      "--sidebar-accent-foreground": "222 20% 18%",
      "--sidebar-border": "214 18% 90%",
      "--sidebar-ring": "215 16% 47%",
    },
  },
  {
    id: "rose",
    name: "Rosé",
    swatches: ["#D4637A", "#FFF5F7", "#F5DEE3"],
    vars: {
      "--background": "345 30% 98%",
      "--foreground": "345 25% 18%",
      "--card": "345 40% 100%",
      "--card-foreground": "345 25% 18%",
      "--popover": "345 40% 100%",
      "--popover-foreground": "345 25% 18%",
      "--primary": "348 55% 61%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "345 25% 95%",
      "--secondary-foreground": "345 25% 18%",
      "--muted": "345 20% 96%",
      "--muted-foreground": "345 12% 46%",
      "--accent": "345 25% 95%",
      "--accent-foreground": "345 25% 18%",
      "--border": "345 20% 91%",
      "--input": "345 20% 91%",
      "--ring": "348 55% 61%",
      "--sidebar-background": "345 40% 100%",
      "--sidebar-foreground": "345 12% 52%",
      "--sidebar-primary": "348 55% 61%",
      "--sidebar-primary-foreground": "0 0% 100%",
      "--sidebar-accent": "345 25% 95%",
      "--sidebar-accent-foreground": "345 25% 18%",
      "--sidebar-border": "345 20% 91%",
      "--sidebar-ring": "348 55% 61%",
    },
  },
  {
    id: "earth",
    name: "Earth",
    swatches: ["#A67C52", "#FBF8F4", "#EDE4D8"],
    vars: {
      "--background": "34 25% 97%",
      "--foreground": "28 25% 18%",
      "--card": "34 30% 100%",
      "--card-foreground": "28 25% 18%",
      "--popover": "34 30% 100%",
      "--popover-foreground": "28 25% 18%",
      "--primary": "28 38% 48%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "34 22% 94%",
      "--secondary-foreground": "28 25% 18%",
      "--muted": "34 18% 95%",
      "--muted-foreground": "28 12% 46%",
      "--accent": "34 22% 94%",
      "--accent-foreground": "28 25% 18%",
      "--border": "34 18% 90%",
      "--input": "34 18% 90%",
      "--ring": "28 38% 48%",
      "--sidebar-background": "34 30% 100%",
      "--sidebar-foreground": "28 12% 52%",
      "--sidebar-primary": "28 38% 48%",
      "--sidebar-primary-foreground": "0 0% 100%",
      "--sidebar-accent": "34 22% 94%",
      "--sidebar-accent-foreground": "28 25% 18%",
      "--sidebar-border": "34 18% 90%",
      "--sidebar-ring": "28 38% 48%",
    },
  },
];

export function getThemeById(id: string | null | undefined): ThemePalette {
  return THEME_PALETTES.find((t) => t.id === id) ?? THEME_PALETTES[0];
}

/** Apply a theme palette's CSS variables to a DOM element (default: documentElement) */
export function applyTheme(themeId: string | null | undefined, el?: HTMLElement) {
  const target = el ?? document.documentElement;
  const theme = getThemeById(themeId);
  for (const [key, value] of Object.entries(theme.vars)) {
    target.style.setProperty(key, value);
  }
}
