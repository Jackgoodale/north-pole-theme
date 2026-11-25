import type { EngineInterface, Register, SessionContextUsage, ThemeSetArgs } from 'claude-code'
import { atom, read, update } from 'claude-code'

import type { Fill } from '../types'
import { makeColors } from './make-colors.js'
import { buildScene } from './scene'

// Crimson and gold: deep wine surfaces, a gilded accent.
const { theme, problems } = makeColors({
  label: 'Emperor',
  only: 'dark',
  roles: { accent: '#e2b54a', danger: '#e5484d', success: '#4fb477', warning: '#f08a24', pro: '#b08ce0' },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#1a0b0e',
        'surface-1': '#221013',
        'surface-2': '#2a1418',
        'surface-3': '#31181c',
        'text-primary': '#f7ecd8',
        'text-secondary': '#dccbb0',
        'text-muted': '#b9a68a',
      },
    },
  },
})

const BASE: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'emperor', glass: { blur: 14, tint: '#1a0b0e', opacity: 0.6 } },
  overrideColorScheme: 'dark',
}

const LOOK: ThemeSetArgs = {
  ...BASE,
  style: {
    Text: { fontFamily: ['serif'], fontSize: 16, lineHeight: 25 },
    Heading: { fontFamily: ['serif'], color: '#e8c25a', letterSpacing: 1 },
    UserMessage: { backgroundColor: '#7d1420', color: '#fff6e6', radius: 6, borderColor: '#d9b04a', borderWidth: 2, paddingX: 16, paddingY: 10 },
    AssistantMessage: { backgroundColor: '#1d0d10', color: '#f7ecd8', radius: 4, borderColor: '#6b4e22', borderWidth: 1, padding: 14 },
  },
}

const fill = atom({ plugin: 'emperor', key: 'fill' } as const, {} as Fill)

function toFill(context: SessionContextUsage): Fill {
  return { percent: context.percent, tokens: context.tokens }
}

// Whether the theme is on, remembered across sessions. On unless /emperor turned it off.
const ENABLED = 'enabled'

async function isEnabled($: EngineInterface): Promise<boolean> {
  return (await $.store.get(ENABLED)) !== false
}

async function applyLook($: EngineInterface): Promise<void> {
  const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))

  if (unpainted !== undefined) {
    $.ui.toast(unpainted)
  }
  let set
  try {
    set = await $.theme.set(LOOK)
  } catch (error) {
    $.ui.log(String(error))
    set = await $.theme.set(BASE)
  }
  if (!set.isDrawn) {
    $.ui.status(set.reason)
  }
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'emperor',
      description: 'Take the throne: turn the imperial throne-room theme on or off (/emperor, /emperor on, /emperor off)',
    })
    if (await isEnabled($)) {
      await applyLook($)
    }
    const { context } = await $.session.usage()
    await update($, fill, () => toFill(context))

    return next(e)
  })

  on('command.run', { command: 'emperor' }, async ($, e) => {
    const arg = e.args.trim().toLowerCase()
    const turnOn = arg === 'on' ? true : arg === 'off' ? false : !(await isEnabled($))
    await $.store.set(ENABLED, turnOn)

    if (turnOn) {
      await applyLook($)
      return { text: 'Vive l’Empereur! The throne is yours.' }
    }
    await $.theme.clear()
    return { text: 'You step down from the throne. Type /emperor to reclaim it.' }
  })

  on('session.measure', async ($, e, next) => {
    if (e.changed.includes('context')) {
      await update($, fill, () => toFill(e.context))
    }
    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, async ($, e, next) => {
    if (e.props.scene !== 'emperor' || (e.surface !== 'desktop' && e.surface !== 'mobile')) {
      return next(e)
    }
    const { percent, tokens } = await read($, fill)
    const { Svg } = $.ui.resolve(e)
    const shown = percent === undefined ? 'unknown' : `${percent}%`

    return (
      <Svg
        source={buildScene(percent, tokens)}
        alt={`An imperial throne room; the war banner shows a context window ${shown} full`}
        isInteractive
      />
    )
  })
}
