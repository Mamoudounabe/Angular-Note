
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TagComponent } from '../tag/tag.component';
import { StorageService } from '../../services/storage.service';
import { Tag, createTag, isValidTag } from '../tag';
import { CommonModule } from '@angular/common'; 


@Component({
  selector: 'app-tags',
  standalone: true,
  imports: [RouterLink, FormsModule, TagComponent, CommonModule],
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent {
  tags: Tag[] = [];
  newTag = createTag(); 
  editingTags: { [key: number]: Tag } = {}; 

  filteredTags: Tag[] = [];
  searchQuery: string = '';
  isSearching:boolean  = false;
  //isSearching:boolean  = true;


    filterTags(): void {
      if (!this.searchQuery.trim()) {
        this.filteredTags = [...this.tags];
        this.isSearching = false;
        //this.isSearching = true;
      } else {
        const query = this.searchQuery.toLowerCase().trim();
        this.filteredTags = this.tags.filter(tag => 
          tag.name.toLowerCase().includes(query)
        );
        this.isSearching = true;
       // this.isSearching = false


      }
    }
  


    get noResultsFound(): boolean {
      return this.isSearching && this.filteredTags.length === 0;
    }





  constructor(private storageService: StorageService) {}

  async ngOnInit() {
    await this.loadTags();
  }

  async loadTags() {
    this.tags = await this.storageService.getTags();

    this.filteredTags = [...this.tags];
    this.resetEditingStates();
  }

  private resetEditingStates() {
    this.editingTags = {};
    this.newTag = createTag();
  }

  startEdit(tag: Tag) {
    
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
      await this.loadTags();
    }
  }

  async addTag() {
    if (isValidTag(this.newTag)) {
      await this.storageService.saveTag(this.newTag);
      this.newTag = createTag(); 
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