import { LightningElement, track, api } from 'lwc';

export default class QuestionnaireList extends LightningElement {

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

    openQuestionnaire(event) {
        const questionnaireId = event.detail;
        this.selectedQuestionnaireId = questionnaireId;
        this.showQuestionnaire = true;
    }

    closeQuestionnaire(event) {
        this.selectedQuestionnaireId = '';
        this.showQuestionnaire = false;
    }

}
