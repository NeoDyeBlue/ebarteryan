const { body, documentElement } = typeof document !== undefined && document;
let { scrollTop } = typeof document !== undefined && document.documentElement;

/**
 * @see {@link https://jsfiddle.net/v1gke7po/}
 * @see {@link https://stackoverflow.com/a/70057919}
 */

export function disableScroll() {
  scrollTop = documentElement.scrollTop;
  body.style.top = `-${scrollTop}px`;
  body.classList.add("fixed", "w-full", "overflow-y-scroll");
}

export function enableScroll() {
  body.classList.remove("fixed", "w-full", "overflow-y-scroll");
  documentElement.scrollTop = scrollTop;
  body.style.removeProperty("top");
}
