export class MarkdownService {
  async render(url: string): Promise<string> {
    const md = await fetch(url).then(r=>r.text());
    // Parser tối giản: thay # thành <h1>, **bold** → <b>, xuống dòng → <br>
    return md
      .replace(/^# (.*)$/gm,'<h1 class="text-2xl font-bold mb-2">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g,'<b>$1</b>')
      .replace(/\n/g,'<br/>');
  }
}
