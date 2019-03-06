public with sharing class Questionnaire_Controller {

	@AuraEnabled(cacheable=true)
	public static List<UserQuestionnaireObject> getQuestionnaires() {

		// Object being returned
		List<UserQuestionnaireObject> result = new List<UserQuestionnaireObject>();


	/*
		Object of the class is to return a list of Questionnaire record IDs
		along with records associated the questionnaire for the lgged in user
			- Return Record ID
			- Status (If the user has submitted the Return record or just created one)
			- List of all Questions for the Questionnaire
			  to be added to a map so that each question corresponds
			  to an answer (if one has been added by the user)
	*/

		// Need a Map of Questionnaire Returns Submitted by the 
		// logged in user - along with Answer records
		Map<ID, List<Questionnaire_Answer__c>> submittedQuestionsMap = new Map<ID, List<Questionnaire_Answer__c>>();
		// Map of Questionnaire ID along with associated Questionnaire Return (if exists)
		Map<ID,ID> submittedQuestionnaireMap = new Map<ID,ID>();

		// Need a Map of Questionnaire Returns 'In Progress' by the 
		// logged in user - along with Answer records
		Map<ID, List<Questionnaire_Answer__c>> inProgressQuestionsMap = new Map<ID, List<Questionnaire_Answer__c>>();
		// Map of Questionnaire ID along with associated Questionnaire Return (if exists)
		Map<ID,ID> inProgressQuestionnaireMap = new Map<ID,ID>();

		// Now get the Questionnaire Returned records for the current user
		// along with child answers
		for(Questionnaire_Returned__c qr : [SELECT ID, Questionnaire__c, Submitted__c, 
										    (SELECT ID, QuestionnaireQuestion__c FROM Questionnaire_Answers__r) 
											FROM Questionnaire_Returned__c 
											WHERE Answered_By__c = :UserInfo.getUserId()]) {
			// If submitted - populate the submittedQuestionnaireMap
			if(qr.Submitted__c) {
				// Return record has been submitted

				// Map the Questionnaire ID with the Return Record ID
				submittedQuestionnaireMap.put(qr.Questionnaire__c,qr.id);

				// Map the Return ID with its answer records
				submittedQuestionsMap.put(qr.id, qr.Questionnaire_Answers__r);
			} else {
				// Return record has not been submitted (but does exist)
				// so must be In Progress 

				// Map the Questionnaire ID with the Return Record ID
				inProgressQuestionnaireMap.put(qr.Questionnaire__c,qr.id);

				// Map the Return ID with its answer records
				inProgressQuestionsMap.put(qr.id, qr.Questionnaire_Answers__r);
			}

		}

		// Now get list of Questionnaire records along with associated questions
		List<Questionnaire__c> questionnairesList = [SELECT Id, Name, (SELECT ID FROM Questions__r ORDER BY QuestionNumber__c ASC) FROM Questionnaire__c ORDER BY CreatedDate DESC];

		// Map to be used to compile collection of Questions qith corresponding answers
		// as per complex object subclass
		Map<String,String> questionAnswerMap = new Map<String,String>();

		// Loop over all questionnaires - 
		// for each questionnaire we must have a UserQUestionnaireObject
		// being returned to the comonent
		for(Questionnaire__c q : questionnairesList) {

			UserQuestionnaireObject unit = new UserQuestionnaireObject();
			
			// We know the Questionnaire record ID
			unit.questionnaireId = q.id; 

			// We know the Questionnaire record ID
			unit.questionnaireName = q.Name; 

			// initialize the questions and answers list
			unit.questionAnswerList = new List<UserQuestionAnswerObject>();

			// clear process-specific map
			questionAnswerMap.clear();

			// STEP 1
			// Does the current Questionnaire have a submitted Return
			// (can be found in the submittedQuestionnaireMap) 
			// (ie) a Return exists along with answers (maybe)
			if(submittedQuestionnaireMap.containsKey(q.id)) {

				// QUestionnaire Return ID
				unit.questionnaireReturnedId = submittedQuestionnaireMap.get(q.id);

				// Questionnaire Status is 'Submitted'
				unit.questionnaireStatus = 'Submitted';

				// Error handling containskey
				if(submittedQuestionsMap.containskey(unit.questionnaireReturnedId)) {
					System.debug('SUBMITTED LOOP');
					// Loop over answers and associate it's ID with a Question ID
					for(Questionnaire_Answer__c ans : submittedQuestionsMap.get(unit.questionnaireReturnedId)) {
						for(Questionnaire_Question__c qqc : q.Questions__r) {
							if(qqc.id == ans.QuestionnaireQuestion__c) {
								// The Question has an Answer!!
								questionAnswerMap.put(qqc.id,ans.id);
							}							
						}
					}
					// Now pick out the questions with no corresponding answer
					for(Questionnaire_Question__c qqc : q.Questions__r) {
						if(!questionAnswerMap.containskey(qqc.id)) {
							// The Question does NOT have an Answer!!
							questionAnswerMap.put(qqc.id,null);
						}
					}

				}
			}
			// STEP 2
			// Does the current Questionnaire have a Return that is NOT Submitted
			// (can be found in the inProgressQuestionnaireMap) 
			// (ie) a Return exists along with answers (maybe)
			else if(inProgressQuestionnaireMap.containsKey(q.id)) {

				// QUestionnaire Return ID
				unit.questionnaireReturnedId = inProgressQuestionnaireMap.get(q.id);

				// QUestionnaire Status is 'In Progress'
				unit.questionnaireStatus = 'In Progress';

				// Error handling containskey
				if(inProgressQuestionsMap.containskey(unit.questionnaireReturnedId)) {
					System.debug('IN PROGESS LOOP');
					// Loop over answers and associate it's ID with a Question ID
					for(Questionnaire_Answer__c ans : inProgressQuestionsMap.get(unit.questionnaireReturnedId)) {
						for(Questionnaire_Question__c qqc : q.Questions__r) {
							if(qqc.id == ans.QuestionnaireQuestion__c) {
								// The Question has an Answer!!
								questionAnswerMap.put(qqc.id,ans.id);
							}							
						}
					}
					// Now pick out the questions with no corresponding answer
					for(Questionnaire_Question__c qqc : q.Questions__r) {
						if(!questionAnswerMap.containskey(qqc.id)) {
							// The Question does NOT have an Answer!!
							questionAnswerMap.put(qqc.id,null);
						}
					}
				}
			}
			// STEP 3
			// The current Questionnaire does not have a Return
			else {
				System.debug('Not Started LOOP!!');

				// No Questionnaire Return ID
				unit.questionnaireReturnedId = '';

				// Questionnaire Status is 'Not Started'
				unit.questionnaireStatus = 'Not Started';

				// Now pick out all questions ==> no corresponding answer
				for(Questionnaire_Question__c qq : q.Questions__r) {
					// The Question does NOT have an Answer!!
					questionAnswerMap.put(qq.id,null);
				}
			}

			// Now build up the collection of Question IDs
			// matched with Answer record IDs
			for(String questionID : questionAnswerMap.keySet()) {
				UserQuestionAnswerObject ua = new UserQuestionAnswerObject();
				ua.questionID = questionID;
				ua.answerID = questionAnswerMap.get(questionID);
				unit.questionAnswerList.add(ua);
			}
			result.add(unit);
		}
		return result;
	}	


	public class UserQuestionnaireObject {

		// ID of Questionnaire Record
		@AuraEnabled
		public ID questionnaireId { get; set; }		

		// ID of Questionnaire Record
		@AuraEnabled
		public String questionnaireName { get; set; }

		// Status of QUestionnaire for logged in user
		@AuraEnabled
		public String questionnaireStatus { get; set; }		

		// ID or Return Record for logged in User
		// (which may not exist)
		@AuraEnabled
		public String questionnaireReturnedId { get; set; }		

		// Map of Question record IDs and 
		// corresponding Answer record IDs (if one exists)
		@AuraEnabled
		public List<UserQuestionAnswerObject> questionAnswerList { get; set; }	

	}

	// sub class to manage a Question record ID
	// with a corresponding Answer record ID
	public class UserQuestionAnswerObject {

		@AuraEnabled
		public String questionID { get; set; }		

		@AuraEnabled
		public String answerID { get; set; }		

	}
    
    // Method used to create a new empty QUestionnaire_Returned__c' 
	// record for a given Questionnaire record ID
	@AuraEnabled
	public static ID createQuestionnaireReturned(ID QuestionnaireID) {
		Questionnaire_Returned__c ret = new Questionnaire_Returned__c();
		ret.Answered_By__c = UserInfo.getUserId();
		ret.Questionnaire__c = QuestionnaireID;
		ret.Submitted__c = false;
		ret.Terms_and_Conditions__c = false;
		insert ret;
		return ret.id;
	}
}