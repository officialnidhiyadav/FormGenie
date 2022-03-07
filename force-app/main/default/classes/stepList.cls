public with sharing class stepList {
    @AuraEnabled(cacheable=true)
    public static List<Step__c> getStepList(List<Id> steplist){
        System.debug('steplist--->>'+steplist);
return [SELECT Id, Name, Step_Title__c, Form_Name__c FROM Step__c WHERE Form_Name__c IN :steplist]; 
    }
}