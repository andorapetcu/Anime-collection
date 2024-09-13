import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-anime-collection',
  templateUrl: './anime-collection.component.html',
  styleUrls: ['./anime-collection.component.css']
})
export class AnimeCollectionComponent implements OnInit {
  @Input() filterCriteria: string = '';
  @Output() animeSelected: EventEmitter<any> = new EventEmitter<any>();

  animeForm: FormGroup;
  animeList: any[] = [];
  filteredAnimeList: any[] = [];
  isEditing = false;
  editIndex: number | null = null;
  searchQuery: string = '';
  sortColumn: string = '';
  sortDirection: string = 'asc';
  currentUserName: string | null = null;
  showReviewModal = false;
  selectedAnimeIndex: number | null = null;
  currentReview: string = '';

  types = ['Josei', 'Kids', 'Seinen', 'Shoujo', 'Shounen'];
  genres = ['Action', 'Comedy', 'Horror', 'Romance', 'Adventure', 'Drama', 'Fantasy', 'Mistery', 'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural'];

  constructor(private fb: FormBuilder) {
    this.animeForm = this.fb.group({
      title: ['', Validators.required],
      type: ['', Validators.required],
      year: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      genre: ['', Validators.required],
      rating: ['', [Validators.required, Validators.min(0), Validators.max(10)]]
    });
  }

  ngOnInit(): void {
    this.currentUserName = localStorage.getItem('currentUserName');
    if (this.currentUserName) {
      const storedAnimeList = localStorage.getItem(`animeList_${this.currentUserName}`);
      if (storedAnimeList) {
        this.animeList = JSON.parse(storedAnimeList);
        this.filteredAnimeList = [...this.animeList];
      }
    }
  }

  addAnime() {
    if (this.animeForm.valid) {
      const animeData = { 
        ...this.animeForm.value, 
        review: this.isEditing && this.editIndex !== null ? this.animeList[this.editIndex].review : '' 
      }; 

      if (this.isEditing && this.editIndex !== null) {
        this.animeList[this.editIndex] = animeData;
        this.isEditing = false;
        this.editIndex = null;
      } else {
        this.animeList.push(animeData);
      }

      this.saveAnimeList();
      this.animeForm.reset();
      this.filteredAnimeList = [...this.animeList]; 
    }
  }

  saveAnimeList() {
    if (this.currentUserName) {
      localStorage.setItem(`animeList_${this.currentUserName}`, JSON.stringify(this.animeList));
    }
  }

  editAnime(index: number) {
    this.isEditing = true;
    this.editIndex = index;
    this.animeForm.setValue(this.animeList[index]);
  }

  deleteAnime(index: number) {
    this.animeList.splice(index, 1);
    this.saveAnimeList();
    this.filteredAnimeList = [...this.animeList];
  }

  cancelEdit() {
    this.isEditing = false;
    this.editIndex = null;
    this.animeForm.reset();
  }

  onSearchChange() {
    this.filteredAnimeList = this.animeList.filter(anime =>
      anime.title.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  sortColumnBy(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredAnimeList.sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];

      if (aValue < bValue) {
        return this.sortDirection === 'asc' ? -1 : 1;
      } else if (aValue > bValue) {
        return this.sortDirection === 'asc' ? 1 : -1;
      } else {
        return 0;
      }
    });
  }

  openReviewDialog(index: number) {
    this.selectedAnimeIndex = index; 
    const review = this.filteredAnimeList[index].review; 
    this.currentReview = review || ''; 
    this.showReviewModal = true;
  }

  closeReviewDialog() {
    this.showReviewModal = false;
    this.selectedAnimeIndex = null;
  }

  saveReview() {
    if (this.selectedAnimeIndex !== null) {
      const sortedIndex = this.selectedAnimeIndex; 
      const selectedAnime = this.filteredAnimeList[sortedIndex]; 

      const originalIndex = this.animeList.findIndex(anime => anime.title === selectedAnime.title);

      if (originalIndex !== -1) {
        this.animeList[originalIndex].review = this.currentReview;
        this.saveAnimeList(); 
      }

      this.closeReviewDialog();
      this.filteredAnimeList = [...this.animeList]; 
    }
  }

  getStars(rating: number): number[] {
    const stars = Array(5).fill(0); 
    const fullStars = Math.floor(rating / 2); 
    const halfStar = rating % 2 >= 1 ? 0.5 : 0; 

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars[i] = 1; 
      } else if (i === fullStars && halfStar === 0.5) {
        stars[i] = 0.5; 
      } else {
        stars[i] = 0; 
      }
    }

    return stars;
  }

  onAnimeSelected(anime: any) {
    this.animeSelected.emit(anime);
  }
}
