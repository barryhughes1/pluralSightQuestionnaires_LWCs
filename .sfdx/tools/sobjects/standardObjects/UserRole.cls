// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class UserRole {
    global String CaseAccessForAccountOwner;
    global String ContactAccessForAccountOwner;
    global String DeveloperName;
    global User ForecastUser;
    global Id ForecastUserId;
    global Id Id;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global Boolean MayForecastManagerShare;
    global String Name;
    global String OpportunityAccessForAccountOwner;
    global UserRole ParentRole;
    global Id ParentRoleId;
    global Account PortalAccount;
    global Id PortalAccountId;
    global User PortalAccountOwner;
    global Id PortalAccountOwnerId;
    global String PortalType;
    global List<Group> Related;
    global String RollupDescription;
    global List<ForecastingShare> SharedForecastManagerRole;
    global Datetime SystemModstamp;
    global List<ForecastShare> UserRole;
    global List<User> Users;

    global UserRole () 
    {
    }
}