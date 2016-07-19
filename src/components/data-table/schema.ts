import {TemplateRef, EmbeddedViewRef, ViewRef, ViewContainerRef, Renderer} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {MdDataTable, MdDataTableSection, MdDataTableCell} from './data-table';


export type MdTableRowData = { [key: string]: any };


export interface MdTableRowRange {
  section?: number;
  start: number;
  end: number;
}


export interface MdTableDataSource {
  getSectionCount?(): number | PromiseLike<number> | Observable<number>;
  getRowCount(section: number): number | PromiseLike<number> | Observable<number>;
  getRowData(range: MdTableRowRange, table?: MdDataTable):
    Observable<MdTableRowData | MdTableRowData[]>;
}


export abstract class MdTableSchemaCell {
  title: string;

  abstract renderInto(view: ViewContainerRef, rowData: MdTableRowData): void;

  static createFromTemplate(cell: MdDataTableCell): MdTableSchemaCell {
    return new MdTableSchemaTemplatedCell(cell.template);
  }
}


export class MdTableSchemaTemplatedCell extends MdTableSchemaCell {
  constructor(private _template: TemplateRef<MdTableRowData>) {
    super();
  }

  renderInto(view: ViewContainerRef, rowData: MdTableRowData) {
    view.createEmbeddedView(this._template, { row: rowData });
  }
}


export class MdTableSchemaSection {
  constructor(private _cells: MdTableSchemaCell[]) {}

  renderRow(parentElement: HTMLElement, renderer: Renderer, rowData: MdTableRowData) {
    this._cells.forEach(cell => cell.renderInto(view, rowData));
  }

  static createFromTemplate(row: MdDataTableSection) {
    return new MdTableSchemaSection(
      row.cells.map(cell => MdTableSchemaCell.createFromTemplate(cell)));
  }
}


export class MdTableSchema {
  private _sections: MdTableSchemaSection[];
  private _rowsToRender: MdTableRowData[] = [];

  constructor() {}

  get sections() { return this._sections; }

  renderRow(parentElement: HTMLElement, renderer: Renderer, section: number, rowIndex: number, rowData: MdTableRowData) {
    this._sections[section].renderRow(parentElement, renderer, rowIndex, rowData);
  }

  static createFromComponent(rows: MdDataTableSection[]) {
    const schema = new MdTableSchema();
    schema._sections = rows.map(row => MdTableSchemaSection.createFromTemplate(row));
    return schema;
  }
}
