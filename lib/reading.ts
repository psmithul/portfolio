import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import type { PluggableList } from 'unified';
import type { Root, RootContent, PhrasingContent } from 'mdast';
import type {
  Root as HtmlRoot,
  Element,
  RootContent as HtmlContent,
} from 'hast';

function textOf(node: { value?: string; children?: unknown[] }): string {
  if (typeof node.value === 'string') return node.value;
  return (node.children ?? [])
    .map((child) => textOf(child as Parameters<typeof textOf>[0]))
    .join('');
}

function headingId(text: string): string {
  return text
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-');
}

function identifyHeadings(tree: Root) {
  const seen = new Set<string>();
  return tree.children.flatMap((node) => {
    if (node.type !== 'heading') return [];
    const title = textOf(node);
    const base = headingId(title) || 'section';
    let id = base;
    for (let suffix = 2; seen.has(id); suffix++) id = base + '-' + suffix;
    seen.add(id);
    node.data = { ...node.data, hProperties: { id } };
    return node.depth <= 2 ? [{ id, title }] : [];
  });
}

export function readingHeadings(body: string) {
  return identifyHeadings(unified().use(remarkParse).parse(body));
}

// Keep author-written captions with their images instead of rendering them
// as separate italic paragraphs. Raw HTML is still excluded by the renderer.
export function remarkReading() {
  return (tree: Root) => {
    identifyHeadings(tree);
    const children: RootContent[] = [];
    for (let index = 0; index < tree.children.length; index += 1) {
      const node = tree.children[index];
      const next = tree.children[index + 1];
      if (
        node.type === 'paragraph' &&
        node.children.length === 1 &&
        node.children[0].type === 'image'
      ) {
        const caption =
          next?.type === 'paragraph' &&
          next.children.length === 1 &&
          next.children[0].type === 'emphasis'
            ? next
            : undefined;
        children.push({
          type: 'blockquote',
          data: {
            hName: 'figure',
            hProperties: { className: ['reading-figure'] },
          },
          children: [
            { ...node, data: { hName: 'div' } },
            ...(caption
              ? [
                  {
                    ...caption,
                    data: { hName: 'figcaption' },
                    children:
                      caption.children[0].type === 'emphasis'
                        ? (caption.children[0].children as PhrasingContent[])
                        : caption.children,
                  },
                ]
              : []),
          ],
        });
        if (caption) index += 1;
      } else children.push(node);
    }
    tree.children = children;
  };
}

export function rehypeReadingEquations() {
  return (tree: HtmlRoot) => {
    function wrap(children: HtmlContent[]) {
      for (let index = 0; index < children.length; index += 1) {
        const node = children[index];
        if (node.type !== 'element') continue;
        const classes = node.properties.className;
        if (Array.isArray(classes) && classes.includes('katex-display')) {
          children[index] = {
            type: 'element',
            tagName: 'div',
            properties: {
              className: ['reading-equation'],
              tabIndex: 0,
              role: 'group',
              ariaLabel: 'Equation; scroll horizontally if needed',
            },
            children: [node],
          } as Element;
        } else wrap(node.children);
      }
    }
    wrap(tree.children);
  };
}

export const readingRemarkPlugins: PluggableList = [
  remarkGfm,
  [remarkMath, { singleDollarTextMath: false }],
  remarkReading,
];

export const readingRehypePlugins: PluggableList = [
  [
    rehypeKatex,
    {
      trust: false,
      strict: 'error',
      maxExpand: 1000,
      maxSize: 20,
      errorColor: '#C45A3D',
    },
  ],
  rehypeReadingEquations,
];
