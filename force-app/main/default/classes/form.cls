public with sharing class form {

    @AuraEnabled(cacheable=true)
    //getForms
    public static List<Form__c> getForms()
    {
        return[select Id,Title__c, Name,Active__c from Form__c ORDER BY Title__c DESC];
    }

    @AuraEnabled
    //insert Form__c with LOGO
    public static Form__c  saveFormRecordLogo(Form__c formRec, string file, string fileName){
        //string contactId;  
     try{  
      
       Insert formRec;  
       //contactId = contactRec.Id;  
       String base64File = EncodingUtil.urlDecode(file, 'UTF-8');     
       ContentVersion contentVersionRec = new ContentVersion();  
       contentVersionRec.Title = fileName;  
       contentVersionRec.PathOnClient = '/' + fileName;  
       contentVersionRec.FirstPublishLocationId = formRec.Id;  
       contentVersionRec.VersionData = EncodingUtil.base64Decode(base64File);  
       contentVersionRec.IsMajorVersion = true;  
       Insert contentVersionRec;

       System.debug('contentVersionRec.Id'+contentVersionRec.Id);
       /*ContentDistribution cd = new ContentDistribution();
       cd.contentVersionId = contentVersionRec.Id;
       cd.Name = contentVersionRec.Title;
       INSERT cd;*/
       //,formRec.Id
       ContentDistribution cd = createContentDistribution(contentVersionRec.Id,contentVersionRec.Title);
       System.debug('cd-->>'+cd);

       Form__c updateUrlForm = new Form__c();
       updateUrlForm.Id = formRec.Id;
       updateUrlForm.Logo__c = [SELECT DistributionPublicUrl, ContentDownloadUrl FROM ContentDistribution WHERE Id = :cd.Id LIMIT 1].ContentDownloadUrl;
       update updateUrlForm;

       return formRec; 
        
     } catch(Exception ex){  
       system.debug('Exception===>'+ex.getMessage());
       return null;  
     }  
   }    

   private static ContentVersion contentVersionInsert(string file, string fileName, Id formDToUpdateId){
    String base64File = EncodingUtil.urlDecode(file, 'UTF-8');     
    ContentVersion contentVersionRec = new ContentVersion();  
    contentVersionRec.Title = fileName;  
    contentVersionRec.PathOnClient = '/' + fileName;  
    contentVersionRec.FirstPublishLocationId = formDToUpdateId;  
    contentVersionRec.VersionData = EncodingUtil.base64Decode(base64File);  
    contentVersionRec.IsMajorVersion = true;  
    Insert contentVersionRec;
    return contentVersionRec;
   }

   private static  ContentDistribution createContentDistribution(Id cvId, String cvTitle){
    ContentDistribution cdAttach = new ContentDistribution();
    cdAttach.contentVersionId = cvId;
    cdAttach.Name = cvTitle;
    try{
        insert cdAttach;
        return cdAttach;
    }
        catch(Exception ex){  
        return null;
        }
} 

@AuraEnabled
    //insert Form__c with LOGO
    public static Form__c saveFormRecordNoLOGO(Form__c formRec){
        Insert formRec;
        return formRec;
    }

@AuraEnabled
    public static String releatedFiles(Id idParent){
    Id cntDId = [Select Id, ContentDocumentId From ContentDocumentLink Where LinkedEntityId =:idParent].ContentDocumentId;
    Id contentVId = [SELECT Id, Title, ContentDocumentId FROM ContentVersion WHERE ContentDocumentId = :cntDId LIMIT 1].Id;
    String urlLink = [SELECT Id, ContentDocumentId, ContentDownloadUrl, DistributionPublicUrl FROM ContentDistribution
                      WHERE ContentDocumentId=:cntDId LIMIT 1].ContentDownloadUrl;
    if(urlLink != null){
    System.debug('urlLink-->>'+urlLink);
                      return urlLink;
    }
    else {
        return null;
    }
     
    }

    @AuraEnabled
    public static void deleteReleatedFiles(Id idParent){
        List<ContentDocumentLink> cdLink = [Select Id, ContentDocumentId From ContentDocumentLink Where LinkedEntityId =:idParent];
        Set<Id> cDocumentId = new Set<Id>(); 
        for(ContentDocumentLink cdLinkCopy : cdLink){
            cDocumentId.add(cdLinkCopy.ContentDocumentId);
        }
        List<ContentDocument> cd = [SELECT Id from ContentDocument WHERE Id = :cDocumentId];
        delete cd;

        Form__c updateUrlForm = new Form__c();
       updateUrlForm.Id = idParent;
       updateUrlForm.Logo__c = '';
       update updateUrlForm;
    }
    @AuraEnabled
    public static Form__c updateLogo(Id formId,string file, string fileName){
        try{    
            String base64File = EncodingUtil.urlDecode(file, 'UTF-8');     
            ContentVersion contentVersionRec = new ContentVersion();  
            contentVersionRec.Title = fileName;  
            contentVersionRec.PathOnClient = '/' + fileName;  
            contentVersionRec.FirstPublishLocationId = formId;  
            contentVersionRec.VersionData = EncodingUtil.base64Decode(base64File);  
            contentVersionRec.IsMajorVersion = true;  
            Insert contentVersionRec;

            ContentDistribution cd = createContentDistribution(contentVersionRec.Id,contentVersionRec.Title);
     
            Form__c updateUrlForm = new Form__c();
            updateUrlForm.Id = formId;
            updateUrlForm.Logo__c = [SELECT DistributionPublicUrl, ContentDownloadUrl FROM ContentDistribution WHERE Id = :cd.Id LIMIT 1].ContentDownloadUrl;
            update updateUrlForm;
     
            return updateUrlForm; 
             
          } catch(Exception ex){  
            system.debug('Exception===>'+ex.getMessage());
            return null;  
          }  
          //return contactId;  
         // return formRec; 
    }
    // update
    @AuraEnabled
    public static List<Form__c> updateFormRecord(Id formDToUpdateId,string formDTitle,
    string formDFormName,string formDObjType, string fomDMessage, Boolean formDDateAndTime,
    Boolean formDEnablePageNumber,Boolean formDIsActive, Boolean formDIsDeleted, 
    Boolean formDIsEnablePDF, string formDFooterMsg, string file, string fileName){
    
    System.debug('formDToUpdateId--->>'+formDToUpdateId);
    System.debug('formDToUpdateId--->>'+formDTitle);
    System.debug('formDToUpdateId--->>'+formDFormName);
    System.debug('formDToUpdateId--->>'+formDObjType);
    System.debug('formDToUpdateId--->>'+fomDMessage);
    System.debug('formDToUpdateId--->>'+formDDateAndTime);
    System.debug('formDToUpdateId--->>'+formDEnablePageNumber);
    System.debug('formDToUpdateId--->>'+formDIsActive);
    System.debug('formDToUpdateId--->>'+formDIsDeleted);
    System.debug('formDToUpdateId--->>'+formDIsEnablePDF);
    System.debug('formDToUpdateId--->>'+formDFooterMsg);

    List<Form__c> formDetailRecord = [SELECT Id, Title__c, Name, ObjectType__c, Message_Header__c, 
                                      Date_and_Time__c, Enable_Page_number__c, Active__c, Deleted__c, 
                                      Enable_PDF__c, Footer_Message__c, Logo__c FROM Form__c WHERE Id =: 
                                      formDToUpdateId];
    System.debug('formDetailRecord--->>'+formDetailRecord);

    List<Form__c> formToUpdateList = new List<Form__c>();

    for(Form__c formToUpdateRecord : formDetailRecord){
        formToUpdateRecord.Title__c = formDTitle;
        formToUpdateRecord.Name= formDFormName;
        formToUpdateRecord.ObjectType__c=formDObjType;
        formToUpdateRecord.Message_Header__c=fomDMessage;
        formToUpdateRecord.Date_and_Time__c=formDDateAndTime;
        formToUpdateRecord.Enable_Page_number__c=formDEnablePageNumber;
        formToUpdateRecord.Active__c=formDIsActive;
        formToUpdateRecord.Deleted__c=formDIsDeleted;
        formToUpdateRecord.Enable_PDF__c=formDIsEnablePDF;
    //formObj.Logo__c=formlogo;
    formToUpdateRecord.Footer_Message__c=formDFooterMsg;
    formToUpdateList.add(formToUpdateRecord);
    }
    update formToUpdateList;

    ContentVersion contntVersion = contentVersionInsert(file,fileName,formDToUpdateId);
    ContentDistribution cd = createContentDistribution(contntVersion.Id,contntVersion.Title);

    Form__c updateUrlForm = new Form__c();
       updateUrlForm.Id = formDToUpdateId;
       updateUrlForm.Logo__c = [SELECT DistributionPublicUrl, ContentDownloadUrl FROM ContentDistribution WHERE Id = :cd.Id LIMIT 1].ContentDownloadUrl;
       update updateUrlForm;
    return formToUpdateList; 
    }
    @AuraEnabled(cacheable=true)
    public static List<Form__c> updateFormNoLogoRecord(Id formDToUpdateId,string formDTitle,
    string formDFormName,string formDObjType, string fomDMessage, Boolean formDDateAndTime,
    Boolean formDEnablePageNumber,Boolean formDIsActive, Boolean formDIsDeleted, 
    Boolean formDIsEnablePDF, string formDFooterMsg, String formDLogo){

        List<Form__c> formDetailRecord = [SELECT Id, Title__c, Name, ObjectType__c, Message_Header__c, 
                                      Date_and_Time__c, Enable_Page_number__c, Active__c, Deleted__c, 
                                      Enable_PDF__c, Footer_Message__c, Logo__c FROM Form__c WHERE Id =: 
                                      formDToUpdateId];

    List<Form__c> formToUpdateList = new List<Form__c>();

    for(Form__c formToUpdateRecord : formDetailRecord){
        formToUpdateRecord.Title__c = formDTitle;
        formToUpdateRecord.Name= formDFormName;
        formToUpdateRecord.ObjectType__c=formDObjType;
        formToUpdateRecord.Message_Header__c=fomDMessage;
        formToUpdateRecord.Date_and_Time__c=formDDateAndTime;
        formToUpdateRecord.Enable_Page_number__c=formDEnablePageNumber;
        formToUpdateRecord.Active__c=formDIsActive;
        formToUpdateRecord.Deleted__c=formDIsDeleted;
        formToUpdateRecord.Enable_PDF__c=formDIsEnablePDF;
        formToUpdateRecord.Logo__c=formDLogo;
        formToUpdateRecord.Footer_Message__c=formDFooterMsg;
        formToUpdateList.add(formToUpdateRecord);
    }
        update formToUpdateList;
        return formToUpdateList;
    }
    
      @AuraEnabled(cacheable=true)
    //getForms
    public static List<Form__c> getActiveForms()
    {
        return[select Id,Title__c, Name,Active__c from Form__c  where Active__c=true];
    }
  @AuraEnabled(cacheable=true)
    //getForms
    public static List<Step__c> getstepDetails(Id formid)
    {
       system.debug('formid'+formid);   
       List<Step__c> steplist= [SELECT Id, Name, Step_Title__c, Form_Name__c FROM Step__c WHERE Form_Name__c = :formid AND IsFirstStep__c=true];
       system.debug('steplist'+steplist); 
       return steplist;
    }
      @AuraEnabled(cacheable=true)
    
    public static list<Form__c> getformInfo(Id formid)
    {
        list<Form__c> formlist=[select Id,Title__c, Name,Message_Header__c,Logo__c,Footer_Message__c,Active__c from Form__c  where Id=:formid];
        String header=formlist[0].Message_Header__c;
        String Footer=formlist[0].Footer_Message__c;
        String Logo=formlist[0].Logo__c;
        System.debug('######'+formlist[0].Message_Header__c);
        System.debug('######'+formlist[0].Footer_Message__c);
        System.debug('######'+formlist[0].Logo__c);
        List<String> formdata = new list<String> { formlist[0].Message_Header__c ,formlist[0].Footer_Message__c ,formlist[0].Logo__c};
        System.debug('formdata'+formdata);
        return formlist;
    }

     @AuraEnabled
     public static String Savedata(List< Map<String,String>> data)
     {
      if(!data.isEmpty()){
      List<Form_Detail_Data__c> formDetaildataList=new List<Form_Detail_Data__c>();
      for(Map<String,String> a:data)
      {
        List<Form_Detail_Data__c> existdata=[SELECT Name, Id,Form_Detail_Display_Name__c,Form_Detail_Id__c,Value__c,Data_Type__c from Form_Detail_Data__c where Form_Detail_Id__c=:a.get('Key')];
        if(existdata.size()>0)
        {
          for(Form_Detail_Data__c f:existdata)
          {
          System.debug('existdata'+existdata);
          f.Value__c=a.get('Value');
          formDetaildataList.add(f);
          System.debug('existdata[0].Value__c'+existdata[0].Value__c);
          }
        }
        else
        {
          System.debug('^^^^^^^^^^'+a);
            list <Form_Detail__c> detailList=[SELECT Id,Display_Name__c,Data_Type__c,OptionList__c,Form_Name__c FROM Form_Detail__c WHERE Id =: a.get('Key')];
            if(detailList.size()>0)
            {
              System.debug('inside');
              Form_Detail_Data__c fdd = new Form_Detail_Data__c();
              fdd.Name='Detail Data For'+detailList[0].Display_Name__c;
              fdd.Form_Detail_Display_Name__c=detailList[0].Display_Name__c;
              fdd.Form_Detail_Id__c=a.get('Key');
              fdd.Display_Name__c=detailList[0].Display_Name__c;
              fdd.Value__c=a.get('Value');
              fdd.Data_Type__c=detailList[0].Data_Type__c;
              formDetaildataList.add(fdd) ;
            }
          }
        }
        upsert formDetaildataList;
        System.debug('formDetaildataList'+formDetaildataList);
  }
  return null;
 }

  @AuraEnabled
  public static list<Form_Detail_Data__c> getformDetailData(Id detailId){
  List<Form_Detail_Data__c> detailList=[Select Name, Display_Name__c,Data_Type__c,Value__c,Form_Detail_Display_Name__c ,Form_Detail_Id__c from Form_Detail_Data__c Where Form_Detail_Id__c=: detailId];
  System.debug('detailList'+detailList);
  return detailList;
  }
   
}