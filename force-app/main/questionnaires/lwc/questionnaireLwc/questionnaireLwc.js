import { LightningElement, track, api, wire } from 'lwc';
import { getRecord, createRecord, updateRecord } from 'lightning/uiRecordApi';
import Id from '@salesforce/user/Id';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import QUESTIONNAIRE_RETURNED_OBJECT from '@salesforce/schema/Questionnaire_Returned__c';
import QUESTIONNAIRE_FIELD from '@salesforce/schema/Questionnaire_Returned__c.Questionnaire__c';
import SUBMITTED_FIELD from '@salesforce/schema/Questionnaire_Returned__c.Submitted__c';
import TANDC_FIELD from '@salesforce/schema/Questionnaire_Returned__c.Terms_and_Conditions__c';
import ANSWERED_BY_FIELD from '@salesforce/schema/Questionnaire_Returned__c.Answered_By__c';

const FIELDS = [
    'Questionnaire_Returned__c.Name',
    'Questionnaire_Returned__c.Questionnaire__c',
    'Questionnaire_Returned__c.Submitted__c',
    'Questionnaire_Returned__c.Terms_and_Conditions__c',
    'Questionnaire_Returned__c.Answered_By__c',
];

export default class QuestionnaireLwc extends LightningElement {

    @api selectedQuestionnaireId;
    @api selectedQuestionnaireObj;

    @track questionnaireReturnedReady = false;

    @track questionnaireReturnedId;
    @track questionnaireReturned;

    @track termsConditions = false;
    @track questionnaireSubmitted = false;
    answeredBy = Id;

    @track questionnaireName;
    @track questionnaireQuestions = [];

    @track callbackEvent;

    createreturnrec(event) {
        this.termsConditions = false;
        console.log('PARENT FUNCTION');
//        console.log(event.questionId);
//        this.selectedQuestionnaireId = event.questionId;
//        console.log('selectedEvent: ' + JSON.stringify(event));
//        this.callbackEvent = event;
        this.createQuestionnaireReturn();
    }


    connectedCallback() {
        console.log('connectedCallback in Return');
        console.log(JSON.stringify(this.selectedQuestionnaireObj));
        if(this.selectedQuestionnaireObj) {
            this.questionnaireReturnedId = this.selectedQuestionnaireObj.questionnaireReturnedId;
            this.questionnaireName = this.selectedQuestionnaireObj.questionnaireName;   
            this.questionnaireQuestions =  this.selectedQuestionnaireObj.questionAnswerList;
        }
    }

    @wire(getRecord, { recordId: '$questionnaireReturnedId', fields: FIELDS })
    questionnaireRecord(result) {
        if (result.data) {
/*
            console.log('===================');
            console.log(JSON.stringify(this.selectedQuestionnaireObj));
            console.log('===================');
            console.log(JSON.stringify(result.data));
            console.log('SUCCESS');
*/
            this.questionnaireReturned = result.data;
            this.termsConditions = this.questionnaireReturned.fields.Terms_and_Conditions__c.value;
            this.questionnaireSubmitted = this.questionnaireReturned.fields.Submitted__c.value;
            this.error = undefined;
            this.questionnaireReturnedReady = true;
        } else if (!this.questionnaireReturnedId) {
            console.log('===================');
            console.log('No ID Loop');
            console.log('===================');

            this.questionnaireReturnedReady = true;
        } else if (result.error) {
            console.log('ERROR');
            this.error = result.error;
            this.questionnaireReturned = undefined;
        }
    }


    handleChangeTermsConditions(event) {
        console.log(event.target.checked);
        this.termsConditions = event.target.checked;
        if(this.questionnaireReturnedId) {
            this.updateQuestionnaireReturn();
        } else {
            this.createQuestionnaireReturn();
        }
    }

    createQuestionnaireReturn() {
        const fields = {};
        console.log(this.termsConditions);
        console.log(this.selectedQuestionnaireId);
        fields[QUESTIONNAIRE_FIELD.fieldApiName] = this.selectedQuestionnaireId;
        fields[TANDC_FIELD.fieldApiName] = this.termsConditions;
        fields[SUBMITTED_FIELD.fieldApiName] = this.questionnaireSubmitted;
        fields[ANSWERED_BY_FIELD.fieldApiName] = this.answeredBy;

        const recordInput = { apiName: QUESTIONNAIRE_RETURNED_OBJECT.objectApiName, fields };
        createRecord(recordInput)
            .then(questionnaireReturned => {
                console.log('QUESTIONNAIRE RETURN RECORD CREATED');
                // this.selectedQuestionnaireObj.questionnaireReturnedId = questionnaireReturned.id;
                this.questionnaireReturnedId = questionnaireReturned.id;
                console.log('QUESTIONNAIRE RETURN RECORD CREATED 1');
                this.questionnaireReturned = questionnaireReturned;
                console.log(JSON.stringify(this.questionnaireQuestions));
//                this.questionnaireQuestions =  this.selectedQuestionnaireObj.questionAnswerList;
//                this.questionnaireQuestions.questionnaireReturnedId = questionnaireReturned.id;
//                console.log('this.questionnaireQuestions.questionnaireReturnedId: ' + this.questionnaireQuestions.questionnaireReturnedId);

              // LAST PIECE TO EXPLAIN - Updating the initial JSON
               // Creates the event with the new questionnaire Return ID
               // sending an update event to the parent questionnaireList component
               console.log('QUESTIONNAIRE RETURN RECORD CREATED 2');
               console.log('Creating Return ==> updating list');
               console.log('this.questionnaireReturnedId: ' +  this.questionnaireReturnedId);
               const updateEvent = new CustomEvent('updatequestionnaire', { 
                detail: {
                    operation: 'New Return',
                    newQuestionnaireReturnID: this.questionnaireReturnedId,
                   },
                 bubbles: true                   
               });        
               // Dispatches the event.
               this.dispatchEvent(updateEvent);    

//                console.log(JSON.stringify(questionnaireReturned));
//                console.log('this.questionnaireReturnedId: ' + this.questionnaireReturnedId);
                // Toast
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Questionnaire saved',
                        variant: 'success',
                    }),
                );
            })
            .catch(error => {
                console.log(JSON.stringify(error));
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
            });
    }

    updateQuestionnaireReturn() {
        let record = {
            fields: {
                Id: this.questionnaireReturnedId,
                Questionnaire__c: this.selectedQuestionnaireId,
                Terms_and_Conditions__c:this.termsConditions,
                Submitted__c:this.questionnaireSubmitted,
                Answered_By__c:this.answeredBy,
            },
        };
        updateRecord(record)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Questionnaire Updated',
                        variant: 'success',
                    }),
                );
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error updating record',
                        message: error.message.body,
                        variant: 'error',
                    }),
                );
            });
    }

/*
    handleUpdateQuestionnaire(event) {
        console.log('===> handleUpdateQuestionnaire in lwc');

        console.log(JSON.stringify(event.detail));
        console.log('operation: ' + event.detail.operation);
        if(event.detail.operation === 'New Answer') {
            console.log('New Answer LOOP');
            console.log('questionID: ' + event.detail.questionID);
            console.log('newQuestionnaireAnswerID: ' + event.detail.newQuestionnaireAnswerID);
        }

        // this.handleUpdateQuestionnaireList();

    }

    handleUpdateQuestionnaireList() {

               // LAST PIECE TO EXPLAIN - Updating the initial JSON
               // Creates the event with the new questionnaire Return ID
               // sending an update event to the parent questionnaireList component
               const updateEvent = new CustomEvent('updatequestionnairelist', { 
                Message : 'update list',
                bubbles: true
             });        
             // Dispatches the event.
             this.dispatchEvent(updateEvent);           
    }
*/
    json = {
        "Title": "UAT Evaluation",
        "questions": [
            {
            "name": "QUEST-0001",
            "question__c": "1. I didn't experience issues in my database related to the performance of software, hardware or network.",
            "help_text__c": "This question relates to the main database as well as the CMS connector.",
            "options": "AgreeValues",
            "comment_available__c": "Yes"
            },
            {
            "name": "QUEST-0001",
            "question__c": "2. The combination of the UPK \"Try It\" mode and the business processes will be sufficient documentation for me to perform my day to day activities after the upgrade is complete",
            "help_text__c": "This question relates to the main database as well as the CMS connector.",
            "options": "AgreeValues",
            "comment_available__c": "Yes"
            },
            {
            "name": "QUEST-0001",
            "question__c": "3. The tests conducted during UAT and in homework were representative of the major business processes my institution will perform on a recurring basis.",
            "help_text__c": "This question relates to the main database as well as the CMS connector.",
            "options": "AgreeValues",
            "comment_available__c": "Yes"
            },
            {
            "name": "QUEST-0001",
            "question__c": "4. I didn't experience issues in my database related to the performance of software, hardware or network.",
            "help_text__c": "This question relates to the main database as well as the CMS connector.",
            "options": "AgreeValues",
            "comment_available__c": "Yes"
            },
            {
            "name": "QUEST-0001",
            "question__c": "5. I didn't experience issues in my database related to the performance of software, hardware or network.",
            "help_text__c": "This question relates to the main database as well as the CMS connector.",
            "options": "AgreeValues",
            "comment_available__c": "Yes"
            },
            {
            "name": "QUEST-0001",
            "question__c": "6. I didn't experience issues in my database related to the performance of software, hardware or network.",
            "help_text__c": "This question relates to the main database as well as the CMS connector.",
            "options": "AgreeValues",
            "comment_available__c": "Yes"
            }
        ]
        };


    get options() {
        return [
            { label: 'Strongly Disagree', value: 'Strongly Disagree' },
            { label: 'Disagree', value: 'Disagree' },
            { label: 'No Opinion', value: 'No Opinion' },
            { label: 'Agree', value: 'Agree' },
            { label: 'Strongly Agree', value: 'Strongly Agree' }
        ];
    }

    closeQuestionnaire() {
        this.dispatchEvent(new CustomEvent('close'));
    }

}