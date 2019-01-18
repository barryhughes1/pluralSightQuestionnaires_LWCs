({
	initAnswerRecord: function(component, helper) {
        // Prepare a new record from template
        component.find("answerRecordLoader").getNewRecord(
            "Questionnaire_Answer__c", // sObject type (objectApiName)
            null,      // recordTypeId
            false,     // skip cache?
            $A.getCallback(function() {
                var rec = component.get("v.answer");
                var error = component.get("v.answerRecordError");
                if(error || (rec === null)) {
                    console.log("Error initializing record template: " + error);
                    return;
                }
                console.log("Record template initialized: " + rec.sobjectType);
            })
        );
    },    
    handleSaveAnswerRecord: function(component, helper) {

        var answerRec = component.get("v.answerFields"); 

        // Developer Note on weird behaviour found with radio buttons
        // It seems that when changing the value of the radio button group
        // LDS is interpreting the new value as an array (??)
        // which means the save of the record will fail
        // So, I am reverting it to  string here
        var jsonAgree = JSON.stringify(answerRec.Agree_with_Question__c);
        if(jsonAgree.substring(0,1) == "[")
            answerRec.Agree_with_Question__c = answerRec.Agree_with_Question__c[0];            

        // Now for the rest of the fields - re-affirming lookup field values.        
        var questionRec = component.get("v.questionObj");
        answerRec.QuestionnaireQuestion__c = questionRec.questionID;
        answerRec.Questionnaire_Returned__c = component.get("v.returnId");

        // Call the saveRecord method available in the force:recordData base component.
        component.find("answerRecordLoader").saveRecord($A.getCallback(function(saveResult) {
            // NOTE: If you want a specific behavior(an action or UI behavior) when this action is successful 
            // then handle that in a callback (generic logic when record is changed should be handled in recordUpdated event handler)
            if (saveResult.state === "SUCCESS" || saveResult.state === "DRAFT") {
                // handle component related logic in event handler
                console.log('save successful');
                console.log(JSON.stringify(saveResult));
                var questionObj = component.get("v.questionObj");
                console.log('==> ' + questionObj.answerID);
                // When creating a new Answer record, (the
                // questionObj.answerID will be undefined),
                // we must set the ID to the saveResult's recordId
                // so that the 'recordUpdated' handler function
                // will fire.
                if(!questionObj.answerID) {
                    questionObj.answerID = saveResult.recordId;
                    console.log('==> ' + questionObj.answerID);
                    // The 'recordUpdated' function is not going to fire here
                    // so we must do a toast now (other toasts are in the handler)
                    helper.showMessageAsToast("success", "The Answer was successfully saved.", "dismissible");    
                }
            } else if (saveResult.state === "INCOMPLETE") {
                console.log("User is offline, device doesn't support drafts.");
            } else if (saveResult.state === "ERROR") {
                console.log('Problem saving record, error: ' + JSON.stringify(saveResult.error));
                helper.showMessageAsToast("error", 'Problem saving record, error: ' + JSON.stringify(saveResult.error), "dismissible");
            } else {
                console.log('Unknown problem, state: ' + saveResult.state + ', error: ' + JSON.stringify(saveResult.error));
//                alert('Unknown problem, state: ' + saveResult.state + ', error: ' + JSON.stringify(saveResult.error));
                helper.showMessageAsToast("error", 'Unknown problem, state: ' + saveResult.state + ', error: ' + JSON.stringify(saveResult.error), "dismissible");
            }
        }));
    },
	createQuestionnaireReturned : function(component, helper) {
        // create a one-time use instance of the 
        // getQuestionnaires action
        // in the server-side controller
        var action = component.get("c.createQuestionnaireReturned");
 
 		action.setParams({ QuestionnaireID : component.get("v.questionnaireID") });

        // Create a callback that is executed after 
        // the server-side action returns
        action.setCallback(this, function(response) {
            var state = response.getState();
            // The action executed successfully
            if (state === "SUCCESS") {
                // The apex method successfully created 
                // a Questionnaire_Returned__c record, so
                // we can set the returnID attribute
                // and call the handleSaveAnswerRecord function
                var result = response.getReturnValue();
				component.set("v.returnId", result);
                helper.handleSaveAnswerRecord(component, helper);
            }
            else if (state === "NEW") {
                // The action was created but is not in progress yet
            }            
            else if (state === "RUNNING") {
                // The action is in progress
            }            
            else if (state === "ABORTED") {
                // The action was aborted
            }            
            else if (state === "INCOMPLETE") {
                // The server didn't return a response. 
                // The server might be down or the client might be offline. 
                // The framework guarantees that an action's callback is always invoked as 
                // long as the component is valid. If the socket to the server is never 
                // successfully opened, or closes abruptly, or any other network 
                // error occurs, the XHR resolves and the callback is invoked 
                // with state equal to INCOMPLETE.
            }
            else if (state === "ERROR") {
                // The server returned an error
                // generic error handler
                var errors = response.getError();
                if (errors) {
                    $A.log("Errors", errors);
                    if (errors[0] && errors[0].message) {
                        throw new Error("Error: " + errors[0].message);
                    }
                } else {
                    throw new Error("Unknown Error");
                }
            }
        });
 
        // A client-side action could cause multiple events, 
        // which could trigger other events and 
        // other server-side action calls.
        // $A.enqueueAction adds the server-side action to the queue.
        $A.enqueueAction(action);
    }    
})