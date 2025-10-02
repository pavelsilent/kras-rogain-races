import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorDialogService } from '../components/core/error-dialog/error-dialog.service';
import { LoaderService } from '../components/core/loader/loader.service';

export const errorInterceptor = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const loader = inject(LoaderService);
  const errorDialog = inject(ErrorDialogService);

  return next(req).pipe(
    catchError(err => {
      loader.hide();

      const msg = err?.error?.message || err.statusText || 'Server error';
      errorDialog.show('Ошибка сервера', msg);

      return throwError(() => err);
    }),
  );
};

export const loaderInterceptor = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const loader = inject(LoaderService);
  loader.show();
  return next(req).pipe(finalize(() => loader.hide()));
};
