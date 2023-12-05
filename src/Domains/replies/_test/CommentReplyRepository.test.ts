import CommentsReplyRepositoryTest from "./dummies/ThreadCommentsRepositoryTest";
import CommentsReplyRepository from "../CommentReplyRepository";

describe('ThreadCommentsRepository', () => {
  it('should throw error when invoked', async () => {
    // Arrange
    const sut: CommentsReplyRepository = new CommentsReplyRepositoryTest();

    // Act & Assert
    // @ts-expect-error: no-check
    await expect(sut.addReply({})).rejects.toThrow('UNINPLEMENTED.ERROR');
    await expect(sut.deleteReplyById('')).rejects.toThrow('UNINPLEMENTED.ERROR');
    await expect(sut.getRepliesByCommentIds([''])).rejects.toThrow('UNINPLEMENTED.ERROR');
    await expect(sut.getReplyById('')).rejects.toThrow('UNINPLEMENTED.ERROR');
  });
});