import { Question } from './Question';
export class Quiz {
  constructor(public id: string, public title: string, public questions: Question[]){ }
  totalPoints(){ return this.questions.reduce((s,q)=>s+q.points,0); }
}
