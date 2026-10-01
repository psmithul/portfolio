import type { Post } from './post-types';

export type JournalCategory = 'AI' | 'Controls' | 'Other';
export type JournalSummary = Omit<Post, 'body' | 'draft'> & {
  category: JournalCategory;
  cover?: { src: string; alt: string };
};

export function journalCategory(post: Pick<Post, 'tags'>): JournalCategory {
  if (post.tags.some((tag) => /control|robot/i.test(tag))) return 'Controls';
  if (
    post.tags.some((tag) =>
      /^(ai|artificial intelligence)$|openai|model/i.test(tag),
    )
  )
    return 'AI';
  return 'Other';
}

export function journalSummary(post: Post): JournalSummary {
  const { body, draft: _draft, ...summary } = post;
  const image = /!\[([^\]\n]*)\]\((https?:\/\/[^\s)]+|\/(?!\/)[^\s)]+)\)/i.exec(
    body,
  );
  return {
    ...summary,
    category: journalCategory(post),
    ...(image ? { cover: { src: image[2], alt: image[1] } } : {}),
  };
}

export function journalArtKind(
  post: Pick<JournalSummary, 'slug' | 'category'>,
) {
  if (post.slug === 'gpt-6-and-the-question-of-efficiency') return 'efficiency';
  if (post.slug === 'what-excites-me-about-gpt-6-astra') return 'astra';
  if (post.slug === 'gpt-5-6-sol-and-what-i-want-to-build') return 'sol';
  return post.category === 'Controls' ? 'control' : 'note';
}
