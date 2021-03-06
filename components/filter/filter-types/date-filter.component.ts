import {Component, OnInit} from '@angular/core';

import { DefaultFilter } from './default-filter';

@Component({
  selector: 'date-filter',
  styles: ['input { width: 100% !important; }'],
  template: `
	<div class="calendar_icon">
		<input [owlDateTimeTrigger]="dt" [owlDateTime]="dt" [selectMode]="datepickerSelectMode"
			   [(ngModel)]="inputModel" [placeholder]="datepickerPlaceholder" readonly />
		<button (click)="resetFilter()" class="calendarReset"></button>
	</div>
    <owl-date-time #dt [pickerType]="datepickerType" (afterPickerClosed)="onChange()"></owl-date-time>
  `,
})
export class DateFilterComponent extends DefaultFilter implements OnInit {
  inputModel: any;
  datepickerType = 'calendar';
  datepickerSelectMode = 'single';
  datepickerPlaceholder = 'Pick a date';

  constructor() {
    super();
  }

  resetFilter() {
    this.inputModel = null;
    this.onChange();
  }

  ngOnInit(): void {
    if (this.column.getFilterConfig().datepicker.type) {
      this.datepickerType = this.column.getFilterConfig().datepicker.type;
    }
    if (this.column.getFilterConfig().datepicker.selectMode) {
      this.datepickerSelectMode = this.column.getFilterConfig().datepicker.selectMode;
    }
    if (this.column.getFilterConfig().datepicker.placeholder) {
      this.datepickerPlaceholder = this.column.getFilterConfig().datepicker.placeholder;
    }
  }

  public static filterFunction(value: string, query: string) {
    const input = new Date(value);
    const queryParts = query.split("~");
    const date1 = new Date(queryParts[0]);

    if (queryParts.length > 1) { // date range
      const date2 = new Date(queryParts[1]);
      return date1.getTime() <= input.getTime() && date2.getTime() >= input.getTime();
    }

    // exact date
    return date1.getTime() == input.getTime();
  }

  dateToUTCDateString(date: Date): string {
    const year = date.getFullYear();
    let month: string = (date.getMonth() + 1).toString();
    if (month.length == 1) {
      month = "0" + month;
    }
    let day: string = date.getDate().toString();
    if (day.length == 1) {
      day = "0" + day;
    }
    return year + '-' + month + '-' + day;
  }

  onChange() {
    if (!this.inputModel) {
      this.query = '';
      this.setFilter();
      return;
    }
    const config = this.column.getFilterConfig().datepicker;
    if (config.selectMode == 'range') {
      this.query = `'${this.dateToUTCDateString(this.inputModel[0])} 00:00:00' $AND ${this.column.id} $LTE '${this.dateToUTCDateString(this.inputModel[1])} 23:59:59'`;
    } else {
      this.query = this.dateToUTCDateString(this.inputModel);
    }
    this.setFilter();
  }
}