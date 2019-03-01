import { LightningElement, track, api, wire } from 'lwc';
import { getRecord, createRecord, updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import QUESTIONNAIRE_ANSWER_OBJECT from '@salesforce/schema/Questionnaire_Answer__c';
import QUESTIONNAIRE_RETURNED_FIELD from '@salesforce/schema/Questionnaire_Answer__c.Questionnaire_Returned__c';
import QUESTIONNAIRE_QUESTION_FIELD from '@salesforce/schema/Questionnaire_Answer__c.QuestionnaireQuestion__c';
import AGREE_WITH_QUESTION_FIELD from '@salesforce/schema/Questionnaire_Answer__c.Agree_with_Question__c';
import COMMENTS_FIELD from '@salesforce/schema/Questionnaire_Answer__c.Comments__c';

const QUESTION_FIELDS = [
   'Questionnaire_Question__c.Name',
   'Questionnaire_Question__c.QuestionNumber__c',
];

const ANSWER_FIELDS = [
   'Questionnaire_Answer__c.Name',
   'Questionnaire_Answer__c.Questionnaire_Returned__c',
   'Questionnaire_Answer__c.QuestionnaireQuestion__c',
   'Questionnaire_Answer__c.Agree_with_Question__c',
   'Questionnaire_Answer__c.Comments__c',
];

export default class QuestionnaireAnswer extends LightningElement {

   @api questionId;  // ID of the Question__c being answered
   @api question;    // JSON of the Question__c being answered
   @api returnId;    // ID of the Questionnaire Return (ie) record the user has answered

   @track Questionnaire_Question__c;
   @track QuestionText;
   @track QuestionnaireQuestionId;

   // LDS call to get the Question record
   @wire(getRecord, { recordId: '$questionId', fields: QUESTION_FIELDS })
   questionnaireQuestion(result) {
      if (result.data) {
         // Question record found from the ID
         // populating trackable variables
         this.Questionnaire_Question__c = result.data;
         this.QuestionnaireQuestionId = this.Questionnaire_Question__c.id;
         // Creating Text variable to display the text
         this.QuestionText = this.Questionnaire_Question__c.fields.Name.value;

      } else if (!this.questionId) {
         // There is no question ID ==> scenario is not expected
       } else if (result.error) {
           this.error = result.error;
       }
   }

   @track questionAnswerId;
   @track Questionnaire_Answer__c;
   @track QuestionnaireReturnedId;
   @track createAnswerRecord;
   @track answerValue;
   @track comments;
   @track error;

   // LDS call to get the Answer record - if it exists
   @wire(getRecord, { recordId: '$questionAnswerId', fields: ANSWER_FIELDS })
   questionnaireAnswer(result) {
       if (result.data) {
           this.Questionnaire_Answer__c = result.data;
           this.QuestionnaireReturnedId = this.Questionnaire_Answer__c.fields.Questionnaire_Returned__c.value;
           this.QuestionnaireQuestionId = this.Questionnaire_Answer__c.fields.QuestionnaireQuestion__c.value;
           this.answerValue = this.Questionnaire_Answer__c.fields.Agree_with_Question__c.value;
           this.comments = this.Questionnaire_Answer__c.fields.Comments__c.value;
       } else if (result.error) {
           this.error = result.error;
       }
   }


   connectedCallback() {
      console.log('c-questionnaire-answer connectedCallback');
      if(this.question.answerID) {
         this.questionAnswerId = this.question.answerID;
      }      
      this.QuestionnaireReturnedId = this.returnId;
  }

   renderedCallback() {
      console.log('ANS renderedCallback!!!');
//      console.log('this.returnId: ' + this.returnId);
      console.log('this.QuestionnaireReturnedId: ' + this.QuestionnaireReturnedId);
//      this.QuestionnaireReturnedId = this.returnId;
//      if((this.returnId) && (!this.QuestionnaireReturnedId))
      if((this.returnId) && (!this.QuestionnaireReturnedId)) {
         this.QuestionnaireReturnedId = this.returnId;
         if(this.createAnswerRecord) {
            console.log('Will now create the answer record');
            this.createAnswerRecord = false;
            this.processQuestionnaireAnswerRecord();
         }   
      }
   }


   processQuestionnaireAnswerRecord() {
      if(this.questionAnswerId) {
         this.updateQuestionnaireAnswer();
      } else {
         this.createQuestionnaireAnswer();
      }         
   }
  

  handleFieldValueChange(event) {
      this.createAnswerRecord = false;
      if (event.target.label === 'Comments') {
         this.comments = event.target.value;
      } else {
         this.answerValue = event.target.value;
      }

      // If there is no QuestionnaireReturnedId value
      // a Questionnaire Return must be created first
      // so we call a createreturn event.
      if(!this.QuestionnaireReturnedId) {
         // Prevents the anchor element from navigating to a URL.
        event.preventDefault();

        // Boolean used to create the answer once the Return record is created.
        this.createAnswerRecord = true;

        // Creates the event with the questionnaire ID data.
        // sending a selected event
        const selectedEvent = new CustomEvent('createreturn', { 
            questionId: this.questionId
         });

        // Dispatches the event.
        this.dispatchEvent(selectedEvent);


      } else {
         // Questionnaire Return record already exists
         // so the Answer record can be created or updated
         this.processQuestionnaireAnswerRecord();
      }
   }


   createQuestionnaireAnswer() {
      const fields = {};
      fields[QUESTIONNAIRE_RETURNED_FIELD.fieldApiName] = this.QuestionnaireReturnedId;
      fields[QUESTIONNAIRE_QUESTION_FIELD.fieldApiName] = this.QuestionnaireQuestionId;
      fields[AGREE_WITH_QUESTION_FIELD.fieldApiName] = this.answerValue;
      fields[COMMENTS_FIELD.fieldApiName] = this.comments;

      const recordInput = { apiName: QUESTIONNAIRE_ANSWER_OBJECT.objectApiName, fields };
      createRecord(recordInput)
            .then(QuestionnaireAns => {
                this.questionAnswerId = QuestionnaireAns.id;
                this.Questionnaire_Answer__c = QuestionnaireAns;

               // LAST PIECE TO EXPLAIN - Updating the initial JSON
               // Creates the event with the new questionnaire Return ID
               // sending an update event to the parent questionnaireList component
               console.log('Creating Answer ==> updating list');
               const updateEvent = new CustomEvent('updatequestionnaire', { 
                  detail: {
                     operation: 'New Answer',
                     questionID : this.QuestionnaireQuestionId,
                     newQuestionnaireAnswerID: this.questionAnswerId
                  },
                  bubbles: true
               });        
               // Dispatches the event.
               this.dispatchEvent(updateEvent);     

                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Answer saved',
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

    updateQuestionnaireAnswer() {
      let record = {
            fields: {
                Id: this.questionAnswerId,
                Agree_with_Question__c:this.answerValue,
                Comments__c:this.comments,
            },
        };

        updateRecord(record)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Answer Updated',
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


   get options() {
      return [
             {'label': 'Strongly Disagree', 'value': 'Strongly Disagree'},
             {'label': 'Disagree', 'value': 'Disagree'},
             {'label': 'Undecided', 'value': 'Undecided'},
             {'label': 'Agree', 'value': 'Agree'},
             {'label': 'Strongly Agree', 'value': 'Strongly Agree'}
      ];
   }
}