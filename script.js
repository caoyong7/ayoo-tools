const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const words = (text) => text.trim().match(/[A-Za-z0-9]+(?:[-'][A-Za-z0-9]+)*/g) || [];
const sentences = (text) => text.trim().match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];

function setYear() {
  $$("[data-year]").forEach((node) => {
    node.textContent = new Date().getFullYear();
  });
}

function initTextStats() {
  const input = $("[data-text-input]");
  if (!input) return;
  const output = {
    words: $("[data-stat='words']"),
    chars: $("[data-stat='chars']"),
    charsNoSpaces: $("[data-stat='charsNoSpaces']"),
    sentences: $("[data-stat='sentences']"),
    read: $("[data-stat='read']")
  };
  const update = () => {
    const text = input.value;
    const wordCount = words(text).length;
    output.words && (output.words.textContent = wordCount);
    output.chars && (output.chars.textContent = text.length);
    output.charsNoSpaces && (output.charsNoSpaces.textContent = text.replace(/\s/g, "").length);
    output.sentences && (output.sentences.textContent = text.trim() ? sentences(text).length : 0);
    output.read && (output.read.textContent = `${Math.max(1, Math.ceil(wordCount / 225))} min`);
  };
  input.addEventListener("input", update);
  update();
}

function initCaseConverter() {
  const input = $("[data-case-input]");
  const output = $("[data-case-output]");
  if (!input || !output) return;
  const titleCase = (value) => value.toLowerCase().replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
  const convert = (mode) => {
    const value = input.value;
    const map = {
      upper: value.toUpperCase(),
      lower: value.toLowerCase(),
      title: titleCase(value),
      sentence: value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
    };
    output.textContent = map[mode] || value;
  };
  $$("[data-case-mode]").forEach((button) => {
    button.addEventListener("click", () => convert(button.dataset.caseMode));
  });
  input.addEventListener("input", () => convert("title"));
  convert("title");
}

function initSlugGenerator() {
  const input = $("[data-slug-input]");
  const output = $("[data-slug-output]");
  if (!input || !output) return;
  const update = () => {
    output.textContent = input.value
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .replace(/-{2,}/g, "-") || "your-clean-url-slug";
  };
  input.addEventListener("input", update);
  update();
}

function initPasswordGenerator() {
  const output = $("[data-password-output]");
  const lengthInput = $("[data-password-length]");
  const button = $("[data-password-generate]");
  if (!output || !lengthInput || !button) return;
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*";
  const generate = () => {
    const length = Math.min(64, Math.max(8, Number(lengthInput.value) || 16));
    const bytes = new Uint32Array(length);
    crypto.getRandomValues(bytes);
    output.textContent = [...bytes].map((value) => chars[value % chars.length]).join("");
  };
  button.addEventListener("click", generate);
  lengthInput.addEventListener("input", generate);
  generate();
}

function initJsonFormatter() {
  const input = $("[data-json-input]");
  const output = $("[data-json-output]");
  const button = $("[data-json-format]");
  if (!input || !output || !button) return;
  button.addEventListener("click", () => {
    try {
      output.textContent = JSON.stringify(JSON.parse(input.value), null, 2);
      output.style.color = "inherit";
    } catch (error) {
      output.textContent = `Invalid JSON: ${error.message}`;
      output.style.color = "#b42318";
    }
  });
}

setYear();
initTextStats();
initCaseConverter();
initSlugGenerator();
initPasswordGenerator();
initJsonFormatter();
