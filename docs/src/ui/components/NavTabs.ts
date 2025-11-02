class NavTabs extends HTMLElement {
  connectedCallback(){
    this.innerHTML = `
      <nav class="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div class="container mx-auto px-4">
          <div id="nav-tabs" class="flex space-x-4 py-2">
            <a href="#/" class="tab-button active">Tổng quan</a>
            <a href="#/quiz/sequences-01" class="tab-button">Phần 1–3 (Đề: sequences-01)</a>
          </div>
        </div>
      </nav>`;
    const tabs = this.querySelectorAll('.tab-button');
    const setActive = () => {
      tabs.forEach(t=>t.classList.remove('active'));
      const hash = location.hash || '#/';
      const m = Array.from(tabs).find(a => (a as HTMLAnchorElement).getAttribute('href') === hash);
      m?.classList.add('active');
    };
    window.addEventListener('hashchange', setActive);
    setActive();
  }
}
customElements.define('nav-tabs', NavTabs);
