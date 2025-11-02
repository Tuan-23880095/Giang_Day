export type Unsubscribe = () => void;
export class Store<T> {
  private state: T; private subs = new Set<(s: T) => void>();
  constructor(initial: T) { this.state = initial; }
  get() { return this.state; }
  set(patch: Partial<T>) { this.state = { ...this.state, ...patch }; this.subs.forEach(s => s(this.state)); }
  subscribe(cb: (s: T) => void): Unsubscribe { this.subs.add(cb); cb(this.state); return () => this.subs.delete(cb); }
}
