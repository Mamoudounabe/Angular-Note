
import { Tag } from './tag';

export interface Note {
    id: number;
    title: string;
    content: string;
    tags: number[];
    createdAt: Date;
    updatedAt: Date;
  }

  
export class NoteClass implements Note {
    constructor(
      public id: number,
      public title: string,
      public content: string,
      public tags: number[] = [], 
      public createdAt: Date = new Date(),
      public updatedAt: Date = new Date()
    ) {}
  
    static createNew(): NoteClass {
      return new NoteClass(
        Date.now(), 
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
      this.updatedAt = new Date(); 
    }
  }