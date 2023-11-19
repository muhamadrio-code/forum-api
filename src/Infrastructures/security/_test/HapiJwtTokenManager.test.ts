import HapiJwtTokenManager from "../HapiJwtTokenManager"
import { token } from "@hapi/jwt";

describe('HapiJwtTokenManager', () => {
  let sut: HapiJwtTokenManager;
  let mockToken: Pick<typeof token, 'generate' | 'decode'>

  beforeEach(() => {
    mockToken = {
      generate: jest.fn().mockReturnValue("encoded payload"),
      decode: jest.fn().mockReturnValue({ 
        decoded: {
          payload: { id: "test_id", username: "test" }
        }
      }),
    }

    sut = new HapiJwtTokenManager(mockToken as typeof token)
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  it('should return a string token when calling createAccessToken', async () => {
    const accessToken = await sut.createAccessToken({ id: "test_id", username: "test" })
    expect(mockToken.generate).toHaveBeenCalled()
    expect(accessToken)
    .toEqual("encoded payload")
  })

  it('should return a string token when calling createRefreshToken', async () => {
    const result = await sut.createRefreshToken({ id: "test_id", username: "test" });
    expect(mockToken.generate).toHaveBeenCalled()
    expect(result)
    .toEqual("encoded payload")
  });

  it('should decode a token when calling decodePayload without throw an error', async () => {
    const accessToken = await sut.createAccessToken({ id: "test_id", username: "test" });
    const result = await sut.decodePayload(accessToken)

    expect(mockToken.decode).toHaveBeenCalled()
    expect(result).toStrictEqual({ id: "test_id", username: "test" })
  });

  it('should not throw an error when calling varifyRefreshToken', async () => {
    const hapiJwtTokenManager = new HapiJwtTokenManager(token)
    const spyVerify = jest.spyOn(token, 'verify')
    const spyDecode = jest.spyOn(token, 'decode')

    const refreshToken = await hapiJwtTokenManager.createRefreshToken({ id: "test_id", username: "test" });

    await expect(hapiJwtTokenManager.verifyRefreshToken(refreshToken)).resolves.not.toThrow()
    expect(spyDecode).toHaveBeenCalledWith(refreshToken)
    expect(spyVerify).toHaveBeenCalled()
  });

  it('should throw error when calling varifyRefreshToken with invalid token', async () => {
    const hapiJwtTokenManager = new HapiJwtTokenManager(token)
    const spyVerify = jest.spyOn(token, 'verify')

    await expect(hapiJwtTokenManager.verifyRefreshToken("refreshToken")).rejects.toThrow()
    expect(spyVerify).not.toHaveBeenCalled()
  });
})