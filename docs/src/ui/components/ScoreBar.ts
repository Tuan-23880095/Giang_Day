export class ScoreBar extends HTMLElement {
  setScore(score: number, total: number){
    this.innerHTML = `<div class="score-bar bg-blue-800 text-white p-4 text-xl font-bold text-center">Điểm số: ${score} / ${total}</div>`;
  }
}
customElements.define('score-bar', ScoreBar);
