import { LightningElement,wire,track, api } from 'lwc';
import getStepFields from '@salesforce/apex/transitionRule.getStepFields';  

export default class CustomLookupTransitionRule extends LightningElement {
    @track stepFieldName = '';
    @track stepFieldsList = [];     
    @track stepFieldId;
    @api toStp;
    @track messageResult=false;
    @track isShowResult = true;   
    @track showSearchedValues = false;
    
    @wire(getStepFields, {toStep: '$toStp', stpFieldName:'$stepFieldName'})
    retrieveStepFields ({error, data}) {
       this.messageResult=false;
       if (data) {
           // TODO: Error handling 
           console.log('data::'+data.length);
           if(data.length>0 && this.isShowResult){
               this.stepFieldsList = data;                
               this.showSearchedValues = true; 
               this.messageResult=false;
           }            
           else if(data.length==0){
               this.stepFieldsList = [];                
               this.showSearchedValues = false;
               if(this.stepFieldName!='')
                   this.messageResult=true;               
           }  
               
       } else if (error) {
           // TODO: Data handling
           this.stepFieldId =  '';
           this.stepFieldName =  '';
           this.stepFieldsList=[];           
           this.showSearchedValues = false;
           this.messageResult=true;   
       }
   }

   handleClick(event){
    this.isShowResult = true;   
    this.messageResult=false; 
    console.log('this.toStp--->>',this.toStp);      
  }
  handleKeyChange(event){       
    this.messageResult=false; 
    this.stepFieldName = event.target.value;
  } 
  handleParentSelection(event){        
    this.showSearchedValues = false;
    this.isShowResult = false;
    this.messageResult=false;
    //Set the parent calendar id
    this.stepFieldId =  event.target.dataset.value;
    //Set the parent calendar label
    this.stepFieldName =  event.target.dataset.label;      
    console.log('stepFieldId::'+this.stepFieldId);    
    const selectedEvent = new CustomEvent('selected', { detail: this.stepFieldId });
        // Dispatches the event.
    this.dispatchEvent(selectedEvent);    
}
}