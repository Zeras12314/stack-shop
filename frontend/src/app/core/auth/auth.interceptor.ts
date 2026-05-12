import { HttpInterceptorFn } from '@angular/common/http';

// Sends session cookie automatically with every request
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req.clone({ withCredentials: true }));
};