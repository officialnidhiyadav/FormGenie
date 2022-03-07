import { LightningElement, wire, api, track} from 'lwc';
import getFormDetailList from '@salesforce/apex/formDetailFields.getFormDetailList';
import {updateRecord} from 'lightning/uiRecordApi';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import {refreshApex} from '@salesforce/apex';

const actions = [
    { label: 'Delete', name: 'delete' }
];

const columns = [
    {label:'Field Name', fieldName:'Field_name__c', editable:true},
    {label:'Data Type', fieldName:'Data_Type__c', editable:true},
    {
        type: 'action',
        typeAttributes: { rowActions: actions }
    }
];

export default class FormDetailFields extends LightningElement {
    columns = columns;
    draftValues = [];
    @api formDetailIdListArray;
    // @track formdetailidlistarrCopy
    @track formDetailNameResult;
    @track formDetails = [];
    @track error;
    /*@wire(getFormDetailList, { formdetailidlist: '$formDetailIdListArray'})
    formDetailNme;*/
    
    //async
    connectedCallback() {
        //const data = this.formDetailIdListArray;
        //console.log('formDetails ' + data);
        console.log('formDetailIdListArray ' + JSON.stringify(this.formDetailIdListArray));
        this.formDetails = this.formDetailIdListArray;
        console.log('formDetails ' + JSON.stringify(this.formDetails));
    }

    handleDelete(event) {
        const { id } = event.detail.row;
        const index = this.findRowIndexById(id);
        if (index !== -1) {
            this.data = this.data
                .slice(0, index)
                .concat(this.data.slice(index + 1));
        }
    }

    /*
    loadList() {
        this.formDetails = this.formDetailIdListArray;
    }*/
    
    @wire(getFormDetailList, { formdetailidlist: '$formDetailIdListArray'})
    formDetailNme(result){
        this.formDetailNameResult = result;
        if(result.data){
            this.formDetails = result.data;
            console.log('formDetails data----->>'+this.formDetails);
        this.error = undefined;
        }else if(result.error){
            this.error = result.error;
            this.formDetails= undefined;
            console.log('what is error-->>'+JSON.stringify(this.error));
        }
    }
    

   handleSave(event){
    console.log("formDetailIdListArray--->>>", typeof this.formDetailIdListArray);
        console.log(event.detail.draftValues);
        const recordInputs = event.detail.draftValues.slice().map(draft=>{
            const fields = Object.assign({}, draft)
            return {fields}
        })
        console.log("recordInputs",recordInputs)

        const promises = recordInputs.map(recordInput=> updateRecord(recordInput))
        Promise.all(promises).then(result=>{
            this.showToastMsg('success','Field updated')
            this.draftValues=[]
            console.log('formDetailNme object-->>',this.formDetailNme);
           // return refreshApex(this.formDetailNme);
           return refreshApex(this.formDetailNameResult);
        }).catch(error=>{
this.showToastMsg('Error creating record', error.body.message, error)
        })

    }
    showToastMsg(title, message, variant){
        this.dispatchEvent(
            new ShowToastEvent({
                title:title,
                message:message,
                variant:variant||'success'
            })
        )
    }
    
    //@api processChildData(){
   /* new Promise(function(resolve,reject){
        if(this.formDetailNme){
            console.log('processChildData --->>',this.formDetailNme);*/
        //return refreshApex(this.formDetailNameResult);
       // }
   // })
    /*handleInsert(){
        console.log('this.formDetailIdListArray ----->>>'+this.formDetailIdListArray);
    }*/
}