import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Directive,
  ElementRef,
  ViewChild,
  ViewEncapsulation, QueryList, Input, TemplateRef, ViewContainerRef, Optional, Host, forwardRef,
  Inject, Self, Injector
} from '@angular/core';
import {MdTableSchema, MdTableRowData, MdTableDataSource} from './schema';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';


@Directive({
  selector: '[md-cell]'
})
export class MdDataTableCell {
  constructor(private _template: TemplateRef<MdTableRowData>) {
  }

  get template(): any { return this._template; }
}


@Directive({
  selector: 'md-section',
  exportAs: '$implicit'
})
export class MdDataTableSection {
  @ContentChildren(MdDataTableCell) private _cells: QueryList<MdDataTableCell>;

  constructor(private _viewContainer: ViewContainerRef) {}

  get data(): MdTableRowData { return {}; }

  get template(): any { return null; }
  get cells() { return this._cells; }
}


@Component({
  moduleId: module.id,
  selector: 'md-data-table',
  templateUrl: 'data-table.html',
  styleUrls: ['data-table.css'],
  providers: []
  // encapsulation: ViewEncapsulation.None,
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class MdDataTable implements AfterContentInit {
  private _schema: MdTableSchema = null;
  private _dataSource: MdTableDataSource = null;

  @ViewChild('headers', { read: ViewContainerRef }) private _headers: ViewContainerRef;
  @ContentChildren(MdDataTableSection) private _rows: QueryList<MdDataTableSection>;

  @Input() get dataSource() { return this._dataSource; }
  set dataSource(v: MdTableDataSource) {
    this._dataSource = v;
  }

  @Input() get schema() { return this._schema; }
  set schema(v: MdTableSchema) {
    this._schema = v;
  }

  private _getRowCount(section: number): Promise<number> {
    const rowCount = this._dataSource.getRowCount(section);
    if (rowCount instanceof Observable) {
      return rowCount.toPromise();
    } else {
      return Promise.resolve(rowCount);
    }
  }

  private _loadSection(section: number) {
    this._getRowCount(section)
      .then(size => {
        const start = 0;
        const end = size;

        let i = start;
        this._dataSource.getRowData({section, start, end})
          .subscribe((partialRowInfo) => {
            const arr = (partialRowInfo instanceof Array) ? partialRowInfo : [partialRowInfo];
            for (const row of arr) {
              this._renderRow(section, i++, row);
            }
          }, (error) => {
            console.error(error);
          });
      });
  }

  private _renderRow(section: number, rowIndex: number, row: MdTableRowData) {
    this._schema.render(section, rowIndex, row);
  }

  ngAfterContentInit() {
    if (this._schema === null) {
      this._schema = MdTableSchema.createFromComponent(this._rows.toArray());
    }

    this._loadSection(0);
  }
}
