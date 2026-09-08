import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// Published copy is a separate snapshot: saving a revision never changes it.
export const journalEntries = sqliteTable('journal_entries', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  draftJson: text('draft_json').notNull(),
  publishedJson: text('published_json'),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
  publishedAt: integer('published_at'),
  version: integer('version').notNull().default(1),
});
