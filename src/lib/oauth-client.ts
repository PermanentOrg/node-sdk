import { AuthorizationCode } from 'simple-oauth2';

import { Permanent } from './client';

class PermanentOAuthClient {
  private client: AuthorizationCode;

  public constructor(
    clientId: string,
    clientSecret: string,
    private baseUrl = 'https://www.permanent.org/api',
    authHost = 'https://auth.permanent.org/'
  ) {
    this.client = new AuthorizationCode({
      client: {
        id: clientId,
        secret: clientSecret,
      },
      auth: {
        authorizePath: '/oauth2/authorize',
        tokenHost: authHost,
        tokenPath: '/oauth2/token',
      },
    });
  }

  public authorizeUrl(
    callbackUrl: string,
    scope: string,
    state: string
  ): string {
    // TODO: generate CSRF token and include it in state
    // TODO: allow arbitrary state and encode it into a URL-safe value
    return this.client.authorizeURL({
      redirect_uri: callbackUrl,
      scope,
      state,
    });
  }

  public async completeAuthorization(
    callbackUrl: string,
    code: string,
    scope: string,
    state: string
  ) {
    // eslint-disable-next-line no-empty
    if (state) {
      // TODO: verify csrf token in state
    } // override silly TS6133 error

    const token = await this.client.getToken({
      code,
      redirect_uri: callbackUrl,
      scope,
    });

    return new Permanent({
      accessToken: token,
      baseUrl: this.baseUrl,
    });
  }

  public loadToken(token: string) {
    const tokenObject = JSON.parse(token);
    const accessToken = this.client.createToken(tokenObject);
    return accessToken;
  }
}

export { PermanentOAuthClient };
