import { LightningElement, track, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';

const FIELDS = [
    'Questionnaire__c.Name',
    'Questionnaire__c.Description__c',
    'Questionnaire__c.Total_Questions__c',
];

export default class QuestionnaireCard extends LightningElement {

    @api recordId;
    @api questionnaire;

    @track questionnaireRec;
    @track name;
    @track description;
    @track questionsToAnswer;
    @track questionsAnswered;
    @track cardTheme = "slds-card__footer";
    @track status;
    @track error;

    /** Wired Apex result so it can be refreshed programmatically */
    wiredQuestionnaireResult;

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    questionnaireRecord(result) {
        if (result.data) {
            console.log('CARD record');
            this.wiredQuestionnaireResult = result;
            this.questionnaireRec = result.data;
            console.log(JSON.stringify(this.questionnaire));
            console.log(JSON.stringify(this.questionnaireRec.fields));
            this.name = this.questionnaireRec.fields.Name.value;
            this.description = this.questionnaireRec.fields.Description__c.value;
            this.status = this.questionnaire.questionnaireStatus;
            this.setCardTheme();
            this.setQuestionsAskedAndAnswered();
            this.error = undefined;
        } else if (result.error) {
            this.error = result.error;
            this.questionnaireRec = undefined;
        }
    }

    renderedCallback() {
        console.log('Questionnaire Card renderedCallback');
        this.setCardTheme();
        this.setQuestionsAskedAndAnswered();
    }

    setCardTheme() {  
        let cardTheme = "slds-card__footer";
		if(this.questionnaire.questionnaireStatus === "In Progress") {
            cardTheme = cardTheme + " slds-theme_warning";
		} else if(this.questionnaire.questionnaireStatus === "Submitted") {
            cardTheme = cardTheme + " slds-theme_success";
		} else {
            cardTheme = cardTheme + " slds-theme_inverse";
        }
        if(this.cardTheme != cardTheme) {
            this.cardTheme = cardTheme;
        }

    }
    

    setQuestionsAskedAndAnswered() {
        // Count the number of questions to be answered in questionnaire
        if(this.questionsToAnswer != this.questionnaire.questionAnswerList.length) {
            this.questionsToAnswer = this.questionnaire.questionAnswerList.length;
        }

        // Count the number of questions answered in questionnaire
        let questionsAnswered = 0;
        for (let j = 0; j < this.questionsToAnswer; j++) {
            if(this.questionnaire.questionAnswerList[j].hasOwnProperty('answerID')) {
                questionsAnswered = questionsAnswered + 1;
            }
        }

        // Only update the @trackable property once it has changed
        // to avoid an infinite loop
        if(this.questionsAnswered != questionsAnswered) {
            this.questionsAnswered = questionsAnswered;
        }
    }

    openQuestionnaire(event) {
        // Prevents the anchor element from navigating to a URL.
        event.preventDefault();

        // Creates the event with the questionnaire ID data.
        // sending a selected event
        const selectedEvent = new CustomEvent('selected', { detail: this.recordId, qobj: this.questionnaire });

        // Dispatches the event.
        this.dispatchEvent(selectedEvent);
    }
}