/**
 * Minimal builders for Lexical editor state.
 * Payload stores rich text as Lexical JSON; typing that by hand is unreadable,
 * so seeds and imports go through these instead.
 */

type LexNode = { type: string; version: number; [k: string]: unknown }

const textNode = (text: string) => ({
  type: 'text',
  detail: 0,
  format: 0,
  mode: 'normal',
  style: '',
  text,
  version: 1,
})

export const para = (text: string): LexNode => ({
  type: 'paragraph',
  children: [textNode(text)],
  direction: 'ltr',
  format: '',
  indent: 0,
  textFormat: 0,
  version: 1,
})

export const heading = (text: string, tag: 'h2' | 'h3' = 'h2'): LexNode => ({
  type: 'heading',
  tag,
  children: [textNode(text)],
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
})

export const list = (items: string[]): LexNode => ({
  type: 'list',
  listType: 'bullet',
  tag: 'ul',
  start: 1,
  children: items.map((item, i) => ({
    type: 'listitem',
    value: i + 1,
    children: [textNode(item)],
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  })),
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
})

/** Wrap nodes into the root document Payload expects. */
export const doc = (...children: LexNode[]) => ({
  root: {
    type: 'root',
    children,
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  },
})
