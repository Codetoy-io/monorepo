export function outsideclick(node: HTMLElement) {
  const handleClick = (event: MouseEvent) => {
    if (!node.contains(event.target as Node)) {
      node.dispatchEvent(new CustomEvent("outclick"));
    }
  };

  document.addEventListener("click", handleClick, true);

  return {
    destroy() {
      document.removeEventListener("click", handleClick, true);
    }
  };
}

/*
 * Waits until the provided condition function returns a truthy value.
 * @param {Function} condition - The function to check periodically.
 * @param {number} [timeout=5000] - Maximum time to wait in milliseconds.
 * @param {number} [intervalTime=100] - How often to check the condition in milliseconds.
 * @returns {Promise<any>} A promise that resolves with the condition's result when met.
 */
export function waitUntil(condition: () => boolean, timeout = 5000, intervalTime = 100) {
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      const result = condition();
      if (result) {
        clearInterval(interval);
        clearTimeout(timeoutId);
        resolve(result); // Resolve with the result (e.g., the non-null value)
      }
    }, intervalTime);

    const timeoutId = setTimeout(() => {
      clearInterval(interval);
      reject(new Error('Timed out waiting for condition to be met'));
    }, timeout);
  });
}

export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delay: number
): ((...args: Args) => void) & { cancel(): void } {
  let id: ReturnType<typeof setTimeout> | undefined;
  function debounced(...args: Args) {
    clearTimeout(id);
    id = setTimeout(() => fn(...args), delay);
  }
  debounced.cancel = () => clearTimeout(id);
  return debounced;
}
