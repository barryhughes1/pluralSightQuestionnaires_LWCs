({
    getQuestionnaireRecords : function(component) {
        // create a one-time use instance of the 
        // getQuestionnaires action
        // in the server-side controller
        var action = component.get("c.getQuestionnaires");
 
        // Create a callback that is executed after 
        // the server-side action returns
        action.setCallback(this, function(response) {
            var state = response.getState();
            // The action executed successfully
            if (state === "SUCCESS") {
                // Quote records have been returned (if any exist)
                // The Quotes component can be set with the Quotes returned
                var result = response.getReturnValue();
                // alert(JSON.stringify(result));
                component.set("v.questionnaires", response.getReturnValue());
                component.set("v.showMarkup", "true");
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