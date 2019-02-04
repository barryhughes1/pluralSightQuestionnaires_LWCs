import { LightningElement, track, api } from 'lwc';

export default class QuestionnaireAnswer extends LightningElement {

   @api question;

   @track comments;

   @track value = '';

   get options() {
      return [
             {'label': 'Strongly Disagree', 'value': 'Strongly Disagree'},
             {'label': 'Disagree', 'value': 'Disagree'},
             {'label': 'Undecided', 'value': 'Undecided'},
             {'label': 'Agree', 'value': 'Agree'},
             {'label': 'Strongly Agree', 'value': 'Strongly Agree'}
      ];
   }
}