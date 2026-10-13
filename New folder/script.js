/* ---------- Data ---------- */
const bikes = [
  { id: 1, name: "Ridgeline", type: "Mountain", price: 64900, weight: 14.2, gears: "12-speed", frame: "Aluminium", bg: "#d9e3dc", blurb: "A trail bike with front suspension and wide tyres. Built for rocky climbs and loose descents." },
  { id: 2, name: "Arrowhead", type: "Road", price: 78500, weight: 8.9, gears: "22-speed", frame: "Carbon", bg: "#dbe1ee", blurb: "A light carbon frame for long, fast rides. Narrow tyres and a low riding position." },
  { id: 3, name: "Canal", type: "City", price: 24900, weight: 13.1, gears: "7-speed", frame: "Steel", bg: "#ecdfc9", blurb: "An upright commuter with mudguards, a chain guard and a rear rack. Ready for daily errands." },
  { id: 4, name: "Volt 500", type: "Electric", price: 119000, weight: 21.5, gears: "9-speed", frame: "Aluminium", bg: "#e4dcee", blurb: "A 500 Wh battery gives up to 90 km of assisted riding. Charges fully in four hours." },
  { id: 5, name: "Gravelhawk", type: "Road", price: 58900, weight: 10.4, gears: "11-speed", frame: "Aluminium", bg: "#e3e5d3", blurb: "Drop handlebars with room for wider tyres. Takes you from tarmac to dirt tracks." },
  { id: 6, name: "Quarry", type: "Mountain", price: 92000, weight: 12.6, gears: "12-speed", frame: "Carbon", bg: "#d6e6e8", blurb: "A full carbon hardtail that stays stiff on climbs and quick through tight corners." },
  { id: 7, name: "Lane", type: "City", price: 31900, weight: 12.4, gears: "3-speed hub", frame: "Aluminium", bg: "#efd8d4", blurb: "A low-maintenance hub-gear bike with a step-through frame. Easy to get on and off." },
  { id: 8, name: "Volt Fold", type: "Electric", price: 84900, weight: 17.8, gears: "6-speed", frame: "Aluminium", bg: "#dce6f0", blurb: "A folding e-bike that fits in a car boot or under a desk. Range of 45 km." }
];

const state = { type: "All", sort: "featured" };

/* ---------- Helpers ---------- */
const formatPrice = n => "₹" + n.toLocaleString("en-IN");

/* Draws a simple bike. Wheels get a .wheel group so they can spin. */
function bikeSVG({ type = "City", frameColor = "#2340e8" } = {}) {
  const tyre = type === "Mountain" ? 9 : type === "Road" ? 3.5 : 5.5;
  const bar = type === "Mountain" ? "M262 52 L300 52" : type === "Road" ? "M268 62 q22 -2 24 18" : "M255 50 q25 -10 48 4";
  const spokes = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 8;
    const x = Math.cos(a) * 54, y = Math.sin(a) * 54;
    return `<line x1="${-x}" y1="${-y}" x2="${x}" y2="${y}"/>`;
  }).join("");
  const wheel = (cx) => `
    <g transform="translate(${cx} 140)">
      <circle r="58" fill="none" stroke="currentColor" stroke-width="${tyre}"/>
      <g class="wheel" style="transform-box:fill-box;transform-origin:center" stroke="currentColor" stroke-width="1.2" opacity=".55">${spokes}</g>
      <circle r="5" fill="currentColor"/>
    </g>`;
  const battery = type === "Electric"
    ? `<rect x="150" y="96" width="82" height="12" rx="6" fill="#f2c230" transform="rotate(26 191 102)"/>` : "";
  const rack = type === "City"
    ? `<path d="M90 82 h-36 M70 82 v58" stroke="currentColor" stroke-width="4" fill="none"/>` : "";
  const fork = type === "Mountain" ? 7 : 5;

  return `
  <svg viewBox="0 0 400 210" role="img" aria-label="${type} bike illustration" xmlns="http://www.w3.org/2000/svg">
    ${wheel(88)}${wheel(312)}
    ${rack}
    <g fill="none" stroke="${frameColor}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
      <path d="M88 140 L170 140 L150 80 Z"/>
      <path d="M150 80 L270 76 L170 140"/>
    </g>
    ${battery}
    <g fill="none" stroke="currentColor" stroke-width="${fork}" stroke-linecap="round">
      <path d="M270 76 L312 140"/>
      <path d="M270 76 L262 52"/>
      <path d="${bar}" stroke-width="5"/>
      <path d="M150 80 L146 62 M134 62 h28" stroke-width="6"/>
    </g>
    <circle cx="170" cy="140" r="11" fill="none" stroke="currentColor" stroke-width="4"/>
    <path d="M170 140 L182 160" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
  </svg>`;
}

const frameColors = { Road: "#2340e8", Mountain: "#1f8f5f", City: "#d4571e", Electric: "#7a3fd1" };

/* ---------- Render the grid ---------- */
const grid = document.getElementById("bikeGrid");
const countEl = document.getElementById("resultCount");

function visibleBikes() {
  let list = bikes.filter(b => state.type === "All" || b.type === state.type);
  if (state.sort === "low") list.sort((a, b) => a.price - b.price);
  if (state.sort === "high") list.sort((a, b) => b.price - a.price);
  if (state.sort === "weight") list.sort((a, b) => a.weight - b.weight);
  return list;
}

function render() {
  const list = visibleBikes();
  countEl.textContent = list.length === 1 ? "1 bike" : `${list.length} bikes`;

  if (!list.length) {
    grid.innerHTML = `<p class="empty">No bikes match this filter. Choose All to see every bike.</p>`;
    return;
  }

  grid.innerHTML = list.map(b => `
    <article class="card">
      <div class="card-art" style="--bike-bg:${b.bg}">${bikeSVG({ type: b.type, frameColor: frameColors[b.type] })}</div>
      <div class="card-body">
        <p class="card-type">${b.type}</p>
        <h3>${b.name}</h3>
        <p class="card-meta">${b.gears} &middot; ${b.weight} kg</p>
        <div class="card-foot">
          <span class="price">${formatPrice(b.price)}</span>
          <button class="link-btn" data-id="${b.id}">View details</button>
        </div>
      </div>
    </article>`).join("");
}

/* ---------- Filter and sort ---------- */
document.querySelectorAll(".chip").forEach(chip => {
  chip.addEventListener("click", () => {
    state.type = chip.dataset.type;
    document.querySelectorAll(".chip").forEach(c =>
      c.setAttribute("aria-pressed", String(c === chip)));
    render();
  });
});

document.getElementById("sortSelect").addEventListener("change", e => {
  state.sort = e.target.value;
  render();
});

/* ---------- Details dialog ---------- */
const dialog = document.getElementById("bikeDialog");

grid.addEventListener("click", e => {
  const btn = e.target.closest("[data-id]");
  if (!btn) return;
  const b = bikes.find(x => x.id === Number(btn.dataset.id));

  document.getElementById("dlgArt").style.setProperty("--bike-bg", b.bg);
  document.getElementById("dlgArt").innerHTML = bikeSVG({ type: b.type, frameColor: frameColors[b.type] });
  document.getElementById("dlgType").textContent = b.type;
  document.getElementById("dlgTitle").textContent = b.name;
  document.getElementById("dlgBlurb").textContent = b.blurb;
  document.getElementById("dlgPrice").textContent = formatPrice(b.price);
  document.getElementById("dlgSpecs").innerHTML = `
    <dt>Frame</dt><dd>${b.frame}</dd>
    <dt>Gears</dt><dd>${b.gears}</dd>
    <dt>Weight</dt><dd>${b.weight} kg</dd>`;
  dialog.showModal();
});

// Close when clicking the backdrop, or after tapping the test-ride link
dialog.addEventListener("click", e => { if (e.target === dialog) dialog.close(); });
document.getElementById("dlgCta").addEventListener("click", () => dialog.close());

/* ---------- Size finder ---------- */
const fitForm = document.getElementById("fitForm");
const fitResult = document.getElementById("fitResult");

fitForm.addEventListener("submit", e => {
  e.preventDefault();
  const h = Number(document.getElementById("heightInput").value);
  fitResult.classList.remove("error");

  if (!h || h < 130 || h > 210) {
    fitResult.classList.add("error");
    fitResult.textContent = "Enter a height between 130 and 210 cm.";
    return;
  }

  let size, note;
  if (h < 155)      { size = "XS"; note = "47 to 49 cm frame"; }
  else if (h < 165) { size = "S";  note = "50 to 52 cm frame"; }
  else if (h < 175) { size = "M";  note = "53 to 55 cm frame"; }
  else if (h < 185) { size = "L";  note = "56 to 58 cm frame"; }
  else              { size = "XL"; note = "59 to 61 cm frame"; }

  fitResult.textContent = `Size ${size}: ${note}.`;
});

/* ---------- Hero: wheels turn as you scroll ---------- */
const heroBike = document.getElementById("heroBike");
heroBike.innerHTML = bikeSVG({ type: "Road", frameColor: "#2340e8" });

const wheels = heroBike.querySelectorAll(".wheel");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let ticking = false;

function spin() {
  const deg = window.scrollY * 0.6;
  wheels.forEach(w => { w.style.transform = `rotate(${deg}deg)`; });
  ticking = false;
}

window.addEventListener("scroll", () => {
  if (reduceMotion.matches || ticking) return;
  ticking = true;
  requestAnimationFrame(spin);
}, { passive: true });

/* ---------- Init ---------- */
document.getElementById("year").textContent = new Date().getFullYear();
render();