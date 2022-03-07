import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import uploadFile from '@salesforce/apex/fileUploader.uploadFile';
import { NavigationMixin } from 'lightning/navigation';

export default class FileUploader extends NavigationMixin (LightningElement) {
    @api formRecordId;
    @api formIdFormDetail;
    fileData;

    openFileUpload(event) {
        const file = event.target.files[0]
        var reader = new FileReader()
        reader.onload = () => {
            var base64 = reader.result.split(',')[1]
            this.fileData = {
                'filename': file.name,
                'base64': base64,
                'recordId': this.formRecordId
            }
            window.console.log(this.fileData)
        }
        reader.readAsDataURL(file)
    }
    handleclick() {
        window.console.log(this.fileData)
        const { base64, filename, recordId } = this.fileData
        uploadFile({ base64, filename, recordId }).then(result => {
            this.fileData = null
            console.log('result-->>',result);
            let title =`${filename} uploaded succesfully!!`
            this.toast(title)
        })
    }
    toast(title){
        const toastEvent = new  ShowToastEvent({
            title,
            variant:"success"
        })
        this.dispatchEvent(toastEvent)
    }
    handleNext(event){
        event.preventDefault();
        let componentDef = {
            componentDef: "c:formDetail",
            attributes: {
              formnamefrmdetail: this.formIdFormDetail
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
}