import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';

// Services
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url: string = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  public sign(payload: {email:string, password: string}): Observable<any>{
    return this.http.post<{ token: string }>(`${this.url}/sign`,payload).pipe(
      map((res) => {
        localStorage.removeItem('acess_token');
        localStorage.setItem('acess_token', JSON.stringify(res.token));
        return this.router.navigate(['admin']);
      }),
      catchError((e) => {
        if(e.error.message)return throwError(() => e.error.message);
    
        return throwError(
          () => 'Error validating data, try again later'
          );
      })
    );
  }
  public logout(){
    localStorage.removeItem('acess_token');
    return this.router.navigate(['']);
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('acess_token');

    if(!token) return false;

    const jwtHelper = new JwtHelperService();
    return !jwtHelper.isTokenExpired(token);
  }

}
