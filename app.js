const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const orderForm = document.querySelector("#orderForm");
const orderResult = document.querySelector("#orderResult");
const productSelect = document.querySelector("#product");
const notesInput = document.querySelector("#notes");
const cityInput = document.querySelector("#city");
const quantityInput = document.querySelector("#quantity");
const cadenceSelect = document.querySelector("#cadence");
const businessTypeSelect = document.querySelector("#businessType");
const businessNameInput = document.querySelector("#businessName");
const contactInput = document.querySelector("#contact");
const assistantToggle = document.querySelector(".assistant-toggle");
const assistantPanel = document.querySelector(".assistant-panel");
const preloader = document.querySelector("#preloader");
const scrollProgress = document.querySelector(".scroll-progress");
const registerModal = document.querySelector("#registerModal");
const registerForm = document.querySelector("#registerForm");
const registerStatus = document.querySelector("#registerStatus");

const priorityCities = [
  "surrey",
  "vancouver",
  "burnaby",
  "richmond",
  "delta",
  "abbotsford",
  "langley",
  "coquitlam",
  "new westminster",
  "maple ridge",
  "chilliwack",
  "mission",
];

window.addEventListener("load", () => {
  window.setTimeout(() => {
    document.body.classList.remove("is-loading");
    preloader.classList.add("is-hidden");
  }, 650);

  window.setTimeout(() => {
    openRegisterModal();
  }, 1500);
});

function openRegisterModal() {
  if (!registerModal) return;
  registerModal.hidden = false;
}

function closeRegisterModal() {
  if (!registerModal) return;
  registerModal.hidden = true;
}

function wrapHeadingText() {
  document.querySelectorAll("h1, h2").forEach((heading) => {
    const text = heading.textContent.trim();
    if (!text || heading.dataset.split === "true") return;

    heading.dataset.split = "true";
    heading.classList.add("split-text");
    heading.innerHTML = text
      .split(/(\s+)/)
      .map((part) => {
        if (/^\s+$/.test(part)) return part;
        return `<span class="split-word">${part}</span>`;
      })
      .join("");

    heading.querySelectorAll(".split-word").forEach((word, index) => {
      word.style.setProperty("--word-index", index);
    });
  });
}

function initRevealAnimations() {
  const revealGroups = [
    ".section-head",
    ".quick-order a",
    ".product-card",
    ".buyer-grid article",
    ".intelligence-grid article",
    ".commerce-band > div",
    ".channel-grid article",
    ".ai-workflow > div",
    ".workflow-rail div",
    ".order-copy",
    ".delivery-panel",
    ".order-form",
    ".ai-copy",
    ".ai-console",
    ".proof-image",
    ".proof-copy",
    ".proof-list div",
    ".site-footer > div",
  ];

  const targets = document.querySelectorAll(revealGroups.join(","));
  targets.forEach((target, index) => {
    target.classList.add("reveal");
    target.style.setProperty("--reveal-delay", `${Math.min(index % 5, 4) * 80}ms`);
  });

  document.querySelectorAll(".order-copy, .ai-copy, .proof-image").forEach((target) => {
    target.classList.add("reveal-left");
  });

  document.querySelectorAll(".order-form, .ai-console, .proof-copy").forEach((target) => {
    target.classList.add("reveal-right");
  });

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

  targets.forEach((target) => observer.observe(target));
}

function updateScrollProgress() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  document.documentElement.style.setProperty("--scroll-progress", progress.toFixed(4));
  if (scrollProgress) {
    scrollProgress.style.setProperty("--scroll-progress", progress.toFixed(4));
  }
}

wrapHeadingText();
initRevealAnimations();
updateScrollProgress();
window.setTimeout(() => {
  document.querySelector(".hero")?.classList.add("is-visible");
}, 180);
window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress);

function encodeMailto(subject, body) {
  return `mailto:bcwholesaledairy@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function getDeliveryMessage(city) {
  const normalized = city.trim().toLowerCase();
  if (!normalized) {
    return "Add a BC city to check delivery priority.";
  }

  if (priorityCities.includes(normalized)) {
    return `${city} is in a priority BC wholesale delivery corridor.`;
  }

  return `${city} can be requested for BC delivery. The team should confirm route timing and minimum order size.`;
}

function buildOrderSummary() {
  const city = cityInput.value.trim();
  const product = productSelect.value;
  const quantity = Number(quantityInput.value || 0);
  const cadence = cadenceSelect.value;
  const business = businessNameInput.value.trim() || "New wholesale account";
  const businessType = businessTypeSelect.value || "Restaurant, cafe, or corporate buyer";
  const contact = contactInput.value.trim() || "Contact not provided";
  const notes = notesInput.value.trim() || "No extra notes.";
  const delivery = getDeliveryMessage(city);

  const subject = `Wholesale order request: ${business}`;
  const body = [
    "Hello BC Wholesale Dairy,",
    "",
    "I would like to place a wholesale order request.",
    "",
    `Business: ${business}`,
    `Business type: ${businessType}`,
    `BC delivery city: ${city || "Not provided"}`,
    `Product: ${product}`,
    `Estimated quantity: ${quantity}`,
    `Cadence: ${cadence}`,
    `Contact: ${contact}`,
    "",
    `Delivery note: ${delivery}`,
    `Notes: ${notes}`,
    "",
    "Please confirm pricing, availability, delivery timing, and any minimum order requirements.",
  ].join("\n");

  return { subject, body, delivery, quantity, product, cadence };
}

function updateOrderResult() {
  const { delivery, quantity, product, cadence } = buildOrderSummary();
  const volumeNote = quantity >= 10 ? "High-volume account request" : "Starter wholesale request";
  orderResult.textContent = `${delivery} ${volumeNote}: ${quantity || 0} x ${product}, ${cadence.toLowerCase()}.`;
}

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  document.body.classList.toggle("nav-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    navLinks.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

document.querySelectorAll(".add-product").forEach((button) => {
  button.addEventListener("click", () => {
    const product = button.dataset.product;
    if ([...productSelect.options].some((option) => option.value === product)) {
      productSelect.value = product;
    } else if (product.includes("Paneer")) {
      productSelect.value = "Paneer Blocks";
    } else if (product.includes("Milk")) {
      productSelect.value = "Milk Supply";
    } else {
      productSelect.value = "15L Punjabi Dahi Bucket";
    }
    notesInput.value = notesInput.value
      ? `${notesInput.value}\nInterested in ${product}.`
      : `Interested in ${product}.`;
    document.querySelector("#order").scrollIntoView({ behavior: "smooth" });
    updateOrderResult();
  });
});

document.querySelectorAll(".add-buyer").forEach((button) => {
  button.addEventListener("click", () => {
    const buyer = button.dataset.buyer;
    businessTypeSelect.value = buyer === "B2B Corporate Buyer" ? "B2B Corporate Order" : buyer;
    notesInput.value = notesInput.value
      ? `${notesInput.value}\nBuyer path selected: ${buyer}.`
      : `Buyer path selected: ${buyer}.`;
    document.querySelector("#order").scrollIntoView({ behavior: "smooth" });
    updateOrderResult();
  });
});

document.querySelector(".amazon-request").addEventListener("click", () => {
  notesInput.value = notesInput.value
    ? `${notesInput.value}\nPlease also share Amazon Business selling/listing options.`
    : "Please also share Amazon Business selling/listing options.";
  productSelect.value = "Custom Bulk Dairy Supply";
  document.querySelector("#order").scrollIntoView({ behavior: "smooth" });
  updateOrderResult();
});

orderForm.addEventListener("input", updateOrderResult);

orderForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!orderForm.reportValidity()) return;
  const { subject, body } = buildOrderSummary();
  window.location.href = encodeMailto(subject, body);
});

document.querySelector("#runPlanner").addEventListener("click", () => {
  const customers = Number(document.querySelector("#weeklyCustomers").value || 0);
  const menuItems = Number(document.querySelector("#menuItems").value || 1);
  const storage = document.querySelector("#storageCapacity").value;
  const storageFactor = storage === "large" ? 1.25 : storage === "limited" ? 0.72 : 1;
  const estimatedBuckets = Math.max(2, Math.round(((customers / 85) + menuItems * 0.45) * storageFactor));
  const cadence = estimatedBuckets > 10 ? "twice per week" : estimatedBuckets > 5 ? "weekly" : "starter weekly";
  const channel = estimatedBuckets > 8 ? "direct BC wholesale delivery" : "direct order first, Amazon channel later for business-buyer demand";

  document.querySelector("#aiOutput").textContent =
    `AI planner recommendation: start with ${estimatedBuckets} x 15L Punjabi Dahi buckets on a ${cadence} cadence. Best for restaurant, cafe, or corporate B2B planning. Best channel: ${channel}.`;
});

assistantToggle.addEventListener("click", () => {
  const isHidden = assistantPanel.hidden;
  assistantPanel.hidden = !isHidden;
  assistantToggle.setAttribute("aria-expanded", String(isHidden));
});

document.querySelector("#assistantFill").addEventListener("click", () => {
  const { delivery, quantity, product, cadence } = buildOrderSummary();
  notesInput.value = notesInput.value
    ? `${notesInput.value}\nAI helper summary: ${delivery} Requested ${quantity || 0} x ${product}, ${cadence.toLowerCase()}.`
    : `AI helper summary: ${delivery} Requested ${quantity || 0} x ${product}, ${cadence.toLowerCase()}.`;
  document.querySelector("#order").scrollIntoView({ behavior: "smooth" });
  updateOrderResult();
});

document.querySelectorAll("[data-register-close]").forEach((button) => {
  button.addEventListener("click", closeRegisterModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && registerModal && !registerModal.hidden) {
    closeRegisterModal();
  }
});

registerForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const registerBusiness = document.querySelector("#registerBusiness").value.trim();
  const registerBuyer = document.querySelector("#registerBuyer").value;
  const registerCity = document.querySelector("#registerCity").value.trim();
  const registerProduct = document.querySelector("#registerProduct").value;
  const registerContact = document.querySelector("#registerContact").value.trim();

  if (!registerForm.reportValidity()) return;

  businessNameInput.value = registerBusiness;
  businessTypeSelect.value = registerBuyer;
  cityInput.value = registerCity;
  contactInput.value = registerContact;
  productSelect.value = registerProduct;
  notesInput.value = notesInput.value
    ? `${notesInput.value}\nRegistration source: popup.`
    : "Registration source: popup.";

  updateOrderResult();
  registerStatus.textContent = "Registered. Your wholesale order form has been prepared.";

  window.setTimeout(() => {
    closeRegisterModal();
    document.querySelector("#order").scrollIntoView({ behavior: "smooth" });
  }, 700);
});

updateOrderResult();
