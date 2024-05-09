import { ISecuredTokenInformation, ISecurityContext } from './security-token';

export class SecurityContext implements ISecurityContext {
  private readonly _securedTokenInfo: ISecuredTokenInformation;
  private readonly _accessToken?: string;

  constructor(token?: string) {
    this._accessToken = token;
    this._securedTokenInfo = this.getTokenInformation();
  }

  get securedTokenInfo(): ISecuredTokenInformation {
    return this._securedTokenInfo;
  }

  get accessToken(): string | undefined {
    return this._accessToken;
  }

  getTokenInformation(): ISecuredTokenInformation {
    return;
  }
}
