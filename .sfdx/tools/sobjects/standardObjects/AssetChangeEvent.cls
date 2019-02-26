// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class AssetChangeEvent {
    global Account Account;
    global Id AccountId;
    global Account AssetProvidedBy;
    global Id AssetProvidedById;
    global Account AssetServicedBy;
    global Id AssetServicedById;
    global Object ChangeEventHeader;
    global Contact Contact;
    global Id ContactId;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global String Description;
    global Id Id;
    global Date InstallDate;
    global Boolean IsCompetitorProduct;
    global Boolean IsInternal;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global Location Location;
    global Id LocationId;
    global String Name;
    global User Owner;
    global Id OwnerId;
    global Asset Parent;
    global Id ParentId;
    global Decimal Price;
    global Product2 Product2;
    global Id Product2Id;
    global Date PurchaseDate;
    global Double Quantity;
    global String ReplayId;
    global Asset RootAsset;
    global Id RootAssetId;
    global String SerialNumber;
    global String Status;
    global Date UsageEndDate;

    global AssetChangeEvent () 
    {
    }
}