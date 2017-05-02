import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  IWebPartContext
} from '@microsoft/sp-webpart-base';

import {
  SPHttpClient
} from '@microsoft/sp-http'

import * as strings from 'ttDemoStrings';
import TtDemo from './components/TtDemo';
import { ITtDemoProps } from './components/TtDemo';
import { ITtDemoWebPartProps } from './ITtDemoWebPartProps';
import styles from './components/TtDemo.module.scss';



import MockHttpClient from './MockHttpClient';

export interface ISPLists {
    value: ISPList[];
}

export interface ISPList {
    Title: string;
    Id: string;
}


export default class TtDemoWebPart extends BaseClientSideWebPart<ITtDemoWebPartProps> {
  
  public render(): void {
    
    
    const element: React.ReactElement<ITtDemoProps > = React.createElement(
      TtDemo,
      {
        listName: this.properties.listName,
        description: this.properties.description,
        siteUrl: this.context.pageContext.web.absoluteUrl,        
        httpClient: this.context.spHttpClient
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                 PropertyPaneTextField('listName', {
                  label: strings.ListNameFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
