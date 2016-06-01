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


function getIteratorSymbol() {
  return Symbol.iterator;
}


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
  selector: '[md-row]',
  exportAs: 'row'
})
class MdDataTableRow {
  /** @internal */
  templateRef: TemplateRef<DataRow>;

  constructor(templateRef: TemplateRef<DataRow>) {
    this.templateRef = templateRef;
  }
}

@Directive({
  selector: '[md-cell]',
})
class MdDataTableCell implements DoCheck {
  @Input() title: string;
  @Input() order: number = -1;
  @Input() @BooleanFieldValue() sticky: boolean = false;

  /** @internal */
  templateRef: TemplateRef<DataRow>;

  ngDoCheck() {}

  constructor(templateRef: TemplateRef<DataRow>) {
    this.templateRef = templateRef;
  }
}


@Directive({selector: '[mdFor]'})
class MdFor {
  constructor(private _viewContainer: ViewContainerRef, private _templateRef: TemplateRef<any>) {}

  insertRows(template: TemplateRef<any>, rows: Object[], index: number) {
    for (const row of rows) {
      this._viewContainer.createEmbeddedView(template, { $implicit: row }, index++);
    }
  }
}


@Directive({selector: '[mdTemplateOutlet]'})
class MdForCell implements DoCheck {
  constructor(private _viewContainerRef: ViewContainerRef) {}

  ngDoCheck() {}

  @Input()
  set mdForCell(value: { template: TemplateRef<Object>, context: Object }) {
    this._viewContainerRef.createEmbeddedView(value.template, value.context);
  }
}


@Component({
  moduleId: module.id,
  selector: 'md-data-table',
  templateUrl: 'data-table.html',
  styleUrls: ['data-table.css'],
  directives: [MdFor, MdForCell, NgTemplateOutlet],
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
    this.data.getRows(start, 1000)
      .subscribe(rows => {
        this._rowsFor.insertRows(this._row.templateRef, rows, start);
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
