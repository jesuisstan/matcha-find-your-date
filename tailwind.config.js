/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
    },
    screens: {
      xs: '480px',

      sm: '640px',
      // => @media (min-width: 640px) { ... }

      md: '900px',
      // => @media (min-width: 900px) { ... }

      lg: '1200px',
      // => @media (min-width: 1200px) { ... }

      xl: '1500px',
      // => @media (min-width: 1500px) { ... }
    },
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none', // remove max-width for prose
          },
        },
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        positive: 'hsl(var(--positive))',
        negative: 'hsl(var(--negative))',
        card: 'hsl(var(--card))',
        c42orange: 'hsl(var(--c42orange))',
        c42green: 'hsl(var(--c42green))',

        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
      },
      //backgroundImage: {
      //  'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      //  'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      //},
      backgroundImage: {
        'identity-background': "url('/identity/background.jpg')",
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        hide: {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        slideIn: {
          from: {
            transform: 'translateX(calc(100% + var(--viewport-padding)))',
          },
          to: { transform: 'translateX(0)' },
        },
        swipeOut: {
          from: { transform: 'translateX(var(--radix-toast-swipe-end-x))' },
          to: { transform: 'translateX(calc(100% + var(--viewport-padding)))' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        hide: 'hide 100ms ease-in',
        slideIn: 'slideIn 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        swipeOut: 'swipeOut 100ms ease-out',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.smooth42transition': {
          transition: 'all 300ms ease-in-out',
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    },
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
  ],
};
