import { Router } from '../core/router';
import { HomePage } from './pages/HomePage';
import { QuizPage } from './pages/QuizPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { HttpContentRepo } from '../data/ContentRepository';
import { QuizService } from '../services/QuizService';

export class App {
  private router = new Router();
  private quizService = new QuizService(new HttpContentRepo('/content'));

  constructor(private mount: HTMLElement){}

  start(){
    const home = new HomePage(this.mount);
    const notFound = new NotFoundPage(this.mount);
    const quizPage = new QuizPage(this.mount, this.quizService);

    this.router.on('/', ()=> home.show());
    this.router.on('/quiz/sequences-01', ()=> quizPage.show('sequences-01'));
    this.router.on('/404', ()=> notFound.show());
    this.router.start();
  }
}
