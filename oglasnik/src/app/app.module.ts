import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ParentCategoryComponent } from './components/parent-category/parent-category.component';
import { CategoryComponent } from './components/category/category.component';
import { PostsComponent } from './components/posts/posts.component';
import { SinglePostComponent } from './components/single-post/single-post.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NewPostComponent } from './components/new-post/new-post.component';
import { AdminViewComponent } from './components/admin-view/admin-view.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { TruncatePipe } from './pipes/truncate.pipe';
import { CurrencyFormatPipe } from './pipes/currency-format.pipe';
import { DateTimeFormatPipe } from './pipes/date-time-format.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ProfileComponent,
    RegisterComponent,
    ParentCategoryComponent,
    CategoryComponent,
    PostsComponent,
    SinglePostComponent,
    NavbarComponent,
    NewPostComponent,
    AdminViewComponent,
    ErrorPageComponent,
    TruncatePipe,
    CurrencyFormatPipe,
    DateTimeFormatPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    GoogleMapsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
