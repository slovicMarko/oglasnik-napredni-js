import { Component } from '@angular/core';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrl: './admin-view.component.css',
})
export class AdminViewComponent {
  statistics: any[] = [];
  users: any[] = [];
  posts: any[] = [];

  constructor(
    private postService: PostService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isAdmin()) {
      this.loadStatisticsTable();
      this.loadPosts();
      this.loadUsers();
    } else {
      this.router.navigate(['/error']);
    }
  }

  loadStatisticsTable(): void {
    this.postService.getPostsStatisticts().subscribe({
      next: (statistic) => {
        this.statistics = statistic;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      },
    });
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        console.log(users);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      },
    });
  }

  loadPosts(): void {
    this.postService.getPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      },
    });
  }

  confirmDelete(entity: any, index: number, type: 'user' | 'post'): void {
    const confirmationMessage =
      type === 'user'
        ? 'Jeste li sigurni da želite obrisati ovog korisnika?'
        : 'Jeste li sigurni da želite obrisati ovaj oglas?';

    const confirmDelete = confirm(confirmationMessage);
    if (confirmDelete) {
      this.deleteEntity(entity, index, type);
    }
  }

  deleteEntity(entity: any, index: number, type: 'user' | 'post'): void {
    if (type === 'post') {
      this.deletePost(entity, index);
    } else if (type === 'user') {
      this.deleteUser(entity, index);
    }
  }

  deleteUser(user: any, index: number): void {
    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.users.splice(index, 1);
        this.statistics.splice(index, 1);
      },
      error: (error) => console.error('Error deleting user:', error),
    });
  }

  deletePost(post: any, index: number): void {
    this.postService.deletePost(post.id).subscribe({
      next: () => {
        this.posts.splice(index, 1);
      },
      error: (error) => console.error('Error deleting post:', error),
    });
  }
}
