const snd = {
  click: new Audio("./sfx/click.wav"),
  beep: new Audio("./sfx/beep.wav"),
  hum: new Audio("./sfx/hum.wav"),
  enabled: false,
  play(name) {
    if (!this.enabled || !this[name]) return;
    if (name === "click" && this.click.playing) {
      const c = this.click.cloneNode();
      c.volume = 0.15;
      c.play();
      return;
    }
    this[name].currentTime = 0;
    this[name].volume = this[name].volume || 1;
    this[name].play();
  },
};
snd.hum.loop = true;
snd.hum.volume = 0.35;
snd.beep.volume = 0.4;
snd.click.volume = 0.15;

function startAudio() {
  if (snd.enabled) return;
  snd.enabled = true;
  snd.hum.play();
}
startAudio();
document.addEventListener("pointerdown", startAudio, { once: true });

const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

const chars = "アィイウエオカキクケコサシスセソ0123456789ABCDEFXYZ<>#@$%&*+".split("");
const fontSize = 14;
let columns, drops;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  columns = Math.floor(canvas.width / fontSize);
  drops = Array(columns).fill(1).map(() => Math.random() * canvas.height / fontSize);
}

resize();
window.addEventListener("resize", resize);

function draw() {
  ctx.fillStyle = "rgba(1, 10, 3, 0.08)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#00ff66";
  ctx.font = fontSize + "px monospace";
  for (let i = 0; i < drops.length; i++) {
    const text = chars[Math.floor(Math.random() * chars.length)];
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}

setInterval(draw, 50);
setInterval(() => snd.play("click"), 280);

const lines = [
  "> INITIALIZING HACKDOX CORE ............. OK",
  "> CHECKING VERSION ............... OK",
  "> CRACKING ENCRYPTION [AES-256] ......... OK",
  "> INJECTING ROOTKIT ..................... OK",
  "> ESTABLISHING UPLINK ................... OK",
  "> ACCESS GRANTED : WELCOME, HACKER",
  "User : How do i track someones ip address?",
  "> GO TO IP LOGGER AND SHORTEN A WEBSITE",
  "> SEND IT TO SOMEONE",
  "> WAIT FOR SOMEONE TO VISIT IT",
  "User : How do i track where the ip is from?",
  "> GO TO IP LOOKUP",
  "User : How do i save my shortcut?",
  "> GO TO URL VAULT",
  "User:How do i find-",
  "STOP IT YOU ANNOYING BITC-",
];

const log = document.getElementById("log");
let lineIndex = 0;
let charIndex = 0;

function typeLine() {
  if (lineIndex >= lines.length) {
    document.querySelector(".terminal").style.pointerEvents = "auto";
    return;
  }
  const line = lines[lineIndex];
  if (charIndex <= line.length) {
    log.textContent = lines.slice(0, lineIndex).join("\n") + "\n" + line.slice(0, charIndex);
    charIndex++;
    snd.play("click");
    setTimeout(typeLine, 28);
  } else {
    log.textContent = lines.slice(0, lineIndex + 1).join("\n");
    lineIndex++;
    charIndex = 0;
    setTimeout(typeLine, 220);
  }
}

typeLine();

const vault = document.getElementById("vault");
const openBtn = document.getElementById("open-vault");
const closeBtn = document.getElementById("close-vault");
const form = document.getElementById("add-form");
const urlInput = document.getElementById("url-input");
const list = document.getElementById("vault-list");
const empty = document.getElementById("vault-empty");
const nameInput = document.getElementById("name-input");

const KEY = "hackdox.urls";

function getUrls() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

function saveUrls(urls) {
  localStorage.setItem(KEY, JSON.stringify(urls));
}

function render() {
  const urls = getUrls();
  list.innerHTML = "";
  empty.style.display = urls.length ? "none" : "block";
  for (const item of urls) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = item.url;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = item.name || item.url;
    a.title = item.url;
    const del = document.createElement("button");
    del.className = "del";
    del.textContent = "×";
    del.title = "Delete";
    del.addEventListener("click", () => {
      saveUrls(urls.filter((u) => u !== item));
      render();
    });
    li.append(a, del);
    list.appendChild(li);
  }
}

openBtn.addEventListener("click", () => {
  snd.play("beep");
  vault.classList.add("open");
  nameInput.focus();
});

closeBtn.addEventListener("click", () => {
  snd.play("beep");
  vault.classList.remove("open");
});

vault.addEventListener("click", (e) => {
  if (e.target === vault) vault.classList.remove("open");
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") vault.classList.remove("open");
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  let url = urlInput.value.trim();
  if (!url) return;
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;
  const urls = getUrls();
  if (!urls.some((u) => u.url === url)) {
    urls.push({ name, url });
    saveUrls(urls);
  }
  nameInput.value = "";
  urlInput.value = "";
  render();
});

render();

