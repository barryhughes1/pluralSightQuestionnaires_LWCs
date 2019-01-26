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


      @track clickedButtonLabel;

     @track status;

      handleSaveClick(event) {
//          this.clickedButtonLabel = event.target.label;
      }
  
      handleBackClick(event) {
        this.status = 'clicked';
        alert('Call event to be received by parent');
        console.log('Call event to be received by parent');

        // Prevents the anchor element from navigating to a URL.
        event.preventDefault();

        this.status = 'ID: ' + this.questionnaire.id;

        // Creates the event with the contact ID data.
        const selectedEvent = new CustomEvent('closed');
        this.status = 'event set';

        // Dispatches the event.
        this.dispatchEvent(selectedEvent);
        this.status = 'event fired';
    }

}