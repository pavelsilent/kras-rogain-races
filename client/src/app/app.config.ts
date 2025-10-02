import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { environment } from '../environments/environment';
import { provideApi } from './api/index';

import { routes } from './app.routes';
import { errorInterceptor, loaderInterceptor } from './utils/interceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideMomentDateAdapter(),
    provideAnimations(),
    provideApi(environment.apiBaseUrl),
    provideHttpClient(withInterceptors([loaderInterceptor, errorInterceptor])),
  ],
};
