export const Storage = {
  set(key: string, val: unknown){ localStorage.setItem(key, JSON.stringify(val)); },
  get<T>(key: string): T | null { const v = localStorage.getItem(key); return v ? JSON.parse(v) as T : null; },
  remove(key: string){ localStorage.removeItem(key); }
};
