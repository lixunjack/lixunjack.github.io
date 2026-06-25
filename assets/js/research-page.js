(function () {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.getElementById('wrapper');
    if (!wrapper) return;

    let zoomInner = document.getElementById('zoom-inner');
    if (!zoomInner) {
      zoomInner = document.createElement('div');
      zoomInner.id = 'zoom-inner';
      while (wrapper.firstChild) zoomInner.appendChild(wrapper.firstChild);
      wrapper.appendChild(zoomInner);
    }

    let scale = 1;
    let tx = 0;
    let ty = 0;
    const ZOOM_STEP = 1.05;
    const MIN_SCALE = 0.5;
    const MAX_SCALE = 3;

    zoomInner.style.transformOrigin = 'center center';
    zoomInner.style.willChange = 'transform';

    const clamp = (value, min, max) => Math.max(min, Math.min(value, max));
    const applyTransform = () => {
      zoomInner.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    };
    const zoomBy = (factor) => {
      const nextScale = clamp(scale * factor, MIN_SCALE, MAX_SCALE);
      if (nextScale === scale) return;
      scale = nextScale;
      applyTransform();
    };

    window.addEventListener('wheel', (event) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      zoomBy(event.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP);
    }, { passive: false });

    window.addEventListener('keydown', (event) => {
      const el = event.target;
      const isEditable = el && (el.isContentEditable ||
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName));
      if (isEditable || (!event.ctrlKey && !event.metaKey)) return;

      let handled = false;
      if (event.code === 'Equal' || event.code === 'NumpadAdd' || event.key === '+') {
        zoomBy(ZOOM_STEP);
        handled = true;
      } else if (event.code === 'Minus' || event.code === 'NumpadSubtract' || event.key === '-') {
        zoomBy(1 / ZOOM_STEP);
        handled = true;
      } else if (event.code === 'Digit0' || event.code === 'Numpad0' || event.key === '0') {
        scale = 1;
        tx = 0;
        ty = 0;
        handled = true;
      }

      if (handled) {
        event.preventDefault();
        applyTransform();
      }
    });

    let isPanning = false;
    let startX = 0;
    let startY = 0;
    let startTx = 0;
    let startTy = 0;

    const startPan = (clientX, clientY) => {
      isPanning = true;
      startX = clientX;
      startY = clientY;
      startTx = tx;
      startTy = ty;
      document.body.style.cursor = 'grabbing';
    };
    const movePan = (clientX, clientY) => {
      if (!isPanning) return;
      tx = startTx + (clientX - startX);
      ty = startTy + (clientY - startY);
      applyTransform();
    };
    const endPan = () => {
      isPanning = false;
      document.body.style.cursor = '';
    };

    window.addEventListener('mousedown', (event) => {
      if (!event.target || !event.isTrusted) return;
      if (event.button === 0 && (event.getModifierState && event.getModifierState(' '))) {
        event.preventDefault();
        startPan(event.clientX, event.clientY);
      }
    });

    window.addEventListener('mousemove', (event) => movePan(event.clientX, event.clientY));
    window.addEventListener('mouseup', endPan);
    window.addEventListener('mouseleave', endPan);
    window.addEventListener('gesturestart', (event) => event.preventDefault());
    window.addEventListener('gesturechange', (event) => {
      event.preventDefault();
      zoomBy(clamp(event.scale, 0.95, 1.05));
    }, { passive: false });

    applyTransform();
  });
})();
