import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';

const fields = [
    'Questionnaire.Name',
    'Questionnaire.Description__c',
    'Questionnaire.Total_Questions__c',
];

export default class Questionnaire_Card_lwc extends LightningElement {
    @api recordId;

    @wire(getRecord, { recordId: '$recordId', fields })
    questionnaire;

    get name() {
        return this.questionnaire.data.fields.Name.value;
    }

    get description() {
        return this.questionnaire.data.fields.Description__c.value;
    }

    get totalQuestions() {
        return this.questionnaire.data.fields.Total_Questions__c.value;
    }
}