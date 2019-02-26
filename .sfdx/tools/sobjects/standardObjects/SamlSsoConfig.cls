// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class SamlSsoConfig {
    global String AttributeFormat;
    global String AttributeName;
    global String Audience;
    global List<AuthConfigProviders> AuthProvider;
    global List<LoginHistory> AuthenticationService;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global String DeveloperName;
    global String ErrorUrl;
    global User ExecutionUser;
    global Id ExecutionUserId;
    global Id Id;
    global String IdentityLocation;
    global String IdentityMapping;
    global Boolean IsDeleted;
    global String Issuer;
    global String Language;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global String LoginUrl;
    global String LogoutUrl;
    global String MasterLabel;
    global String NamespacePrefix;
    global Boolean OptionsSpInitBinding;
    global Boolean OptionsUserProvisioning;
    global String RequestSignatureMethod;
    global ApexClass SamlJitHandler;
    global Id SamlJitHandlerId;
    global String SingleLogoutBinding;
    global String SingleLogoutUrl;
    global Datetime SystemModstamp;
    global String ValidationCert;
    global String Version;

    global SamlSsoConfig () 
    {
    }
}