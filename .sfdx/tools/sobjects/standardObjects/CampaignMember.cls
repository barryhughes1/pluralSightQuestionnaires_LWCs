// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class CampaignMember {
    global Campaign Campaign;
    global Id CampaignId;
    global String City;
    global String CompanyOrAccount;
    global Contact Contact;
    global Id ContactId;
    global String Country;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global String Description;
    global Boolean DoNotCall;
    global String Email;
    global String Fax;
    global String FirstName;
    global Date FirstRespondedDate;
    global Boolean HasOptedOutOfEmail;
    global Boolean HasOptedOutOfFax;
    global Boolean HasResponded;
    global Id Id;
    global Boolean IsDeleted;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global String LastName;
    global Lead Lead;
    global Id LeadId;
    global SObject LeadOrContact;
    global Id LeadOrContactId;
    global SObject LeadOrContactOwner;
    global Id LeadOrContactOwnerId;
    global String LeadSource;
    global List<ListEmailIndividualRecipient> ListEmailIndividualRecipients;
    global String MobilePhone;
    global String Name;
    global String Phone;
    global String PostalCode;
    global List<FlowRecordRelation> RelatedRecord;
    global String Salutation;
    global String State;
    global String Status;
    global String Street;
    global Datetime SystemModstamp;
    global String Title;
    global String Type;

    global CampaignMember () 
    {
    }
}