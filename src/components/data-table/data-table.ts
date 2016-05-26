import {
  AfterContentInit,
  AfterViewInit,
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
  selector: '[md-cell]',
  exportAs: 'row'
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
class MdFor implements DoCheck {
  constructor(private _viewContainer: ViewContainerRef, private _templateRef: TemplateRef<any>) {}

  @Input()
  set mdForOf(value: any[]) {
    this.appendRows(value);
  }

  ngDoCheck() {}

  appendRows(rows: Object[]) {
    this.insertRows(rows, this._viewContainer.length);
  }

  insertRows(rows: Object[], index: number) {
    for (const row of rows) {
      this._viewContainer.createEmbeddedView(this._templateRef, { $implicit: row }, index++);
    }
  }

  removeRows(start: number, count: number) {
    while (count--) {
      this._viewContainer.remove(start);
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
  directives: [MdFor, MdForCell, NgTemplateOutlet]
  // encapsulation: ViewEncapsulation.None,
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
class MdDataTable implements DoCheck {
  private _columns: MdDataTableCell[] = [];

  @Input() data: IDataTableController;

  @ViewChild('header', { read: ViewContainerRef }) private _headerView: ViewContainerRef;
  @ViewChild('headerTemplate', { read: TemplateRef }) private _headerTemplate: TemplateRef<MdDataTableCell>;
  @ViewChild('rows', { read: MdFor }) private _rowsFor: MdFor;
  @ContentChildren(MdDataTableCell) private _cells: QueryList<MdDataTableCell>;

  constructor(private _viewContainer: ViewContainerRef, private _renderer: Renderer, private _ngZone: NgZone) {}

  ngDoCheck() {}

  ngAfterContentInit() : any {
    this._cells.changes.subscribe(() => this._updateCells());
  }

  ngAfterViewInit() : any {
    window.setTimeout(() => {
      this._updateCells();
      this._updateData();
    });
  }

  private _updateCells() {
    this._columns = this._cells.toArray();

    // Sort by sticky first, then order. A negative order is last, and the sort function is
    // stable so the content order is maintained.
    this._columns.sort((a, b) => {
      if (a.sticky != b.sticky) {
        return (+b.sticky) - (+a.sticky);
      }
      if (a.order >= 0) {
        if (b.order >= 0) {
          return b.order - a.order;
        }
        return -1;
      }

      return 0;
    });

    if (this._headerView) {
      this._headerView.clear();
      this._columns.forEach(col => {
        this._headerView.createEmbeddedView(this._headerTemplate, col);
      });
    }
  }

  private _updateData() {
    let start = 0;
    this.data.getRows(start, 1000)
      .subscribe(rows => {
        // this._ngZone.runOutsideAngular(() => {
          this._rowsFor.insertRows(rows, start);
          start += rows.length;
        // });
      });
  }
}


export const MD_DATA_TABLE_DIRECTIVES: any[] = [
  MdDataTable,
  MdDataTableCell
];
