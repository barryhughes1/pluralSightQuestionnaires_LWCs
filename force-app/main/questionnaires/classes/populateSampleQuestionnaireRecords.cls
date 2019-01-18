public class populateSampleQuestionnaireRecords {
	public static void initData() {

		// SELECT Id, Description__c, Name, (SELECT QuestionNumber__c, Questionnaire__c, Name, Id FROM Questions__r) FROM Questionnaire__c

		Questionnaire__c q1 = new Questionnaire__c(
			Name = 'October Experience Feedback',
			Description__c = 'Please give feedback on the Company Night held on October 31st - was it spooky enough for you?'
		);

		insert q1;

		List<Questionnaire_Question__c> questions = new List<Questionnaire_Question__c>();

		questions.add(
			new Questionnaire_Question__c(
				Questionnaire__c = q1.id,
				QuestionNumber__c = 4,
				Name = 'The entertainment was a good choice'
			)
		);


		questions.add(
			new Questionnaire_Question__c(
				Questionnaire__c = q1.id,
				QuestionNumber__c = 3,
				Name = 'The food and drink was very good'
			)
		);

		questions.add(
			new Questionnaire_Question__c(
				Questionnaire__c = q1.id,
				QuestionNumber__c = 2,
				Name = 'I was able to find an appropriate costume'
			)
		);

		questions.add(
			new Questionnaire_Question__c(
				Questionnaire__c = q1.id,
				QuestionNumber__c = 5,
				Name = 'I look forward to next years party'
			)
		);


		questions.add(
			new Questionnaire_Question__c(
				Questionnaire__c = q1.id,
				QuestionNumber__c = 1,
				Name = 'The Decorations scared me.'
			)
		);


		Questionnaire__c q2 = new Questionnaire__c(
			Name = 'Salesforce Course Questionnaire',
			Description__c = 'Your feedback is very much appreciated'
		);

		insert q2;


		questions.add(
			new Questionnaire_Question__c(
				Questionnaire__c = q2.id,
				QuestionNumber__c = 1,
				Name = 'The facilitator was knowledgable.'
			)
		);

		questions.add(
			new Questionnaire_Question__c(
				Questionnaire__c = q2.id,
				QuestionNumber__c = 1,
				Name = 'The course material was of interest to me.'
			)
		);

		questions.add(
			new Questionnaire_Question__c(
				Questionnaire__c = q2.id,
				QuestionNumber__c = 1,
				Name = 'The Course will be useful in my day-to-day tasks.'
			)
		);


		questions.add(
			new Questionnaire_Question__c(
				Questionnaire__c = q2.id,
				QuestionNumber__c = 1,
				Name = 'The course material was engaging.'
			)
		);




		Questionnaire__c q3 = new Questionnaire__c(
			Name = 'General Feedback Survey',
			Description__c = 'General Survey'
		);

		insert q3;


		questions.add(
			new Questionnaire_Question__c(
				Questionnaire__c = q3.id,
				QuestionNumber__c = 1,
				Name = 'The food and refreshments were excellent.'
			)
		);



		questions.add(
			new Questionnaire_Question__c(
				Questionnaire__c = q3.id,
				QuestionNumber__c = 2,
				Name = 'The directions provided for the day were helpful.'
			)
		);



		questions.add(
			new Questionnaire_Question__c(
				Questionnaire__c = q3.id,
				QuestionNumber__c = 3,
				Name = 'The location was ideal for the event.'
			)
		);

		insert questions;

		
	}
}