import { LightningElement, track, wire,api } from 'lwc';
import getValidationFields from '@salesforce/apex/validationRule.getValidationFields';

export default class CustomLookupValidationRule extends LightningElement {
    @track formFieldName = '';
    @api validFrmNme;
    @track formFieldsList = [];     
    @track formFieldId; 
    @track isshow=false;
    @track messageResult=false;
    @track isShowResult = true;   
    @track showSearchedValues = true;  
    // 
    @wire(getValidationFields, {validFormName: '$validFrmNme', validFromFieldName: '$formFieldName'})
    retrieveValidationFields ({error, data}) {
       this.messageResult=false;
       if (data) {
           // TODO: Error handling 
           console.log('data::'+data.length);
           if(data.length>0 && this.isShowResult){
               this.formFieldsList = data;                
               //this.showSearchedValues = true; 
               this.messageResult=false;
           }            
           else if(data.length==0){
               this.formFieldsList = [];                
               //this.showSearchedValues = false;
               //if(this.accountName!='')
                   this.messageResult=false;               
           }  
               
       } else if (error) {
           // TODO: Data handling
           this.formFieldId =  '';
           this.formFieldName =  '';
           this.formFieldsList=[];           
           //this.showSearchedValues = false;
           this.messageResult=true;   
       }
   }

   handleClick(event){
    this.isShowResult = true;   
    this.messageResult=false;        
  }
  /*handleKeyChange(event){       
    this.messageResult=false; 
    this.formFieldName = event.target.value;
  } */ 

  handleParentSelection(event){        
    //this.showSearchedValues = false;
    this.isShowResult = false;
    this.messageResult=false;
    //Set the parent calendar id
    this.formFieldId =  event.target.dataset.value;
    //Set the parent calendar label
    this.formFieldName =  event.target.dataset.label;      
    console.log('formFieldId::'+this.formFieldId);
    console.log('this.formFieldName::'+this.formFieldName);  
    var fieldValues = { idOfField: this.formFieldId, nameOfFiled: this.formFieldName};  
    const selectedEvent = new CustomEvent('selected', { detail: fieldValues });
        // Dispatches the event.
    this.dispatchEvent(selectedEvent);    
}
}