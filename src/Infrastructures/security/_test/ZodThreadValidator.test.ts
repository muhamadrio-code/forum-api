import { ThreadPayload } from "../../../Domains/threads/entities";
import ZodThreadValidator from "../ZodThreadValidator";

describe('ZodThreadValidator', () => {
  it('should successfully validate a valid payload', () => {
    const validator = new ZodThreadValidator();
    const payload: ThreadPayload = {
      body:"thread body",
      title: "thread title"
    };

    const result = validator.validatePayload(payload);
    expect(result).toEqual(payload);
  });

  it('should return a readonly validated payload', () => {
    const validator = new ZodThreadValidator();
    const payload: ThreadPayload = {
      body:"thread body",
      title: "thread title"
    };

    const result = validator.validatePayload(payload);

    expect(Object.isFrozen(result.body)).toBe(true);
    expect(Object.isFrozen(result.title)).toBe(true);
  });

  it('should throw am error for a very long title', () => {
    const validator = new ZodThreadValidator();
    const payload: ThreadPayload = {
      body:"thread body",
      title: "t".repeat(1000)
    };

    expect(() => {
      validator.validatePayload(payload);
    }).toThrow('tidak dapat membuat thread baru, title melebihi batas limit karakter');
  });

  it('should throw a error if payload is missing property', () => {
    const validator = new ZodThreadValidator();
    const payload = {
      title: "thread title"
    };

    expect(() => {
      validator.validatePayload(payload);
    }).toThrow("tidak dapat membuat thread baru karena properti body tidak ada");
  });

  it('should handle empty payload', () => {
    const validator = new ZodThreadValidator();
    const payload = {};

    expect(() => {
      validator.validatePayload(payload);
    }).toThrow("tidak dapat membuat thread baru karena properti title tidak ada;\ntidak dapat membuat thread baru karena properti body tidak ada");
  });

  it('should handle payload with invalid data types', () => {
    const validator = new ZodThreadValidator();
    const payload = {
      title: "thread title",
      body: []
    };

    expect(() => {
      validator.validatePayload(payload);
    }).toThrow("tidak dapat membuat thread baru karena tipe data tidak sesuai");
  });

  it('should handle undefiend payload', () => {
    const validator = new ZodThreadValidator();
    const payload = undefined;

    expect(() => {
      validator.validatePayload(payload);
    }).toThrow('tidak dapat membuat thread baru karena properti tidak sesuai');
  });

  it('should handle null payload', () => {
    const validator = new ZodThreadValidator();
    const payload = null;

    expect(() => {
      validator.validatePayload(payload);
    }).toThrow('tidak dapat membuat thread baru karena properti tidak sesuai');
  });

});
