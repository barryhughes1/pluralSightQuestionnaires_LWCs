// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class OpportunityChangeEvent {
    global Account Account;
    global Id AccountId;
    global Decimal Amount;
    global Campaign Campaign;
    global Id CampaignId;
    global Object ChangeEventHeader;
    global Date CloseDate;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global String Description;
    global Decimal ExpectedRevenue;
    global String ForecastCategory;
    global String ForecastCategoryName;
    global Boolean HasOpportunityLineItem;
    global Id Id;
    global Boolean IsClosed;
    global Boolean IsPrivate;
    global Boolean IsWon;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global String LeadSource;
    global String Name;
    global String NextStep;
    global User Owner;
    global Id OwnerId;
    global Pricebook2 Pricebook2;
    global Id Pricebook2Id;
    global Double Probability;
    global String ReplayId;
    global String StageName;
    global Double TotalOpportunityQuantity;
    global String Type;

    global OpportunityChangeEvent () 
    {
    }
}