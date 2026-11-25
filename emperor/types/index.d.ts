export type Fill = { percent?: number; tokens?: number }

declare module 'claude-code' {
  interface PluginState {
    emperor: { fill: Fill }
  }
}
