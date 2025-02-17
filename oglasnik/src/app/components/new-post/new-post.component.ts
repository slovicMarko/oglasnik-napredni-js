import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CategoryService } from "../../services/category.service";
import { StateService } from "../../services/state.service";
import { PostService } from "../../services/post.service";
import { AuthService } from "../../services/auth.service";
import { switchMap } from "rxjs";

@Component({
  selector: "app-new-post",
  templateUrl: "./new-post.component.html",
  styleUrls: ["./new-post.component.css"],
})
export class NewPostComponent {
  parentCategories: { id: number; naziv: string }[] = [];
  categories: { id: number; naziv: string }[] = [];
  regions: { id: number; naziv: string }[] = [];
  states: { id: number; naziv: string }[] = [];
  description: string = "";
  price: number = 0;
  title: string = "";
  postId: number = -1;
  userId: number = -1;
  isAuthor: boolean = false;
  post: any = {};
  isNewPost: boolean = true;

  selectedParentCategories: number = -1;
  selectedCategory: number = -1;
  selectedRegion: number = -1;
  selectedState: number = -1;
  photos: File[] = [];

  constructor(
    private authService: AuthService,
    private categoryService: CategoryService,
    private stateService: StateService,
    private postService: PostService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<void> {
    const user = await this.authService.getUser();
    if (user) {
      this.description = this.description || "";
      this.loadParentCategories();
      this.loadRegions();

      this.route.params.subscribe((params) => {
        this.postId = +params["id"];
      });

      if (this.postId) {
        this.userId = user.user.id;
        this.isNewPost = false;
        this.postService.getPostbyId(this.postId).subscribe({
          next: (post) => {
            this.post = post[0];
            this.checkOwnership();
          },
          error: (error) => {
            console.error("Error loading post:", error);
          },
        });
      }
    } else {
      this.router.navigate(["/error"]);
    }
  }

  checkOwnership(): void {
    if (this.userId === this.post.korisnik_id) {
      this.isAuthor = true;
      this.selectedParentCategories = this.post.nadkategorija_id;
      this.onParentCategoryChange();
      this.selectedCategory = this.post.kategorija_id;
      this.selectedRegion = this.post.zupanija_id;
      this.onRegionChange();
      this.selectedState = this.post.grad_id;
      this.description = this.post.opis;
      this.price = this.post.cijena;
      this.title = this.post.naslov;
    } else {
      this.router.navigate(["/error"]);
    }
  }

  loadParentCategories(): void {
    this.categoryService.getParentCategories().subscribe({
      next: (parentCategories) => {
        this.parentCategories = parentCategories;
      },
      error: (error) => {
        console.error("Error loading posts:", error);
      },
    });
  }

  onParentCategoryChange(): void {
    this.categoryService
      .getCategories(this.selectedParentCategories)
      .subscribe({
        next: (categories) => {
          this.categories = categories;
        },
        error: (error) => {
          console.error("Error loading categories:", error);
        },
      });
  }

  loadRegions(): void {
    this.stateService.getRegions().subscribe({
      next: (regions) => {
        this.regions = regions;
      },
      error: (error) => {
        console.error("Error loading posts:", error);
      },
    });
  }

  onRegionChange(): void {
    this.stateService.getCities(this.selectedRegion).subscribe({
      next: (states) => {
        this.states = states;
      },
      error: (error) => {
        console.error("Error loading categories:", error);
      },
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    if (input.files.length > 1) {
      alert("Možete uploadati maksimalno 1 sliku.");
      return;
    }

    this.photos = Array.from(input.files);
  }

  onSubmit(form: NgForm): void {
    if (!form.valid) {
      alert("Molimo popunite sva polja!");
      return;
    }

    if (this.photos.length > 5) {
      alert("Možete uploadati maksimalno 1 sliku.");
      return;
    }

    if (this.isAuthor) {
      this.updatedPost(form);
    } else {
      this.addNewPost(form);
    }
  }

  addNewPost(form: NgForm): void {
    const korisnik_id = JSON.parse(localStorage.getItem("user") || "null").user
      .id;
    const newPost = { ...form.value, korisnik_id };

    console.log("✅ Novi oglas:", newPost);
    console.log("📸 Slike:", this.photos);

    form.resetForm();
    this.photos = [];

    this.postService.addPost(newPost).subscribe({
      next: () => {
        this.router.navigate(["/profile"]);
      },
      error: (error) => {
        console.error("Error while adding post:", error);
      },
    });
  }

  updatedPost(form: NgForm): void {
    const formData = new FormData();

    formData.append("id", this.postId.toString());
    formData.append("korisnik_id", this.userId.toString());

    if (this.photos.length > 0) {
      this.photos.forEach((photo) => {
        formData.append("images", photo);
      });
    }

    let updatedPost = {
      ...form.value,
      id: this.postId,
      korisnik_id: this.userId,
    };

    form.resetForm();
    this.photos = [];

    this.postService
      .uploadMultipleImages(formData)
      .pipe(
        switchMap((res) => {
          if (res) {
            updatedPost = {
              ...updatedPost,
              slike: res,
            };
          }
          console.log(updatedPost);
          return this.postService.updatePost(updatedPost);
        })
      )
      .subscribe({
        next: () => {
          this.router.navigate(["/profile"]);
        },
        error: (error) => {
          console.error("Error while processing post:", error);
        },
      });
  }
}
