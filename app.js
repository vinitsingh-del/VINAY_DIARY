const loader = document.querySelector("#loader");
const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".nav");
const register = document.querySelector("#register");
const orderForm = document.querySelector("#orderForm");
const registerForm = document.querySelector("#registerForm");
const fields = {
  business: document.querySelector("#businessName"),
  type: document.querySelector("#businessType"),
  city: document.querySelector("#city"),
  product: document.querySelector("#product"),
  quantity: document.querySelector("#quantity"),
  cadence: document.querySelector("#cadence"),
  contact: document.querySelector("#contact"),
  notes: document.querySelector("#notes"),
  result: document.querySelector("#orderResult"),
};

const priorityCities = ["surrey", "vancouver", "burnaby", "richmond", "delta", "abbotsford", "langley", "coquitlam", "chilliwack", "mission"];

window.addEventListener("load", () => {
  window.setTimeout(() => loader.classList.add("is-hidden"), 500);
  window.setTimeout(() => openRegister(), 4500);
});

menuButton.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(open));
});

nav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    nav.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
  }
});

function updateProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  document.documentElement.style.setProperty("--progress", max > 0 ? (window.scrollY / max).toFixed(4) : 0);
}

window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);
updateProgress();

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
);

document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));

function deliveryMessage(city) {
  const normalized = city.trim().toLowerCase();
  if (!normalized) return "Add a BC city to check delivery priority.";
  if (priorityCities.includes(normalized)) return `${city} is in a priority BC delivery corridor.`;
  return `${city} can be requested for BC delivery. Confirm route timing and minimum order size.`;
}

function updateOrderResult() {
  const quantity = Number(fields.quantity.value || 0);
  const volume = quantity >= 10 ? "High-volume request" : "Starter wholesale request";
  fields.result.textContent = `${deliveryMessage(fields.city.value)} ${volume}: ${quantity || 0} x ${fields.product.value}, ${fields.cadence.value.toLowerCase()}.`;
}

function mailtoLink() {
  const subject = `Wholesale order request: ${fields.business.value || "New account"}`;
  const body = [
    "Hello BC Wholesale Dairy,",
    "",
    "I would like to place a wholesale order request.",
    "",
    `Business: ${fields.business.value}`,
    `Buyer type: ${fields.type.value}`,
    `BC delivery city: ${fields.city.value}`,
    `Product: ${fields.product.value}`,
    `Quantity: ${fields.quantity.value}`,
    `Cadence: ${fields.cadence.value}`,
    `Contact: ${fields.contact.value}`,
    `Notes: ${fields.notes.value || "No extra notes."}`,
    "",
    "Please confirm pricing, availability, delivery timing, and minimum order requirements.",
  ].join("\n");
  return `mailto:bcwholesaledairy@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

orderForm.addEventListener("input", updateOrderResult);
orderForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!orderForm.reportValidity()) return;
  window.location.href = mailtoLink();
});

document.querySelectorAll(".add-product").forEach((button) => {
  button.addEventListener("click", () => {
    fields.product.value = button.dataset.product;
    fields.notes.value = fields.notes.value ? `${fields.notes.value}\nInterested in ${button.dataset.product}.` : `Interested in ${button.dataset.product}.`;
    updateOrderResult();
    document.querySelector("#order").scrollIntoView({ behavior: "smooth" });
  });
});

document.querySelectorAll(".buyer-pick").forEach((button) => {
  button.addEventListener("click", () => {
    fields.type.value = button.dataset.buyer;
    updateOrderResult();
    document.querySelector("#order").scrollIntoView({ behavior: "smooth" });
  });
});

document.querySelector("#amazonRequest").addEventListener("click", () => {
  fields.product.value = "Custom Bulk Dairy Supply";
  fields.notes.value = fields.notes.value ? `${fields.notes.value}\nPlease include Amazon Business channel options.` : "Please include Amazon Business channel options.";
  updateOrderResult();
  document.querySelector("#order").scrollIntoView({ behavior: "smooth" });
});

function openRegister() {
  register.hidden = false;
}

function closeRegister() {
  register.hidden = true;
}

document.querySelector("#openRegister").addEventListener("click", openRegister);
document.querySelectorAll("[data-close-register]").forEach((button) => button.addEventListener("click", closeRegister));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeRegister();
});

registerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!registerForm.reportValidity()) return;
  fields.business.value = document.querySelector("#registerBusiness").value;
  fields.type.value = document.querySelector("#registerBuyer").value;
  fields.city.value = document.querySelector("#registerCity").value;
  fields.contact.value = document.querySelector("#registerContact").value;
  fields.notes.value = fields.notes.value ? `${fields.notes.value}\nRegistration source: popup.` : "Registration source: popup.";
  updateOrderResult();
  closeRegister();
  document.querySelector("#order").scrollIntoView({ behavior: "smooth" });
});

updateOrderResult();
