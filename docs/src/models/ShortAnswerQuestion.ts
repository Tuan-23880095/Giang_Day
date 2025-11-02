import { Question } from './Question';
export class ShortAnswerQuestion extends Question {
  private user = '';
  constructor(id: string, prompt: string, private accepted: string[], points=1){ super(id, prompt, points); }
  kind(){ return 'sa' as const; }
  render(el: HTMLElement){
    el.innerHTML = `
      <div class="question-card">
        <div class="font-medium text-lg">${this.prompt}</div>
        <input type="text" class="mt-3 w-full border rounded px-3 py-2" placeholder="Nhập đáp án" />
      </div>`;
    const input = el.querySelector('input') as HTMLInputElement;
    input.addEventListener('input',()=>{ this.user = input.value.trim(); });
  }
  grade(){
    const norm = (s:string)=>s.replace(/\s+/g,'').toLowerCase();
    return this.accepted.some(a=>norm(a)===norm(this.user)) ? this.points : 0;
  }
  lock(){ const i=document.querySelector<HTMLInputElement>(`#${this.id} input`); if(i) i.disabled=true; }
  reset(){ this.user=''; const i=document.querySelector<HTMLInputElement>(`#${this.id} input`); if(i){ i.disabled=false; i.value=''; } }
}
