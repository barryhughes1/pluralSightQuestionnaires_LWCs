({
	doInit : function(component, event, helper) {
		helper.initCardTheme(component);
	},    
    // Handle Questionnaire (Data Service) function
    handleQuestionnaireRecord_LDS : function(component, event, helper) {
        var eventParams = event.getParams();
        if(eventParams.changeType === "LOADED") {
            // record is loaded (render other component which needs record data value)
            console.log("Record is loaded successfully.");
        } else if(eventParams.changeType === "CHANGED") {
            // record is changed
        } else if(eventParams.changeType === "REMOVED") {
            // record is deleted
        } else if(eventParams.changeType === "ERROR") {
            // there’s an error while loading, saving, or deleting the record
            console.log("Questionnaire Record is loaded unsuccessfully. Error: " + JSON.stringify(eventParams.error));
        }
    },
	openQuestionnaire : function(component, event, helper) {
		var questionnaireObj = component.get("v.QuestionnaireObj");
		component.set("v.selectedQuestionnaireObj",questionnaireObj);
	}
})