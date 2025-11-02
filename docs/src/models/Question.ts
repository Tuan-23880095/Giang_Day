export type QuestionKind = 'choice'|'tf'|'sa';

export abstract class Question {
  constructor(
    public id: string,
    public prompt: string,
    public points = 1
  ) {}
  abstract kind(): QuestionKind;
  abstract render(container: HTMLElement): void; // tạo UI vào container
  abstract grade(): number;                      // trả điểm theo đáp án người dùng
  abstract lock(): void;                         // khoá sau khi kiểm tra
  abstract reset(): void;                        // đặt lại trạng thái
}
