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

export default class questionnaireLwc extends LightningElement {

    @api selectedQuestionnaireId;
    @api selectedQuestionnaireObj;

    @track questionnaireReturnedId;
    @track questionnaireReturned;
    @track questionnaireName;
    @track questionnaireQuestions = [];

    // Function called when rendering is complete
    connectedCallback() {
        console.log('connectedCallback in c-questionnaire-lwc');
        if(this.selectedQuestionnaireObj) {
            this.questionnaireReturnedId = this.selectedQuestionnaireObj.questionnaireReturnedId;
            this.questionnaireName = this.selectedQuestionnaireObj.questionnaireName;   
            this.questionnaireQuestions =  this.selectedQuestionnaireObj.questionAnswerList;
        }
    }

    // Close Questionnaire button function
    closeQuestionnaire() {
        this.dispatchEvent(new CustomEvent('close'));
    }


    // Terms and Conditions Checkbox value and binding function
    // when selected the Questionnaire Return record should be inserted
    @track termsConditions = false;
    handleChangeTermsConditions(event) {
        this.termsConditions = event.target.checked;
        console.log('handleChangeTermsConditions');
        if(!this.questionnaireReturnedId) {
            console.log('calling createQuestionnaireReturn');
            this.createQuestionnaireReturn();
        } else {
            console.log('calling updateQuestionnaireReturn');
            this.updateQuestionnaireReturn();
        }
    }    

    @track questionnaireSubmitted = false;

    // function to create Questionnaire Return
    createQuestionnaireReturn() {
        const fields = {};
        if(!this.termsConditions) this.termsConditions = false;
        fields[QUESTIONNAIRE_FIELD.fieldApiName] = this.selectedQuestionnaireId;
        fields[TANDC_FIELD.fieldApiName] = this.termsConditions;
        fields[SUBMITTED_FIELD.fieldApiName] = this.questionnaireSubmitted;
        fields[ANSWERED_BY_FIELD.fieldApiName] = Id;  // from import

        const recordInput = { apiName: QUESTIONNAIRE_RETURNED_OBJECT.objectApiName, fields };
        createRecord(recordInput)
            .then(questionnaireReturned => {
                console.log('QUESTIONNAIRE RETURN RECORD CREATED');

                // The following line is a bad idea - selectedQuestionnaireObj controlled by parent.
                // this.selectedQuestionnaireObj.questionnaireReturnedId = questionnaireReturned.id;

                this.questionnaireReturnedId = questionnaireReturned.id;
                this.questionnaireReturned = questionnaireReturned;
  
               // sending an update event to the parent questionnaireList component
               const updateEvent = new CustomEvent('updatequestionnairelist', { 
                detail: {
                    operation: 'New Return',
                    newQuestionnaireReturnID: this.questionnaireReturnedId,
                   },
                 bubbles: true                   
               });        
               // Dispatches the event.
               this.dispatchEvent(updateEvent);    
              

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
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
            });
    }

    @wire(getRecord, { recordId: '$questionnaireReturnedId', fields: FIELDS })
    questionnaireRecord(result) {
        if (result.data) {
            console.log('Questionnaire Return LDS retrieved');
            this.questionnaireReturned = result.data;
            this.termsConditions = this.questionnaireReturned.fields.Terms_and_Conditions__c.value;
            this.questionnaireSubmitted = this.questionnaireReturned.fields.Submitted__c.value;
            this.error = undefined;
            this.questionnaireReturnedReady = true;
        } else if (!this.questionnaireReturnedId) {
            console.log('No Questionnaire Return ID');
            this.questionnaireReturnedReady = true;
        } else if (result.error) {
            console.log('ERROR');
            this.error = result.error;
            this.questionnaireReturned = undefined;
        }
    }

    updateQuestionnaireReturn() {
        let record = {
            fields: {
                Id: this.questionnaireReturnedId,
                Questionnaire__c: this.selectedQuestionnaireId,
                Terms_and_Conditions__c:this.termsConditions,
                Submitted__c:this.questionnaireSubmitted,
                Answered_By__c:Id,
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
    

    markQuestionnaireComplete() {
        if(!this.termsConditions) {

            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Warning',
                    message: 'You must agree to terms and conditions before submitting',
                    variant: 'warning',
                }),
            );

        } else {
            let record = {
                fields: {
                    Id: this.questionnaireReturnedId,
                    Questionnaire__c: this.selectedQuestionnaireId,
                    Terms_and_Conditions__c:this.termsConditions,
                    Submitted__c:true,
                    Answered_By__c:this.answeredBy,
                },
            };
            updateRecord(record)
                .then(() => {
    
                    const updateEvent = new CustomEvent('updatequestionnairelist', { 
                        detail: {
                            operation: 'Return Submitted',
                            newQuestionnaireReturnID: this.questionnaireReturnedId,
                        },
                        bubbles: true                   
                    });        
                    // Dispatches the event.
                    this.dispatchEvent(updateEvent);   
            
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Questionnaire Submitted',
                            variant: 'success',
                        }),
                    );
    
                    // Close the Questionnaire
                    this.closeQuestionnaire();
                })
                .catch(error => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error submitting record',
                            message: error.message.body,
                            variant: 'error',
                        }),
                    );
                });
        }
    }
}