// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class ContentDistribution {
    global List<ContentDistributionView> ContentDistributionViews;
    global ContentDocument ContentDocument;
    global Id ContentDocumentId;
    global String ContentDownloadUrl;
    global ContentVersion ContentVersion;
    global Id ContentVersionId;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global String DistributionPublicUrl;
    global Datetime ExpiryDate;
    global Datetime FirstViewDate;
    global Id Id;
    global Boolean IsDeleted;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global Datetime LastViewDate;
    global String Name;
    global User Owner;
    global Id OwnerId;
    global String Password;
    global String PdfDownloadUrl;
    global Boolean PreferencesAllowOriginalDownload;
    global Boolean PreferencesAllowPDFDownload;
    global Boolean PreferencesAllowViewInBrowser;
    global Boolean PreferencesExpires;
    global Boolean PreferencesLinkLatestVersion;
    global Boolean PreferencesNotifyOnVisit;
    global Boolean PreferencesNotifyRndtnComplete;
    global Boolean PreferencesPasswordRequired;
    global SObject RelatedRecord;
    global Id RelatedRecordId;
    global Datetime SystemModstamp;
    global Integer ViewCount;

    global ContentDistribution () 
    {
    }
}