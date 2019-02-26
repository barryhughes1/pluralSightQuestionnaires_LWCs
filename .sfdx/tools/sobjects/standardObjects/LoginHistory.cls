// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class LoginHistory {
    global String ApiType;
    global String ApiVersion;
    global String Application;
    global SObject AuthenticationService;
    global Id AuthenticationServiceId;
    global String Browser;
    global String CipherSuite;
    global String ClientVersion;
    global String CountryIso;
    global Id Id;
    global LoginGeo LoginGeo;
    global Id LoginGeoId;
    global List<AuthSession> LoginHistory;
    global Datetime LoginTime;
    global String LoginType;
    global String LoginUrl;
    global Boolean OptionsIsGet;
    global Boolean OptionsIsPost;
    global String Platform;
    global String SourceIp;
    global String Status;
    global String TlsProtocol;
    global User User;
    global Id UserId;

    global LoginHistory () 
    {
    }
}