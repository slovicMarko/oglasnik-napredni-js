import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-parent-category',
  templateUrl: './parent-category.component.html',
  styleUrl: './parent-category.component.css',
})
export class ParentCategoryComponent {
  parentCategories: any[] = [];
  posts: any[] = [];
  allPosts: any[] = [];
  filteredPosts: any[] = [];
  searchQuery: string = '';
  newUser: string | null = '';
  userId: number = 0;
  currentUserId: number = -1;

  constructor(
    private categoryService: CategoryService,
    private postService: PostService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadParentCategories();
    this.loadPosts();
    this.setUserDetails();
  }

  loadParentCategories(): void {
    this.categoryService.getParentCategories().subscribe({
      next: (parentCategories) => {
        this.parentCategories = parentCategories;
      },
      error: (error) => {
        console.error('Error loading parent categories:', error);
      },
    });
  }

  setUserDetails(): void {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user) {
      this.newUser = user.username;
      this.userId = user._id;
      this.currentUserId = user._id;
    }
  }

  loadPosts(): void {
    this.postService.getPosts().subscribe({
      next: (posts) => {
        this.posts = posts.slice(0, 6);
        this.filteredPosts = posts.slice(0, 6);
        this.allPosts = posts;
      },
      error: (error) => {
        console.error('Error loading posts:', error);
      },
    });
  }

  onSearch(): void {
    if (this.searchQuery.trim() === '') {
      this.filteredPosts = this.posts;
    } else {
      this.filteredPosts = this.allPosts.filter(
        (post) =>
          post.naslov.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          post.opis.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    this.cdr.detectChanges();
  }
}
