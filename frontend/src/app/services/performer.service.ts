import { Injectable } from '@angular/core';

import { Performer } from '../models/performer.model';

import { DataService } from './data.service';

@Injectable()
export class PerformerService {

  constructor(
    private dataService: DataService
  ) { }

  getAllPerformers(): Promise<Performer[]> {
    return this.dataService.getRequest('popular/allperformers');
  }

  getPerformersByFilters(city: string, name: string): Promise<Performer[]> {
    let uriParams = `city=${city ? city : ''}&name=${name ? name : ''}`;
    return this.dataService.getRequest(`popular/search?${uriParams}`);
  }

}
