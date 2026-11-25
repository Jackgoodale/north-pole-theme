# North Pole theme for Claude Code

A Christmas backdrop for the Claude Code desktop app: a snowy North Pole night with a decorated tree, a snowman, a lamp post, an A-frame cabin and northern mountains. A robin in a Santa hat sits on a hanging sign that shows how full your context window is, and the snow piles up higher as the context fills (and melts back after `/compact`).

## Turn it on and off

Type `/xmas` to switch the theme on or off (or `/xmas on`, `/xmas off`). Your choice is remembered for new sessions.

## Install

In the desktop app: click **+** next to the prompt box, then **Plugins**, **Add marketplace** with `Jackgoodale/north-pole-theme`, then **Add plugin**.

At the prompt of a terminal session:

```
/plugin install north-pole --marketplace Jackgoodale/north-pole-theme
```

From a shell:

```
claude plugin install north-pole --marketplace Jackgoodale/north-pole-theme
```

Answer `y` to add the marketplace, then pick a scope (user is first).

Already installed? Update to get `/xmas`: in the desktop app's Plugins menu, update the marketplace, or run `claude plugin marketplace update north-pole-theme`.

## Bonus theme: Emperor

An imperial throne room: crimson walls sown with golden bees, you, cartoon-style, in coronation robes on a gilded throne, candelabra, and a tricolor war banner that carries your context and token count. Its laurel wreath fills in leaf by leaf as your context fills. Type `/throne` to take the throne or step down.

Install it the same way, choosing **emperor** instead of north-pole, or:

```
claude plugin install emperor --marketplace Jackgoodale/north-pole-theme
```

Only one theme shows at a time: whichever you switched on last wins, so turn the other off (`/xmas off` or `/throne off`).
