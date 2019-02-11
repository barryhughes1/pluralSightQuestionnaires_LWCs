import { LightningElement, track, wire } from 'lwc';
import getQuestionnaires from '@salesforce/apex/Questionnaire_Controller.getQuestionnaires';

export default class QuestionnaireList extends LightningElement {

    @wire(getQuestionnaires) questionnaires;

    json = {
        "pageTitle": "Questionnaires",
        "questionnaires": [
            {
            "name": "UAT Evaluation",
            "description__c": "Customer - Direct",
            "due_date__c": "11-04-2017",
            "status__c": "Not Started",
            "cardtheme": "slds-card__footer slds-theme_inverse",
            "icontheme": "slds-icon-standard-bot",
            "questions__c": "10",
            "questions_mandatory__c": "8",
            "answers__c": "6",
            "status-theme__c" : "info"
            },
            {
            "name": "Big Sky Inc Project",
            "description__c": "Customer - Direct",
            "due_date__c": "11-08-2017",
            "status__c": "Not Submitted",
            "cardtheme": "slds-card__footer slds-theme_warning",
            "icontheme": "slds-icon-custom-custom18",
            "questions__c": "10",
            "questions_mandatory__c": "8",
            "answers__c": "6",
            "status-theme__c" : "info"
            },
            {
            "name": "Edge Communications Data Cleanse Project Evaluation",
            "description__c": "Customer - Direct",
            "due_date__c": "11-11-2017",
            "status__c": "Submitted",
            "cardtheme": "slds-card__footer",
            "icontheme": "slds-icon-standard-opportunity",
            "questions__c": "10",
            "questions_mandatory__c": "8",
            "answers__c": "6",
            "status-theme__c" : "success"
            }
        ]
    };

    @track showQuestionnaire;
    @track selectedQuestionnaireId;
    @track selectedQuestionnaire;

    openQuestionnaire(event) {
//        const questionnaireId = event.detail;
//        const questionnaireId = event.detail;
        
        console.log('+++++++++++++++++++++++++');
        console.log(JSON.stringify(event.qobj));
        console.log(event.detail);
        console.log(JSON.stringify(this.questionnaires));
        console.log('+++++++++++++++++++++++++');
        console.log(this.questionnaires.data.length);
        for(var i=0; i < this.questionnaires.data.length; i=i+1) {
            console.log('LOOP');
            if(this.questionnaires.data[i].questionnaireId === event.detail) {
                this.selectedQuestionnaire = this.questionnaires.data[i];
                console.log('Object: ' + JSON.stringify(this.selectedQuestionnaire));
                console.log('ID: ' + this.questionnaires.data[i].questionnaireReturnedId);
            }
        }
        console.log('+++++++++++++++++++++++++');
        // learn from the timing if things
        this.selectedQuestionnaireId = event.detail;
        this.showQuestionnaire = true;
        console.log('+++++++++++++++++++++++++');
    }

    closeQuestionnaire() {
        this.selectedQuestionnaireId = '';
        this.selectedQuestionnaire = {};
        this.showQuestionnaire = false;
    }

}