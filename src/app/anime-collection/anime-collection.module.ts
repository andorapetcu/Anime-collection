import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnimeCollectionRoutingModule } from './anime-collection-routing.module';
import { AnimeCollectionComponent } from './anime-collection.component';
@NgModule({
  declarations: [
    AnimeCollectionComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, 
    AnimeCollectionRoutingModule
  ]
})
export class AnimeCollectionModule { }
