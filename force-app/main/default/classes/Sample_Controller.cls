public with sharing class Sample_Controller {
 
    @AuraEnabled(cacheable=true)
    public static List<Picklist_Value__c> f_Get_Types(){
        try {
            List<Picklist_Value__c> l_Types = new List<Picklist_Value__c>();
             
            l_Types = [Select id, Name from Picklist_Value__c]; // Can include multiple fields, 
            // You can also use any standard or custom object
            // You can get values from custom setting also.
             
            return l_Types;
        } catch (Exception e) {
            System.debug('Exception: '+e.getMessage());
            return null;
        }
    }
}