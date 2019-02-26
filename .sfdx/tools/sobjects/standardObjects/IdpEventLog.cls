// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class IdpEventLog {
    global ConnectedApplication App;
    global Id AppId;
    global AuthSession AuthSession;
    global Id AuthSessionId;
    global String ErrorCode;
    global Id Id;
    global String IdentityUsed;
    global String InitiatedBy;
    global Boolean OptionsHasLogoutUrl;
    global String SamlEntityUrl;
    global String SsoType;
    global Datetime Timestamp;
    global User User;
    global Id UserId;

    global IdpEventLog () 
    {
    }
}