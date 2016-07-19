import {Component} from '@angular/core';
import {MD_TABLE_DIRECTIVES, MdTableRowData} from '@angular2-material/data-table/index';


let currentId = 0;
const prefixes = [
  'Aerial', 'Armor', 'Assault', 'Atomic', 'Bird', 'Bolt', 'Canine', 'Cascade', 'Clerical', 'Cloud',
  'Cobra', 'Cold', 'Compu', 'Cosmic', 'Cosmo', 'Cutlass', 'Disease', 'Diviner', 'Doctor', 'Dynamo',
  'Eagle', 'Eat', 'Emerald', 'Feather', 'Fire', 'Flame', 'Fraud', 'Ghost', 'Goddess', 'Gold',
  'Green', 'Hound', 'Hyperion', 'Icicle', 'Insect', 'Iron', 'Jest', 'Kill', 'Lance', 'Luck', 'Lynx',
  'Mister', 'Master', 'Mistress', 'Obsidian', 'Ochre', 'Oracle', 'Paw', 'Photo', 'Plant', 'Raptor',
  'Robot', 'Ruby', 'Ruby', 'Rush', 'Shape', 'Shield', 'Shot', 'Sorcery', 'Spike', 'Stab', 'Talon',
  'Tempest', 'Topaz', 'Tornado', 'Trace'
];
const suffixes = [
  'Amphibian', 'Arrow', 'Bash', 'Bite', 'Blast', 'Blaze', 'Bloom', 'Bombadier', 'Brain', 'Charmer',
  'Chill', 'Comet', 'Cutlass', 'Dark', 'Dart', 'Dash', 'Dolphin', 'Driver', 'Emerald', 'Falcon',
  'Fever', 'Fission', 'Form', 'Freeze', 'Frost', 'Golem', 'Grenade', 'Hurricane', 'Lynx', 'Masher',
  'Nemesis', 'Net', 'Phase', 'Prophet', 'Root', 'Scream', 'Searcher', 'Shaman', 'Shifter', 'Siege',
  'Slasher', 'Sorceress', 'Spawn', 'Spear', 'Spectre', 'Spirit', 'Storm', 'Swimmer', 'Talon',
  'Tarantula', 'Time', 'Toad', 'Trickster', 'Warrior'
];
const names = [
  ['Edward', 'Blake'],
  ['Jon', 'Osterman'],
  ['Daniel', 'Dreiberg'],
  ['Adrian', 'Veidt'],
  ['Walter', 'Kovacs'],
  ['Laurie', 'Juspeczyk'],
  ['Hollis', 'Mason'],
  ['Sally', 'Jupiter'],
  ['Nelson', 'Gardner'],
  ['William', 'Brady'],
  ['Byron', 'Lewis'],
  ['Ursula', 'Zandt']
];


function _pick<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}


function _createDataRow(): MdTableRowData {
  return {
    id: currentId++,
    name: `${_pick(prefixes)} ${_pick(suffixes)}`,
    alterEgo: `${_pick(names)[0]} ${_pick(names)[1]}`,
    age: Math.floor(Math.random() * 100) + 12
  };
}


function _generateRows(nb: number): MdTableRowData[] {
  return new Array(nb).fill(undefined).map(_createDataRow);
}


@Component({
  moduleId: module.id,
  selector: 'md-data-table-demo',
  templateUrl: 'data-table-demo.html',
  styleUrls: ['data-table-demo.css'],
  directives: [MD_TABLE_DIRECTIVES]
})
export class DataTableDemo {
  myData: MdTableRowData[];

  constructor() {
    this.myData = _generateRows(Math.floor(Math.random() * 100) + 30);
  }
}
