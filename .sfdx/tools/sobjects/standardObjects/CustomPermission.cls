// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class CustomPermission {
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global List<CustomPermissionDependency> CustomPermissionDependencyItem;
    global List<CustomPermissionDependency> CustomPermissionItem;
    global String Description;
    global String DeveloperName;
    global List<GrantedByLicense> GrantedByLicenses;
    global Id Id;
    global Boolean IsDeleted;
    global Boolean IsProtected;
    global String Language;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global String MasterLabel;
    global String NamespacePrefix;
    global List<SetupEntityAccess> SetupEntityAccessItems;
    global Datetime SystemModstamp;

    global CustomPermission () 
    {
    }
}