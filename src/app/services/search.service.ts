import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  searchTextSubject = new BehaviorSubject<string>('');
  resetTextSubject = new BehaviorSubject<boolean>(false);
  searchText$ = this.searchTextSubject.asObservable().pipe(debounceTime(1000));

  setSearchText(text: string) {
    this.searchTextSubject.next(text);
  }
}
