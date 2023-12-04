import { RegisteredUser, User, UserLoginPayload, UserPayload } from "../entities";


describe('users entities', () => {
  it("should create User object with readonly properties", () => {
    const user: User = {
      id: 'my-id',
      fullname: 'my fullname',
      password: 'secret',
      username: 'my username',
    };

    expect(user).toStrictEqual({
      id: 'my-id',
      fullname: 'my fullname',
      password: 'secret',
      username: 'my username',
    });

      // @ts-expect-error: user id should readonly
      user.id = 'changed';
      // @ts-expect-error: user fullname should readonly
      user.fullname = 'changed';
      // @ts-expect-error: user password should readonly
      user.password = 'changed';
      // @ts-expect-error: user username should readonly
      user.username = 'changed';
  });

  it("should create RegisteredUser object with readonly properties", () => {
    const registeredUser: RegisteredUser = {
      id: 'my-id',
      fullname: 'my fullname',
      username: 'my username',
    };

    expect(registeredUser).toStrictEqual({
      id: 'my-id',
      fullname: 'my fullname',
      username: 'my username',
    });

    // @ts-expect-error: registeredUser id should readonly
    registeredUser.id = 'changed';
    // @ts-expect-error: registeredUser fullname should readonly
    registeredUser.fullname = 'changed';
    // @ts-expect-error: registeredUser username should readonly
    registeredUser.username = 'changed';
  });

  it("should create UserPayload object with readonly properties", () => {
    const registeredUser: UserPayload = {
      fullname: 'my fullname',
      username: 'my username',
      password: 'secret'
    };

    expect(registeredUser).toStrictEqual({
      fullname: 'my fullname',
      username: 'my username',
      password: 'secret'
    });

    // @ts-expect-error: registeredUser fullname should readonly
    registeredUser.fullname = 'changed';
    // @ts-expect-error: registeredUser username should readonly
    registeredUser.username = 'changed';
    // @ts-expect-error: registeredUser id should readonly
    registeredUser.password = 'changed';
  });

  it("should create UserLoginPayload object with readonly properties", () => {
    const registeredUser: UserLoginPayload = {
      username: 'my username',
      password: 'secret'
    };

    expect(registeredUser).toStrictEqual({
      username: 'my username',
      password: 'secret'
    });

    // @ts-expect-error: registeredUser username should readonly
    registeredUser.username = 'changed';
    // @ts-expect-error: registeredUser id should readonly
    registeredUser.password = 'changed';
  });
});