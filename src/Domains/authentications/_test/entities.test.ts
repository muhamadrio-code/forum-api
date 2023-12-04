import { AuthenticationPayload, AuthenticationTokens } from "../entities";

describe("authentications entities", () => {
  it("should create Comment object with readonly properties", () => {
    const comment: AuthenticationPayload = {
      id: 'id-123',
      username: 'my username',
    };

    expect(comment).toStrictEqual({
      id: 'id-123',
      username: 'my username',
    });

    // @ts-expect-error: comment id should readonly
    comment.id = 'changed';
    // @ts-expect-error: comment username should readonly
    comment.username = 'changed';
  });

  it("should create AuthenticationTokens object with readonly properties", () => {
    const authenticationTokens: AuthenticationTokens = {
      accessToken: 'access',
      refreshToken: 'refresh'
    };

    expect(authenticationTokens).toStrictEqual({
      accessToken: 'access',
      refreshToken: 'refresh'
    });

    // @ts-expect-error: comment id should readonly
    authenticationTokens.accessToken = 'changed';
    // @ts-expect-error: comment username should readonly
    authenticationTokens.refreshToken = 'changed';
  });
});