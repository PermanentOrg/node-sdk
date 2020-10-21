export class PermSdkError extends Error {
  constructor(message?: string) {
    super(`@permanentorg/node-sdk - ${message}`);
  }
}
