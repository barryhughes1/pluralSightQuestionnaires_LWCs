// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class OrderChangeEvent {
    global Account Account;
    global Id AccountId;
    global User ActivatedBy;
    global Id ActivatedById;
    global Datetime ActivatedDate;
    global Contact BillToContact;
    global Id BillToContactId;
    global Address BillingAddress;
    global String BillingCity;
    global String BillingCountry;
    global String BillingGeocodeAccuracy;
    global Double BillingLatitude;
    global Double BillingLongitude;
    global String BillingPostalCode;
    global String BillingState;
    global String BillingStreet;
    global Object ChangeEventHeader;
    global User CompanyAuthorizedBy;
    global Id CompanyAuthorizedById;
    global Date CompanyAuthorizedDate;
    global Contract Contract;
    global Id ContractId;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global Contact CustomerAuthorizedBy;
    global Id CustomerAuthorizedById;
    global Date CustomerAuthorizedDate;
    global String Description;
    global Date EffectiveDate;
    global Date EndDate;
    global Id Id;
    global Boolean IsReductionOrder;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global String Name;
    global String OrderNumber;
    global String OrderReferenceNumber;
    global Order OriginalOrder;
    global Id OriginalOrderId;
    global User Owner;
    global Id OwnerId;
    global Date PoDate;
    global String PoNumber;
    global Pricebook2 Pricebook2;
    global Id Pricebook2Id;
    global String ReplayId;
    global Contact ShipToContact;
    global Id ShipToContactId;
    global Address ShippingAddress;
    global String ShippingCity;
    global String ShippingCountry;
    global String ShippingGeocodeAccuracy;
    global Double ShippingLatitude;
    global Double ShippingLongitude;
    global String ShippingPostalCode;
    global String ShippingState;
    global String ShippingStreet;
    global String Status;
    global String StatusCode;
    global Decimal TotalAmount;
    global String Type;

    global OrderChangeEvent () 
    {
    }
}