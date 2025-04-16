import { Injectable } from '@angular/core';
import { Tag } from '../app/tag'; 
import { Note } from '../app/note'; 

/*
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly TAGS_STORAGE_KEY = 'notes_app_tags';

  constructor() { }

  // Récupère tous les tags
  getTags(): Tag[] {
    try {
      const tagsJson = localStorage.getItem(this.TAGS_STORAGE_KEY);
      return tagsJson ? JSON.parse(tagsJson) : [];
    } catch (error) {
      console.error('Error reading tags from localStorage', error);
      return [];
    }
  }

  // Sauvegarde tous les tags
  private saveAllTags(tags: Tag[]): void {
    localStorage.setItem(this.TAGS_STORAGE_KEY, JSON.stringify(tags));
  }

  // Ajoute ou met à jour un tag
  saveTag(tag: Tag): void {
    const tags = this.getTags();
    const existingIndex = tags.findIndex(t => t.id === tag.id);
    
    if (existingIndex >= 0) {
      tags[existingIndex] = tag;
    } else {
      tags.push(tag);
    }
    
    this.saveAllTags(tags);
  }

  // Supprime un tag par son ID
  deleteTag(tagId: number): void {
    const updatedTags = this.getTags().filter(tag => tag.id !== tagId);
    this.saveAllTags(updatedTags);
  }

  // Génère un nouvel ID unique
  generateTagId(): number {
    const tags = this.getTags();
    const maxId = tags.reduce((max, tag) => Math.max(max, tag.id), 0);
    return maxId + 1;
  }

  // Vérifie si un tag existe déjà par son nom (insensible à la casse)
  tagExists(name: string): boolean {
    const normalizedSearch = name.toLowerCase().trim();
    return this.getTags().some(tag => 
      tag.name.toLowerCase().trim() === normalizedSearch
    );
  }

 /*  async deleteTag(tagId: number): Promise<void> {
    const updatedTags = this.getTags().filter(tag => tag.id !== tagId);
    this.saveAllTags(updatedTags);
  } 

}*/





@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly NOTES_KEY = 'notes_app_notes';
  private readonly TAGS_KEY = 'notes_app_tags';

  constructor() {}

  /* --------------------------- Méthodes pour les Tags --------------------------- */

  getTags(): Tag[] {
    return this.getItems<Tag>(this.TAGS_KEY);
  }

  getTagById(tagId: number): Tag | undefined {
    return this.getTags().find(t => t.id === tagId);
  }

  saveTag(tag: Tag): void {
    this.saveItem<Tag>(this.TAGS_KEY, tag);
    this.updateTagInNotes(tag);
  }

  deleteTag(tagId: number): void {
    // Supprime le tag
    const updatedTags = this.getTags().filter(tag => tag.id !== tagId);
    this.saveAll<Tag>(this.TAGS_KEY, updatedTags);
    
    // Supprime les références dans les notes
    const notes = this.getNotes().map(note => {
      note.tags = note.tags.filter(tId => tId !== tagId);
      return note;
    });
    this.saveAll<Note>(this.NOTES_KEY, notes);
  }

  generateTagId(): number {
    const tags = this.getTags();
    return tags.length > 0 ? Math.max(...tags.map(t => t.id)) + 1 : 1;
  }

  tagExists(name: string, excludeId?: number): boolean {
    const normalized = name.toLowerCase().trim();
    return this.getTags().some(t => 
      t.name.toLowerCase().trim() === normalized && 
      (!excludeId || t.id !== excludeId)
    );
  }

  /* --------------------------- Méthodes pour les Notes -------------------------- */
/*
  getNotes(): Note[] {
    return this.getItems<Note>(this.NOTES_KEY).map(note => {
      // Reconstruit les objets Tag complets
      note.tags = note.tags.map(tagId => this.getTagById(tagId)).filter(Boolean) as Tag[];
      return note;
    });
  }
*/

// Modifiez la méthode getNotes()
getNotes(): Note[] {
  const notes = this.getItems<Note>(this.NOTES_KEY);
  return notes.map(note => ({
    ...note,
    createdAt: new Date(note.createdAt),
    updatedAt: new Date(note.updatedAt),
    tags: note.tags || [] // Assure que tags existe
  }));
}


  getNoteById(noteId: number): Note | undefined {
    return this.getNotes().find(n => n.id === noteId);
  }

  /*saveNote(note: Note): void {
    // Sauvegarde d'abord les nouveaux tags
    note.tags.forEach(tag => {
      if (!this.getTagById(tag.id)) {
        this.saveItem<Tag>(this.TAGS_KEY, tag);
      }
    });
    
    // Convertit les tags en IDs pour le stockage
    const noteToSave = {
      ...note,
      tags: note.tags.map(t => t.id)
    };
    
    this.saveItem<Note>(this.NOTES_KEY, noteToSave);
  }*/

// Modifiez la méthode saveNote
// Modifiez la méthode saveNote()
/*saveNote(note: Note): void {
  // Convertit les dates en strings pour le stockage
  const noteToSave = {
    ...note,
    createdAt: note.createdAt.toISOString(),
    updatedAt: new Date().toISOString(), // Mise à jour de la date de modification
    tags: note.tags || [] // Assure que tags existe
  };
  
  this.saveItem<Note>(this.NOTES_KEY, noteToSave);
}*/




saveNote(note: Note): void {
  const noteToSave = {
    ...note,
    createdAt: note.createdAt.toISOString(),
    updatedAt: new Date().toISOString(),
    tags: note.tags || []
  };

  this.saveItem(this.NOTES_KEY, noteToSave); // 👈 Pas de <Note> ici
}





  deleteNote(noteId: number): void {
    const updatedNotes = this.getNotes().filter(n => n.id !== noteId);
    this.saveAll<Note>(this.NOTES_KEY, updatedNotes);
  }

 
getNotesByTag(tagId: number): Note[] {
  return this.getNotes().filter(n => 
    n.tags && n.tags.includes(tagId)
  );
}

  /* --------------------------- Méthodes génériques ----------------------------- */

  private getItems<T>(key: string): T[] {
    try {
      const items = localStorage.getItem(key);
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error(`Error reading ${key} from localStorage`, error);
      return [];
    }
  }

  private saveItem<T extends { id: number }>(key: string, item: T): void {
    const items = this.getItems<T>(key);
    const index = items.findIndex(i => i.id === item.id);
    
    if (index >= 0) {
      items[index] = item;
    } else {
      items.push(item);
    }
    
    localStorage.setItem(key, JSON.stringify(items));
  }

  private saveAll<T>(key: string, items: T[]): void {
    localStorage.setItem(key, JSON.stringify(items));
  }

  private updateTagInNotes(tag: Tag): void {
    const notes = this.getItems<Note>(this.NOTES_KEY);
    let needsUpdate = false;
    
    const updatedNotes = notes.map(note => {
      const updatedTags = note.tags.map(tId => 
        tId === tag.id ? tag.id : tId
      );
      
      if (JSON.stringify(note.tags) !== JSON.stringify(updatedTags)) {
        needsUpdate = true;
        return { ...note, tags: updatedTags };
      }
      return note;
    });
    
    if (needsUpdate) {
      this.saveAll<Note>(this.NOTES_KEY, updatedNotes);
    }
  }
}