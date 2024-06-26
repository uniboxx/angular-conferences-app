import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Conference } from '../model';
import { differenceInCalendarDays } from 'date-fns';
import { DataService } from '../data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-conference',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe],
  templateUrl: './view-conference.component.html',
  styleUrl: './view-conference.component.scss',
})
export class ViewConferenceComponent implements OnInit, OnDestroy {
  private subs: Subscription[] = [];
  protected confs: Conference[] = [];
  protected conf: Conference = {} as unknown as Conference;
  protected days = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService
  ) {
    // this.confs.push({
    //   id: 1,
    //   title: 'Typescript Conference',
    //   startDateTime: '2024-05-04T09:00:00Z',
    //   endDateTime: '2024-05-05T17:00:00Z',
    //   description: 'A fun-filled weekend of pure Typescript...',
    //   talks: [
    //     {
    //       title: 'Keynote with Anders Hejlsberg',
    //       speaker: {
    //         name: 'Anders Hejlsberg',
    //       },
    //       duration: '2 hours',
    //       day: 1,
    //       description:
    //         'An incredible keynote speech on the future of Typescript',
    //     },
    //     {
    //       title: 'Latest Typescript features',
    //       speaker: {
    //         name: 'Daniel Rosenwasser',
    //       },
    //       duration: '1 hour',
    //       day: 2,
    //       description: 'All the latest Typescript features you can use today',
    //     },
    //   ],
    // });
  }

  public ngOnInit(): void {
    // console.log(this.confs[0]);
    const confId = Number(this.route.snapshot.paramMap.get('id'));
    // const conf = this.confs.find((conf) => conf.id === confId);
    this.subs.push(
      this.dataService.getConferences$.subscribe(
        (conferences: Conference[]) => {
          this.confs = conferences;
          const conf = this.confs.find((conf) => conf.id === confId);
          if (!conf) {
            this.router.navigateByUrl('/not-found');
          } else {
            this.conf = conf;
            this.days = this.calculateDays();
          }
        }
      )
    );

    // if (!conf) {
    //   this.router.navigateByUrl('/not-found');
    // } else {
    //   this.conf = conf;
    //   this.days = this.calculateDays();
    // }
  }
  private calculateDays(): number {
    const start = new Date(this.conf.startDateTime);
    const end = new Date(this.conf.endDateTime);
    return differenceInCalendarDays(end, start) + 1;
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
