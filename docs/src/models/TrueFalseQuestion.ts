import { Question } from './Question';
export class TrueFalseQuestion extends Question {
  private val: boolean | null = null;
  constructor(id: string, prompt: string, private answer: boolean, points=1){ super(id, prompt, points); }
  kind(){ return 'tf' as const; }
  render(el: HTMLElement){
    el.innerHTML = `
      <div class="question-card">
        <div class="font-medium text-lg">${this.prompt}</div>
        <div class="mt-3 flex gap-6">
          <label class="flex items-center gap-2"><input type="radio" name="${this.id}" value="true"/> Đúng</label>
          <label class="flex items-center gap-2"><input type="radio" name="${this.id}" value="false"/> Sai</label>
        </div>
      </div>`;
    el.querySelectorAll<HTMLInputElement>(`input[name='${this.id}']`).forEach(inp=>inp.addEventListener('change',()=>{
      this.val = inp.value === 'true';
    }));
  }
  grade(){ return this.val === this.answer ? this.points : 0; }
  lock(){ elDisable(`input[name='${this.id}']`); }
  reset(){ this.val = null; elEnable(`input[name='${this.id}']`); }
}
function elDisable(sel: string){ document.querySelectorAll<HTMLInputElement>(sel).forEach(i=>i.disabled=true); }
function elEnable(sel: string){ document.querySelectorAll<HTMLInputElement>(sel).forEach(i=>i.disabled=false); }
