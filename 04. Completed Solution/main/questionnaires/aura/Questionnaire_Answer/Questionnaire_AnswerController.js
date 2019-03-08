({
	doInit: function(component,event,helper) {
        // helper.detectUtilityBar(component);
        var obj = component.get("v.questionObj");

        // Detect if an Answer has been created for the Question
        // for the user already
        // IF NOT we must initialise the answer LDS component
        var answerRec = component.get("v.questionObj").answerID;
        if(!answerRec) {
            helper.initAnswerRecord(component, helper);
        }

    },    
	// Handle Questionnaire (Data Service) function
    handleQuestionRecord_LDS : function(component, event, helper) {
        var eventParams = event.getParams();
        var objName = "Question";
        // Helper method in the utilityFunctions component
        helper.handle_LDS_cmp(component, helper, eventParams, objName);
    },
	// Handle Answer (Data Service) function
    handleAnswerRecord_LDS : function(component, event, helper) {
        var eventParams = event.getParams();
        var objName = "Answer";
        // Using general helper method from c:utilityFunctions
        helper.handle_LDS_cmp(component, helper, eventParams, objName);        
    },
	handleAnswerChange: function (component, event, helper) {
		// Need to save a new (or update an existing)
		// answer with the selection
		// and the comments when change
        var returnRec = component.get("v.returnId");
        console.log('handleChange');
        if(!returnRec) {
            helper.createQuestionnaireReturned(component, helper);
        } else {
            helper.handleSaveAnswerRecord(component, helper);
        }
    }    
})