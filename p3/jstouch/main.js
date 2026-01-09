// SERVICES - Interactive stickers (Drag & Drop) + Parallax
(() => {
  const stage = document.getElementById("servicesStage");
  if (!stage) return;

  const buttons = document.querySelectorAll(".service-button");
  const imgs = stage.querySelectorAll(".float-img");

  // Estado de drag
  let isDragging = false;
  let draggedImg = null;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let savedPositions = {}; // Guardar posiciones

  // Función para activar imagen
  function setActive(key) {
    buttons.forEach((b) =>
      b.classList.toggle("is-active", b.dataset.key === key)
    );
    imgs.forEach((img) =>
      img.classList.toggle("is-active", img.dataset.key === key)
    );
  }

  // Default
  setActive("branding");

  // Botones - hover para cambiar imagen activa
  buttons.forEach((btn) => {
    btn.addEventListener("mouseenter", () => setActive(btn.dataset.key));
  });

  // ============================================
  // DRAG & DROP - Mouse Events
  // ============================================
  imgs.forEach((img) => {
    // MOUSEDOWN - Iniciar drag
    img.addEventListener("mousedown", startDrag);

    // Hover cursor
    img.addEventListener("mouseenter", () => {
      if (!isDragging) {
        img.style.cursor = "grab";
      }
    });

    img.addEventListener("mouseleave", () => {
      if (!isDragging) {
        img.style.cursor = "default";
      }
    });
  });

  function startDrag(e) {
    if (e.button !== 0) return; // Solo botón izquierdo

    isDragging = true;
    draggedImg = this;

    const rect = this.getBoundingClientRect();
    const stageRect = stage.getBoundingClientRect();

    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;

    this.style.cursor = "grabbing";
    this.style.zIndex = "1000";
    this.style.transition = "none";
    this.style.animation = "none";
    this.style.opacity = "0.8";

    e.preventDefault();
    e.stopPropagation();
  }

  // MOUSEMOVE - Arrastrar o Parallax
  document.addEventListener("mousemove", (e) => {
    if (isDragging && draggedImg) {
      moveDraggedImage(e);
    } else {
      applyParallax(e);
    }
  });

  // MOUSEUP - Terminar drag
  document.addEventListener("mouseup", () => {
    if (draggedImg) {
      draggedImg.style.cursor = "grab";
      draggedImg.style.zIndex = "2";
      draggedImg.style.transition = "opacity 260ms ease, transform 360ms ease";
      draggedImg.style.animation = "";
      draggedImg.style.opacity = "1";

      // Guardar posición
      const key = draggedImg.dataset.key;
      savedPositions[key] = {
        left: draggedImg.style.left,
        top: draggedImg.style.top,
      };

      isDragging = false;
      draggedImg = null;
    }
  });

  // ============================================
  // TOUCH EVENTS - Soporte táctil
  // ============================================
  imgs.forEach((img) => {
    img.addEventListener("touchstart", (e) => {
      isDragging = true;
      draggedImg = img;

      const touch = e.touches[0];
      const rect = img.getBoundingClientRect();
      const stageRect = stage.getBoundingClientRect();

      dragOffsetX = touch.clientX - rect.left;
      dragOffsetY = touch.clientY - rect.top;

      img.style.zIndex = "1000";
      img.style.transition = "none";
      img.style.animation = "none";
      img.style.opacity = "0.8";

      e.preventDefault();
    });
  });

  document.addEventListener("touchmove", (e) => {
    if (isDragging && draggedImg) {
      const touch = e.touches[0];
      const stageRect = stage.getBoundingClientRect();

      const x = touch.clientX - stageRect.left - dragOffsetX;
      const y = touch.clientY - stageRect.top - dragOffsetY;

      draggedImg.style.left = x + "px";
      draggedImg.style.top = y + "px";
      draggedImg.style.right = "auto";
      draggedImg.style.bottom = "auto";
      draggedImg.style.transform = "scale(1)";

      e.preventDefault();
    }
  });

  document.addEventListener("touchend", () => {
    if (draggedImg) {
      draggedImg.style.zIndex = "2";
      draggedImg.style.transition = "opacity 260ms ease, transform 360ms ease";
      draggedImg.style.animation = "";
      draggedImg.style.opacity = "1";

      const key = draggedImg.dataset.key;
      savedPositions[key] = {
        left: draggedImg.style.left,
        top: draggedImg.style.top,
      };

      isDragging = false;
      draggedImg = null;
    }
  });

  // ============================================
  // FUNCIONES AUXILIARES
  // ============================================

  function moveDraggedImage(e) {
    const stageRect = stage.getBoundingClientRect();
    const x = e.clientX - stageRect.left - dragOffsetX;
    const y = e.clientY - stageRect.top - dragOffsetY;

    draggedImg.style.left = x + "px";
    draggedImg.style.top = y + "px";
    draggedImg.style.right = "auto";
    draggedImg.style.bottom = "auto";
    draggedImg.style.transform = "scale(1)";
  }

  function applyParallax(e) {
    const stageRect = stage.getBoundingClientRect();

    // Solo aplicar parallax si el mouse está dentro del área
    if (
      e.clientY < stageRect.top ||
      e.clientY > stageRect.bottom ||
      e.clientX < stageRect.left ||
      e.clientX > stageRect.right
    ) {
      return;
    }

    const nx = (e.clientX - stageRect.left) / stageRect.width;
    const ny = (e.clientY - stageRect.top) / stageRect.height;

    const mx = (nx - 0.5) * 20;
    const my = (ny - 0.5) * 20;

    imgs.forEach((img) => {
      const k = img.dataset.key;
      const factor =
        k === "branding"
          ? 1.4
          : k === "web"
          ? 0.5
          : k === "support"
          ? 1.8
          : 0.7;

      img.style.setProperty("--mx", mx * factor + "px");
      img.style.setProperty("--my", my * factor + "px");
    });
  }

  // Restaurar posiciones guardadas (opcional, si recargas)
  window.resetImagePositions = function () {
    imgs.forEach((img) => {
      img.style.left = "";
      img.style.top = "";
      img.style.right = "";
      img.style.bottom = "";
    });
    savedPositions = {};
  };
})();

// ============================================
// ABOUT: mobile slide-up editorial panel
// ============================================
(() => {
  const wrapper = document.querySelector(".about-text-wrapper");
  const toggle = document.querySelector(".text-toggle");
  const source = document.getElementById("aboutText");
  const panel = document.getElementById("aboutPanel");
  const snap = document.querySelector(".snap");

  if (!wrapper || !toggle || !source || !panel) return;

  const mq = () => window.matchMedia("(max-width:480px)").matches;

  function openPanel() {
    if (!mq()) return;
    if (panel.classList.contains("open")) return;

    // populate panel content (use a clean inner wrapper)
    const inner = document.createElement("div");
    inner.className = "about-panel-inner";
    inner.innerHTML = source.innerHTML;
    panel.innerHTML = "";
    panel.appendChild(inner);

    // show panel and disable underlying scroll
    panel.style.display = "block";
    if (snap) snap.classList.add("no-scroll");

    // give the browser a frame to apply display before transitioning
    requestAnimationFrame(() => {
      panel.classList.add("open");
      panel.setAttribute("aria-hidden", "false");
      toggle.setAttribute("aria-expanded", "true");
      // focus for accessibility
      inner.setAttribute("tabindex", "-1");
      inner.focus();
    });
  }

  function closePanel() {
    if (!panel.classList.contains("open")) return;
    panel.classList.remove("open");
    panel.setAttribute("aria-hidden", "true");
    toggle.setAttribute("aria-expanded", "false");
    if (snap) snap.classList.remove("no-scroll");

    const onEnd = (e) => {
      if (e && e.propertyName && e.propertyName !== "transform") return;
      panel.style.display = "none";
      panel.removeEventListener("transitionend", onEnd);
      // keep panel content for next open
    };

    panel.addEventListener("transitionend", onEnd);
  }

  // Toggle behavior: on mobile only
  toggle.addEventListener("click", (e) => {
    e.preventDefault();
    if (!mq()) return;
    if (panel.classList.contains("open")) closePanel();
    else openPanel();
  });

  // Ensure panel is closed on resize to larger screens
  window.addEventListener("resize", () => {
    if (!mq()) {
      panel.classList.remove("open");
      panel.style.display = "none";
      panel.setAttribute("aria-hidden", "true");
      toggle.setAttribute("aria-expanded", "false");
      if (snap) snap.classList.remove("no-scroll");
    }
  });
})();

// ============================================
// FOOTER TOGGLE - Collapsible footer
// ============================================
(() => {
  const footerToggle = document.querySelector(".footer-toggle");
  const footerContent = document.getElementById("footerContent");

  if (!footerToggle || !footerContent) return;

  footerToggle.addEventListener("click", () => {
    const isExpanded = footerToggle.getAttribute("aria-expanded") === "true";
    footerToggle.setAttribute("aria-expanded", !isExpanded);
  });
})();

// ============================================
// HAMBURGER MENU - mobile
// ============================================
(() => {
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector(".nav");
  if (!hamburger || !nav) return;

  function toggleMenu() {
    const open = nav.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", open ? "true" : "false");
  }

  hamburger.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close when clicking a nav link
  nav.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });

  // Close when clicking outside
  document.addEventListener("click", (e) => {
    if (!nav.classList.contains("open")) return;
    if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
      nav.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
    }
  });
})();
