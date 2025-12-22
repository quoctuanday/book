export class ChapterContentModel {
  constructor(
    public readonly id: string | null,
    public readonly chapterId: string,
    public content: string,
    public readonly updatedAt: Date,
  ) {}

  updateContent(content: string) {
    if (!content?.trim()) {
      throw new Error('Content must not be empty');
    }
    this.content = content;
  }
}
