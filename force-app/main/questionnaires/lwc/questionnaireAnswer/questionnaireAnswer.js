import { LightningElement, track, api, wire } from 'lwc';
import { getRecord, createRecord, updateRecord } from 'lightning/uiRecordApi';
import Id from '@salesforce/user/Id';
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

   @api question;
   @api questionId;

   @track Questionnaire_Question__c;
   @track QuestionText;
   

   @wire(getRecord, { recordId: '$questionId', fields: QUESTION_FIELDS })
   questionnaireQuestion(result) {
       if (result.data) {
           console.log('===================');
           console.log('SUCCESS ==> QUESTION');
           console.log('===================');
           console.log(JSON.stringify(result.data));

           this.Questionnaire_Question__c = result.data;
            this.QuestionText = this.Questionnaire_Question__c.fields.Name.value;

       } else if (!this.questionId) {
           console.log('===================');
           console.log('No ID Loop');
           console.log('===================');

//           this.questionnaireReturnedReady = true;

       } else if (result.error) {
           console.log('ERROR');
           this.error = result.error;
//           this.questionnaireReturned = undefined;
       }
   }

   @track questionAnswerId;
   @track Questionnaire_Answer__c;
   @track QuestionnaireReturnedId;
   @track QuestionnaireQuestionId;
   @track value = '';
   @track comments;


   @wire(getRecord, { recordId: '$questionAnswerId', fields: ANSWER_FIELDS })
   questionnaireAnswer(result) {
       if (result.data) {
           console.log('===================');
           console.log('SUCCESS ==> ANSWER');
           console.log('===================');
           console.log(JSON.stringify(result.data));
           this.Questionnaire_Answer__c = result.data;
           this.QuestionnaireReturnedId = this.Questionnaire_Answer__c.fields.Questionnaire_Returned__c.value;
           this.QuestionnaireQuestionId = this.Questionnaire_Answer__c.fields.QuestionnaireQuestion__c.value;
           this.value = this.Questionnaire_Answer__c.fields.Agree_with_Question__c.value;
           console.log(this.value);
           this.comments = this.Questionnaire_Answer__c.fields.Comments__c.value;
/*

           'Questionnaire_Answer__c.Questionnaire_Returned__c',
           'Questionnaire_Answer__c.QuestionnaireQuestion__c',
           'Questionnaire_Answer__c.Agree_with_Question__c',
           'Questionnaire_Answer__c.Comments__c',
*/

            /*
//            console.log('SUCCESS 2');
//            console.log(JSON.stringify(this.questionnaireReturned.fields));
//            this.questionnaireReturnedId = this.questionnaireReturned.fields.Id.value;
           this.termsConditions = this.questionnaireReturned.fields.Terms_and_Conditions__c.value;
//            console.log('this.termsConditions: ' + this.termsConditions);
//            console.log('SUCCESS 3');
           this.questionnaireSubmitted = this.questionnaireReturned.fields.Submitted__c.value;
           console.log('SUCCESS 4');
           this.error = undefined;
           console.log('SUCCESS 5');
           this.questionnaireReturnedReady = true;
           console.log('SUCCESS 6');
       } else if (!this.questionnaireReturnedId) {
           console.log('===================');
           console.log('No ID Loop');
           console.log('===================');

           this.questionnaireReturnedReady = true;
*/
       } else if (result.error) {
           console.log('ERROR');
//           this.error = result.error;
//           this.questionnaireReturned = undefined;
       }
   }


   connectedCallback() {
      console.log('connectedCallback');
      console.log(JSON.stringify(this.question));
      if(this.question.answerID) {
         this.questionAnswerId = this.question.answerID;
      }      
/*
      if(this.selectedQuestionnaireObj) {
          this.questionnaireReturnedId = this.selectedQuestionnaireObj.questionnaireReturnedId;
          this.questionnaireName = this.selectedQuestionnaireObj.questionnaireName;   
          this.questionnaireQuestions =  this.selectedQuestionnaireObj.questionAnswerList;
      */
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