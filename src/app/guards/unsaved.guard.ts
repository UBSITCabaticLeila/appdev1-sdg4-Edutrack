import { CanDeactivateFn } from '@angular/router';
import { DetailComponent } from '../pages/detail/detail';

export const unsavedGuard: CanDeactivateFn<DetailComponent> = (component) => {
  return confirm('You may lose unsaved changes. Leave this page?');
};

