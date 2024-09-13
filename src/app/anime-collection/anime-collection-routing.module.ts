import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnimeCollectionComponent } from './anime-collection.component';

const routes: Routes = [
  { path: '', component: AnimeCollectionComponent } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnimeCollectionRoutingModule { }
