type Context = {
  next: (name: string) => number,
}
type Initializer<T> = T | ((context: Context) => T)


const newContext = () => {
  const sequences: Record<string, number> = {};
  return {
    next: (name: string) => {
      sequences[name] = sequences[name] || 0;
      return sequences[name]++;
    }
  }
}

function initialize<T>(initializer: Initializer<T>, context: Context) {
  if (typeof initializer == 'function') {
    return (initializer as Function)(context)
  } else {
    return initializer as T
  }
}

export const builderFor = <T>(defaults: Initializer<T>) => {
  const context = newContext();

  const builder: (overrides?: Partial<T>) => T = (overrides = {}) => ({
    ...initialize(defaults, context),
    ...overrides
  });

  return builder;
}
