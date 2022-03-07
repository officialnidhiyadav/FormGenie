import { LightningElement,wire,track,api } from 'lwc';
import getSteps from '@salesforce/apex/stepTransaction.getSteps';

export default class CustomLookupNextStep extends LightningElement {
    @track stepName = '';
    //@track stepFieldsList;     
    @track stepId; 
    @api nextStepFrmNme; //= 'a1I1s000002BN5AEAW'
    //@track isshow=false;
    @track messageResult=false;
    @track isShowResult = true;   
    @track showSearchedValues = false; 
    @track nextStepTitle='';
    @api nextNewStepFieldsListCopy;
    @track StepFieldsListObjectArray;
    @track StepFieldsListArray
    /*@wire(getSteps, {stepFormName:'$nextStepFrmNme',stpName:'$stepName'})
    retrieveSteps ({error, data}) {
       this.messageResult=false;
       if (data) {
           // TODO: Error handling 
           console.log('data::'+data.length);
           console.log('nextNewStepFieldsListCopy-->>',JSON.stringify(this.nextNewStepFieldsListCopy));
           if(data.length>0 && this.isShowResult){
               this.stepFieldsList = data;                
               this.showSearchedValues = true; 
               this.messageResult=false;
           }            
           else if(data.length==0){
               this.stepFieldsList = [];                
               this.showSearchedValues = false;
               if(this.stepName!='')
                   this.messageResult=true;               
           }  
               
       } else if (error) {
           // TODO: Data handling
           this.stepId =  '';
           this.stepName =  '';
           this.stepFieldsList=[];           
           this.showSearchedValues = false;
           this.messageResult=true;   
       }
   }*/
   handleClick(event){
    this.isShowResult = true;   
    this.messageResult=false; 
    console.log(' this.messageResult=false--->>', this.messageResult);
    console.log('this.nextNewStepFieldsListCopy--->>', JSON.stringify(this.nextNewStepFieldsListCopy));       
  }
  handleKeyChange(event){       
    this.messageResult=false; 
    this.stepName = event.target.value;
    console.log(' this.stepName keychange--->>', this.stepName);

    if(this.nextNewStepFieldsListCopy){
        console.log('nextNewStepFieldsListCopy length-->>', this.nextNewStepFieldsListCopy.length) 
        if(this.nextNewStepFieldsListCopy.length>0 && this.isShowResult){
            var stepFieldsList;
            stepFieldsList = [...this.nextNewStepFieldsListCopy];
            //this.stepFieldsList = [...this.nextNewStepFieldsListCopy];
            this.StepFieldsListObjectArray= Object.prototype.toString.call(stepFieldsList)
            console.log('this.StepFieldsListObjectArray-->',this.StepFieldsListObjectArray);
            //console.log('this.StepFieldsListObjectArray-->',JSON.stringify(this.StepFieldsListObjectArray));
            //this.StepFieldsListArray = JSON.stringify(this.StepFieldsListObjectArray);
            //console.log('this.stepFieldsList proxy-->',this.StepFieldsListArray);
            this.showSearchedValues = true; 
            this.messageResult=false;
        }
        else if(this.nextNewStepFieldsListCopy.length==0){
            this.stepFieldsList = [];                
            this.showSearchedValues = false;
            if(this.stepName!='')
                this.messageResult=true;               
        }  
        else {
            // TODO: Data handling
            this.stepId =  '';
            this.stepName =  '';
            this.stepFieldsList=[];           
            this.showSearchedValues = false;
            this.messageResult=true;   
        }
    }
    /*if(this.stepName != ''){

    }*/
  }  
  handleParentSelection(event){        
    this.showSearchedValues = false;
    this.isShowResult = false;
    this.messageResult=false;
    //Set the parent calendar id
    this.stepId =  event.target.dataset.value;
    //Set the parent calendar label
    this.stepName =  event.target.dataset.label; 
    this. nextStepTitle = event.target.dataset.title;     
    console.log('stepId::'+this.stepId);
    var nextStepValues = {idOfNextStep:this.stepId, nameOfNextStep:this.nextStepTitle};    
    const selectedEvent = new CustomEvent('nextselected', { detail: nextStepValues });
        // Dispatches the event.
    this.dispatchEvent(selectedEvent); 
}
@api
    nextStepDataRefresh(){
        this.stepName = '';
    }
}