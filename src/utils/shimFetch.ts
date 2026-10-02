// Defensive shim to prevent "Cannot set property fetch of #<Window> which has only a getter"
if (typeof window !== 'undefined') {
  try {
    const rawFetch = window.fetch;
    let currentFetch = typeof rawFetch === 'function' ? rawFetch.bind(window) : rawFetch;
    Object.defineProperty(window, 'fetch', {
      get() {
        return currentFetch;
      },
      set(newFetch) {
        currentFetch = typeof newFetch === 'function' ? newFetch.bind(window) : newFetch;
      },
      configurable: true,
      enumerable: true,
    });
  } catch {
    try {
      const protoFetch = Window.prototype.fetch;
      let currentProtoFetch = typeof protoFetch === 'function' ? protoFetch.bind(window) : protoFetch;
      Object.defineProperty(Window.prototype, 'fetch', {
        get() {
          return currentProtoFetch;
        },
        set(newFetch) {
          currentProtoFetch = typeof newFetch === 'function' ? newFetch.bind(window) : newFetch;
        },
        configurable: true,
        enumerable: true,
      });
    } catch {
      // Ignored
    }
  }

  try {
    if (window.navigator && window.navigator.sendBeacon) {
      const rawBeacon = window.navigator.sendBeacon;
      let currentBeacon = typeof rawBeacon === 'function' ? rawBeacon.bind(window.navigator) : rawBeacon;
      Object.defineProperty(window.navigator, 'sendBeacon', {
        get() {
          return currentBeacon;
        },
        set(nb) {
          currentBeacon = typeof nb === 'function' ? nb.bind(window.navigator) : nb;
        },
        configurable: true,
        enumerable: true,
      });
    }
  } catch {
    // Ignored
  }
}

export {};
