// This file is generated as an Apex representation of the
//     corresponding sObject and its fields.
// This read-only file is used by the Apex Language Server to
//     provide code smartness, and is deleted each time you
//     refresh your sObject definitions.
// To edit your sObjects and their fields, edit the corresponding
//     .object-meta.xml and .field-meta.xml files.

global class UserProvisioningRequest {
    global String AppName;
    global String ApprovalStatus;
    global ConnectedApplication ConnectedApp;
    global Id ConnectedAppId;
    global User CreatedBy;
    global Id CreatedById;
    global Datetime CreatedDate;
    global String ExternalUserId;
    global Id Id;
    global Boolean IsDeleted;
    global User LastModifiedBy;
    global Id LastModifiedById;
    global Datetime LastModifiedDate;
    global User Manager;
    global Id ManagerId;
    global String Name;
    global String Operation;
    global SObject Owner;
    global Id OwnerId;
    global UserProvisioningRequest Parent;
    global Id ParentId;
    global List<ProcessInstance> ProcessInstances;
    global List<ProcessInstanceHistory> ProcessSteps;
    global List<FlowRecordRelation> RelatedRecord;
    global Integer RetryCount;
    global User SalesforceUser;
    global Id SalesforceUserId;
    global Datetime ScheduleDate;
    global String State;
    global Datetime SystemModstamp;
    global UserProvAccount UserProvAccount;
    global Id UserProvAccountId;
    global UserProvisioningConfig UserProvConfig;
    global Id UserProvConfigId;
    global List<UserProvisioningLog> UserProvisioningRequest;

    global UserProvisioningRequest () 
    {
    }
}