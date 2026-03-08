# MagicCursor

**MagicCursor** is a lightweight JavaScript utility that enhances the mouse cursor with:

- 🎯 Custom cursor characters, images, or CSS cursors
- ✨ Particle trails following the cursor
- 🌀 Smooth cursor follower with configurable delay
- 🎨 Multiple particle shapes, colors, and physics options
- 🖱 Hover effects with custom cursor, particles, and callbacks

It uses **pure JavaScript and Canvas**, with no external dependencies.

---

# Installation

Download or include the script in your project.

```html
<script src="magic-cursor.js"></script>
```

Then initialize it:

```javascript
const cursor = new MagicCursor();
```

---

# Basic Example

```javascript
const cursor = new MagicCursor({
  cursor: "✨",
  delay: 0.2,
  className: "cursor-follower"
});
```

---

# Cursor Options

| Option | Type | Default | Description |
|------|------|------|------|
| `cursor` | string | `"default"` | Cursor style, emoji, or image URL |
| `delay` | number | `0.15` | Smooth follower delay (0–1) |
| `className` | string | `null` | CSS class for the cursor follower element |
| `particles` | object | `null` | Particle system configuration |

---

# Particle System

Enable particles when creating the cursor:

```javascript
const cursor = new MagicCursor({
  particles: {
    baseSize: 5,
    spawnDistance: 15,
    colors: "rainbow"
  }
});
```

---

# Particle Options

| Option | Default | Description |
|------|------|------|
| `selector` | `"body"` | Container element where particles render |
| `shape` | `"circle"` | `circle`, `square`, `triangle`, or image |
| `rotation` | `[0,360]` | Initial rotation range |
| `spin` | `[-0.1,0.1]` | Rotation speed |
| `gravity` | `0` | Downward force |
| `friction` | `1` | Velocity damping |
| `baseSize` | `4` | Initial particle size |
| `finalSize` | `0` | Final size over lifetime |
| `decay` | `0.015` | Opacity fade speed |
| `speedMultiplier` | `0` | Particle velocity |
| `colors` | `"rainbow"` | Color or array of colors |
| `spawnDistance` | `20` | Distance mouse moves before spawning |
| `spawnChance` | `1` | Probability of spawning |
| `spawnAmount` | `1` | Particles per spawn |
| `bounce` | `0.7` | Bounce strength |
| `useCollision` | `false` | Enable container collision |
| `lifetime` | `0` | Frames before fading |

---

# Hover Effects

You can apply different cursor styles and particles on hover.

```javascript
cursor.onHover({
  selector: ".button",
  cursor: "🔥",
  className: "hover-cursor",
  particles: {
    colors: ["#ff0000", "#ff9900", "#ffff00"],
    baseSize: 6,
    speedMultiplier: 2
  }
});
```

---

# Methods

## addParticles(options)

Adds a particle system to the cursor.

```javascript
cursor.addParticles({
  colors: "rainbow",
  baseSize: 5
});
```

---

## onHover(options)

Applies custom effects when hovering elements.

```javascript
cursor.onHover({
  selector: ".card",
  cursor: "⭐"
});
```

---

# Cursor Types

You can use:

### Standard CSS cursors

```javascript
cursor: "pointer"
```

### Emoji or characters

```javascript
cursor: "🔥"
```

### Image URL

```javascript
cursor: "https://example.com/cursor.png"
```

---

# CSS Example (Follower)

```css
.cursor-follower {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  mix-blend-mode: difference;
  transform: translate(-50%, -50%);
}
```

---

# Example Setup

```javascript
const cursor = new MagicCursor({
  cursor: "✨",
  className: "cursor-follower",
  particles: {
    colors: "rainbow",
    baseSize: 4,
    speedMultiplier: 1,
    spawnDistance: 10
  }
});

cursor.onHover({
  selector: "a, button",
  cursor: "👉"
});
```

---

# Features

- Lightweight
- No dependencies
- Custom cursor rendering
- Particle physics
- Hover interactions
- Canvas based rendering
- Automatic cleanup

---

# License

MIT