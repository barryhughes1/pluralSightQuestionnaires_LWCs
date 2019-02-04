import { LightningElement, track, api } from 'lwc';

export default class QuestionnaireLwc extends LightningElement {


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

    @track termsConditions = false;

    handleChangeTermsConditions(event) {
        this.termsConditions = event.target.value;
    }

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
