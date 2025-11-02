export class NotFoundPage {
  constructor(private mount: HTMLElement){}
  show(){ this.mount.innerHTML = `<div class='p-6 bg-white rounded-xl border'>Không tìm thấy trang.</div>`; }
}
