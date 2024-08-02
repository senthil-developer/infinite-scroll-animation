const menuElement = document.querySelector(".menu");
const menuItemElements = document.querySelectorAll(".menu-item");

let menuElementHeight = menuElement.clientHeight;
let menuItemHeight = menuItemElements[0].clientHeight;
let totalMenuHeight = menuItemElements.length * menuItemHeight;

let currentScrollPosition = 0;
let lastScrollY = 0;
let smoothScrollY = 0;

const lerp = (start, end, t) => {
  return start * (1 - t) + end * t;
};

const adjustMenuItemsPosition = (scroll) => {
  gsap.set(menuItemElements, {
    y: (i) => i * menuItemHeight + scroll,
    modifiers: {
      y: (y) => {
        const wrapper = gsap.utils.wrap(
          -menuItemHeight,
          totalMenuHeight - menuItemHeight,
          parseInt(y)
        );
        return `${wrapper}px`;
      },
    },
  });
};

adjustMenuItemsPosition(0);

const onWheelScroll = (e) => {
  currentScrollPosition = e.deltaY;
};

let startY = 0;
let currentY = 0;
let isDragging = false;

const onDragStart = (e) => {
  startY = e.clientY || (e.touches && e.touches[0].clientY);
  isDragging = true;
  menuElement.classList.add("is-dragging");
};

const onDragMove = (e) => {
  if (!isDragging) return;
  currentY = e.clientY || (e.touches && e.touches[0].clientY);
  currentScrollPosition += (currentY - startY) * 3;
  startY = currentY;
};

const onDragEnd = (e) => {
  isDragging = false;
  menuElement.classList.remove("is-dragging");
};

const animate = () => {
  requestAnimationFrame(animate);

  smoothScrollY = lerp(smoothScrollY, currentScrollPosition, 0.1);
  adjustMenuItemsPosition(smoothScrollY);

  const scrollSpeed = smoothScrollY - lastScrollY;
  lastScrollY = smoothScrollY;

  gsap.to(menuItemElements, {
    scale: 1 - Math.min(100, Math.abs(scrollSpeed)) * 0.0075,
    rotateX: scrollSpeed * 0.2,
  });
};

animate();

menuElement.addEventListener("mousewheel", onWheelScroll);
menuElement.addEventListener("touchstart", onDragStart);
menuElement.addEventListener("touchmove", onDragMove);
menuElement.addEventListener("touchend", onDragEnd);
menuElement.addEventListener("mousedown", onDragStart);
menuElement.addEventListener("mousemove", onDragMove);
menuElement.addEventListener("mouseleave", onDragEnd);
menuElement.addEventListener("mouseup", onDragEnd);
menuElement.addEventListener("selectstart", () => false);

window.addEventListener("resize", () => {
  menuElementHeight = menuElement.clientHeight;
  menuItemHeight = menuItemElements[0].clientHeight;
  totalMenuHeight = menuItemElements.length * menuItemHeight;
});
