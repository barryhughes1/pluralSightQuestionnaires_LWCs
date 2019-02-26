// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class ConnectedApplication {
    global List<IdpEventLog> App;
    global List<UserAppMenuCustomization> Application;
    global List<UserProvisioningRequest> ConnectedApp;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global Id Id;
    global List<InstalledMobileApp> InstalledMobileApps;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global String MobileSessionTimeout;
    global String MobileStartUrl;
    global String Name;
    global Boolean OptionsAllowAdminApprovedUsersOnly;
    global Boolean OptionsFullContentPushNotifications;
    global Boolean OptionsHasSessionLevelPolicy;
    global Boolean OptionsIsInternal;
    global Boolean OptionsRefreshTokenValidityMetric;
    global String PinLength;
    global Integer RefreshTokenValidityPeriod;
    global List<VerificationHistory> Resource;
    global List<SetupEntityAccess> SetupEntityAccessItems;
    global String StartUrl;
    global Datetime SystemModstamp;

    global ConnectedApplication () 
    {
    }
}