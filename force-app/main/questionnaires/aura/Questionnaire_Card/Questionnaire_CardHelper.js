({
	initCardTheme : function(component) {
		var questionnaireObj = component.get("v.QuestionnaireObj");
		var cardTheme = "slds-theme_inverse";
		if(questionnaireObj.questionnaireStatus === "In Progress") {
		    cardTheme = "slds-theme_warning";
		} else if(questionnaireObj.questionnaireStatus === "Submitted") {
		    cardTheme = "slds-theme_success";
		}
		component.set("v.cardTheme", cardTheme);
	}
})