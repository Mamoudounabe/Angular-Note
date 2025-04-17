
export interface Tag {
  id: number;
  name: string;
  color: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const DEFAULT_TAG: Omit<Tag, 'id'> = {
  name: 'Nouveau tag',
  color: '#3f51b5',
  createdAt: new Date(),
  updatedAt: new Date()
};

export function createTag(partialTag: Partial<Tag> = {}): Tag {
  const now = new Date();
  return {
    id: partialTag.id || generateTagId(),
    name: partialTag.name?.trim() || DEFAULT_TAG.name,
    color: partialTag.color || DEFAULT_TAG.color,
    createdAt: partialTag.createdAt || now,
    updatedAt: partialTag.updatedAt || now
  };
}

export function isValidTag(tag: unknown): tag is Tag {
  return (
    typeof tag === 'object' && tag !== null &&
    'id' in tag && typeof tag.id === 'number' &&
    'name' in tag && typeof tag.name === 'string' && 
    tag.name.trim().length > 0 &&
    'color' in tag && typeof tag.color === 'string' &&
    /^#[0-9A-F]{6}$/i.test(tag.color)
  );
}

function generateTagId(): number {
  return Math.floor(Date.now() / 1000);
}

