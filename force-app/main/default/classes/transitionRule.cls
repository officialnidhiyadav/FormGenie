public with sharing class transitionRule {
    // customLookupTransitionRule
    @AuraEnabled(cacheable=true)
    public static List<Step_Field__c > getStepFields(Id toStep, String stpFieldName){
        System.debug('toStep-->>'+ toStep);
        List<Step_Field__c > stepFieldsList = new List<Step_Field__c >();
        if(stpFieldName!=''){
            String stepFields = '%' + stpFieldName + '%';
            stepFieldsList = [SELECT Id, Form_Detail__c, Step__c, Name FROM Step_Field__c WHERE Step__c =: toStep AND Name LIKE:stepFields];
            return stepFieldsList;  
        }
        return stepFieldsList;
}
}
