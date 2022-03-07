import { LightningElement, track, wire, api} from 'lwc';
 
import Objects_Type from "@salesforce/apex/Sample_Controller.f_Get_Types";
 
export default class Sample_Combobox extends LightningElement {
    @track l_All_Types;
    @track TypeOptions;
    @track Picklist_Value;
    @wire(Objects_Type, {})
    WiredObjects_Type({ error, data }) {
 
        if (data) {
            try {
                this.l_All_Types = data; 
                let options = [];
                 
                for (var key in data) {
                    // Here key will have index of list of records starting from 0,1,2,....
                    options.push({ label: data[key].Name, value: data[key].Name  });
 
                    // Here Name and Id are fields from sObject list.
                }
                this.TypeOptions = options;
                 
            } catch (error) {
                console.error('check error here', error);
            }
        } else if (error) {
            console.error('check error here', error);
        }
 
    }
 
    handleTypeChange(event){
        this.Picklist_Value = event.target.value;
        console.log('this.Picklist_Value',this.Picklist_Value); 
        // Do Something.
       
     const selectedEvent = new CustomEvent('selected', { detail: this.Picklist_Value });
    // Dispatches the event.
    this.dispatchEvent(selectedEvent);
    }
    
}