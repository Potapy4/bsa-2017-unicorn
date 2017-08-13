import {Vendor} from './vendor'
import {User} from './user'
import {Review} from './review.model'

export interface History {
    date: Date;
	description: string;
    vendor: Vendor;
    user: User;
    workType: string;
    review: Review;
}