# ✨ MagicCursor

![license](https://img.shields.io/badge/license-MIT-blue.svg)
![size](https://img.shields.io/badge/dependency-none-brightgreen)
![js](https://img.shields.io/badge/javascript-ES6+-yellow)
![status](https://img.shields.io/badge/status-stable-success)

**MagicCursor** is a lightweight JavaScript utility that lets you create **custom cursors, smooth followers, and particle trails** with powerful configuration.

It uses **pure JavaScript + Canvas** with **zero dependencies**.

Perfect for:

- landing pages
- portfolios
- creative websites
- interactive UI
- gaming interfaces

---

# ✨ Features

- 🎯 Custom cursors (emoji, text, image, or CSS cursor)
- 🌀 Smooth cursor follower
- ✨ Particle trail system
- 🎨 Multiple particle shapes
- 🌈 Rainbow or custom colors
- 🧲 Physics simulation (gravity, friction, bounce)
- 🖱 Hover interactions
- ⚡ Lightweight
- 🧹 Automatic cleanup

---

# 📦 Installation

Simply include the script in your project.

```html
<script src="magic-cursor.js"></script>
```

Then initialize:

```javascript
const cursor = new MagicCursor();
```

---

# 🚀 Basic Example

```javascript
const cursor = new MagicCursor({
  cursor: "✨",
  delay: 0.2,
  className: "cursor-follower"
});
```

---

# 🎯 Cursor Options

| Option | Type | Default | Description |
|------|------|------|------|
| `cursor` | string | `"default"` | Cursor style, emoji, or image |
| `delay` | number | `0.15` | Follower smoothing |
| `className` | string | `null` | CSS class applied to follower |
| `particles` | object | `null` | Default particle configuration |

---

# 🖱 Cursor Types

### Standard CSS Cursor

```javascript
cursor: "pointer"
```

### Emoji / Character Cursor

```javascript
cursor: "🔥"
```

### Image Cursor

```javascript
cursor: "https://example.com/cursor.png"
```

---

# 🌀 Cursor Follower

If `className` is provided, a follower element will be created.

Example CSS:

```css
.cursor-follower {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: white;
  mix-blend-mode: difference;
  transform: translate(-50%, -50%);
  pointer-events: none;
}
```

---

# ✨ Particle System

Particles can be enabled globally:

```javascript
const cursor = new MagicCursor({
  particles: {
    baseSize: 5,
    spawnDistance: 12,
    colors: "rainbow"
  }
});
```

Or dynamically:

```javascript
cursor.addParticles(options);
```

---

# ⚙️ Particle Options

| Option | Default | Description |
|------|------|------|
| `selector` | `"body"` | Container where particles render |
| `shape` | `"circle"` | `circle`, `square`, `triangle`, or image |
| `rotation` | `[0,360]` | Initial rotation range |
| `spin` | `[-0.1,0.1]` | Rotation speed |
| `gravity` | `0` | Downward force |
| `friction` | `1` | Velocity damping |
| `baseSize` | `4` | Initial size |
| `finalSize` | `0` | Final size |
| `decay` | `0.015` | Fade speed |
| `speedMultiplier` | `0` | Velocity multiplier |
| `colors` | `"rainbow"` | Color, array, or rainbow |
| `spawnDistance` | `20` | Distance before spawn |
| `spawnChance` | `1` | Spawn probability |
| `spawnAmount` | `1` | Particles per spawn |
| `bounce` | `0.7` | Bounce force |
| `useCollision` | `false` | Enable collisions |
| `lifetime` | `0` | Frames before fading |

---

# 🎲 Random Ranges

Many options accept **random ranges**.

Example:

```javascript
baseSize: [2,6]
```

Each particle receives a random value between **2 and 6**.

You can also use **random choice objects**:

```javascript
shape: {
  a: "circle",
  b: "triangle",
  c: "square"
}
```

---

# 🖱 Hover Interactions

Change cursor, follower class, and particles when hovering elements.

```javascript
cursor.onHover({
  selector: ".button",
  cursor: "🔥",
  className: "hover-cursor",

  particles: {
    colors: ["#ff0000","#ff9900","#ffff00"],
    baseSize: [4,8],
    speedMultiplier: 2
  }
});
```

---

# 🔁 Hover Callbacks

You can run custom code when entering or leaving elements.

```javascript
cursor.onHover({
  selector: ".card",

  onEnter: (element) => {
    console.log("Entered:", element);
  },

  onLeave: (element) => {
    console.log("Left:", element);
  }
});
```

---

# 🧩 Methods

## addParticles(options)

Adds a particle system.

```javascript
cursor.addParticles({
  colors: "rainbow",
  baseSize: 5
});
```

---

## onHover(options)

Adds hover interactions.

| Option | Description |
|------|------|
| `selector` | Target elements |
| `cursor` | Cursor on hover |
| `className` | Follower class |
| `particles` | Particle configuration |
| `onEnter` | Callback on enter |
| `onLeave` | Callback on leave |

---

# 🧹 Particle Lifecycle

Internal particle controls.

### pause()

Stops spawning particles.

### play()

Resumes spawning.

### destroy()

Stops spawning and removes the system once particles fade.

---

# 🎨 Preset Examples

## ✨ Sparkle Trail

```javascript
cursor.addParticles({
  colors: ["#ffffff","#ffe066","#ffd43b"],
  baseSize: [2,5],
  speedMultiplier: 1
});
```

---

## 🔥 Fire Trail

```javascript
cursor.addParticles({
  colors: ["#ff0000","#ff6600","#ffaa00"],
  gravity: -0.05,
  baseSize: [3,7],
  speedMultiplier: 1.5
});
```

---

## ❄ Snow Trail

```javascript
cursor.addParticles({
  colors: "#ffffff",
  gravity: 0.05,
  baseSize: [3,6],
  speedMultiplier: 0.5
});
```

---

# ⚡ Performance Notes

- Uses **Canvas rendering**
- Animations via **requestAnimationFrame**
- Distance-based particle spawning
- Automatic cleanup when destroyed

---

# 📄 License

MIT