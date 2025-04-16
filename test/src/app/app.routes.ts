import { Routes } from '@angular/router';
import { TagsComponent } from './tags/tags.component';
import {NoteComponent} from './note/note.component'
import {AccueilComponent} from './accueil/accueil.component'

export const routes: Routes = [
    { path: 'tags', component: TagsComponent },
    { path: 'notes', component: NoteComponent},
    { path: '', component: AccueilComponent },

];
