({
/*
    initReturnRecord: function(component, helper) {
        // Prepare a new record from template
        component.find("questionnaireReturnedRecordLoader").getNewRecord(
            "Questionnaire_Returned__c", // sObject type (objectApiName)
            null,      // recordTypeId
            false,     // skip cache?
            $A.getCallback(function() {
                var rec = component.get("v.questionnaireReturned");
                var error = component.get("v.questionnaireReturnedRecordError");
                if(error || (rec === null)) {
                    console.log("Error initializing record template: " + error);
                    return;
                }
                console.log("Record template initialized: " + rec.sobjectType);
            })
        );
    }, 
    */
    handleSaveReturnRecord: function(component,helper) {
        component.find("questionnaireReturnedRecordLoader").saveRecord($A.getCallback(function(saveResult) {
            // NOTE: If you want a specific behavior(an action or UI behavior) when this action is successful 
            // then handle that in a callback (generic logic when record is changed should be handled in recordUpdated event handler)
            if (saveResult.state === "SUCCESS" || saveResult.state === "DRAFT") {
                // handle component related logic in event handler
                helper.showMessageAsToast("success", "Questionnaire Return Record was saved successfully.", "dismissible");
            } else if (saveResult.state === "INCOMPLETE") {
                console.log("User is offline, device doesn't support drafts.");
            } else if (saveResult.state === "ERROR") {
                console.log('Problem saving record, error: ' + JSON.stringify(saveResult.error));
                helper.showMessageAsToast("error", 'Problem saving record, error: ' + JSON.stringify(saveResult.error), "dismissible");
            } else {
                console.log('Unknown problem, state: ' + saveResult.state + ', error: ' + JSON.stringify(saveResult.error));
                helper.showMessageAsToast("error", 'Unknown problem, state: ' + saveResult.state + ', error: ' + JSON.stringify(saveResult.error), "dismissible");
            }
        }));
    }
})