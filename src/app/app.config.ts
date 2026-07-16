import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { jwtInterceptor, errorInterceptor } from './core/interceptors/http.interceptors';

import { environment } from '../environments/environment';
import { mockInterceptor } from './core/interceptors/mock.interceptor';

const interceptors = [jwtInterceptor, errorInterceptor];
if (environment.useMockBackend) {
  interceptors.push(mockInterceptor); // Mock interceptor should run last (innermost) to act as backend
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withInterceptors(interceptors)
    )
  ]
};
