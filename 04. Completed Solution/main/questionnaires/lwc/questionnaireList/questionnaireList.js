import { LightningElement, track, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getQuestionnaires from '@salesforce/apex/Questionnaire_Controller.getQuestionnaires';

export default class QuestionnaireList extends LightningElement {

    @track questionnaires;

    @wire(getQuestionnaires) wiredQuestionnaires(value) {
        // Hold on to the provisioned value so we can refresh it later.
        this.questionnaires = value;
    }

    pageTitle = 'Questionnaires';

    // Show Questionnaire record property and functions:
    // tracking a boolean controlling if the
    // questionnaire list is to be displayed (false)
    // or an individual questionnaire is to be displayed (true)
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

    closeQuestionnaire() {
        console.log('closeQuestionnaire called');
        // If a Return or Answer record is created we need to refresh and recall the Apex call
        if((this.operation === 'New Answer') || (this.operation === 'New Return') || (this.operation === 'Return Submitted')) {
            console.log('refreshing apex and calling again');
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

    // operation property is to indicate a record has been created
    // and the 'closeQuestionnaire' function must call the apex method
    @track operation;

    handleUpdateQuestionnaireList(event) {
        console.log('Received bubbling event');
        this.operation = event.detail.operation;
        console.log('Received bubbling event: ' + this.operation);
        // stop.propagation();
    }

    
}