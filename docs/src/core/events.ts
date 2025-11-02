export type Listener<T = any> = (data: T) => void;
export class EventEmitter {
  private m = new Map<string, Set<Listener>>();
  on(event: string, cb: Listener) { if (!this.m.has(event)) this.m.set(event, new Set()); this.m.get(event)!.add(cb); return () => this.off(event, cb); }
  off(event: string, cb: Listener) { this.m.get(event)?.delete(cb); }
  emit<T>(event: string, data: T) { this.m.get(event)?.forEach(cb => cb(data)); }
}
