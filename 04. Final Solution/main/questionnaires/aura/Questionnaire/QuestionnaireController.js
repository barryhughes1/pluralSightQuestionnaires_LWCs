({
	doInit : function(component, event, helper) {
/*
		// Detect if a Questionnaire Return has been created
		// for the user already
		// IF NOT we must initialise the return LDS component
		var returnRec = component.get("v.selectedQuestionnaireObj");
		if(returnRec) {
            alert("1");
			if(returnRec.questionnaireReturnedId === "") {
            alert("2");
				helper.initReturnRecord(component, helper);
		}}
        */
    },
	// Handle Answer (Data Service) function
	handleQuestionnaireReturnedRecord_LDS : function(component, event, helper) {
		var eventParams = event.getParams();
		var objName = "Questionnaire Returned";
		// Using general helper method from c:utilityFunctions
		helper.handle_LDS_cmp(component, helper, eventParams, objName);
	},   
    handleSaveClick : function(component, event, helper) {
        var questionnaireReturnedRec = component.get("v.questionnaireReturnedFields");
        if($A.util.isEmpty(questionnaireReturnedRec)) {
            helper.showMessageAsToast("error", "The questionnaire cannot be submitted as no questions have been answered.", "dismissible");			
        } else {
            // Get terms Checkbox
            var termsCbox = component.find("cbox");
            questionnaireReturnedRec.Terms_and_Conditions__c = termsCbox.get("v.checked");
            // Terms & Conditions must be completed before submission
            if(questionnaireReturnedRec.Terms_and_Conditions__c) {
                var selQuestionnaire = component.get("v.selectedQuestionnaireObj");
                questionnaireReturnedRec.Questionnaire__c = selQuestionnaire.questionnaireId;
                questionnaireReturnedRec.Submitted__c = true;			
                helper.handleSaveReturnRecord(component,helper);	
            } else {
                helper.showMessageAsToast("error", "Please accept Terms & Conditions in order to submit the questionnaire.", "dismissible");
            }			
        }
    },
    handleBackClick : function(component) {
        component.set("v.selectedQuestionnaireObj", "");
    }
})