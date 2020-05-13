import { Component, OnInit,Input,ViewChild,Inject } from '@angular/core';
import {Dish} from '../shared/dish' ;
import { DishService } from '../services/dish.service';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';
import { visibility,flyInOut,expand } from '../animations/app.animation';




@Component({
  selector: 'app-dish-detail',
  templateUrl: './dish-detail.component.html',
  styleUrls: ['./dish-detail.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
    animations: [
      visibility(),
      flyInOut(),
      expand()
    ]
})
export class DishDetailComponent implements OnInit {

  @ViewChild('fform') commentFormDirective;
  errMess: string; 

    dish:Dish;
    dishcopy: Dish;
    dishIds: string[];
    prev: string;
    next: string;
    commentForm:FormGroup;
    comment:Comment;
    visibility = 'shown';
    

    constructor(private dishservice: DishService,private route: ActivatedRoute,private location: Location,private fb:FormBuilder,@Inject('BaseURL') private BaseURL) {

      this.createForm();
    }

    ngOnInit() {
        this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
        this.route.params.pipe(switchMap((params: Params) => {
          this.visibility = 'hidden'; 
          return this.dishservice.getDish(+params['id']); }))
          .subscribe(dish => { 
            this.dish = dish; 
            this.dishcopy = dish; 
            this.setPrevNext(dish.id); this.visibility = 'shown'; },
            errmess => this.errMess = <any>errmess);
      }

      formErrors = {
        'author': '',
        'comment': '',
      };

      validationMessages = {
        'author': {
          'required':      'Author Name is required.',
          'minlength':     'Author Name must be at least 2 characters long.'
        },
        'comment': {
          'required':      'Comment is required.'
        },
      };

      createForm(){
        this.commentForm=this.fb.group({
          'author':['',[Validators.required,Validators.minLength(2)]],
          'rating':[5,[Validators.required]],
          'comment':['',[Validators.required]],
          'date':[new Date().toISOString()]
        })

        this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data),
      errmess => this.errMess = <any>errmess);

    this.onValueChanged(); // (re)set validation messages now
      }

      onValueChanged(data?: any) {
        if (!this.commentForm) { return; }
        const form = this.commentForm;
        for (const field in this.formErrors) {
          if (this.formErrors.hasOwnProperty(field)) {
            // clear previous error message (if any)
            this.formErrors[field] = '';
            const control = form.get(field);
            if (control && control.dirty && !control.valid) {
              const messages = this.validationMessages[field];
              for (const key in control.errors) {
                if (control.errors.hasOwnProperty(key)) {
                  this.formErrors[field] += messages[key] + ' ';
                }
              }
            }
          }
        }
      }

      onSubmit(){
        this.dishcopy.comments.push(this.commentForm.value)
        this.dishservice.putDish(this.dishcopy)
      .subscribe(dish => {
        this.dish = dish; this.dishcopy = dish;
      },
      errmess => { this.dish = null; this.dishcopy = null; this.errMess = <any>errmess; });
        this.commentForm.reset(
          {
            author: '',
            rating: 5,
            comment: '',
          }
        );
        this.commentFormDirective.resetForm();
      }

    goBack(): void {
        this.location.back();
    }

    setPrevNext(dishId: string) {
        const index = this.dishIds.indexOf(dishId);
        this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
        this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
      }

}
