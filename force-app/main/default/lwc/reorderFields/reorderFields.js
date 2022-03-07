import { LightningElement, wire, track, api } from 'lwc';
import getFieldList from "@salesforce/apex/formDetail.getFieldList";
import updateFieldOrder from "@salesforce/apex/formDetail.updateFieldOrder";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ReorderFields extends LightningElement {
  @track dragStart;
  @track ElementList = [];
  @api formnamereorderid;
  @track serialNumber = 0;
  @track countSerial = 0;
  @track serialArray = [];
  @track serailvaluehtml;
  //@track changedElementList=[];
  @track iteratedList = [];
  @track newIndexDrop;
  @track changedElementList;
  @track currentIndexDrag;

  connectedCallback() {
    getFieldList({ formId: this.formnamereorderid })
      .then((result) => {
        for (let i = 0; i < result.length; i++) {
          this.ElementList.push(result[i]);
        }
      })
      .catch((error) => {
        console.log("###Error : " + error.body.message);
      });
  }
  /*get serialNumCount(){ 
      this.countSerial=this.countSerial+1;
      if(this.countSerial <= this.ElementList.length){
      this.serialNumber = this.serialNumber +1;
      this.serialArray.push(this.serialNumber);
      let copyserialNumber = this.serialNumber;
      return copyserialNumber;
  }
  else{
      const constSerialArray = [...this.serialArray];
  }
  }*/
  DragStart(event) {
    this.dragStart = event.target.title;
    //this.serailvaluehtml= event.target.dataset.serialvalue;
    //console.log('this.serailvaluehtml --->>',this.serailvaluehtml);
    event.target.classList.add("drag");
  }

  DragOver(event) {
    event.preventDefault();
    return false;
  }

  Drop(event) {
    event.stopPropagation();
    this.iteratedList = [];
    const DragValName = this.dragStart;
    const DropValName = event.target.title;
    if (DragValName === DropValName) {
      return false;
    }
    const index = DropValName;
    const currentIndex = DragValName;
    this.currentIndexDrag = parseInt(DragValName);
    const newIndex = DropValName;
    this.newIndexDrop = parseInt(DropValName);
    Array.prototype.move = function (from, to) {
      this.splice(to, 0, this.splice(from, 1)[0]);
    };
    this.ElementList.move(currentIndex, newIndex);

    if (this.currentIndexDrag > this.newIndexDrop) {
      this.ElementList[this.newIndexDrop].Display_Order_number__c = this.newIndexDrop + 1;
      this.iteratedList.push({ 'Id': this.ElementList[this.newIndexDrop].Id, 'Field_name__c': this.ElementList[this.newIndexDrop].Field_name__c, 'Display_Order_number__c': this.ElementList[this.newIndexDrop].Display_Order_number__c });

      var newIndexvalue = this.newIndexDrop + 1;
      for (let i = this.newIndexDrop + 1; i <= this.currentIndexDrag; i++) {
        newIndexvalue = newIndexvalue + 1
        this.ElementList[i].Display_Order_number__c = newIndexvalue;
      }
    }
    if (this.currentIndexDrag < this.newIndexDrop) {
      this.ElementList[this.newIndexDrop].Display_Order_number__c = this.newIndexDrop + 1;
      var newIndexvalue = this.newIndexDrop + 1;
      for (let i = this.newIndexDrop - 1; i >= this.currentIndexDrag; i--) {
        newIndexvalue = newIndexvalue - 1;
        this.ElementList[i].Display_Order_number__c = newIndexvalue;
      }
    }
    console.log('this.ElementList -->>', JSON.stringify(this.ElementList));
  }
  fieldOrderupdate(event){
    console.log('this.ElementList 2-->>', JSON.stringify(this.ElementList));
    updateFieldOrder({formId:this.formnamereorderid, formFieldsList: [...this.ElementList]})
    .then(result => {
      console.log('resultId----->>' + JSON.stringify(result));
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
}