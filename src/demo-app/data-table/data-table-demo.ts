import {Component, Input} from '@angular/core';
import {MdButton} from '@angular2-material/button/button';
import {MD_CHECKBOX_DIRECTIVES} from '@angular2-material/checkbox/checkbox';
import {MD_DATA_TABLE_DIRECTIVES, IDataTableController} from '@angular2-material/data-table';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/delay';

const nameMap = [
  "Holly Sweeten",
  "Jacquiline Vigliotti",
  "Bernardo Grillo",
  "Cyrus Parry",
  "Scarlet Chouinard",
  "Bret Maland",
  "Rochel Toller",
  "Luna Rossbach",
  "Gonzalo Mcbath",
  "Teri Vannatter",
  "Erna Strahl",
  "Luigi Mounts",
  "James Daubert",
  "Carissa Hodnett",
  "Letha Dorantes",
  "Leonia Hatt",
  "Johna Martz",
  "Andree Coghlan",
  "Emmie August",
  "Karan Hastings",
  "Evelynn Klingensmith",
  "Olevia Sigman",
  "Yulanda Verrill",
  "Nathanial Haffey",
  "Dorthey Rentz",
  "Mavis Halsell",
  "Vincenza Caya",
  "Mignon Goley",
  "Shirl Sherk",
  "Adriane Gaeth",
  "Virgilio Liston",
  "Leda Jovel",
  "Karrie Dillman",
  "Rae Pillow",
  "Mindi Billick",
  "Laci Eckman",
  "Marna Hennessy",
  "Darleen Cantrelle",
  "Otha Banker",
  "Camilla Seneca",
  "Shaina Buechner",
  "Brenton Hollenbach",
  "Eli Santacruz",
  "Eilene Knapper",
  "Sallie Temme",
  "Amie Burson",
  "Sharice Malcomb",
  "Gaylord Reeser",
  "Annett Wherry",
  "Lynetta Rufus",
].map(name => name.split(' '));


function uniquePicker(arr: any[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}


function _generateEntry() {
  return {
    name: `${uniquePicker(nameMap)[0]} ${uniquePicker(nameMap)[1]}`,
    age: Math.floor(Math.random() * 80 + 10),
    hair: Math.random() * 2 != 0
  };
}


function _generateEntries(amount: number) {
  let result = new Array(amount);
  while (amount--) {
    result[amount] = _generateEntry();
  }
  return result;
}


@Component({
  moduleId: module.id,
  selector: 'data-table-demo',
  templateUrl: 'data-table-demo.html',
  styleUrls: ['data-table-demo.css'],
  directives: [MD_DATA_TABLE_DIRECTIVES, MD_CHECKBOX_DIRECTIVES]
})
export class DataTableDemo implements IDataTableController {
  this = this;

  getRows(start: number, end: number): Observable<any> {
    const generated = _generateEntries(end - start);
    let result = Observable.of(generated).delay(new Date(Date.now() + 1000));
    window.setTimeout(() => generated[0].name = 'Bob', 2000);
    return result;
  }
}
