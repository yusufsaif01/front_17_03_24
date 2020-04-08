import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-filter-dialog-player',
  templateUrl: './filter-dialog-player.component.html',
  styleUrls: ['./filter-dialog-player.component.scss']
})
export class FilterDialogPlayerComponent implements OnInit {
  filterForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<FilterDialogPlayerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder
  ) {
    this.filterForm = this.formBuilder.group({
      sample: ['']
    });
    // this.filterForm.patchValue({
    //   sample: data.formControlName
    // });
  }

  ngOnInit() {}
}