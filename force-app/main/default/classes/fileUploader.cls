public with sharing class fileUploader {
    @AuraEnabled
    public static String uploadFile(String base64, String filename, String recordId) {
        ContentVersion cv = createContentVersion(base64, filename);
        ContentDocumentLink cdl = createContentLink(cv.Id, recordId);
        if(cv == null || cdl == null){return null;}
        return cv.Id;

    }
    private static  ContentVersion createContentVersion(String base64, String filename){
        ContentVersion cv = new ContentVersion();
        cv.VersionData = EncodingUtil.base64Decode(base64);
        cv.Title = filename;
        cv.PathOnClient = filename;
        try {
            insert cv;
            return cv;
        } catch(DmlException e){
            System.debug(e);
            return null;
        }
    } 
    private static ContentDocumentLink createContentLink(String contentVersionId, string recordId){
        if(contentVersionId == null || recordId == null){return null;}
        ContentDocumentLink cdl = new ContentDocumentLink();
        cdl.ContentDocumentId = [
            SELECT ContentDocumentId
            FROM ContentVersion
            WHERE Id =: contentVersionId
        ].ContentDocumentId;
        cdl.LinkedEntityId = recordId;
        cdl.ShareType = 'V';
        try{
            insert cdl;
            return cdl;
        }catch(DmlException e){
            System.debug(e);
            return null;
        }
    }
}
