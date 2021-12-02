import { AuthorizationCode } from 'simple-oauth2';
import type { AccessToken } from 'simple-oauth2';

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
  ): Promise<AccessToken> {
    if (state) {
      // TODO: verify csrf token in state
    }

    return await this.client.getToken({
      code,
      redirect_uri: callbackUrl,
      scope,
    });
  }

  public loadToken(token: string): AccessToken {
    const tokenObject = JSON.parse(token);
    const accessToken = this.client.createToken(tokenObject);
    return accessToken;
  }

  public clientFromToken(accessToken: AccessToken): Permanent {
    return new Permanent({
      accessToken,
      baseUrl: this.baseUrl,
    });
  }
}

export { PermanentOAuthClient };
