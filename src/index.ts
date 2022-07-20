type Initializer<T> = T | (() => T)
function initialize<T>(initializer: Initializer<T>) {
  if (typeof initializer == 'function') {
    return (initializer as Function)()
  } else {
    return initializer as T
  }
}

export const builderFor = <T>(defaults: Initializer<T>) => 
  (overrides: Partial<T> = {}) => ({
    ...initialize(defaults),
    ...overrides
  });
