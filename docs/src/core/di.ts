export class Container {
  private map = new Map<string, any>();
  set<T>(key: string, v: T) { this.map.set(key, v); }
  get<T>(key: string): T { const v = this.map.get(key); if (!v) throw new Error(`DI missing: ${key}`); return v; }
}
