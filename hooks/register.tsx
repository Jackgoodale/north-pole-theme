import type { Register, SessionContextUsage, ThemeSetArgs } from 'claude-code'
import { atom, read, update } from 'claude-code'

import type { Fill } from '../types'
import { makeColors } from './make-colors.js'
import { buildScene } from './scene'

// A dark winter night: navy surfaces, icy accent, festive red and pine green.
const { theme, problems } = makeColors({
  label: 'North Pole',
  only: 'dark',
  roles: { accent: '#7cc4ff', danger: '#e5484d', success: '#3fbf7f', warning: '#f2c14e', pro: '#b18cff' },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#0b1630',
        'surface-1': '#111e3b',
        'surface-2': '#162545',
        'surface-3': '#1b2b4e',
        'text-primary': '#f2f7ff',
        'text-secondary': '#c9d6ea',
        'text-muted': '#9fb2cf',
      },
    },
  },
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'north-pole', glass: { blur: 14, tint: '#0b1630', opacity: 0.6 } },
  overrideColorScheme: 'dark',
}

const fill = atom({ plugin: 'north-pole', key: 'fill' } as const, {} as Fill)

function toFill(context: SessionContextUsage): Fill {
  return { percent: context.percent, tokens: context.tokens }
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }
    const set = await $.theme.set(LOOK)

    if (!set.isDrawn) {
      $.ui.status(set.reason)
    }
    const { context } = await $.session.usage()
    await update($, fill, () => toFill(context))

    return next(e)
  })

  // After each turn (and after /compact) the engine measures the session.
  on('session.measure', async ($, e, next) => {
    if (e.changed.includes('context')) {
      await update($, fill, () => toFill(e.context))
    }
    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, async ($, e, next) => {
    if (e.props.scene !== 'north-pole' || (e.surface !== 'desktop' && e.surface !== 'mobile')) {
      return next(e)
    }
    const { percent, tokens } = await read($, fill)
    const { Svg } = $.ui.resolve(e)
    const shown = percent === undefined ? 'unknown' : `${percent}%`

    return (
      <Svg
        source={buildScene(percent, tokens)}
        alt={`Christmas night at the North Pole, snow piled to match a context window ${shown} full`}
        isInteractive
      />
    )
  })
}
