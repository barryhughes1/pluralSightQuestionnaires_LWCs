import { LightningElement, track, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getQuestionnaires from '@salesforce/apex/Questionnaire_Controller.getQuestionnaires';


export default class QuestionnaireList extends LightningElement {

    @track questionnaires;

    @wire(getQuestionnaires) wiredQuestionnaires(value) {
        // Hold on to the provisioned value so we can refresh it later.
        this.questionnaires = value;
    }

    @track showQuestionnaire;
    @track selectedQuestionnaireId;
    @track selectedQuestionnaire;

    openQuestionnaire(event) {        
        for(let i=0; i < this.questionnaires.data.length; i=i+1) {
            if(this.questionnaires.data[i].questionnaireId === event.detail) {
                this.selectedQuestionnaire = this.questionnaires.data[i];
            }
        }

        this.selectedQuestionnaireId = event.detail;
        this.showQuestionnaire = true;
    }

    // operation property is to indicate a record has been created
    // and the 'closeQuestionnaire' function must call the apex method
    @track operation;

    handleUpdateQuestionnaire(event) {
        console.log('------ handleUpdateQuestionnaire IN PARENT LIST COMPONENT -----');
        console.log(JSON.stringify(event.detail));
        this.operation = event.detail.operation;
/*
        Note: the cdoe below tries to update the JSON so as to avoid an Apex call
        -- this is definitiely not good practice as the inheritance in sub-components
        being refreshd causes havoc that is not easily debugged
        Code is left here to indicate what was tried and failed for info purposes only
        switch(operation) {
            case "New Answer":
                // Need to find the questionID in the JSON matching event.detail.questionID
                // and add a corresponding answerID property with the value of event.detail.newQuestionnaireAnswerID
                // (If it does not already have an answerID property)
                for (var i = 0; i < this.questionnaires.length; i++) {
                    if (this.questionnaires[i].questionnaireId === this.selectedQuestionnaireId) {
                        for (var j = 0; j < this.questionnaires[j].questionAnswerList.length; j++) {
                            if(this.questionnaires[j].questionAnswerList[j].questionID === event.detail.questionID) {
                                console.log('ERROR OCCURS IN NEXT LINE');
                                questionnaires[i].questionAnswerList[j] = {
                                    "questionID": event.detail.questionID,
                                    "answerID" : event.detail.newQuestionnaireAnswerID
                                };
                                break;
                            }
                        }
                      break;
                    }
                  }

                break;
            case "New Return":            
                // Need to find the questionnaireId in the JSON matching this.selectedQuestionnaireId
                // and update it's questionnaireReturnedId propoerty to event.detail.newQuestionnaireReturnID
                // (If it does not already have a value)
                for (var i = 0; i < this.questionnaires.length; i++) {
                    if (this.questionnaires[i].questionnaireId === this.selectedQuestionnaireId) {
                        console.log('ERROR OCCURS ON THE NEXT LINE');
                        this.questionnaires[i].questionnaireReturnedId = event.detail.newQuestionnaireReturnID;
                      break;
                    }
                  }
                break;
            default:
              // not recognised action;
          }
          */
    }


    closeQuestionnaire() {
        console.log('closeQuestionnaire called');

        // If a Return or Answer record is created we need to refresh and recall the Apex call
        if((this.operation === 'New Answer') || (this.operation === 'New Return') || (this.operation === 'Return Submitted')) {
            refreshApex(this.questionnaires);
            this.operation = '';
            getQuestionnaires()
                .then(result => {
                    this.questionnaires = result;
                })
                .catch(error => {
                    console.log(error);
                });                
        }

        this.selectedQuestionnaireId = '';
        this.selectedQuestionnaire = {};
        this.showQuestionnaire = false;
    }

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



}