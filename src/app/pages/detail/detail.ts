import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ResourceService } from '../../services/resource';
import { Observable, switchMap, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail.html',
  styleUrl: './detail.css'
})
export class DetailComponent {
  private route = inject(ActivatedRoute);
  private resource = inject(ResourceService);

  book$: Observable<any> = this.route.paramMap.pipe(
    switchMap(params => {
      const id = params.get('id');
      return id ? this.resource.getBookDetail(id) : of(null);
    }),
    catchError(() => of(null))
  );
}