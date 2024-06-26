import { NgIf } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { DataService } from '../data.service';
import { Conference } from '../model';

@Component({
  selector: 'app-add-conference',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './add-conference.component.html',
  styleUrl: './add-conference.component.scss',
})
export class AddConferenceComponent implements OnInit, OnDestroy {
  private subs: Subscription[] = [];
  private confs: Conference[] = [];
  protected logoDataSrc = '';
  protected conferenceForm = new UntypedFormGroup({
    name: new UntypedFormControl('', Validators.required),
    logo: new UntypedFormControl(''),
    startDateTime: new UntypedFormControl('', Validators.required),
    endDateTime: new UntypedFormControl('', Validators.required),
    desc: new UntypedFormControl('', Validators.required),
  });

  constructor(private dataService: DataService) {}

  public uploadLogo(input: HTMLInputElement): void {
    const files: FileList | null = input.files;
    const firstFile: File | null = files instanceof FileList ? files[0] : null;
    const reader: FileReader = new FileReader();
    reader.addEventListener('load', (event: ProgressEvent<FileReader>) => {
      if (event.target?.result) {
        const value = event.target.result as string;
        this.conferenceForm.patchValue({
          logo: value,
        });
        this.logoDataSrc = value;
      }
    });
    if (firstFile) {
      reader.readAsDataURL(firstFile);
    }
  }

  public save(): void {
    const lastId = this.confs.pop()?.id ?? 0;
    const logo = this.conferenceForm.get('logo')?.value || undefined;
    const desc = this.conferenceForm.get('desc')?.value ?? '';
    this.confs.push({
      id: lastId + 1,
      title: this.conferenceForm.get('name')?.value ?? '',
      startDateTime: this.conferenceForm.get('startDateTime')?.value ?? '',
      endDateTime: this.conferenceForm.get('endDateTime')?.value ?? '',
      description: desc,
      shortDescription: desc.length > 150 ? desc.slice(0, 150) : desc,
      logo: logo ? { src: logo } : undefined,
    });
    this.dataService.setConferences(this.confs);
  }

  private resetForm(): void {
    this.conferenceForm.reset();
    this.logoDataSrc = '';
  }

  ngOnInit(): void {
    this.subs.push(
      this.dataService.getConferences$.subscribe(
        (conferences: Conference[]) => {
          this.confs = conferences;
        }
      ),
      this.dataService.setConferences$.subscribe({
        next: () => this.resetForm(),
        error: (error) => console.error(error),
      })
    );
    this.dataService.getConferences();
  }
  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
