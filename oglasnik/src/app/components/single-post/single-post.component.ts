import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.css'],
})
export class SinglePostComponent {
  post: any = {};
  postId: number = -1;
  map: any;
  lat: number = 45.1;
  lng: number = 15.2;
  query: string = '';

  constructor(
    private postService: PostService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.postId = +params['id'];
      this.loadPosts();
    });
  }

  loadPosts(): void {
    this.postService.getPostbyId(this.postId).subscribe({
      next: (post) => {
        this.post = post;
        this.query = `${this.post.grad}, ${this.post.zupanija}`;
        this.loadMap();
      },
      error: (error) => {
        console.error('Error loading post:', error);
      },
    });
  }

  loadMap(): void {
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address: this.query }, (results, status) => {
      if (status === 'OK' && results && results.length > 0) {
        const location = results[0].geometry.location;
        this.lat = location.lat();
        this.lng = location.lng();

        const mapOptions = {
          center: new google.maps.LatLng(this.lat, this.lng),
          zoom: 12,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
        };

        this.map = new google.maps.Map(
          document.getElementById('map') as HTMLElement,
          mapOptions
        );

        new google.maps.Marker({
          position: location,
          map: this.map,
          title: results[0].formatted_address,
        });
      } else {
        alert('Location not found: ' + status);
      }
    });
  }
}
