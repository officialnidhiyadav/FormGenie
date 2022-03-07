public with sharing class formDetailFields {
    @AuraEnabled(cacheable=true)
    public static List<Form_Detail__c> getFormDetailList(List<Id> formdetailidlist){
        System.debug('formdetailidlist--->>'+formdetailidlist);
return [SELECT Id, Field_name__c, Data_Type__c, Form_Name__c FROM Form_Detail__c where Form_Name__c IN :formdetailidlist];
//return [SELECT Id FROM Form__c WHERE Id IN (SELECT Form_Name__c FROM Form_Detail__c)];    
}
    }