import { Injectable } from '@angular/core';
import { Tag } from '../app/tag'; 


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
}