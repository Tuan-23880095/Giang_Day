import { QuizService } from '../../services/QuizService';
import { ScoringService } from '../../services/ScoringService';
import '../../ui/components/ScoreBar';

export class QuizPage {
  private scoreBar: HTMLElement;
  constructor(private mount: HTMLElement, private quizzes: QuizService, private scoring = new ScoringService()){
    this.scoreBar = document.createElement('score-bar');
    document.body.appendChild(this.scoreBar);
  }
  async show(quizId: string){
    const quiz = await this.quizzes.loadQuiz(quizId);
    this.mount.innerHTML = '';
    const frag = document.createDocumentFragment();

    quiz.questions.forEach(q => {
      const host = document.createElement('div'); host.id = q.id; host.className = 'my-4';
      q.render(host); frag.appendChild(host);
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
    this.mount.appendChild(frag);
    this.mount.appendChild(controls);

    const updateScore = () => {
      const s = this.scoring.score(quiz);
      (this.scoreBar as any).setScore(s, quiz.totalPoints());
    };

    checkBtn.onclick = () => { updateScore(); checkBtn.disabled = true; };
    resetBtn.onclick = () => { location.reload(); };
  }
}
