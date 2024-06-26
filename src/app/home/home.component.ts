import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { Conference } from '../model';
import { DataService } from '../data.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgIf, NgFor, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  protected confs: Conference[] = [];
  private subs: Subscription[] = [];

  constructor(private router: Router, private dataService: DataService) {}

  public addConference(): void {
    this.router.navigateByUrl('/add');
  }

  public ngOnInit(): void {
    this.subs.push(
      this.dataService.getConferences$.subscribe(
        (conferences: Conference[]) => {
          this.confs = conferences;
        }
      )
    );
    this.dataService.getConferences();
  }
  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
