({
	doInit : function(component, event, helper) {
		component.set("v.pageTitle", "Questionnaires");
		helper.getQuestionnaireRecords(component);        
	},
    openQuestionnaire : function(component, event, helper) {
       component.set("v.selectedQuestionnaireID","Open");
    }
})