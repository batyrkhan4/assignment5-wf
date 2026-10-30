
document.addEventListener("DOMContentLoaded", function () {
    console.log("MCTiers League: Assignment 5 Advanced JS Engine Initialized");


    const SoundEngine = {
        ctx: null,
        enabled: true,

        init() {
            if (!this.ctx) {
                const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                if (AudioContextClass) {
                    this.ctx = new AudioContextClass();
                }
            }
            if (this.ctx && this.ctx.state === "suspended") {
                this.ctx.resume();
            }
        },

        toggleSound() {
            this.enabled = !this.enabled;
            localStorage.setItem("mctiers_sound_enabled", this.enabled);
            this.updateButtonUI();
            if (this.enabled) {
                this.playClick();
            }
            return this.enabled;
        },

        updateButtonUI() {
            const btn = document.getElementById("soundToggleBtn");
            if (btn) {
                btn.innerHTML = this.enabled ? "🔊 Sound: On" : "🔇 Sound: Off";
                btn.setAttribute("aria-pressed", this.enabled ? "true" : "false");
            }
        },

        playClick() {
            if (!this.enabled) return;
            try {
                this.init();
                if (!this.ctx) return;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = "sine";
                osc.frequency.setValueAtTime(650, this.ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + 0.05);
                gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start();
                osc.stop(this.ctx.currentTime + 0.05);
            } catch (err) {
                console.warn("Audio playback not permitted yet", err);
            }
        },

        playStar(starIndex) {
            if (!this.enabled) return;
            try {
                this.init();
                if (!this.ctx) return;
                const scale = [261.63, 329.63, 392.00, 523.25, 659.25]; 
                const freq = scale[starIndex] || 440;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = "triangle";
                osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
                gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start();
                osc.stop(this.ctx.currentTime + 0.22);
            } catch (err) {
                console.warn(err);
            }
        },

        playSwitch() {
            if (!this.enabled) return;
            try {
                this.init();
                if (!this.ctx) return;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = "square";
                osc.frequency.setValueAtTime(320, this.ctx.currentTime);
                osc.frequency.setValueAtTime(480, this.ctx.currentTime + 0.04);
                gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.09);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start();
                osc.stop(this.ctx.currentTime + 0.09);
            } catch (err) {
                console.warn(err);
            }
        },

        playSuccess() {
            if (!this.enabled) return;
            try {
                this.init();
                if (!this.ctx) return;
                const notes = [392.00, 523.25, 659.25, 783.99];
                notes.forEach((freq, idx) => {
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    const startTime = this.ctx.currentTime + idx * 0.09;
                    osc.type = "sine";
                    osc.frequency.setValueAtTime(freq, startTime);
                    gain.gain.setValueAtTime(0.15, startTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);
                    osc.connect(gain);
                    gain.connect(this.ctx.destination);
                    osc.start(startTime);
                    osc.stop(startTime + 0.2);
                });
            } catch (err) {
                console.warn(err);
            }
        }
    };

    const savedSound = localStorage.getItem("mctiers_sound_enabled");
    if (savedSound !== null) {
        SoundEngine.enabled = savedSound === "true";
    }
    SoundEngine.updateButtonUI();

    const soundToggleBtn = document.getElementById("soundToggleBtn");
    if (soundToggleBtn) {
        soundToggleBtn.addEventListener("click", () => {
            SoundEngine.toggleSound();
        });
    }


    function initKeyboardNavigation() {
        const navLinks = Array.from(document.querySelectorAll(".navbar-nav .nav-link"));
        if (!navLinks.length) return;

        navLinks.forEach((link, index) => {
            link.addEventListener("keydown", (event) => {
                let targetIndex = null;

                switch (event.key) {
                    case "ArrowRight":
                    case "ArrowDown":
                        event.preventDefault();
                        targetIndex = (index + 1) % navLinks.length;
                        break;
                    case "ArrowLeft":
                    case "ArrowUp":
                        event.preventDefault();
                        targetIndex = (index - 1 + navLinks.length) % navLinks.length;
                        break;
                    case "Home":
                        event.preventDefault();
                        targetIndex = 0;
                        break;
                    case "End":
                        event.preventDefault();
                        targetIndex = navLinks.length - 1;
                        break;
                    default:
                        return;
                }

                if (targetIndex !== null) {
                    navLinks[targetIndex].focus();
                    SoundEngine.playClick();
                }
            });
        });
    }
    initKeyboardNavigation();


    function initThemeSwitcher() {
        const themeBtn = document.getElementById("themeToggleBtn");
        const body = document.body;

        const updateThemeUI = (isLight) => {
            if (themeBtn) {
                themeBtn.innerHTML = isLight ? "☀️ Theme: Day" : "🌙 Theme: Night";
                themeBtn.setAttribute("aria-label", isLight ? "Switch to Night theme" : "Switch to Day theme");
            }
        };

        const savedTheme = localStorage.getItem("mctiers_theme");
        if (savedTheme === "light") {
            body.classList.add("light-theme");
            updateThemeUI(true);
        } else {
            updateThemeUI(false);
        }

        if (themeBtn) {
            themeBtn.addEventListener("click", () => {
                const isLight = body.classList.toggle("light-theme");
                localStorage.setItem("mctiers_theme", isLight ? "light" : "dark");
                updateThemeUI(isLight);
                SoundEngine.playSwitch();
            });
        }

        const changeBgBtn = document.getElementById("changeThemeBtn");
        const gradients = [
            "linear-gradient(135deg, #0d0f17, #171a26)",
            "linear-gradient(135deg, #111827, #1f2937)",
            "linear-gradient(135deg, #1e1b4b, #312e81)",
            "linear-gradient(135deg, #064e3b, #065f46)",
            "linear-gradient(135deg, #451a03, #78350f)",
            "linear-gradient(135deg, #3b0764, #581c87)"
        ];
        let currentGrad = 0;
        if (changeBgBtn) {
            changeBgBtn.addEventListener("click", () => {
                currentGrad = (currentGrad + 1) % gradients.length;
                document.body.style.backgroundImage = gradients[currentGrad];
                document.body.style.backgroundAttachment = "fixed";
                document.body.style.backgroundSize = "cover";
                SoundEngine.playClick();
            });
        }
    }
    initThemeSwitcher();


    function initTimeGreeting() {
        const greetingEl = document.getElementById("timeGreeting");
        const greetingBadge = document.getElementById("greetingBadge");
        if (!greetingEl) return;

        const hour = new Date().getHours();
        let message = "";
        let badge = "";


        switch (true) {
            case (hour >= 5 && hour < 12):
                message = "Good morning, Warrior! Ready for morning duels? ⚔️";
                badge = "Dawn Training";
                break;
            case (hour >= 12 && hour < 18):
                message = "Good afternoon, Champion! Tournament arenas are live! 🏆";
                badge = "Prime Battles";
                break;
            case (hour >= 18 && hour < 23):
                message = "Good evening, Gladiator! Evening showdowns active! 🌌";
                badge = "Night League";
                break;
            default:
                message = "Welcome, Shadow Duelist! Elite underground arena open! 🌙";
                badge = "Midnight Ops";
                break;
        }

        greetingEl.textContent = message;
        if (greetingBadge) {
            greetingBadge.textContent = badge;
        }
    }
    initTimeGreeting();


    function initPvPTips() {
        const tipText = document.getElementById("pvpTipContent");
        const tipAuthor = document.getElementById("pvpTipAuthor");
        const tipBtn = document.getElementById("newTipBtn");
        if (!tipText || !tipBtn) return;

  
        const tips = [
            { quote: "Critical hits require falling momentum — jump and strike precisely on the descent for maximum hearts.", author: "Erauina (HT1 Champion)" },
            { quote: "Always keep a water bucket in your hotbar; it resets fall damage and extinguishes flame aspect immediately.", author: "Itzrealme (Pot PvP Lead)" },
            { quote: "In Axe PvP, disable enemy shields with an axe sprint-hit before switching to your sword for combo follow-ups.", author: "Crozzor (Axe Tier Test Host)" },
            { quote: "Place End Crystals on obsidian diagonally to shield your hitbox while dealing lethal blast radius damage.", author: "VapeFly (Crystal Specialist)" },
            { quote: "Speed II potions increase your FOV and maneuverability — learn to W-tap to continuously reset enemy sprint.", author: "Speedster (Tier 1 Duelist)" },
            { quote: "Spacing is king: keeping a 3-block reach distance prevents enemies from starting counter-combos.", author: "Sharpness (EU Regional Winner)" }
        ];

        let lastIndex = -1;

        tipBtn.addEventListener("click", () => {
            let nextIndex;
            do {
                nextIndex = Math.floor(Math.random() * tips.length);
            } while (nextIndex === lastIndex && tips.length > 1);

            lastIndex = nextIndex;
            const chosen = tips[nextIndex];

            tipText.style.opacity = "0";
            setTimeout(() => {
                tipText.textContent = `"${chosen.quote}"`;
                if (tipAuthor) tipAuthor.textContent = `— ${chosen.author}`;
                tipText.style.opacity = "1";
            }, 180);

            SoundEngine.playClick();
        });
    }
    initPvPTips();


    function initReadMore() {
        const readMoreBtn = document.getElementById("readMoreRulesBtn");
        const extendedRules = document.getElementById("extendedRules");
        if (!readMoreBtn || !extendedRules) return;

        readMoreBtn.addEventListener("click", () => {
            const isHidden = extendedRules.style.display === "" || extendedRules.style.display === "none";

            if (isHidden) {
                extendedRules.style.display = "block";
                readMoreBtn.textContent = "Collapse Rules ↑";
                readMoreBtn.setAttribute("aria-expanded", "true");
            } else {
                extendedRules.style.display = "none";
                readMoreBtn.textContent = "Read Extended Rules ↓";
                readMoreBtn.setAttribute("aria-expanded", "false");
            }

            SoundEngine.playClick();
        });
    }
    initReadMore();


    function initArenaGallery() {
        const displayImg = document.getElementById("arenaDisplayImg");
        const displayTitle = document.getElementById("arenaDisplayTitle");
        const displayDesc = document.getElementById("arenaDisplayDesc");
        const displayBadge = document.getElementById("arenaDisplayBadge");
        const thumbBtns = document.querySelectorAll(".arena-thumb-btn");

        if (!displayImg || !thumbBtns.length) return;


        const arenasData = {
            "overworld.jpg": {
                name: "Overworld Colosseum",
                badge: "Standard Duel Arena",
                desc: "Classic open-field battleground ideal for Sword 1.9+ spacing and shield mechanics under natural daylight."
            },
            "nether.jpg": {
                name: "Nether Fortress Bastion",
                badge: "Extreme Hazard",
                desc: "High-temperature arena surrounded by lava lakes. Testing fire-resistance management and tight corridor combat."
            },
            "end.jpg": {
                name: "The End Citadel",
                badge: "Crystal PvP Official",
                desc: "Void-edge arena with obsidian pillars designed exclusively for fast-paced End Crystal and anchor duels."
            },
            "dungeon.jpg": {
                name: "Ancient Stone Dungeon",
                badge: "Close Quarters",
                desc: "Subterranean stone labyrinth featuring claustrophobic corners where shield stun and axe crits dominate."
            },
            "portal.jpg": {
                name: "Ruined Portal Crossing",
                badge: "Hybrid Arena",
                desc: "Interdimensional gateway arena with uneven elevation challenges, crying obsidian blocks, and tactical cover."
            },
            "village.jpg": {
                name: "Desert Village Square",
                badge: "Tactical Skirmish",
                desc: "Urban combat testing rooftop traversal, parkour maneuvers, and multi-tier potion ambushes."
            }
        };

        thumbBtns.forEach((btn) => {
            btn.addEventListener("click", () => {
                const targetSrc = btn.getAttribute("data-src");
                const filename = btn.getAttribute("data-file");
                const arenaInfo = arenasData[filename] || {
                    name: "Tournament Arena",
                    badge: "Competitive",
                    desc: "Official battleground for competitive tier test matches."
                };

                thumbBtns.forEach((b) => b.classList.remove("active-thumb"));
                btn.classList.add("active-thumb");

                // Smooth fade transition
                displayImg.classList.add("fade-out");

                setTimeout(() => {
                    displayImg.src = targetSrc;
                    displayImg.alt = arenaInfo.name;

                    if (displayTitle) displayTitle.textContent = arenaInfo.name;
                    if (displayBadge) displayBadge.textContent = arenaInfo.badge;
                    if (displayDesc) displayDesc.textContent = arenaInfo.desc;

                    displayImg.classList.remove("fade-out");
                }, 150);

                SoundEngine.playClick();
            });
        });
    }
    initArenaGallery();


    function initStarRating() {
        const starBtns = document.querySelectorAll(".star-btn");
        const feedbackEl = document.getElementById("ratingFeedback");
        if (!starBtns.length) return;

        let currentRating = 0;

        function updateStarsVisual(ratingCount, isHover = false) {
            starBtns.forEach((btn) => {
                const starVal = parseInt(btn.getAttribute("data-star"), 10);
                if (starVal <= ratingCount) {
                    if (isHover) {
                        btn.classList.add("hovered");
                    } else {
                        btn.classList.add("active");
                    }
                } else {
                    btn.classList.remove(isHover ? "hovered" : "active");
                }
            });
        }

        function getRatingMessage(rating) {
            switch (rating) {
                case 1:
                    return "⭐ 1/5: Needs work — we are forging sharper swords!";
                case 2:
                    return "⭐⭐ 2/5: Decent — arena repairs in progress.";
                case 3:
                    return "⭐⭐⭐ 3/5: Solid battleground — Iron rank approved!";
                case 4:
                    return "⭐⭐⭐⭐ 4/5: Epic league — Diamond Tier quality!";
                case 5:
                    return "⭐⭐⭐⭐⭐ 5/5: Flawless Victory — Netherite Tier Legend!";
                default:
                    return "Click a star to rate the championship!";
            }
        }

        starBtns.forEach((btn, index) => {

            btn.addEventListener("mouseenter", () => {
                const hoverVal = parseInt(btn.getAttribute("data-star"), 10);
                updateStarsVisual(hoverVal, true);
            });

            btn.addEventListener("mouseleave", () => {
                starBtns.forEach((b) => b.classList.remove("hovered"));
                updateStarsVisual(currentRating, false);
            });


            btn.addEventListener("click", () => {
                currentRating = parseInt(btn.getAttribute("data-star"), 10);
                updateStarsVisual(currentRating, false);


                btn.classList.add("pulse");
                setTimeout(() => btn.classList.remove("pulse"), 300);

                if (feedbackEl) {
                    feedbackEl.textContent = getRatingMessage(currentRating);
                    feedbackEl.style.color = currentRating >= 4 ? "#10b981" : "#59c7f5";
                }

                SoundEngine.playStar(index);
            });
        });
    }
    initStarRating();


    function initMatchFilter() {
        const container = document.getElementById("matchesContainer");
        const filterBtns = document.querySelectorAll(".btn-discipline-filter");
        if (!container || !filterBtns.length) return;


        const matchesData = [
            {
                id: 1,
                title: "Grand Final: Sword 1.19",
                discipline: "Sword",
                date: "Sep 25, 18:00 UTC",
                desc: "Showdown between Erauina and Itzrealme for top rank.",
                image: "images/Без_названия-removebg-preview (1).png",
                action: "Watch Match"
            },
            {
                id: 2,
                title: "Crystal Tier Test",
                discipline: "Crystal",
                date: "Sep 28, 16:00 UTC",
                desc: "Qualification duels for High Tier 1 and High Tier 2.",
                image: "images/crys-removebg-preview.png",
                action: "Register Test"
            },
            {
                id: 3,
                title: "Pot PvP 1.8 Showdown",
                discipline: "Pot",
                date: "Oct 2, 19:00 UTC",
                desc: "Classic competitive potion duels with a cash prize pool.",
                image: "images/PotionDuels.webp",
                action: "Join Tournament"
            },
            {
                id: 4,
                title: "Heavy Shield & Axe Clash",
                discipline: "Axe",
                date: "Oct 8, 17:00 UTC",
                desc: "Brutal axe combat focusing on critical hits and shield breaks.",
                image: "images/Без_названия-removebg-preview (1).png",
                action: "Enter Queue"
            },
            {
                id: 5,
                title: "End Crystal Blast Invitational",
                discipline: "Crystal",
                date: "Oct 15, 20:00 UTC",
                desc: "World tier invitation tournament with double elimination brackets.",
                image: "images/crys-removebg-preview.png",
                action: "View Bracket"
            },
            {
                id: 6,
                title: "Pot Speed Sprint Masters",
                discipline: "Pot",
                date: "Oct 22, 18:30 UTC",
                desc: "High octane nodebuff matches with instant health II inventory kits.",
                image: "images/PotionDuels.webp",
                action: "Join Queue"
            }
        ];

        function renderMatches(selectedDiscipline) {

            const filtered = selectedDiscipline === "All"
                ? matchesData
                : matchesData.filter(m => m.discipline === selectedDiscipline);


            let badgeClass = "";
            switch (selectedDiscipline) {
                case "Sword":
                    badgeClass = "bg-primary";
                    break;
                case "Axe":
                    badgeClass = "bg-warning text-dark";
                    break;
                case "Crystal":
                    badgeClass = "bg-danger";
                    break;
                case "Pot":
                    badgeClass = "bg-success";
                    break;
                default:
                    badgeClass = "bg-info text-dark";
                    break;
            }


            const cardsHTML = filtered.map(match => `
                <div class="col-md-6 col-lg-4">
                    <div class="card match-card h-100 bg-dark border-secondary">
                        <img src="${match.image}" class="card-img-top pixel-icon" alt="${match.title}">
                        <div class="card-body d-flex flex-column text-light">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <span class="badge ${badgeClass}">${match.discipline}</span>
                                <small class="text-secondary">#${match.id}</small>
                            </div>
                            <h3 class="card-title text-info h5">${match.title}</h3>
                            <p class="card-text">${match.desc}</p>
                            <p class="card-text mt-auto"><strong>Date:</strong> ${match.date}</p>
                            <a href="contact.html" class="btn btn-outline-info mt-3">${match.action}</a>
                        </div>
                    </div>
                </div>
            `).join("");

            container.innerHTML = cardsHTML;
        }

        filterBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                filterBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                const discipline = btn.getAttribute("data-discipline");
                renderMatches(discipline);
                SoundEngine.playSwitch();
            });
        });


        renderMatches("All");
    }
    initMatchFilter();


    function initLeaderboard() {
        const tableBody = document.getElementById("leaderboardTableBody");
        const searchInput = document.getElementById("leaderboardSearch");
        const filterBtns = document.querySelectorAll(".btn-lb-filter");
        if (!tableBody) return;

        const players = [
            { rank: 1, name: "Erauina", country: "Kazakhstan (KZ)", points: 300, tier: "HT1", discipline: "Sword", wins: 142 },
            { rank: 2, name: "Itzrealme", country: "USA (US)", points: 295, tier: "HT1", discipline: "Pot", wins: 138 },
            { rank: 3, name: "Crozzor", country: "USA (US)", points: 290, tier: "HT1", discipline: "Axe", wins: 131 },
            { rank: 4, name: "Kylaz", country: "USA (US)", points: 285, tier: "HT1", discipline: "Sword", wins: 125 },
            { rank: 5, name: "Sharpness", country: "Germany (DE)", points: 275, tier: "HT1", discipline: "Sword", wins: 119 },
            { rank: 6, name: "Refraction", country: "Canada (CA)", points: 260, tier: "LT1", discipline: "Pot", wins: 110 },
            { rank: 7, name: "VapeFly", country: "UK (GB)", points: 250, tier: "LT1", discipline: "Crystal", wins: 104 },
            { rank: 8, name: "Speedster", country: "France (FR)", points: 240, tier: "HT2", discipline: "Pot", wins: 98 },
            { rank: 9, name: "BlockHitter", country: "Brazil (BR)", points: 230, tier: "HT2", discipline: "Sword", wins: 91 },
            { rank: 10, name: "DiamondPvP", country: "Japan (JP)", points: 215, tier: "LT2", discipline: "Axe", wins: 85 }
        ];

        function updateStatsSummary(list) {
            const totalPointsEl = document.getElementById("statTotalPoints");
            const topScoreEl = document.getElementById("statTopScore");
            const countEl = document.getElementById("statPlayerCount");

            if (totalPointsEl && list.length) {
                const totalPoints = list.reduce((acc, curr) => acc + curr.points, 0);
                const avgPoints = Math.round(totalPoints / list.length);
                totalPointsEl.textContent = totalPoints.toLocaleString();
                if (topScoreEl) topScoreEl.textContent = `${list[0] ? list[0].name : "N/A"} (${list[0] ? list[0].points : 0}p)`;
                if (countEl) countEl.textContent = list.length;
            }
        }
        updateStatsSummary(players);

        let activeDiscipline = "All";
        let searchQuery = "";

        function getTierBadgeClass(tier) {

            switch (tier) {
                case "HT1": return "tier-ht1";
                case "LT1": return "tier-lt1";
                case "HT2": return "tier-ht2";
                case "LT2": return "tier-lt2";
                default: return "bg-secondary";
            }
        }

        function render() {

            let filtered = players.filter(p => {
                const matchDiscipline = activeDiscipline === "All" || p.discipline === activeDiscipline;
                const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    p.country.toLowerCase().includes(searchQuery.toLowerCase());
                return matchDiscipline && matchSearch;
            });

            if (!filtered.length) {
                tableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-muted">No players found matching current criteria.</td></tr>`;
                return;
            }


            tableBody.innerHTML = filtered.map(p => `
                <tr>
                    <td>#${p.rank}</td>
                    <td><strong>${p.name}</strong></td>
                    <td>${p.country}</td>
                    <td>${p.points} Pts <span class="tier-badge ${getTierBadgeClass(p.tier)} ms-1">${p.tier}</span></td>
                    <td><span class="badge bg-dark border border-secondary">${p.discipline}</span></td>
                    <td>${p.wins} Wins</td>
                </tr>
            `).join("");
        }

        if (searchInput) {
            searchInput.addEventListener("input", (e) => {
                searchQuery = e.target.value.trim();
                render();
            });
        }

        filterBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                filterBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                activeDiscipline = btn.getAttribute("data-discipline");
                render();
                SoundEngine.playSwitch();
            });
        });

        render();
    }
    initLeaderboard();



    function initMultiStepRegistration() {
        const regForm = document.getElementById("registrationForm");
        if (!regForm) return;

        const steps = Array.from(document.querySelectorAll(".form-step"));
        const stepIndicators = Array.from(document.querySelectorAll(".step-indicator"));
        const progressFill = document.getElementById("formProgressFill");
        const nextBtns = document.querySelectorAll(".btn-step-next");
        const prevBtns = document.querySelectorAll(".btn-step-prev");
        const resetBtn = regForm.querySelector("button[type='reset']");
        const feedbackCard = document.getElementById("submissionFeedbackCard");
        const formCardBody = document.getElementById("formCardBody");

        let currentStepIndex = 0;


        function goToStep(targetIndex, callback) {
            if (targetIndex < 0 || targetIndex >= steps.length) return;

            steps.forEach((step, idx) => {
                step.classList.toggle("active", idx === targetIndex);
            });

            stepIndicators.forEach((ind, idx) => {
                ind.classList.toggle("active", idx === targetIndex);
                ind.classList.toggle("completed", idx < targetIndex);
            });

            if (progressFill) {
                const percent = ((targetIndex + 1) / steps.length) * 100;
                progressFill.style.width = `${percent}%`;
            }

            currentStepIndex = targetIndex;

            if (typeof callback === "function") {
                callback(currentStepIndex, steps.length);
            }
        }

        function validateStep(index) {
            let isValid = true;
            const currentStepEl = steps[index];
            if (!currentStepEl) return true;

            const inputs = currentStepEl.querySelectorAll("input, select, textarea");

            inputs.forEach(input => {
                const feedback = input.parentElement.querySelector(".invalid-feedback");
                let errorMsg = "";

                if (input.hasAttribute("required") && !input.value.trim()) {
                    errorMsg = "This field is required.";
                    isValid = false;
                } else if (input.id === "email" && input.value.trim()) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input.value.trim())) {
                        errorMsg = "Please enter a valid email address.";
                        isValid = false;
                    }
                } else if (input.id === "password" && input.value && input.value.length < 8) {
                    errorMsg = "Password must be at least 8 characters.";
                    isValid = false;
                } else if (input.id === "confirmPassword") {
                    const passVal = document.getElementById("password") ? document.getElementById("password").value : "";
                    if (input.value !== passVal) {
                        errorMsg = "Passwords do not match.";
                        isValid = false;
                    }
                }

                if (errorMsg) {
                    input.classList.add("is-invalid");
                    input.classList.remove("is-valid");
                    if (feedback) feedback.textContent = errorMsg;
                } else if (input.value.trim()) {
                    input.classList.remove("is-invalid");
                    input.classList.add("is-valid");
                    if (feedback) feedback.textContent = "";
                }
            });

            return isValid;
        }

        nextBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                if (validateStep(currentStepIndex)) {
                    goToStep(currentStepIndex + 1, (newStep, total) => {
                        SoundEngine.playClick();
                        console.log(`Callback: Form moved to step ${newStep + 1} of ${total}`);
                    });
                } else {
                    SoundEngine.playClick();
                }
            });
        });

        prevBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                goToStep(currentStepIndex - 1, (newStep) => {
                    SoundEngine.playClick();
                    console.log(`Callback: Form returned to step ${newStep + 1}`);
                });
            });
        });

        if (resetBtn) {
            resetBtn.addEventListener("click", () => {
                regForm.querySelectorAll("input, select, textarea").forEach(field => {
                    field.value = "";
                    field.classList.remove("is-invalid", "is-valid");
                });
                goToStep(0, () => {
                    SoundEngine.playClick();
                });
            });
        }


        regForm.addEventListener("submit", (e) => {
            e.preventDefault();

            if (!validateStep(currentStepIndex)) {
                return;
            }

            const submitBtn = regForm.querySelector("button[type='submit']");
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = "Verifying Credentials...";
            }

            const registrationData = {
                ign: document.getElementById("ign") ? document.getElementById("ign").value.trim() : "",
                email: document.getElementById("email") ? document.getElementById("email").value.trim() : "",
                discipline: document.getElementById("discipline") ? document.getElementById("discipline").value : "",
                discord: document.getElementById("experience") ? document.getElementById("experience").value.trim() : "",
                submittedAt: new Date().toISOString()
            };

            function simulateAsyncSubmit(data, callback) {
                setTimeout(() => {
                    const response = {
                        status: 200,
                        success: true,
                        message: `Gladiator ${data.ign} successfully registered for ${data.discipline}!`,
                        ticketId: "MCT-" + Math.floor(100000 + Math.random() * 900000)
                    };
                    callback(response);
                }, 1000);
            }

            simulateAsyncSubmit(registrationData, (res) => {
                SoundEngine.playSuccess();

                if (formCardBody && feedbackCard) {
                    formCardBody.style.display = "none";
                    feedbackCard.style.display = "block";

                    const summaryEl = document.getElementById("registrationSummary");
                    if (summaryEl) {
                        summaryEl.innerHTML = `
                            <p class="mb-1 text-info"><strong>Application ID:</strong> ${res.ticketId}</p>
                            <p class="mb-1"><strong>Username:</strong> ${registrationData.ign}</p>
                            <p class="mb-1"><strong>Discipline:</strong> ${registrationData.discipline}</p>
                            <p class="mb-0 text-success">${res.message}</p>
                        `;
                    }
                }
            });
        });
    }
    initMultiStepRegistration();


    // Task 2: Custom FAQ Accordion
    const faqQuestions = document.querySelectorAll(".faq-question");
    faqQuestions.forEach(function (question) {
        question.addEventListener("click", function () {
            const answerId = question.getAttribute("aria-controls");
            const answer = document.getElementById(answerId);
            if (!answer) return;

            const isOpen = question.getAttribute("aria-expanded") === "true";

            faqQuestions.forEach(function (other) {
                const otherAnswer = document.getElementById(other.getAttribute("aria-controls"));
                other.classList.remove("active");
                other.setAttribute("aria-expanded", "false");
                if (otherAnswer) {
                    otherAnswer.classList.remove("open");
                    otherAnswer.setAttribute("aria-hidden", "true");
                }
            });

            if (!isOpen) {
                question.classList.add("active");
                question.setAttribute("aria-expanded", "true");
                answer.classList.add("open");
                answer.setAttribute("aria-hidden", "false");
            }
            SoundEngine.playClick();
        });
    });

    // Task 3: Popup Subscription Form
    const subscribeOverlay = document.getElementById("subscribeOverlay");
    if (subscribeOverlay) {
        const openBtn = document.getElementById("openSubscribe");
        const closeBtn = document.getElementById("closeSubscribe");
        const subForm = document.getElementById("subscribeForm");
        const emailInput = document.getElementById("subscribeEmail");
        const errEl = document.getElementById("subscribeError");
        const msgEl = document.getElementById("subscribeMessage");

        const openPopup = () => {
            subscribeOverlay.classList.add("active");
            subscribeOverlay.setAttribute("aria-hidden", "false");
            emailInput.focus();
            SoundEngine.playClick();
        };

        const closePopup = () => {
            subscribeOverlay.classList.remove("active");
            subscribeOverlay.setAttribute("aria-hidden", "true");
            if (openBtn) openBtn.focus();
        };

        if (openBtn) openBtn.addEventListener("click", openPopup);
        if (closeBtn) closeBtn.addEventListener("click", closePopup);

        subscribeOverlay.addEventListener("click", (e) => {
            if (e.target === subscribeOverlay) closePopup();
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && subscribeOverlay.classList.contains("active")) {
                closePopup();
            }
        });

        if (subForm) {
            subForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const email = emailInput.value.trim();
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                errEl.textContent = "";
                msgEl.textContent = "";

                if (!emailPattern.test(email)) {
                    errEl.textContent = "Please enter a valid email address.";
                    emailInput.focus();
                    return;
                }

                msgEl.textContent = "Thank you for subscribing to MCTiers League!";
                subForm.reset();
                SoundEngine.playSuccess();
            });
        }
    }

    // Task 5: Display Current Date & Time
    function updateClock() {
        const clockEl = document.getElementById("currentDateTime");
        if (clockEl) {
            const now = new Date();
            clockEl.textContent = now.toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            });
        }
    }
    updateClock();
    setInterval(updateClock, 1000);
});