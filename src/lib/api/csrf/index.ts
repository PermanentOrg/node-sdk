export class CsrfStore {
  private csrf: string | undefined;

  setCsrf(csrf: string) {
    this.csrf = csrf;
  }

  getCsrf() {
    return this.csrf;
  }
}
