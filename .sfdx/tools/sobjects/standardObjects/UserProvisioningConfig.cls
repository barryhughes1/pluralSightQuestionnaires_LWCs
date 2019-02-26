// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class UserProvisioningConfig {
    global String ApprovalRequired;
    global ConnectedApplication ConnectedApp;
    global Id ConnectedAppId;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global String DeveloperName;
    global Boolean Enabled;
    global String EnabledOperations;
    global Id Id;
    global Boolean IsDeleted;
    global String Language;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global Datetime LastReconDateTime;
    global String MasterLabel;
    global NamedCredential NamedCredential;
    global Id NamedCredentialId;
    global String NamespacePrefix;
    global String Notes;
    global String OnUpdateAttributes;
    global String ReconFilter;
    global Datetime SystemModstamp;
    global String UserAccountMapping;
    global List<UserProvisioningRequest> UserProvConfig;

    global UserProvisioningConfig () 
    {
    }
}