import type { Post } from '@/lib/post-types';

export const journalTopics = [
  { slug: 'pid-versus-neural-network-control', label: 'PID & neural networks' },
  { slug: 'gpt-6-and-the-question-of-efficiency', label: 'GPT-6 · efficiency' },
  { slug: 'what-excites-me-about-gpt-6-astra', label: 'GPT-6 Astra' },
  { slug: 'gpt-5-6-sol-and-what-i-want-to-build', label: 'GPT-5.6 Sol' },
];

export function journalHighlights(posts: Post[]) {
  const selected = journalTopics.flatMap(({ slug }) => {
    const post = posts.find((entry) => entry.slug === slug);
    return post ? [post] : [];
  });
  return selected.length ? selected : posts.slice(0, 4);
}

export function journalTopic(post: Post) {
  return (
    journalTopics.find(({ slug }) => slug === post.slug)?.label ??
    post.tags.slice(0, 2).join(' / ')
  );
}

export function nextJournalPost(posts: Post[], slug: string) {
  const highlights = journalHighlights(posts);
  const highlighted = new Set(highlights.map((post) => post.slug));
  const order = [
    ...highlights,
    ...posts.filter((post) => !highlighted.has(post.slug)),
  ];
  const current = order.findIndex((post) => post.slug === slug);
  if (current < 0 || order.length < 2) return undefined;
  return order[(current + 1) % order.length];
}
