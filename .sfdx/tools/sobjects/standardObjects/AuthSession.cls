// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class AuthSession {
    global List<IdpEventLog> AuthSession;
    global Datetime CreatedDate;
    global Id Id;
    global Boolean IsCurrent;
    global Datetime LastModifiedDate;
    global LoginGeo LoginGeo;
    global Id LoginGeoId;
    global LoginHistory LoginHistory;
    global Id LoginHistoryId;
    global String LoginType;
    global String LogoutUrl;
    global Integer NumSecondsValid;
    global List<AuthSession> Parent;
    global Id ParentId;
    global List<SessionPermSetActivation> SessionPermSetActivations;
    global String SessionSecurityLevel;
    global String SessionType;
    global String SourceIp;
    global String UserType;
    global User Users;
    global Id UsersId;

    global AuthSession () 
    {
    }
}