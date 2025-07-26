// src/app/translation/MultiTranslateHttpLoader.ts
import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface TranslateResource {
  prefix: string;
  suffix: string;
}

export class MultiTranslateHttpLoader implements TranslateLoader {
  constructor(
    private http: HttpClient,
    private resources: TranslateResource[]
  ) {}

  /**
   * Gets the translations from the server
   */
  getTranslation(lang: string): Observable<any> {
    return forkJoin(
      this.resources.map(config => {
        return this.http.get(`${config.prefix}${lang}${config.suffix}`);
      })
    ).pipe(
      map(response => {
        return response.reduce((combined, current) => {
          return this.mergeDeep(combined, current);
        }, {});
      })
    );
  }

  /**
   * Deep merges two objects
   */
  private mergeDeep(target: any, source: any): any {
    if (typeof target !== 'object' || typeof source !== 'object') {
      return source;
    }

    const output = { ...target };

    Object.keys(source).forEach(key => {
      if (source[key] instanceof Object && key in target) {
        output[key] = this.mergeDeep(target[key], source[key]);
      } else {
        output[key] = source[key];
      }
    });

    return output;
  }
}