import { SecurityContext } from './security-context';
import { ISecurityContext } from './security-token';

export class Context {
  private readonly _userEmail: string;
  private readonly _securedAuthToken?: ISecurityContext;
  constructor(
    userEmail: string,
    private readonly _correlationID: string,
    authToken?: string,
  ) {
    this._securedAuthToken = new SecurityContext(authToken);
    this._userEmail = userEmail;
    if (this._securedAuthToken.securedTokenInfo.email) {
      this._userEmail = this._securedAuthToken.securedTokenInfo.email;
    }
  }

  get userEmail(): string {
    return this._userEmail;
  }

  get correlationId(): string {
    return this._correlationID;
  }

  get securedAuthToken() {
    return this._securedAuthToken.securedTokenInfo;
  }

  get accessToken(): string {
    return this._securedAuthToken.accessToken;
  }
}
