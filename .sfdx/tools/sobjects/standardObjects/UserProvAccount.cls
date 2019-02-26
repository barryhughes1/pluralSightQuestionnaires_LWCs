// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class UserProvAccount {
    global ConnectedApplication ConnectedApp;
    global Id ConnectedAppId;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global Datetime DeletedDate;
    global String ExternalEmail;
    global String ExternalFirstName;
    global String ExternalLastName;
    global String ExternalUserId;
    global String ExternalUsername;
    global Id Id;
    global Boolean IsDeleted;
    global Boolean IsKnownLink;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global String LinkState;
    global String Name;
    global List<FlowRecordRelation> RelatedRecord;
    global User SalesforceUser;
    global Id SalesforceUserId;
    global String Status;
    global Datetime SystemModstamp;
    global List<UserProvisioningRequest> UserProvAccount;

    global UserProvAccount () 
    {
    }
}