/* import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { Tag, createTag } from '../tag'

@Component({
  selector: 'app-tags',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.scss'
})
export class TagsComponent {


  loaded = false;
  tags: Tag[] = [];

  constructor(private storageService: StorageService) {}

  async loadTags() {
    if (!this.loaded) {
      try {
        this.tags = await this.storageService.getTags();
        this.loaded = true;
      } catch (error) {
        console.error('Erreur lors du chargement des tags', error);
      }
    }
  }

  async dialogAddTag() {
    const tagName = window.prompt('Entrez le nom du nouveau tag :');
    
    if (tagName && tagName.trim()) {
      const newTag = createTag({
        name: tagName.trim(),
        color: this.generateRandomColor()
      });

      try {
        await this.storageService.saveTag(newTag);
        this.tags = [...this.tags, newTag]; 
      } catch (error) {
        console.error('Erreur lors de la sauvegarde du tag', error);
      }
    }
  }

  private generateRandomColor(): string {
    return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
  }
}



 */



/*

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../services/storage.service';
import { Tag, createTag } from '../tag';
import { TagComponent } from '../tag/tag.component';

@Component({
  selector: 'app-tags',
  standalone: true,
  imports: [RouterLink, FormsModule, TagComponent],
  templateUrl: './tags.component.html',
  styleUrl: './tags.component.scss'
})
export class TagsComponent {
  loaded = false;
  tags: Tag[] = [];
  editing: Tag | null = null;

  constructor(private storageService: StorageService) {}

  async loadTags() {
    if (!this.loaded) {
      try {
        this.tags = await this.storageService.getTags();
        this.loaded = true;
      } catch (error) {
        console.error('Erreur lors du chargement des tags', error);
      }
    }
  }

  startAddTag() {
    this.editing = createTag({
      id: 0,
      name: '',
      color: this.generateRandomColor()
    });
  }

  startEditTag(tag: Tag) {
    this.editing = { ...tag };
  }

  async deleteTag(tag: Tag) {
    if (confirm(`Supprimer le tag "${tag.name}" ?`)) {
      try {
        await this.storageService.deleteTag(tag.id);
        this.tags = this.tags.filter(t => t.id !== tag.id);
      } catch (error) {
        console.error('Erreur lors de la suppression du tag', error);
      }
    }
  }

  async submitTag() {
    if (!this.editing) return;

    const tagToSave = this.editing;
    
    try {
      await this.storageService.saveTag(tagToSave);
      
      if (tagToSave.id === 0) {
        // Nouveau tag
        this.tags = [...this.tags, tagToSave];
      } else {
        // Mise à jour
        this.tags = this.tags.map(t => t.id === tagToSave.id ? tagToSave : t);
      }
      
      this.editing = null;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du tag', error);
    }
  }

  cancelEdit() {
    this.editing = null;
  }

  private generateRandomColor(): string {
    return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
  }
}*/



import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TagComponent } from '../tag/tag.component';
import { StorageService } from '../../services/storage.service';
import { Tag, createTag, isValidTag } from '../tag';

@Component({
  selector: 'app-tags',
  standalone: true,
  imports: [RouterLink, FormsModule, TagComponent],
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent {
  tags: Tag[] = [];
  newTag = createTag(); // Pour le formulaire d'ajout
  editingTags: { [key: number]: Tag } = {}; // Dictionnaire des tags en édition

  constructor(private storageService: StorageService) {}

  async ngOnInit() {
    await this.loadTags();
  }

  async loadTags() {
    this.tags = await this.storageService.getTags();
    this.resetEditingStates();
  }

  private resetEditingStates() {
    this.editingTags = {};
    this.newTag = createTag();
  }

  startEdit(tag: Tag) {
    // Copie le tag dans l'objet editingTags
    this.editingTags[tag.id] = { ...tag };
  }

  isEditing(tagId: number): boolean {
    return !!this.editingTags[tagId];
  }

  cancelEdit(tagId: number) {
    delete this.editingTags[tagId];
  }

  async saveTag(tag: Tag) {
    if (isValidTag(tag)) {
      await this.storageService.saveTag(tag);
      await this.loadTags(); // Recharge la liste mise à jour
    }
  }

  async addTag() {
    if (isValidTag(this.newTag)) {
      await this.storageService.saveTag(this.newTag);
      this.newTag = createTag(); // Réinitialise pour un nouveau tag
      await this.loadTags();
    }
  }

  async deleteTag(tagId: number) {
    if (confirm('Supprimer ce tag ?')) {
      await this.storageService.deleteTag(tagId);
      await this.loadTags();
    }
  }
}