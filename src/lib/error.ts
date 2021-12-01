export class PermSdkError extends Error {
  constructor(message: string, apiMessage?: string[]) {
    if (!apiMessage?.length) {
      super(`@permanentorg/node-sdk - ${message}`);
    } else {
      super(
        `@permanentorg/node-sdk - ${message} - API message: ${apiMessage.join(
          ', '
        )}`
      );
    }
  }
}
