import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation, ContentChildren, QueryList
} from '@angular/core';
import {
  MdDataTable,
  MdDataTableSection
} from './data-table';
import {MdTableSchema, MdTableDataSource, MdTableRowRange, MdTableRowData} from './schema';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/empty';


@Component({
  moduleId: module.id,
  selector: 'md-table',
  templateUrl: 'table.html',
  directives: [MdDataTable],
  providers: [],
  encapsulation: ViewEncapsulation.None
})
export class MdTable implements MdTableDataSource {
  @ContentChildren(MdDataTableSection) private _rows: QueryList<MdDataTableSection>;
  _this = this;


  @Input() data: MdTableRowData[] = null;

  getSchema() {
    return MdTableSchema.createFromComponent(this._rows.toArray());
  }

  ngAfterContentInit() {
    console.log(this._rows.toArray());
  }

  getSectionCount() {
    return 1;
  }

  getRowCount(section: number) {
    return section == 0 ? this.data.length : 0;
  }

  getRowData({section, start, end}: MdTableRowRange) {
    if (section) {
      return Observable.empty();
    }
    return Observable.of(this.data.slice(start, end));
  }
}
