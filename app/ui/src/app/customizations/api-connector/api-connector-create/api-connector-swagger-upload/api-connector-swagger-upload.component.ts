import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { ApiHttpService } from '@syndesis/ui/platform';
import { Store } from '@ngrx/store';

import {
  ApiConnectorState,
  CustomSwaggerConnectorRequest,
  ApiConnectorValidationError,
} from '@syndesis/ui/customizations/api-connector';

@Component({
  selector: 'syndesis-api-connector-swagger-upload',
  templateUrl: './api-connector-swagger-upload.component.html',
  styleUrls: ['./api-connector-swagger-upload.component.scss']
})
export class ApiConnectorSwaggerUploadComponent {
  @Input() apiConnectorState: ApiConnectorState;
  @Output() request = new EventEmitter<CustomSwaggerConnectorRequest>();
  swaggerFileUrl: string;
  swaggerFileList: FileList;

  get validationError(): ApiConnectorValidationError {
    if (this.apiConnectorState &&
      this.apiConnectorState.createRequest &&
      this.apiConnectorState.createRequest.errors &&
      this.apiConnectorState.createRequest.errors.length > 0) {
      return this.apiConnectorState.createRequest.errors[0];
    }
  }

  onFile(event): void {
    if (event.target && event.target.files) {
      this.swaggerFileList = event.target.files;
    } else {
      this.swaggerFileList = null;
    }
  }

  onSubmit({ valid }): void {
    if ((this.swaggerFileUrl && valid) || this.swaggerFileList) {
      const validateSwaggerRequest = {
        connectorTemplateId: 'swagger-connector-template',
        configuredProperties: {
          specification: this.swaggerFileUrl
        },
        file: this.swaggerFileList && this.swaggerFileList.item[0]
      };

      this.request.next(validateSwaggerRequest);
    }
  }
}
