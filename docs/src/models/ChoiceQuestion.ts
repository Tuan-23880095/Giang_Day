import { Question } from './Question';
export class ChoiceQuestion extends Question {
  private selected = -1;
  constructor(id: string, prompt: string, private choices: string[], private answerIndex: number, points=1){
    super(id, prompt, points);
  }
  kind() { return 'choice' as const; }
  render(el: HTMLElement) {
    el.innerHTML = `
      <div class="question-card">
        <div class="font-medium text-lg">${this.prompt}</div>
        <ul class="list-none space-y-2 mt-4">
          ${this.choices.map((c,i)=>`<li><label class="flex gap-3 items-start">
            <input name="${this.id}" type="radio" value="${i}" class="mt-1" />
            <span class="text-gray-700">${c}</span>
          </label></li>`).join('')}
        </ul>
      </div>`;
    el.querySelectorAll<HTMLInputElement>(`input[name='${this.id}']`).forEach(inp=>{
      inp.addEventListener('change',()=>{ this.selected = Number(inp.value); });
    });
  }
  grade(){ return this.selected === this.answerIndex ? this.points : 0; }
  lock(){ elDisable(`input[name='${this.id}']`); }
  reset(){ this.selected = -1; elEnable(`input[name='${this.id}']`); }
}
function elDisable(sel: string){ document.querySelectorAll<HTMLInputElement>(sel).forEach(i=>i.disabled=true); }
function elEnable(sel: string){ document.querySelectorAll<HTMLInputElement>(sel).forEach(i=>i.disabled=false); }
