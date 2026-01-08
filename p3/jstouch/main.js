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

  // Botones - click para cambiar imagen activa
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => setActive(btn.dataset.key));
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
