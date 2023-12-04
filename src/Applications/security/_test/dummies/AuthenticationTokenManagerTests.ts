/* eslint-disable @typescript-eslint/no-unused-vars */
import { AuthenticationPayload } from "../../../../Domains/authentications/entities";
import AuthenticationTokenManager from "../../AuthenticationTokenManager";

export default class AuthenticationTokenManagerTest extends AuthenticationTokenManager {
  async createAccessToken(payload: AuthenticationPayload): Promise<string> {
    throw new Error('UNINPLEMENTED.ERROR');
  }

  async createRefreshToken(payload: AuthenticationPayload): Promise<string> {
    throw new Error('UNINPLEMENTED.ERROR');
  }

  async decodePayload(token: string): Promise<AuthenticationPayload> {
    throw new Error('UNINPLEMENTED.ERROR');
  }

  async verifyRefreshToken(refreshToken: string): Promise<void> {
    throw new Error('UNINPLEMENTED.ERROR');
  }
}