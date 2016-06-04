import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  ContentChildren,
  Component,
  Directive,
  DoCheck,
  ElementRef,
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


declare type Column = {
  cell: MdDataTableCell;
  order: number;
};


export interface IDataTableController {
  getRows(start: number, end: number): Observable<DataRow[]>;
}


@Directive({
  selector: '[md-row]'
})
class MdDataTableRow {
  /** @internal */
  templateRef: TemplateRef<any>;

  constructor(templateRef: TemplateRef<any>) {
    this.templateRef = templateRef;
  }
}


@Directive({
  selector: 'md-cell',
})
class MdDataTableCell {
  @Input() title: string;
  @Input() order: number = -1;
  @Input() @BooleanFieldValue() sticky: boolean = false;
}


@Component({
  selector: 'md-table',
  template: `<div><ng-content></ng-content></div>`,
  styleUrls: ['data-table.css']
})
class MdScrollableTable implements AfterContentInit {
  constructor(private _viewContainer: ViewContainerRef, private _templateRef: TemplateRef<any>,
              private _renderer: Renderer, private _element: ElementRef) {}

  ngAfterContentInit(): any {
    console.log(2);
    this._renderer.listen(this._element.nativeElement, 'scroll', function() {
      console.log(1);
    });
  }

  scroll($event: Event) {
    console.log(1);
  }
}


@Directive({selector: '[mdFor]'})
class MdFor {
  constructor(private _viewContainer: ViewContainerRef, private _templateRef: TemplateRef<any>,
              private _renderer: Renderer, private _element: ElementRef) {}

  insertRows(template: TemplateRef<any>, rows: Object[], index: number) {
    for (const row of rows) {
      this._viewContainer.createEmbeddedView(template, { $implicit: row }, index++);
    }
  }
}


@Component({
  moduleId: module.id,
  selector: 'md-data-table',
  templateUrl: 'data-table.html',
  styleUrls: ['data-table.css'],
  directives: [MdFor, NgTemplateOutlet],
  // encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class MdDataTable implements DoCheck {
  private _columns: MdDataTableCell[] = [];

  @Input() data: IDataTableController;

  @ViewChild('header', { read: ViewContainerRef }) private _headerView: ViewContainerRef;
  @ViewChild('headerTemplate', { read: TemplateRef }) private _headerTemplate: TemplateRef<MdDataTableCell>;
  @ViewChild('rows', { read: MdFor }) private _rowsFor: MdFor;
  @ContentChildren(MdDataTableCell) private _cells: QueryList<MdDataTableCell>;
  @ContentChildren(MdDataTableRow) private _row: QueryList<MdDataTableRow>;

  constructor(private _viewContainer: ViewContainerRef,
              private _renderer: Renderer,
              private _ngZone: NgZone,
              private _cdr: ChangeDetectorRef) {}

  ngDoCheck() {}

  ngAfterContentInit() : any {
  }

  ngAfterViewInit() : any {
    window.setTimeout(() => {
      this._updateHeader();
      this._updateData();
    });
  }

  scroll(event: Event) {
    console.log(event);
  }

  private _updateHeader() {
    this._columns = this._cells.toArray();

    if (this._headerView) {
      this._headerView.clear();
      this._columns.forEach(col => {
        this._headerView.createEmbeddedView(this._headerTemplate, col);
        this._cdr.markForCheck();
      });
    }
  }

  private _updateData() {
    let start = 0;
    this.data.getRows(start, 100)
      .subscribe(rows => {
        this._rowsFor.insertRows(this._row.toArray()[0].templateRef, rows, start);
        start += rows.length;

        this._cdr.markForCheck();
      });
  }
}


export const MD_DATA_TABLE_DIRECTIVES: any[] = [
  MdDataTable,
  MdDataTableCell,
  MdDataTableRow
];
