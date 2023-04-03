export class PasswordMismatchError extends Error {
  constructor(message: string) {
    super(message);
  }
}
