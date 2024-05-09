export interface ISecuredTokenInformation {
  name: string;
  email: string;
  roles?: string;
}

export interface ISecurityContext {
  securedTokenInfo?: ISecuredTokenInformation;
  accessToken?: string;
}
