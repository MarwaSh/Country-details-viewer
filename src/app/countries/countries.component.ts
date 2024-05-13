import { Component, HostListener  } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';
import { CountryService } from '../country.service';

/**
 * Component responsible for rendering and managing country data.
 * It provides a search interface and displays search results in a table format.
 */
@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent {
    // FormControl for managing the search input field
  searchControl = new FormControl();
  // Observable to hold the array of countries fetched from the server
  countries$: Observable<any>;

  // Columns to display in the mat-table
  displayedColumns: string[] = ['flag', 'name', 'capital', 'currency', 'language', 'population'];

   /**
   * Constructs the CountriesComponent with injected CountryService to fetch country data.
   * @param {CountryService} countryService - The service to fetch country data.
   */
  constructor(private countryService: CountryService) {
     // Setup an observable to handle search input changes and fetch data accordingly.
    this.countries$ = this.searchControl.valueChanges.pipe(
      debounceTime(300), // Debounce the input to reduce API calls.
      switchMap(name => {
        // Ignore empty search queries
        if (!name.trim()) { 
          return of([]); // Return an empty array immediately, no API call
        }
        return this.countryService.getCountryDetails(name);
      }),
      catchError(err => {
        console.error('Error occurred:', err); // Log any errors
        return of([]);
      })
    );
  }

   /**
   * Returns a formatted string of currency information.
   * @param {any} currencies - The currency data object from the API.
   * @returns {string} A formatted string of currency names and symbols.
   */
  getCurrencyDisplay(currencies: any): string {
    return Object.values(currencies).map((cur: any) => `${cur.name} (${cur.symbol})`).join(', ');
  }

    /**
   * Returns a formatted string of language information.
   * @param {any} languages - The languages data object from the API.
   * @returns {string} A formatted string of languages.
   */

  getLanguagesDisplay(languages: any): string {
    return Object.values(languages).join(', ');
  }
}
