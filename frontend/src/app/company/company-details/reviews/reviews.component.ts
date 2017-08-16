import { Component, OnInit, Input } from '@angular/core';
import { Company } from "../../../models/company.model";
import { Review } from "../../../models/review.model";

@Component({
  selector: 'company-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.sass']
})
export class ReviewsComponent implements OnInit {
@Input()
reviews: Review[];
isReviewsNull: boolean = true;
  constructor() { }

  ngOnInit() {
    if(this.reviews !== null){
      this.isReviewsNull = true;
    }
    else{
      this.isReviewsNull = false;
    }
  }

}
