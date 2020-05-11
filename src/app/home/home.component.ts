import { Component, OnInit } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
import {Leader} from '../shared/leader';
import { LeaderService } from '../services/leader.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  dish: Dish;
  promotion: Promotion;
  featuredLeader:Leader;

  constructor(private dishservice: DishService,
    private promotionservice: PromotionService,private leaderService:LeaderService) { }

  ngOnInit() {
    this.dishservice.getFeaturedDish().then(dish=>{this.dish = dish});
    this.promotionservice.getFeaturedPromotion().then(dish=>{this.promotion = dish});
    this.leaderService.getFeaturedLeader().then(dish=>{this.featuredLeader=dish});
  }

}
