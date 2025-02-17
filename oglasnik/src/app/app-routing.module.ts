import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ParentCategoryComponent } from './components/parent-category/parent-category.component';
import { CategoryComponent } from './components/category/category.component';
import { PostsComponent } from './components/posts/posts.component';
import { SinglePostComponent } from './components/single-post/single-post.component';
import { NewPostComponent } from './components/new-post/new-post.component';
import { AdminViewComponent } from './components/admin-view/admin-view.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';

const routes: Routes = [
  { path: '', component: ParentCategoryComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'category/:id', component: CategoryComponent },
  { path: 'posts/:id', component: PostsComponent },
  { path: 'post/:id', component: SinglePostComponent },
  { path: 'new-post', component: NewPostComponent },
  { path: 'new-post/:id', component: NewPostComponent },
  { path: 'admin/statistic', component: AdminViewComponent },
  { path: 'error', component: ErrorPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
