import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
 
@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [],
  templateUrl: './detail.html',
  styleUrl: './detail.css'
})
export class DetailComponent {
  id: string | null = null;
 
  constructor(private route: ActivatedRoute) {
    this.id = this.route.snapshot.paramMap.get('id');
  }
}
 