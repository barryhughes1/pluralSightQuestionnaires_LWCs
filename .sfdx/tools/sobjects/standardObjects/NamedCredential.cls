// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class NamedCredential {
    global AuthProvider AuthProvider;
    global Id AuthProviderId;
    global Boolean CalloutOptionsAllowMergeFieldsInBody;
    global Boolean CalloutOptionsAllowMergeFieldsInHeader;
    global Boolean CalloutOptionsGenerateAuthorizationHeader;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global List<CustomHttpHeader> CustomHttpHeaders;
    global String DeveloperName;
    global String Endpoint;
    global Id Id;
    global Boolean IsDeleted;
    global String Language;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global String MasterLabel;
    global List<UserProvisioningConfig> NamedCredential;
    global String NamespacePrefix;
    global String PrincipalType;
    global List<SetupEntityAccess> SetupEntityAccessItems;
    global Datetime SystemModstamp;
    global List<ExternalDataUserAuth> UserAuths;

    global NamedCredential () 
    {
    }
}