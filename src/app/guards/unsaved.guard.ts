import { CanDeactivateFn } from '@angular/router';
import { DashboardComponent } from '../pages/dashboard/dashboard';

// canDeactivate guard — warns before leaving dashboard (Check-in 4)
export const unsavedGuard: CanDeactivateFn<DashboardComponent> = (component) => {
  if (component.hasUnsavedChanges()) {
    return confirm(
      'You have an active search. Leave the page?'
    );
  }
  return true;
};