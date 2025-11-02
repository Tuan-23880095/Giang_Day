export class Router {
  private routes: Record<string, () => void> = {};
  on(path: string, handler: () => void) { this.routes[path] = handler; }
  start() {
    const run = () => (this.routes[location.hash.slice(1)] || this.routes['/'])?.();
    window.addEventListener('hashchange', run); run();
  }
}
