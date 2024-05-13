import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

/**
 * Service to manage country data fetching.
 * Implements caching to optimize data retrieval performance.
 */
@Injectable({
  providedIn: 'root'
})
export class CountryService {
  // Cache to store country data and reduce API calls.
  private cache = new Map<string, any>();

  /**
   * Constructor to inject HttpClient for making HTTP requests.
   * @param {HttpClient} http - The HTTP client to send requests.
   */
  constructor(private http: HttpClient) { }

  /**
   * Retrieves country details by name. Utilizes caching to avoid repeated API calls for the same data.
   * @param {string} name - The name of the country to retrieve details for.
   * @returns {Observable<any>} An Observable containing the country details.
   */
  getCountryDetails(name: string): Observable<any> {
     // Check if the cache has the data
     if (this.cache.has(name)) {
      return of(this.cache.get(name));
    }

     // If not in cache, fetch from the API and cache the result
    return this.http.get(`https://restcountries.com/v3.1/name/${name}`).pipe(
    tap(data => this.cache.set(name, data)),
      catchError(this.handleError)
    );
  }

  /**
   * Handles HTTP errors by logging and returning a safe fallback.
   * @param {HttpErrorResponse} error - The HTTP error response object.
   * @returns {Observable<any>} An Observable containing an empty array.
   */
  private handleError(error: HttpErrorResponse) {
    console.error('Server error:', error);
    return of([]); // Return an empty array to ensure the application continues to run smoothly
  }
}
