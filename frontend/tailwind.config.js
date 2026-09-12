tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "surface-card": "#FFFFFF",
        "text-muted": "#64748B",

        "primary": "#2563EB",
        "primary-container": "#DBEAFE",
        "on-primary": "#FFFFFF",
        "on-primary-container": "#1E3A8A",
        "primary-fixed": "#BFDBFE",
        "primary-fixed-dim": "#93C5FD",
        "on-primary-fixed": "#172554",
        "on-primary-fixed-variant": "#1E40AF",
        "inverse-primary": "#60A5FA",

        "secondary": "#2563EB",
        "secondary-container": "#EFF6FF",
        "on-secondary": "#FFFFFF",
        "on-secondary-container": "#1E3A8A",
        "secondary-fixed": "#DBEAFE",
        "secondary-fixed-dim": "#BFDBFE",
        "on-secondary-fixed": "#172554",
        "on-secondary-fixed-variant": "#1E40AF",

        "tertiary": "#2563EB",
        "tertiary-container": "#DBEAFE",
        "on-tertiary": "#FFFFFF",
        "on-tertiary-container": "#1E3A8A",
        "tertiary-fixed": "#DBEAFE",
        "tertiary-fixed-dim": "#BFDBFE",
        "on-tertiary-fixed": "#172554",
        "on-tertiary-fixed-variant": "#1E40AF",

        "background": "#F6F7F1",
        "surface": "#F6F7F1",
        "surface-bright": "#FAFAF6",
        "surface-dim": "#E5E7DF",

        "surface-container-lowest": "#FFFFFF",
        "surface-container-low": "#F2F3ED",
        "surface-container": "#ECEDE7",
        "surface-container-high": "#E5E7DF",
        "surface-container-highest": "#DEE1D8",
        "surface-variant": "#E1E3DC",

        "on-surface": "#193330",
        "on-surface-variant": "#526663",
        "on-background": "#193330",

        "outline": "#718582",
        "outline-variant": "#C7D9D6",

        "gradient-start": "#2563EB",
        "gradient-end": "#2563EB",

        "surface-tint": "#2563EB",

        "inverse-surface": "#193330",
        "inverse-on-surface": "#FFFFFF",

        "error": "#BA1A1A",
        "on-error": "#FFFFFF",
        "error-container": "#FFDAD6",
        "on-error-container": "#93000A"
      },

      borderRadius: {
        DEFAULT: "1rem",
        lg: "2rem",
        xl: "3rem",
        full: "9999px"
      },

      spacing: {
        "margin-mobile": "20px",
        gutter: "24px",
        "margin-desktop": "40px",
        base: "8px",
        "section-gap": "64px"
      },

      fontFamily: {
        "display-lg": ["Montserrat"],
        "headline-md": ["Montserrat"],
        "label-sm": ["Montserrat"],
        "label-md": ["Montserrat"],
        "headline-lg-mobile": ["Montserrat"],
        "headline-lg": ["Montserrat"],
        "body-lg": ["Montserrat"],
        "body-md": ["Montserrat"]
      },

      fontSize: {
        "display-lg": ["48px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "800" }],
        "headline-md": ["20px", { lineHeight: "1.3", fontWeight: "600" }],
        "label-sm": ["12px", { lineHeight: "1.4", fontWeight: "500" }],
        "label-md": ["14px", { lineHeight: "1.4", letterSpacing: "0.02em", fontWeight: "600" }],
        "headline-lg-mobile": ["26px", { lineHeight: "1.2", fontWeight: "700" }],
        "headline-lg": ["32px", { lineHeight: "1.2", fontWeight: "700" }],
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "1.5", fontWeight: "400" }]
      }
    }
  }
};