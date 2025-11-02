import { Quiz } from '../models/Quiz';
export class ScoringService {
  score(quiz: Quiz){ return quiz.questions.reduce((s,q)=>s+q.grade(),0); }
}
