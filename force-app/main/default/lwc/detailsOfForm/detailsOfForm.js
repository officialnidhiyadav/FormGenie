import { LightningElement, api, track } from 'lwc';

export default class DetailsOfForm extends LightningElement {
    @api formId;
    @api publicCallWire;
    @track tabLabel;
    @track formFields = false;
    connectedCallback(){
        var callWire = true;
        this.publicCallWire = callWire;
        console.log("formId-->>", this.formId);
    }
    handleActive(event){
        console.log('event.target.label--->>', event.target.label);
        this.tabLabel = event.target.label;
        if(this.tabLabel === 'Form Fields'){
            this.formFields = true;
        }
        //if(this.tabLabel == '')
    }
}