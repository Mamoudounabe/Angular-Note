/* import { Component } from '@angular/core';

import { Tag } from '../tag';

@Component({
  selector: 'app-tag',
  standalone: true,
  imports: [],
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.scss'
})
export class TagComponent {

  @Input({ required: true }) tag!: Tag;

} */



import { Component, Input } from '@angular/core'; 
import { Tag } from '../tag'; 

@Component({
  selector: 'app-tag',
  standalone: true,
  template: `
    <span class="tag" [style.color]="tag.color">
      {{ tag.name }}
    </span>
  `,
  styleUrls: ['./tag.component.scss']
})
export class TagComponent {
  @Input() tag!: Tag; 
}