import {Component} from '@angular/core';
import {FORM_DIRECTIVES} from '@angular/common';
import {MdUniqueSelectionDispatcher} from '@angular2-material/core/core';
import {MD_CHECKBOX_DIRECTIVES} from '@angular2-material/checkbox/checkbox';
import {MD_RADIO_DIRECTIVES} from '@angular2-material/radio/radio';
import {MD_INPUT_DIRECTIVES} from '@angular2-material/input/input';
import {MdButton} from '@angular2-material/button/button';
import {MdCard} from '@angular2-material/card/card';
import {MdIcon} from '@angular2-material/icon/icon';
import {MdToolbar} from '@angular2-material/toolbar/toolbar';


@Component({
  moduleId: module.id,
  selector: 'md-form-mixed-demo',
  templateUrl: 'form-mixed-demo.html',
  styleUrls: ['form-mixed-demo.css'],
  providers: [MdUniqueSelectionDispatcher],
  directives: [
    MdCard,
    MdButton,
    MdIcon,
    MdToolbar,
    MD_CHECKBOX_DIRECTIVES,
    MD_RADIO_DIRECTIVES,
    FORM_DIRECTIVES
  ]
})
export class FormMixedDemo {
}
