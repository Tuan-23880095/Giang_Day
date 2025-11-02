// ---- Utils: Router hash ----
function onRoute(map) {
  const run = () => {
    const hash = location.hash.slice(1) || '/';
    (map[hash] || map['/404'])();
  };
  window.addEventListener('hashchange', run);
  run();
}

// ---- Nav Tabs component ----
customElements.define('nav-tabs', class extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <nav class="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div class="container mx-auto px-4">
          <div id="tabs" class="flex space-x-4 py-2">
            <a href="#/" class="tab-button active">Tổng quan</a>
            <a href="#/quiz/sequences-01" class="tab-button">Phần 1–3 (Đề: sequences-01)</a>
          </div>
        </div>
      </nav>`;
    const tabs = this.querySelectorAll('.tab-button');
    const setActive = () => {
      tabs.forEach(t => t.classList.remove('active'));
      const h = location.hash || '#/';
      const m = Array.from(tabs).find(a => a.getAttribute('href') === h);
      m && m.classList.add('active');
    };
    window.addEventListener('hashchange', setActive);
    setActive();
  }
});

// ---- Score bar ----
customElements.define('score-bar', class extends HTMLElement {
  setScore(score, total) {
    this.innerHTML = `<div class="score-bar bg-blue-800 text-white p-4 text-xl font-bold text-center">Điểm số: ${score} / ${total}</div>`;
  }
});

// ---- Mini Markdown (trang home) ----
async function renderMarkdown(url) {
  const md = await fetch(url).then(r => r.text());
  return md
    .replace(/^# (.*)$/gm, '<h1 class="text-2xl font-bold mb-2">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
    .replace(/\n/g, '<br/>');
}

// ---- Models đơn giản ----
class ChoiceQuestion {
  constructor(q) { Object.assign(this, q); this.selected = -1; }
  render(host) {
    host.innerHTML = `
      <div class="question-card">
        <div class="font-medium text-lg">${this.prompt}</div>
        <ul class="list-none space-y-2 mt-4">
        ${this.choices.map((c,i)=>`
          <li>
            <label class="flex gap-3 items-start">
              <input name="${this.id}" type="radio" value="${i}" class="mt-1"/>
              <span class="text-gray-700">${c}</span>
            </label>
          </li>`).join('')}
        </ul>
      </div>`;
    host.querySelectorAll(`input[name='${this.id}']`).forEach(inp=>{
      inp.addEventListener('change', () => { this.selected = Number(inp.value); });
    });
  }
  grade(){ return this.selected === this.answerIndex ? (this.points||1) : 0; }
  lock(){ document.querySelectorAll(`input[name='${this.id}']`).forEach(i=>i.disabled=true); }
  reset(){ this.selected=-1; document.querySelectorAll(`input[name='${this.id}']`).forEach(i=>{i.disabled=false;i.checked=false;}); }
}

class TrueFalseQuestion {
  constructor(q){ Object.assign(this, q); this.val=null; }
  render(host){
    host.innerHTML = `
      <div class="question-card">
        <div class="font-medium text-lg">${this.prompt}</div>
        <div class="mt-3 flex gap-6">
          <label class="flex items-center gap-2"><input type="radio" name="${this.id}" value="true"/> Đúng</label>
          <label class="flex items-center gap-2"><input type="radio" name="${this.id}" value="false"/> Sai</label>
        </div>
      </div>`;
    host.querySelectorAll(`input[name='${this.id}']`).forEach(inp=>{
      inp.addEventListener('change',()=>{ this.val = (inp.value==='true'); });
    });
  }
  grade(){ return this.val === this.answer ? (this.points||1) : 0; }
  lock(){ document.querySelectorAll(`input[name='${this.id}']`).forEach(i=>i.disabled=true); }
  reset(){ this.val=null; document.querySelectorAll(`input[name='${this.id}']`).forEach(i=>{i.disabled=false;i.checked=false;}); }
}

class ShortAnswerQuestion {
  constructor(q){ Object.assign(this,q); this.user=''; }
  render(host){
    host.innerHTML = `
      <div class="question-card">
        <div class="font-medium text-lg">${this.prompt}</div>
        <input type="text" class="mt-3 w-full border rounded px-3 py-2" placeholder="Nhập đáp án"/>
      </div>`;
    const input = host.querySelector('input');
    input.addEventListener('input',()=>{ this.user = input.value.trim(); });
  }
  grade(){
    const norm = s => s.replace(/\s+/g,'').toLowerCase();
    return (this.acceptedAnswers||[]).some(a=>norm(a)===norm(this.user)) ? (this.points||1) : 0;
  }
  lock(){ const i=document.querySelector(`#${this.id} input`); if(i) i.disabled=true; }
  reset(){ const i=document.querySelector(`#${this.id} input`); if(i){ i.disabled=false; i.value=''; } this.user=''; }
}

// ---- Load quiz JSON (đường dẫn tương đối trong /docs) ----
async function loadQuiz(quizId){
  const j = await fetch(`./content/quizzes/${quizId}.json`).then(r=>r.json());
  const qs = [];
  (j.parts.part1||[]).forEach(q=>qs.push(new ChoiceQuestion(q)));
  (j.parts.part2||[]).forEach(q=>qs.push(new TrueFalseQuestion(q)));
  (j.parts.part3||[]).forEach(q=>qs.push(new ShortAnswerQuestion(q)));
  return { id:j.id, title:j.title, questions:qs, total:qs.reduce((s,q)=>s+(q.points||1),0) };
}

// ---- Pages ----
async function showHome(mount){
  const html = await renderMarkdown('./content/pages/home.md');
  mount.innerHTML = `<div class="bg-white p-6 rounded-xl shadow-lg border">${html}</div>`;
}

async function showQuiz(mount, quizId){
  const quiz = await loadQuiz(quizId);
  mount.innerHTML = '';
  const frag = document.createDocumentFragment();

  quiz.questions.forEach(q=>{
    const host = document.createElement('div');
    host.id = q.id;
    host.className = 'my-4';
    q.render(host);
    frag.appendChild(host);
  });

  const controls = document.createElement('div');
  controls.className = 'mt-6 flex gap-3';
  const checkBtn = document.createElement('button');
  checkBtn.className = 'solution-toggle';
  checkBtn.textContent = 'Kiểm tra';
  const resetBtn = document.createElement('button');
  resetBtn.className = 'px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300';
  resetBtn.textContent = 'Đặt lại';
  controls.append(checkBtn, resetBtn);

  mount.appendChild(frag);
  mount.appendChild(controls);

  const bar = document.createElement('score-bar');
  document.body.appendChild(bar);

  const scoreNow = () => {
    const s = quiz.questions.reduce((sum,q)=>sum+q.grade(),0);
    bar.setScore(s, quiz.total);
  };

  checkBtn.onclick = () => {
    quiz.questions.forEach(q=>q.lock());
    scoreNow();
    checkBtn.disabled = true;
  };
  resetBtn.onclick = () => location.reload();
}

// ---- App start ----
const app = document.getElementById('app');
onRoute({
  '/': () => showHome(app),
  '/quiz/sequences-01': () => showQuiz(app, 'sequences-01'),
  '/404': () => app.innerHTML = `<div class='p-6 bg-white rounded-xl border'>Không tìm thấy trang.</div>`
});
