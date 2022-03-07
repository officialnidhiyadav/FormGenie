public with sharing class formInformation {
    @AuraEnabled(cacheable=true)
            public static List<Form__c> getFormInfo(Id clsFormIdInfo){
                List<Form__c> stepList = new List<Form__c>();
                    stepList = [SELECT id, Title__c,Name, Message_Header__c, Footer_Message__c, Date_and_Time__c,
                    Enable_Page_number__c, Active__c, 	Deleted__c,	Enable_PDF__c,	Logo__c, ObjectType__c FROM 
                    Form__c WHERE Id =: clsFormIdInfo]; 
                return stepList;
    }
}
