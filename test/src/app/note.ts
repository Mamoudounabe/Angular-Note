/*export interface Note {
} */

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
}
