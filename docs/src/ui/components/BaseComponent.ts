export abstract class BaseComponent<T=any> extends HTMLElement {
  protected state!: T;
  protected setState(p: Partial<T>){ this.state = { ...this.state, ...p } as T; this.render(); }
  abstract render(): void;
}
