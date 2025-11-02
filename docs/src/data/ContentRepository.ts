import { Quiz } from '../models/Quiz';
import { ChoiceQuestion } from '../models/ChoiceQuestion';
import { TrueFalseQuestion } from '../models/TrueFalseQuestion';
import { ShortAnswerQuestion } from '../models/ShortAnswerQuestion';

export interface ContentRepository {
  getQuizById(id: string): Promise<Quiz>;
}

export class HttpContentRepo implements ContentRepository {
  constructor(private base = '/content'){}
  async getQuizById(id: string): Promise<Quiz> {
    const j = await fetch(`${this.base}/quizzes/${id}.json`).then(r=>r.json());
    const questions = [
      ...(j.parts.part1||[]).map((q:any)=> new ChoiceQuestion(q.id,q.prompt,q.choices,q.answerIndex,q.points)),
      ...(j.parts.part2||[]).map((q:any)=> new TrueFalseQuestion(q.id,q.prompt,q.answer,q.points)),
      ...(j.parts.part3||[]).map((q:any)=> new ShortAnswerQuestion(q.id,q.prompt,q.acceptedAnswers,q.points))
    ];
    return new Quiz(j.id, j.title, questions);
  }
}
