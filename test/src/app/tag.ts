
  export type Tag ={
    id: number;
    name: string;
    color: string;
    
  }


  // Valeurs par défaut pour un nouveau tag
export const DEFAULT_TAG: Omit<Tag, 'id'> = {
    name: 'Nouveau tag',
    color: '#3f51b5' // Couleur Material indigo par défaut
  };
  
  // Fonction pour créer un nouveau tag avec un ID unique
  export function createTag(partialTag: Partial<Tag> = {}): Tag {
    return {
      id: Date.now(), // Génère un ID unique basé sur le timestamp
      ...DEFAULT_TAG,
      ...partialTag
    };
  }
  
  // Fonction de validation d'un tag
  export function isValidTag(tag: Partial<Tag>): tag is Tag {
    return (
      typeof tag.id === 'number' &&
      typeof tag.name === 'string' && tag.name.trim().length > 0 &&
      typeof tag.color === 'string' && /^#[0-9A-F]{6}$/i.test(tag.color)
    );
  }


