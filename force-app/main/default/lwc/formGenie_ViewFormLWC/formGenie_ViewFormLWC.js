import { LightningElement,track,wire,api } from 'lwc';
import getForms from '@salesforce/apex/form.getActiveForms';
import { NavigationMixin } from 'lightning/navigation';
export default class FormGenie_ViewFormLWC extends NavigationMixin(LightningElement) {
    @track formlist=[];
    @track selectedrecordid;
    @track filedata=true;
    @wire(getForms)
    formRecords({ data ,error}) {
        if(data){
        this.formlist = data;
            console.log('Active Form Data====>'+JSON.stringify( this.formlist ));
        //refreshApex(this.formlist);
        }
    }

    async viewFormDetails(event){
        //this.Viewdetails=true;
        let index = event.currentTarget.dataset.id;
        console.log('Selected Form Record Id==>'+event.currentTarget.dataset.id);
        this.selectedrecordid=index;
        let componentDef = {
            componentDef: "c:formGenieViewFormChild",
             attributes: {
             selectedformid: index
             }
             };
             let encodedComponentDef = btoa(JSON.stringify(componentDef));
             this[NavigationMixin.Navigate]({
                 type: 'standard__webPage',
                 attributes: {
                     url: '/one/one.app#' + encodedComponentDef
                 }
             });
      
        
           
     //this.getFormDetailList();
    }

   
}