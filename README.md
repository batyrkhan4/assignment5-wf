# Assignment 5: Advanced JavaScript and DOM Manipulation
**Project Theme:** Minecraft PvP Championship (MCTiers League)  
**Team Members:** Batyrkhan Uvayev & Yermek Sain  
**Course:** Frontend Development  

---

## 🌟 Overview
This project is an advanced, interactive esports hub built for competitive Minecraft PvP tier testing and tournament management. It implements all requirements of **Assignment 5: Advanced JavaScript and DOM Manipulation**, expanding upon Assignment 4 with rich DOM manipulation, event handling, dynamic styling, Web Audio API sound synthesis, higher-order functions, and stateful callbacks.

---

## 🚀 Key Implemented Features

### 1. DOM Manipulation & Dynamic Styling
- **Star Rating System (`querySelectorAll`):** Interactive 5-star rating widget allowing users to rate the championship hub. Clicking sets rating, dynamically updates color and text sentiment message, pulses animation, and plays a musical chime.
- **Day / Night Theme Toggle (`classList.toggle`):** Seamless switch between Day (Light) and Night (Dark) visual modes with dynamic CSS variables and `localStorage` persistence.
- **Dynamic Background Colors:** Preserved Assignment 4 gradient cycler modifying `document.body.style.backgroundImage`.
- **"Read More" Toggle (`style.display`):** Expandable tournament rules toggle that dynamically shows/hides content and updates button label.

### 2. Event Handling & Keyboard Navigation
- **Keyboard Navigation (Arrow Keys):** Capture `keydown` events on navigation menu items (`ArrowRight`, `ArrowLeft`, `ArrowDown`, `ArrowUp`, `Home`, `End`) to move keyboard focus between pages dynamically.
- **Switch Statements:**
  - Time-of-day greeting (Morning, Afternoon, Evening, Night) updating greeting badges based on system clock.
  - Category badge styling in the match filtering system.
  - Rating sentiment feedback.
  - Keyboard navigation key routing.
- **Callback State Management:** Multi-step wizard navigation utilizing callback functions `goToStep(targetIndex, callback)` to manage step transitions and maintain input state.
- **Asynchronous Submission with Callback:** Asynchronously validates and submits player registration data without reloading the page, displaying a confirmation card with ticket ID.

### 3. JavaScript Advanced Concepts
- **Data Structures (Objects & Arrays):** Structured arrays of objects for tournament matches, player leaderboard, arenas, and pro combat tips.
- **Higher-Order Functions:**
  - `Array.prototype.filter()`: Real-time filtering of matches and leaderboard players by discipline and search input.
  - `Array.prototype.map()`: Transforming data objects into dynamic HTML cards and table rows.
  - `Array.prototype.reduce()`: Calculating aggregate tournament statistics (total league points, top scorer, active participants).
  - `Array.prototype.sort()`: Sorting players by rank and score.
- **Web Audio API Sound Effects:**
  - Crisp mechanical click sounds.
  - Dynamic pentatonic star rating chimes.
  - Tournament filter switch blips.
  - Level-up / success fanfare on registration submission.
  - Toggle button (`🔊 Sound: On/Off`) to mute or unmute audio.
- **Interactive Arena Gallery (Attribute Manipulation):**
  - Thumbnail gallery where clicking a thumbnail dynamically updates the main display image `src`, `alt`, heading, badge, and tactical description with smooth fade transitions.

---

## 📂 Project Structure
```text
project_assignment5/
├── index.html            # Main Championship Hub & Arena Showcase
├── leaderboard.html      # Live Player Tier Rankings with Search & Filters
├── contact.html          # Multi-Step Registration Wizard with Callbacks
├── about.html            # Team Profiles, FAQ Accordion & Newsletter Popup
├── css/
│   ├── bootstrap.min.css # Bootstrap grid & utilities
│   └── style.css         # Custom esports styles, themes & animations
├── js/
│   ├── bootstrap.bundle.min.js
│   └── script.js         # Comprehensive, modular Assignment 5 JS logic
└── images/               # Arena photos, discipline icons, team avatars
```

---

