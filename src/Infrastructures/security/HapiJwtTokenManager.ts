import { HapiJwt } from "@hapi/jwt";
import AuthenticationTokenManager from "../../Applications/security/AuthenticationTokenManager";
import InvariantError from "../../Common/Errors/InvariantError";
import { AuthenticationPayload } from "../../Domains/authentications/entities";

export default class HapiJwtTokenManager extends AuthenticationTokenManager {
  private readonly jwt: HapiJwt.Token;

  constructor(jwt: HapiJwt.Token) {
    super();
    this.jwt = jwt;
  }

  async createAccessToken(payload: AuthenticationPayload): Promise<string> {
    return this.jwt.generate(payload, process.env.ACCESS_TOKEN_KEY!);
  }

  async createRefreshToken(payload: AuthenticationPayload): Promise<string> {
    return this.jwt.generate(payload, process.env.REFRESH_TOKEN_KEY!);
  }

  async decodePayload(token: string): Promise<AuthenticationPayload> {
    return this.jwt.decode(token).decoded.payload;
  }

  async verifyRefreshToken(refreshToken: string) {
    try {
      const artifacts = this.jwt.decode(refreshToken);
      this.jwt.verify(artifacts, process.env.REFRESH_TOKEN_KEY!);
    } catch (error) {
      if (error instanceof Error) {
        throw new InvariantError('refresh token tidak valid');
      }
    }
  }
}