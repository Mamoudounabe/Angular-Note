/*import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Tag, createTag, isValidTag } from '../tag';
import { Note } from '../note';

@Component({
  selector: 'app-note',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './note.component.html',
  styleUrl: './note.component.scss'
})
export class NoteComponent {


}
*/


/*
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TagComponent } from '../tag/tag.component';
import { Note } from '../note';

import { StorageService } from '../../services/storage.service';
import { Tag, createTag, isValidTag } from '../tag';*/




// src/app/note/note.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Ajouté pour ngModel
import { RouterLink } from '@angular/router';
import { TagComponent } from '../tag/tag.component';
import { StorageService } from '../../services/storage.service';
import { Note, NoteClass } from '../note';
import { Tag, createTag, isValidTag } from '../tag';

@Component({
  selector: 'app-note',
  standalone: true,
  imports: [RouterLink, CommonModule, TagComponent, FormsModule], // Ajouté FormsModule
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit {
  notes: Note[] = [];
  selectedNote: NoteClass | null = null;

  constructor(
    private noteService: StorageService,
    public tagService: StorageService // Changé à public pour l'utiliser dans le template
  ) {}

  ngOnInit(): void {
    this.loadNotes();
  }

  loadNotes(): void {
    this.notes = this.noteService.getNotes();
  }

  /*selectNote(note: Note): void {
    this.selectedNote = new NoteClass(
      note.id,
      note.title,
      note.content,
      note.tags,
      note.createdAt,
      note.updatedAt
    );
  }*/

// src/app/note/note.component.ts
selectNote(note: Note): void {
  this.selectedNote = new NoteClass(
    note.id,
    note.title,
    note.content,
    [...note.tags], // Copie du tableau
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