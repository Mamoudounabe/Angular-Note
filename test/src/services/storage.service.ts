/* import { Injectable } from '@angular/core';
import { Tag } from '../app/tag'; 
import { Note } from '../app/note'; 


@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly NOTES_KEY = 'notes_app_notes';
  private readonly TAGS_KEY = 'notes_app_tags';

  constructor() {}


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
    

    const updatedTags = this.getTags().filter(tag => tag.id !== tagId);
    this.saveAll<Tag>(this.TAGS_KEY, updatedTags);
   
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



getNotes(): Note[] {
  const notes = this.getItems<Note>(this.NOTES_KEY);
  return notes.map(note => ({
    ...note,
    createdAt: new Date(note.createdAt),
    updatedAt: new Date(note.updatedAt),
    tags: note.tags || [] 
  }));
}


  getNoteById(noteId: number): Note | undefined {
    return this.getNotes().find(n => n.id === noteId);
  }

  
saveNote(note: Note): void {
  const noteToSave = {
    ...note,
    createdAt: note.createdAt.toISOString(),
    updatedAt: new Date().toISOString(),
    tags: note.tags || []
  };

  this.saveItem(this.NOTES_KEY, noteToSave); 





  deleteNote(noteId: number): void {
    const updatedNotes = this.getNotes().filter(n => n.id !== noteId);
    this.saveAll<Note>(this.NOTES_KEY, updatedNotes);
  }

 
getNotesByTag(tagId: number): Note[] {
  return this.getNotes().filter(n => 
    n.tags && n.tags.includes(tagId)
  );
}





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
} */












import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Tag } from '../app/tag'; 
import { Note } from '../app/note';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly NOTES_KEY = 'notes_app_notes';
  private readonly TAGS_KEY = 'notes_app_tags';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

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
    const updatedTags = this.getTags().filter(tag => tag.id !== tagId);
    this.saveAll<Tag>(this.TAGS_KEY, updatedTags);
    
    const notes = this.getNotes().map(note => ({
      ...note,
      tags: note.tags.filter(tId => tId !== tagId)
    }));
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

  getNotes(): Note[] {
    const notes = this.getItems<Note>(this.NOTES_KEY);
    return notes.map(note => ({
      ...note,
      createdAt: new Date(note.createdAt),
      updatedAt: new Date(note.updatedAt),
      tags: note.tags || []
    }));
  }

  getNoteById(noteId: number): Note | undefined {
    return this.getNotes().find(n => n.id === noteId);
  }

  saveNote(note: Note): void {
    const noteToSave = {
      ...note,
      createdAt: note.createdAt.toISOString(),
      updatedAt: new Date().toISOString(),
      tags: note.tags || []
    };
    this.saveItem(this.NOTES_KEY, noteToSave);
  }

  deleteNote(noteId: number): void {
    const updatedNotes = this.getNotes().filter(n => n.id !== noteId);
    this.saveAll<Note>(this.NOTES_KEY, updatedNotes);
  }

  getNotesByTag(tagId: number): Note[] {
    return this.getNotes().filter(n => n.tags && n.tags.includes(tagId));
  }

  /* --------------------------- Méthodes génériques ----------------------------- */

  private getItems<T>(key: string): T[] {
    if (!this.isBrowser()) return [];
    
    try {
      const items = localStorage.getItem(key);
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error(`Error reading ${key} from localStorage`, error);
      return [];
    }
  }

  private saveItem<T extends { id: number }>(key: string, item: T): void {
    if (!this.isBrowser()) return;

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
    if (!this.isBrowser()) return;
    localStorage.setItem(key, JSON.stringify(items));
  }

  private updateTagInNotes(tag: Tag): void {
    if (!this.isBrowser()) return;

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

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}