import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Libro } from '../interfaces/libro.interface';

@Injectable({
  providedIn: 'root'
})
export class LibrosService {

  url: string = 'http://localhost:3000/libro';

  constructor(
    private http: HttpClient
  ) { }

  get(): Observable<Libro[]> {
    return this.http.get<Libro[]>(this.url, { headers: this.obtenerCabeceras()});
  }

  post(libro: Libro): Observable<any> {
    return this.http.post(this.url, libro, { responseType: 'text', headers: this.obtenerCabeceras('application/json') });
  }

  put(libro: Libro, idactual: number): Observable<any> {
    return this.http.put(`${this.url}/${idactual}`, libro, { responseType: 'text', headers: this.obtenerCabeceras('application/json') });
  }

  delete(libro: Libro): Observable<any> {
    return this.http.delete(`${this.url}/${libro.id}`, { responseType: 'text', headers: this.obtenerCabeceras('application/json') });
  }

  private obtenerCabeceras(contentType?: string): HttpHeaders{
    let cabeceras: HttpHeaders = new HttpHeaders();
    if(contentType) cabeceras = cabeceras.append('Content-Type', contentType);
    const token: string | null = localStorage.getItem('token');
    if(token) cabeceras = cabeceras.append('Authorization', 'Bearer '+token);
    return cabeceras;
  }
}
