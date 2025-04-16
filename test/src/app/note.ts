/*export interface Note {
} */
/*
import { Tag } from "./tag";

export class Note{
    id!: number;
    tags!:  Tag[];


    constructor(id:number,tags:Ta[]=[])
    {
        this.id=id;
        this.tags=tags;
    }

    getId(){
        return this.id;
    }

    getTags(): Tag[] {
        return this.tags;
    }
}*/





// src/app/note.ts
import { Tag } from './tag';

// src/app/note.ts
export interface Note {
    id: number;
    title: string;
    content: string;
    tags: number[];
    createdAt: Date;
    updatedAt: Date;
  }

  // src/app/note.ts
export class NoteClass implements Note {
    constructor(
      public id: number,
      public title: string,
      public content: string,
      public tags: number[] = [], // Valeur par défaut
      public createdAt: Date = new Date(),
      public updatedAt: Date = new Date()
    ) {}
  
    static createNew(): NoteClass {
      return new NoteClass(
        Date.now(), // ID temporaire
        '',
        '',
        [],
        new Date(),
        new Date()
      );
    }
  
    hasTag(tagId: number): boolean {
      return this.tags.includes(tagId);
    }
  
    toggleTag(tag: Tag): void {
      const index = this.tags.indexOf(tag.id);
      if (index === -1) {
        this.tags.push(tag.id);
      } else {
        this.tags.splice(index, 1);
      }
      this.updatedAt = new Date(); // Mise à jour de la date de modification
    }
  }