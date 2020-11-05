export class PermSdkError extends Error {
  constructor(message?: string, apiMessage?: string[]) {
    if (!message && !apiMessage) {
      super(`@permanentorg/node-sdk - error!`);
    } else if (!apiMessage?.length) {
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
