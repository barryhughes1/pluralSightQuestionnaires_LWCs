import { LightningElement, track, api } from 'lwc';

export default class QuestionnaireCard extends LightningElement {

    @api questionnaire;

    @track status;

    openQuestionnaire(event) {
        this.status = 'clicked';

        // Prevents the anchor element from navigating to a URL.
        event.preventDefault();

        this.status = 'ID: ' + this.questionnaire.id;

        // Creates the event with the contact ID data.
        const selectedEvent = new CustomEvent('selected', { detail: this.questionnaire.id });
        this.status = 'event set';

        // Dispatches the event.
        this.dispatchEvent(selectedEvent);
        this.status = 'event fired';
    }

}