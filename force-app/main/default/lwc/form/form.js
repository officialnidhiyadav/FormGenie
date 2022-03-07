import { LightningElement, track, api } from 'lwc';
import saveForm from '@salesforce/apex/form.saveFormRecordLogo';
import saveFormNoLogo from '@salesforce/apex/form.saveFormRecordNoLOGO';
import deleteReleatedFiles from '@salesforce/apex/form.deleteReleatedFiles';
import updateLogo from '@salesforce/apex/form.updateLogo';
//import uploadFile from '@salesforce/apex/form.uploadFile';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//import Form_Name from '@salesforce/schema/Form_Detail__c.Form_Name__c';
import { NavigationMixin } from 'lightning/navigation';
import releatedFiles from '@salesforce/apex/form.releatedFiles';

export default class Form extends  NavigationMixin(LightningElement) {
  //@api recordId;
  fileData= '';
  
  @track title = '';
  @track formName  = '';
  @track objType = '';
  @track message = '';
  @track dateAndTime = '';
  @track enablePageNumber = '';
  @track isActive = '';
  @track isDeleted = '';
  @track isEnablePDF = '';
  //@track logo = '';
  @track footerMsg = '';
  //@track formRecoreId2;
  @track formRecoreId='';
  @track errorMsg;
  @track insertButton=true;
  @track nextButton=true;
  @track showLoadingSpinner = false;
  @track data;
  @track fileUpload = true;
  @track isUpdate = false;

  uploadedFiles = []; file; fileContents; fileReader; content; @track fileName='';
  
  connectedCallback() {
    this.getRelatedFiles();
}
 

  valueHandleChange(event) {
    if (event.target.name == 'titletext') {
      this.title = event.target.value;
      window.console.log('typeof  this.title',typeof this.title);
      window.console.log('value of this.title>>>>>>' + this.title);
      console.log();
    }
    if (event.target.name == 'typeOfObj') {
      this.objType = event.target.value;
      window.console.log(typeof this.objType);
    }
    if (event.target.name == 'Msg') {
      this.message = event.target.value;
      window.console.log(typeof this.message);
    }
    if (event.target.name == 'DandT') {
      this.dateAndTime = event.target.checked;
      window.console.log(typeof this.dateAndTime);
    }
    if (event.target.name == 'Pgnumber') {
      this.enablePageNumber = event.target.checked;
      window.console.log(typeof this.enablePageNumber);
    }
    if (event.target.name == 'active') {
      this.isActive = event.target.checked;
      window.console.log(typeof this.isActive);
    }
    if (event.target.name == 'deleted') {
      this.isDeleted = event.target.checked;
      window.console.log(typeof this.isDeleted);
    }
    if (event.target.name == 'PDF') {
      this.isEnablePDF = event.target.checked;
      window.console.log(typeof this.isEnablePDF);
    }
    /*if (event.target.name == 'loGo') {
      this.logo = event.target.value;
      window.console.log(typeof this.logo);
    }*/
    if (event.target.name == 'FootrMsg') {
      this.footerMsg = event.target.value;
      window.console.log(typeof this.footerMsg);
    }
  }

 /*openFileUpload(event) {
    const file = event.target.files[0]
    var reader = new FileReader()
    reader.onload = () => {
        var base64 = reader.result.split(',')[1]
        this.fileData = {
            'filename': file.name,
            'base64': base64,
            'recordId': this.formRecoreId
        }
        window.console.log(this.fileData)
    }
    reader.readAsDataURL(file);

    this.submitFile(); 
}

submitFile(){
  window.console.log(this.fileData)
    const { base64, filename, recordId } = this.fileData
        uploadFile({ base64, filename, recordId }).then(result => {
            this.fileData = null
            console.log('result-->>',result);
          })
}*/

/*handleUploadFinished(event) {
  // Get the list of uploaded files
  const uploadedFiles = event.detail.files;
  let uploadedFileNames = '';
  for(let i = 0; i < uploadedFiles.length; i++) {
      uploadedFileNames += uploadedFiles[i].name + ', ';
  }
  this.dispatchEvent(
      new ShowToastEvent({
          title: 'Success',
         message: ' File uploaded Successfully: ' + uploadedFileNames,
          variant: 'success',
      }),
  );
}*/
onFileUpload(event) {  
  if (event.target.files.length > 0) {  
    this.uploadedFiles = event.target.files;  
    this.fileName = event.target.files[0].name;  
    console.log('this.fileName-->>',this.fileName);
    this.file = this.uploadedFiles[0];  
    /*if (this.file.size > this.MAX_FILE_SIZE) {  
      alert("File Size Can not exceed" + MAX_FILE_SIZE);  
    } */
  }
}  

get disableNext(){
  return this.nextButton == true;
}

saveCondition(){
  if(this.fileName === '' && this.insertButton===true){
    this.handleInsertNoLogo();
  }
  if(this.fileName !== '' && this.insertButton===true){
    this.saveContact();
  }
  if(this.fileName !== '' && this.isUpdate===true){
    this.saveContact();
  }
}

saveContact() {  

  this.fileReader = new FileReader();  
  this.fileReader.onloadend = (() => {  
    this.fileContents = this.fileReader.result;  
    let base64 = 'base64,';  
    this.content = this.fileContents.indexOf(base64) + base64.length;  
    this.fileContents = this.fileContents.substring(this.content);  
    this.handleInsert();  
  });  
  this.fileReader.readAsDataURL(this.file);  
}

  handleInsert(event) {
    if(this.insertButton === true){
    this.insertButton = false;
    this.nextButton = false;
    this.showLoadingSpinner = true;
  
    var form = {  
      //'sobjectType': 'Form__c',  
      'Title__c': this.title,  
      'Name': this.formName,  
      'ObjectType__c': this.objType,  
      'Message_Header__c': this.message,
      'Date_and_Time__c': this.dateAndTime,
      'Enable_Page_number__c': this.enablePageNumber,
      'Active__c': this.isActive,
      'Deleted__c': this.isDeleted,
      'Enable_PDF__c': this.isEnablePDF,
      'Footer_Message__c': this.footerMsg
    }  
    console.log('form-->>',form);
    
   /*window.console.log(this.fileData)
        const { base64, filename, recordId } = this.fileData
        uploadFile({ base64, filename, recordId }).then(result => {
            this.fileData = null
          })*/

    saveForm({
     formRec : form,
     file: encodeURIComponent(this.fileContents),  
     fileName: this.fileName  
    })
      .then(result => {
        console.log('result-->>',result);
        this.formRecoreId = result.Id;
        this.showLoadingSpinner = false;
        //this.formRecoreId =   event.target.dataset.formRecoreId2;
        this.fileName = this.fileName + ' - Uploaded Successfully';
        this.getRelatedFiles();
        this.fileUpload = false;

        //window.console.log('formRecoreId==>>> ' + this.formRecoreId + 'typeof' + typeof this.formRecoreId);
        //this.fileData = null
        const toastEvent = new ShowToastEvent({
          title: 'Success!',
          message: 'Record created successfully',
          variant: 'success'
        });
        this.dispatchEvent(toastEvent);
      })
      .catch(error => {
        this.errorMsg = error.message;
        window.console.log(this.error);
      });
    }
    if(this.isUpdate===true){
      this.showLoadingSpinner = true;
  
      updateLogo({
      formId: this.formRecoreId,
       file: encodeURIComponent(this.fileContents),  
       fileName: this.fileName  
      })
        .then(result => {
          console.log('result-->>',result);
          this.showLoadingSpinner = false;
          //this.formRecoreId =   event.target.dataset.formRecoreId2;
          this.fileName = this.fileName + ' - Uploaded Successfully';
          this.getRelatedFiles();
          this.fileUpload = false;
  
          //window.console.log('formRecoreId==>>> ' + this.formRecoreId + 'typeof' + typeof this.formRecoreId);
          //this.fileData = null
          const toastEvent = new ShowToastEvent({
            title: 'Success!',
            message: 'Record Updated successfully',
            variant: 'success'
          });
          this.dispatchEvent(toastEvent);
        })
        .catch(error => {
          this.errorMsg = error.message;
          window.console.log(this.error);
        });
      }
    
  }

  handleInsertNoLogo(event) {
    this.insertButton = false;
    this.nextButton = false;
    this.showLoadingSpinner = true;

    var form = {  
      //'sobjectType': 'Form__c',  
      'Title__c': this.title,  
      'Name': this.formName,  
      'ObjectType__c': this.objType,  
      'Message_Header__c': this.message,
      'Date_and_Time__c': this.dateAndTime,
      'Enable_Page_number__c': this.enablePageNumber,
      'Active__c': this.isActive,
      'Deleted__c': this.isDeleted,
      'Enable_PDF__c': this.isEnablePDF,
      'Footer_Message__c': this.footerMsg
    }  
    console.log('form-->>',form);
    
   /*window.console.log(this.fileData)
        const { base64, filename, recordId } = this.fileData
        uploadFile({ base64, filename, recordId }).then(result => {
            this.fileData = null
          })*/

    saveFormNoLogo({
     formRec : form 
    })
      .then(result => {
        console.log('result-->>',result);
        this.formRecoreId = result.Id;
        this.showLoadingSpinner = false;
        //this.formRecoreId =   event.target.dataset.formRecoreId2;
        //this.fileName = this.fileName + ' - Uploaded Successfully';
        //this.getRelatedFiles();

        //window.console.log('formRecoreId==>>> ' + this.formRecoreId + 'typeof' + typeof this.formRecoreId);
        //this.fileData = null
        const toastEvent = new ShowToastEvent({
          title: 'Success!',
          message: 'Record created successfully',
          variant: 'success'
        });
        this.dispatchEvent(toastEvent);
      })
      .catch(error => {
        this.errorMsg = error.message;
        window.console.log(this.error);
      });
  }

  getRelatedFiles() {
    releatedFiles({ idParent: this.formRecoreId })
        .then(data => {
            this.data = data;
            console.log('data-->>',this.data);
        })
        .catch(error => {
            /*this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error!!',
                    message: error.message,
                    variant: 'error',
                }),
            );*/
        });
}

deleteUploadedFile(){
  deleteReleatedFiles({ idParent: this.formRecoreId })
  .then(result => {
    console.log('deleted Succesafully');
    
    const toastEvent = new ShowToastEvent({
      title: 'Success!',
      message: 'Uploaded File is Deleted',
      variant: 'success'
    });
    this.dispatchEvent(toastEvent);
  })
  .catch(error => {
    this.dispatchEvent( new ShowToastEvent({
      title:'Failed!!',
      message:'Deleting Uploaded File Failed',
      variant:'error'
  }));
  this.error=error.message;
});
this.data=false;
this.fileName='';
this.fileUpload = true;
this.isUpdate = true;
}

  handleNext(event){
     event.preventDefault();
    let componentDef = {
        componentDef: "c:formDetail",
        attributes: {
          formnamefrmdetail: this.formRecoreId
        }
    };
    // Encode the componentDefinition JS object to Base64 format to make it url addressable
    let encodedComponentDef = btoa(JSON.stringify(componentDef));
    this[NavigationMixin.Navigate]({
        type: 'standard__webPage',
        attributes: {
            url: '/one/one.app#' + encodedComponentDef
        }
    });
  }

  suffixC(event) { 
    console.log('this.title suffix-->>',this.title);       
    if (event.target.name == 'titletext') {
        let stringFOrmName = event.target.value;
        if (stringFOrmName != '') {
            this.formName = stringFOrmName.replace(/ /g, "_") + "__c";
        }
        else {
            this.formName = '';
        }
        window.console.log(typeof this.formName);
        window.console.log('value of this.formName>>>>>>' + this.formName);
    }
}
}