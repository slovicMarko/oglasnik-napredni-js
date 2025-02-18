import { Component, OnInit } from "@angular/core";
import { PostService } from "../../services/post.service";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.css",
})
export class ProfileComponent implements OnInit {
  id: number = -1;
  user: any = {};
  posts: any[] = [];

  constructor(
    private postService: PostService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      if (user) {
        this.setUserDetails(user);
        this.loadUserPosts();
      } else {
        console.warn("No user data found");
      }
    } else {
      this.router.navigate(["/error"]);
    }
  }

  setUserDetails(res: any): void {
    this.user = res.user;
  }

  loadUserPosts(): void {
    this.postService.filterPosts(this.user.id).subscribe({
      next: (posts) => {
        this.posts = posts;
      },
      error: (error) => {
        console.error("Error loading user posts:", error);
      },
    });
  }

  get userPostCount(): number {
    return this.posts.length;
  }

  confirmDelete(post: any, index: number): void {
    const confirmDelete = confirm(
      "Jeste li sigurni da želite obrisati ovaj oglas?"
    );
    if (confirmDelete) {
      this.deletePost(post, index);
    }
  }

  deletePost(post: any, index: number): void {
    this.postService.deletePost(post.id).subscribe({
      next: () => {
        this.posts.splice(index, 1);
      },
      error: (error) => console.error("Error deleting post:", error),
    });
  }
}
