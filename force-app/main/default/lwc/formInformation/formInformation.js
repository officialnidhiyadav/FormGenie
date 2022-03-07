import { LightningElement, wire, api, track } from 'lwc';
import getFormInfo from '@salesforce/apex/formInformation.getFormInfo';
import updateFormRecord from '@salesforce/apex/form.updateFormRecord';
import updateFormNoLogoRecord from '@salesforce/apex/form.updateFormNoLogoRecord'
import deleteReleatedFiles from '@salesforce/apex/form.deleteReleatedFiles';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import releatedFiles from '@salesforce/apex/form.releatedFiles';

export default class FormInformation extends LightningElement {
  @api formInfoId;
  @track infoData = [];
  @track infoDataString;
  @track readonly = true;
  @track disable = true;
  @track changeStyle = true;
  @track saveEdit = false;
  @track formDRecoreId;

  @track title;
  @track formName;
  @track objType;
  @track message;
  @track dateAndTime;
  @track enablePageNumber;
  @track isActive;
  @track isDeleted;
  @track isEnablePDF;
  @track formLogo = '';
  @track footerMsg;
  @track data ='';
  @track deleteLogo = false;
  @track fileUpload = false;
  @track isUpdate = false;
  @track showLoadingSpinner = false;

  uploadedFiles = []; file; fileContents; fileReader; content; @track fileName='';

  @wire(getFormInfo, { clsFormIdInfo: '$formInfoId' })
  retrieveFormInfo({ error, data }) {
    if (data) {
      // TODO: Error handling 
      console.log('data real::' + data);
      console.log('data::' + JSON.stringify(data));
      this.infoData = JSON.parse(JSON.stringify(data));
      console.log('this.infoData-->>',this.infoData);
      console.log('this.infoData Title__c 1-->>',this.infoData[0].Title__c);
    } else if (error) {

    }
  }

  connectedCallback(){
    this.getRelatedFiles();
    console.log('data connected--->>',this.data)
  }
  
  valueHandleChange(event) {
    if (event.target.name == 'titletext') {
      
      this.title = event.target.value;
      //console.log('this.infoData[0].Title__c---->>',this.infoData[0].Title__c);
      //titleCopy = this.title;
      //console.log('titleCopy-->>',titleCopy);
      this.infoData[0].Title__c = this.title;
      window.console.log(typeof this.title);
      window.console.log('value of>>>>>>' + this.title);
    }
    if (event.target.name == 'typeOfObj') {
      this.objType = event.target.value;
      this.infoData[0].ObjectType__c = this.objType;
      window.console.log(typeof this.objType);
    }
    if (event.target.name == 'Msg') {
      this.message = event.target.value;
      this.infoData[0].Message_Header__c = this.message;
      window.console.log('this.message-->>', this.message);
      window.console.log(typeof this.message);
    }
    if (event.target.name == 'DandT') {
      this.dateAndTime = event.target.checked;
      this.infoData[0].Date_and_Time__c = this.dateAndTime;
      window.console.log(typeof this.dateAndTime);
    }
    if (event.target.name == 'Pgnumber') {
      this.enablePageNumber = event.target.checked;
      this.infoData[0].Enable_Page_number__c = this.enablePageNumber;
      window.console.log(typeof this.enablePageNumber);
    }
    if (event.target.name == 'active') {
      this.isActive = event.target.checked;
      this.infoData[0].Active__c = this.isActive;
      window.console.log(typeof this.isActive);
    }
    if (event.target.name == 'deleted') {
      this.isDeleted = event.target.checked;
      this.infoData[0].Deleted__c = this.isDeleted;
      window.console.log(typeof this.isDeleted);
    }
    if (event.target.name == 'PDF') {
      this.isEnablePDF = event.target.checked;
      this.infoData[0].Enable_PDF__c = this.isEnablePDF;
      window.console.log(typeof this.isEnablePDF);
    }
    /*if (event.target.name == 'loGo') {
      this.logo = event.target.value;
      window.console.log(typeof this.logo);
    }*/
    if (event.target.name == 'FootrMsg') {
      this.footerMsg = event.target.value;
      this.infoData[0].Footer_Message__c = this.footerMsg;
      window.console.log(typeof this.footerMsg);
    }
  }

  get className() {
    //if changeStle is true, getter will return class1 else class2
    return this.changeStyle ? 'forreadonly' : 'forread';
  }

  editFormDetail(event) {
    console.log('this.readonly  --->>', this.readonly);
    this.readonly = false;
    console.log('this.readonly  --->>', this.readonly);
    console.log('this.infoData-->>', this.infoData);
    this.disable = false;
    this.changeStyle = false;
    this.saveEdit = true;
    if(this.data != ''){
    this.deleteLogo = true;
  }
  if(this.data === ''){
    this.fileUpload = true;
  }

    if (this.readonly === false && this.disable === false && this.changeStyle === false) {

      const toastEvent = new ShowToastEvent({
        title: 'EDIT!',
        message: 'Now You Can Edit the Details',
        variant: 'success'
      });
      this.dispatchEvent(toastEvent);
    }
    else {
      this.dispatchEvent(new ShowToastEvent({
        title: 'CANNOT EDIT!!',
        message: 'You are not able to Edit the Details',
        variant: 'error'
      }));
    }
    
    this.title = this.infoData[0].Title__c;
    console.log('this.infoData[0].Title__c 2 --->>'+this.infoData[0].Title__c);
    this.formName = this.infoData[0].Name;
    this.objType = this.infoData[0].ObjectType__c;
    this.message = this.infoData[0].Message_Header__c;
    this.dateAndTime = this.infoData[0].Date_and_Time__c;
    this.enablePageNumber = this.infoData[0].Enable_Page_number__c;
    this.isActive = this.infoData[0].Active__c;
    this.isDeleted = this.infoData[0].Deleted__c;
    this.isEnablePDF = this.infoData[0].Enable_Page_number__c;
    this.formLogo = this.infoData[0].Logo__c;
    this.footerMsg = this.infoData[0].Footer_Message__c;
  }
  
  onFileUpload(event) {  
    if (event.target.files.length > 0) {  
      this.uploadedFiles = event.target.files;  
      this.fileName = event.target.files[0].name;  
      console.log('this.fileName-->>',this.fileName);
      this.file = this.uploadedFiles[0];  
    }
  } 

  saveCondition(){
    if(this.fileName === ''){
      this.handleUpdateNoLogo();
    }
    if(this.fileName !== ''){
      this.saveUpdatedForm();
    }
    /*if(this.fileName !== '' && this.isUpdate===true){
      this.saveContact();
    }*/
  }

  saveUpdatedForm() {  

    this.fileReader = new FileReader();  
    this.fileReader.onloadend = (() => {  
      this.fileContents = this.fileReader.result;  
      let base64 = 'base64,';  
      this.content = this.fileContents.indexOf(base64) + base64.length;  
      this.fileContents = this.fileContents.substring(this.content);  
      this.handleEditSave();  
    });  
    this.fileReader.readAsDataURL(this.file);  
  }

  handleEditSave(event) {
    this.showLoadingSpinner = true;
   console.log('this.title 3 --->>',this.title);
    updateFormRecord({
      formDToUpdateId: this.formInfoId, formDTitle: this.title, formDFormName: this.formName, formDObjType: this.objType, fomDMessage: this.message,
      formDDateAndTime: this.dateAndTime, formDEnablePageNumber: this.enablePageNumber, formDIsActive: this.isActive,
      formDIsDeleted: this.isDeleted, formDIsEnablePDF: this.isEnablePDF, formDFooterMsg: this.footerMsg, file: encodeURIComponent(this.fileContents), fileName: this.fileName
    })
     .then(result => {
      console.log('result-->>',result);
      this.formRecoreId = result.Id;
      this.showLoadingSpinner = false;
      //this.formRecoreId =   event.target.dataset.formRecoreId2;
      this.fileName = this.fileName + ' - Updated Successfully';
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
      this.dataRefresh();
  }

  handleUpdateNoLogo(){
    this.showLoadingSpinner = true;
 
    updateFormNoLogoRecord({
      formDToUpdateId: this.formInfoId, formDTitle: this.title, formDFormName: this.formName, formDObjType: this.objType, fomDMessage: this.message,
      formDDateAndTime: this.dateAndTime, formDEnablePageNumber: this.enablePageNumber, formDIsActive: this.isActive,
      formDIsDeleted: this.isDeleted, formDIsEnablePDF: this.isEnablePDF, formDLogo: this.formLogo
    })
     .then(result => {
      console.log('result-->>',result);
      this.formRecoreId = result.Id;
      this.showLoadingSpinner = false;
      this.getRelatedFiles();
      this.fileUpload = false;

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
      this.dataRefresh();
  }

  dataRefresh(){
    this.readonly = true;
    this.disable = true;
    this.changeStyle = true;
    this.formName ='';
    this.objType ='';
    this.message = '';
    this.dateAndTime = '';
    this.enablePageNumber = '';
    this.isActive = '';
    this.isDeleted = '';
    this.isEnablePDF = '';
    //@track logo = '';
    this.footerMsg = '';
    this.saveEdit = false;
  }
  goBackCancel(){
    this.readonly = true;
    console.log('this.readonly cancel-->>',this.readonly)
    this.disable = true;
    this.changeStyle = true;
  } 

  suffixC(event) {
    console.log('this.title suffix-->>', this.title);
    if (event.target.name == 'titletext') {
      let stringFOrmName = event.target.value;
      if (stringFOrmName != '') {
        this.formName = stringFOrmName.replace(/ /g, "_") + "__c";
        this.infoData[0].Name = this.formName;

      }
      else {
        this.formName = '';
      }
      window.console.log(typeof this.formName);
      window.console.log('value of this.formName>>>>>>' + this.formName);
      this.infoData[0].Name = this.formName;
    }
  }

  getRelatedFiles() {
    releatedFiles({ idParent: this.formInfoId })
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
  deleteReleatedFiles({ idParent: this.formInfoId })
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
//this.fileName='';
this.fileUpload = true;
this.isUpdate = true;
this.deleteLogo = false;
}

}