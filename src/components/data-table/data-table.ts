import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  ContentChildren,
  Component,
  Directive,
  DoCheck,
  EmbeddedViewRef,
  Input,
  NgZone,
  QueryList,
  Renderer,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {NgTemplateOutlet} from '@angular/common';
import {isPresent} from '@angular/core/src/facade/lang';
import {Observable} from 'rxjs/Observable';
import {BooleanFieldValue} from '@angular2-material/core/core';
import {Dir} from '@angular2-material/core/rtl/dir';


export declare type DataRow = {
  [key: string]: any;
};


export interface IDataTableController {
  getRows(start: number, end: number): Observable<DataRow[]>;
}


@Component({
  selector: 'md-row',
  template: `Hello world!`,
  exportAs: 'row'
})
class MdDataTableRow {
  @ContentChildren(MdDataTableCell) cells: QueryList<MdDataTableCell>;
}


@Component({
  selector: '[md-cell]',
  template: ``
})
class MdDataTableCell {
  @Input() title: string;
  @Input() @BooleanFieldValue() sticky: boolean = false;

  constructor(private templateRef: TemplateRef<DataRow>) {}
}


@Component({
  moduleId: module.id,
  selector: 'md-data-table',
  templateUrl: './data-table.html',
  styleUrls: ['./data-table.css'],
  directives: [NgTemplateOutlet],
  // encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Detached,
})
class MdDataTable {
  private _columns: MdDataTableCell[] = [];

  @Input() data: IDataTableController;

  @ViewChild('header', { read: ViewContainerRef }) private _headerView: ViewContainerRef;
  @ViewChild('row', { read: ViewContainerRef }) private _rowView: ViewContainerRef;

  @ViewChild('headerTemplate', { read: TemplateRef }) private _headerTemplate: TemplateRef<any>;
  @ViewChild('rowTemplate', { read: TemplateRef }) private _rowTemplate: TemplateRef<any>;

  @ContentChildren(MdDataTableRow) private _rows: QueryList<MdDataTableRow>;

  constructor(private _viewContainer: ViewContainerRef,
              private _renderer: Renderer,
              private _ngZone: NgZone,
              private _cdr: ChangeDetectorRef) {}

  ngAfterContentInit() : any {
    window.setTimeout(() => {
      this._updateData();
    });
  }

  private _updateData() {
    let start = 0;

    const rowComponents = this._rows.toArray();
    this.data.getRows(start, 1000)
      .subscribe(dataRows => {
        for (const dataRow of dataRows) {
          // const rowView = this._viewContainer.createEmbeddedView(this._rowTemplate, dataRow, start++);
          this._viewContainer.createComponent()
        }
      });
  }
}


export const MD_DATA_TABLE_DIRECTIVES: any[] = [
  MdDataTable,
  MdDataTableCell,
  MdDataTableRow
];
