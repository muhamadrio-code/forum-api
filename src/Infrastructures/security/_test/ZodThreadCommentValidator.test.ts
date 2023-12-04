import ZodThreadCommentValidator from "../ZodThreadCommentValidator";

describe("ZodThreadCommentValidator", () => {
  it('should validate a valid payload successfully', () => {
    const validator = new ZodThreadCommentValidator();
    const payload = { content: "this is content" };

    expect(() => validator.validatePayload(payload)).not.toThrow();
  });

  it('should throw a error when content is invalid data type', () => {
    const validator = new ZodThreadCommentValidator();
    const payload = { content: 1231 };

    expect(() => validator.validatePayload(payload)).toThrow('tidak dapat membuat comment baru, tipe data tidak sesuai');
  });

  it('should throw a error when content is an empty string', () => {
    const validator = new ZodThreadCommentValidator();
    const payload = { content: "" };

    expect(() => validator.validatePayload(payload)).toThrow('tidak dapat membuat comment baru, content tidak boleh kosong');
  });

  it('should throw a error when content is null', () => {
    const validator = new ZodThreadCommentValidator();
    const payload = { content: null };

    expect(() => validator.validatePayload(payload)).toThrow('tidak dapat membuat comment baru, tipe data tidak sesuai');
  });

  it('should throw error if payload is undefined', () => {
    const validator = new ZodThreadCommentValidator();
    const payload = undefined;

    expect(() => {
      validator.validatePayload(payload);
    }).toThrow('tidak dapat membuat thread baru karena properti tidak sesuai');
  });

  it('should throw error if payload is null', () => {
    const validator = new ZodThreadCommentValidator();
    const payload = null;

    expect(() => {
      validator.validatePayload(payload);
    }).toThrow();
  });

  it('should throw error if payload is an empty object', () => {
    const validator = new ZodThreadCommentValidator();
    const payload = {};

    expect(() => {
      validator.validatePayload(payload);
    }).toThrow('tidak dapat membuat comment baru, karena properti tidak sesuai');
  });
});