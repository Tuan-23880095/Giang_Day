import { MarkdownService } from '../../services/MarkdownService';

export class HomePage {
  constructor(private mount: HTMLElement, private md = new MarkdownService()){}
  async show(){
    const html = await this.md.render('/content/pages/home.md');
    this.mount.innerHTML = `<div class="bg-white p-6 rounded-xl shadow-lg border">${html}</div>`;
  }
}
