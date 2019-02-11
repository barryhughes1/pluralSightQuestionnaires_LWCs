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
    @track cardTheme = "slds-card__footer";
    @track status;
    @track error;

    /** Wired Apex result so it can be refreshed programmatically */
    wiredQuestionnaireResult;

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    questionnaireRecord(result) {
        if (result.data) {
            this.wiredQuestionnaireResult = result;
            console.log(JSON.stringify(this.questionnaire));
            console.log('SUCCESS');
            this.questionnaireRec = result.data;
            console.log(JSON.stringify(this.questionnaireRec.fields));
            this.name = this.questionnaireRec.fields.Name.value;
            this.description = this.questionnaireRec.fields.Description__c.value;
            this.questionsToAnswer = this.questionnaireRec.fields.Total_Questions__c.value;
            this.status = this.questionnaire.questionnaireStatus;
            this.cardTheme = "slds-card__footer slds-theme_inverse";
            this.error = undefined;
        } else if (result.error) {
            console.log('ERROR');
            this.error = result.error;
            this.questionnaireRec = undefined;
        }
    }



    openQuestionnaire(event) {
        // Prevents the anchor element from navigating to a URL.
        event.preventDefault();

        // Creates the event with the questionnaire ID data.
        // sending a selected event
        console.log('OBJ: ' + JSON.stringify(this.questionnaire));
        const selectedEvent = new CustomEvent('selected', { detail: this.recordId, qobj: this.questionnaire });

        // Dispatches the event.
        this.dispatchEvent(selectedEvent);
    }

    initCardTheme() {        
        this.cardTheme = "slds-card__footer";
		if(this.questionnaire.questionnaireStatus === "In Progress") {
	        this.cardTheme = this.cardTheme + " slds-theme_warning";
		} else if(this.questionnaire.questionnaireStatus === "Submitted") {
		    this.cardTheme = this.cardTheme + " slds-theme_success";
		} else {
		    this.cardTheme = this.cardTheme + " slds-theme_inverse";
        }
	}
}