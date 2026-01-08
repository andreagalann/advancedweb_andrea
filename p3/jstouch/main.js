// SERVICES hover/tap -> activa la imagen correspondiente + mini parallax
(() => {
  const stage = document.getElementById("servicesStage");
  if (!stage) return;

  const buttons = document.querySelectorAll(".service-button");
  const imgs = stage.querySelectorAll(".float-img");

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

  // Hover + click
  buttons.forEach((btn) => {
    btn.addEventListener("mouseenter", () => setActive(btn.dataset.key));
    btn.addEventListener("focus", () => setActive(btn.dataset.key));
    btn.addEventListener("click", () => setActive(btn.dataset.key));
  });

  // Parallax suave con el mouse
  let raf = null;
  document.addEventListener("mousemove", (e) => {
    const rect = stage.getBoundingClientRect();
    
    // Solo aplicar parallax si el mouse está dentro del área de servicios
    if (e.clientY < rect.top || e.clientY > rect.bottom ||
        e.clientX < rect.left || e.clientX > rect.right) {
      return;
    }

    const nx = (e.clientX - rect.left) / rect.width; // 0..1
    const ny = (e.clientY - rect.top) / rect.height; // 0..1

    const mx = (nx - 0.5) * 20; // intensidad horizontal
    const my = (ny - 0.5) * 20; // intensidad vertical

    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      imgs.forEach((img) => {
            ? 0.8
            : k === "support"
            ? 1.15
            : 0.9;

        img.style.setProperty("--mx", `${mx * factor}px`);
        img.style.setProperty("--my", `${my * factor}px`);
      });
    });
  });
})();
