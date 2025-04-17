
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { Note, NoteClass } from '../note';
import { Tag } from '../tag';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';



@Component({
  selector: 'app-note',
  standalone: true,
  imports: [
      CommonModule,
      FormsModule,
      MatIconModule,
      MatButtonModule,
      MatFormFieldModule,
      MatInputModule,
      MatListModule,
      MatChipsModule,
      MatTooltipModule,
    RouterLink,
    MatCheckboxModule
  ],
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit {
  notes: Note[] = [];
  filteredNotes: Note[] = [];
  selectedNote: NoteClass | null = null;
  searchQuery: string = '';

  constructor(
    private noteService: StorageService,
    public tagService: StorageService
  ) {}

  ngOnInit(): void {
    this.loadNotes();
  }



  get noResultsFound(): boolean {
    return !!this.searchQuery && this.filteredNotes.length === 0;
  }


  loadNotes(): void {
    this.notes = this.noteService.getNotes();
    this.filteredNotes = [...this.notes];
  }

  filterNotes(): void {
    if (!this.searchQuery) {
      this.filteredNotes = [...this.notes];
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredNotes = this.notes.filter(note => 
        note.title.toLowerCase().includes(query)
      );
    }
  }


  selectNote(note: Note): void {
    this.selectedNote = new NoteClass(
      note.id,
      note.title,
      note.content,
      [...note.tags],
      new Date(note.createdAt),
      new Date(note.updatedAt)
    );
  }

  createNewNote(): void {
    this.selectedNote = NoteClass.createNew();
  }

  saveNote(): void {
    if (this.selectedNote) {
      this.noteService.saveNote(this.selectedNote);
      this.loadNotes();
      this.selectedNote = null;
    }
  }

  deleteNote(noteId: number): void {
    if (confirm('Supprimer cette note ?')) {
      this.noteService.deleteNote(noteId);
      this.loadNotes();
      if (this.selectedNote?.id === noteId) {
        this.selectedNote = null;
      }
    }
  }
}