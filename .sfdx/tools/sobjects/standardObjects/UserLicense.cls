// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class UserLicense {
    global Datetime CreatedDate;
    global Id Id;
    global Datetime LastModifiedDate;
    global List<PermissionSet> License;
    global String LicenseDefinitionKey;
    global String MasterLabel;
    global Integer MonthlyLoginsEntitlement;
    global Integer MonthlyLoginsUsed;
    global String Name;
    global String Status;
    global Datetime SystemModstamp;
    global Integer TotalLicenses;
    global Integer UsedLicenses;
    global Datetime UsedLicensesLastUpdated;
    global List<CustomObjectUserLicenseMetrics> UserLicense;

    global UserLicense () 
    {
    }
}