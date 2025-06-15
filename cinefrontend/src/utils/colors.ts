export function stringToColor(
  value: string,
  saturation: number = 100,
  lightness: number = 75
) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  return `hsl(${hash % 360}, ${saturation}%, ${lightness}%)`;
}

export function lightenHexColor(hexColor: string, percentage: number): string {
    const normalizedHex = normalizeHexFormat(hexColor);
    return applyLightnessAdjustment(normalizedHex, percentage, 'lighten');
}

export function darkenHexColor(hexColor: string, percentage: number): string {
    const normalizedHex = normalizeHexFormat(hexColor);
    return applyLightnessAdjustment(normalizedHex, percentage, 'darken');
}

function normalizeHexFormat(hex: string): string {
    if (hex.length === 4) {
        return hex.replace(/#(.)(.)(.)/, '#$1$1$2$2$3$3');
    }
    return hex;
}

function applyLightnessAdjustment(
    hex: string,
    percentage: number,
    operation: 'lighten' | 'darken'
): string {
    const rgbChannels = parseColorChannels(hex);
    
    const adjustedChannels = rgbChannels.map(channel => {
        const adjustmentFactor = percentage / 100;
        
        return operation === 'lighten'
            ? Math.min(255, channel + (255 - channel) * adjustmentFactor)
            : Math.max(0, channel - channel * adjustmentFactor);
    });

    return formatToHex(adjustedChannels);
}

function parseColorChannels(hex: string): number[] {
    const hexWithoutHash = hex.slice(1);
    const channelPairs = hexWithoutHash.match(/.{2}/g) || [];
    return channelPairs.map(pair => parseInt(pair, 16));
}

function formatToHex(channels: number[]): string {
    return '#' + channels
        .map(channel => Math.round(channel).toString(16).padStart(2, '0'))
        .join('');
}

export function cssHslToHex(cssHsl: string): string {
    const match = cssHsl.match(/hsl\(\s*(-?\d+\.?\d*)\s*,\s*(\d+\.?\d*)%\s*,\s*(\d+\.?\d*)%\s*\)/i);
    
    if (!match) return cssHsl;
    
    const h = parseFloat(match[1]) / 360;
    const s = parseFloat(match[2]) / 100;
    const l = parseFloat(match[3]) / 100;

    const hueToRgb = (p: number, q: number, t: number): number => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
    };

    if (s === 0) {
        const gray = Math.round(l * 255);
        return `#${gray.toString(16).padStart(2, '0').repeat(3)}`;
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    const r = Math.round(hueToRgb(p, q, h + 1/3) * 255);
    const g = Math.round(hueToRgb(p, q, h) * 255);
    const b = Math.round(hueToRgb(p, q, h - 1/3) * 255);

    return `#${[r, g, b].map(c => 
        Math.round(c).toString(16).padStart(2, '0')
    ).join('')}`;
}