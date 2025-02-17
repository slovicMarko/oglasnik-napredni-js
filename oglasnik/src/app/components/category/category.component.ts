import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { ActivatedRoute } from '@angular/router'; // Dodano za pristup parametrima URL-a
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {
  categories: any[] = [];
  allPostsInParentCategory: any[] = [];
  filteredPosts: any[] = [];
  posts: any[] = [];
  searchQuery: string = '';
  parentCategoryId: number = -1;

  constructor(
    private categoryService: CategoryService,
    private postService: PostService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.parentCategoryId = +params['id'];
      this.loadCategories();
      this.loadPosts();
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories(this.parentCategoryId).subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      },
    });
  }

  loadPosts(): void {
    this.postService
      .getPostsByParentCategoryId(this.parentCategoryId)
      .subscribe({
        next: (posts) => {
          this.posts = posts.slice(0, 6);
          this.filteredPosts = posts.slice(0, 6);
          this.allPostsInParentCategory = posts;
        },
        error: (error) => {
          console.error('Error loading categories:', error);
        },
      });
  }

  onSearch(): void {
    if (this.searchQuery.trim() === '') {
      this.filteredPosts = this.posts;
    } else {
      this.filteredPosts = this.allPostsInParentCategory.filter(
        (post) =>
          post.naslov.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          post.opis.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    this.cdr.detectChanges();
  }
}
