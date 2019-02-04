import { LightningElement, api } from 'lwc';

export default class QuestionnaireCard extends LightningElement {

    @api questionnaire;

    openQuestionnaire(event) {
        // Prevents the anchor element from navigating to a URL.
        event.preventDefault();

        // Creates the event with the questionnaire ID data.
        // sending a selected event
        const selectedEvent = new CustomEvent('selected', { detail: this.questionnaire.id });

        // Dispatches the event.
        this.dispatchEvent(selectedEvent);
    }

}