import { ContentRepository } from '../data/ContentRepository';
import { ChoiceQuestion } from '../models/ChoiceQuestion';
import { TrueFalseQuestion } from '../models/TrueFalseQuestion';
import { ShortAnswerQuestion } from '../models/ShortAnswerQuestion';
import { Quiz } from '../models/Quiz';

export class QuizService {
  constructor(private repo: ContentRepository){}
  async loadQuiz(id: string): Promise<Quiz>{
    const raw = await this.repo.getQuizById(id);
    return raw;
  }
}
