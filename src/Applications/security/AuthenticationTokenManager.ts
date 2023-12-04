import { AuthenticationPayload } from "../../Domains/authentications/entities";

export default abstract class AuthenticationTokenManager {
  abstract createAccessToken(payload: AuthenticationPayload): Promise<string>
  abstract createRefreshToken(payload: AuthenticationPayload): Promise<string>
  abstract decodePayload(token: string): Promise<AuthenticationPayload>
  abstract verifyRefreshToken(refreshToken: string): Promise<void>
}