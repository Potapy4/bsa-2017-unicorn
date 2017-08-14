import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  title: string;
  slogan: string;
  labelSearch: string;
  placeholderCategory: string;
  placeholderSubcategory: string;
  searchCategory: string;
  searchSubcategory: string;
  labelDate: string;
  searchDate: Date;
  mode: string;
  firstDayOfWeek: string;
  categories: {}[];
  subcategories: string[];
  labelButton: string;

  constructor() { }

  ngOnInit() {
    this.initContent();
  }

  initContent() {
    this.title = 'Happy unicorn';
    this.slogan = 'We can scratch your cat right now, because we can do it.';

    this.placeholderCategory = 'Scratch';
    this.placeholderSubcategory = 'cat';
    this.searchCategory = '';
    this.searchSubcategory = '';
    /* labels */
    this.labelSearch = 'What to do';
    this.labelDate = 'When do it';
    this.labelButton = 'Search';
    /* datepicker settings */
    this.mode = 'date';           /* select day */
    this.firstDayOfWeek = '1';    /* start calendar from first day of week */
    this.categories = [{id: 1, text: 'Category1'}, {id: 2, text: 'Category2'}, {id: 3, text: 'Category3'}];
    this.subcategories = ['Subcategory1', 'Subcategory2', 'Subcategory3'];
  }

  searchVendor() {
    if (this.searchDate === undefined) {
      this.searchDate = new Date();
    }
    if (this.searchCategory === '') {
      this.searchCategory = this.placeholderCategory;
    }
    if (this.searchSubcategory === '') {
      this.searchSubcategory = this.searchSubcategory;
    }
    console.log('"category: "' + this.searchCategory);
    console.log('"subcategory: "' + this.searchSubcategory);
    console.log('"date: "' + this.searchDate);
  }

  // setCategory(category: string) {
  //   this.selCategory = category;
  // }

  // setSubcategory(subcategory: string) {
  //   this.selSubcategory = subcategory;
  // }

}
