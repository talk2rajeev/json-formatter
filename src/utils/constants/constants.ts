export const themes = ['vs-dark', 'vs', 'hc-black'] as const;
export type Theme = typeof themes[number];