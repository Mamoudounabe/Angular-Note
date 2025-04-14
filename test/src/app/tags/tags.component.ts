import { Component } from '@angular/core';
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



