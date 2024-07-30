/* colorsHEX is used to set colors' values in case "hsl(var(--<global-name-of-color>))"-approach does NOT work
    (for example, for "exporting" in StockChart component) */

export const colorsHEX = {
  light: {
    foreground: '#020817',
    background: '#F5F5F5',
    secondary: '#52616B',
    card: '#FFFFFF',
    positive: '#4BBB3A',
    negative: '#B72F2D',
    muted: '#BEC6CA',
    stagflation: '#f7ad00',
    heatingup: '#174f1e',
    goldilocks: '#629d11',
    slowgrowth: '#7f1b0b',
  },
  dark: {
    foreground: '#D9D9D9',
    background: '#09090B',
    secondary: '#52616B',
    card: '#171717',
    positive: '#4BBB3A',
    negative: '#B72F2D',
    muted: '#1E293B',
    stagflation: '#f7ad00',
    heatingup: '#174f1e',
    goldilocks: '#629d11',
    slowgrowth: '#7f1b0b',
  },
};
