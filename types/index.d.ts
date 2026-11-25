export type Fill = { percent?: number; tokens?: number }

declare module 'claude-code' {
  interface PluginState {
    'north-pole': { fill: Fill }
  }
}
