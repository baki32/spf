import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart, IPropertyPaneConfiguration, PropertyPaneTextField, PropertyPaneDropdown, IPropertyPaneDropdownOption} from '@microsoft/sp-webpart-base';
import { Environment, EnvironmentType } from '@microsoft/sp-core-library';
import { SPHttpClient } from '@microsoft/sp-http';
import * as strings from 'ttDemoStrings';
import TtDemo from './components/TtDemo';
//import styles from './components/TtDemo.module.scss';
import { ITtDemoProps, ITtDemoWebPartProps } from './Interfaces/MainInterfaces';
//import MockHttpClient from './MockHttpClient';

export default class TtDemoWebPart extends BaseClientSideWebPart<ITtDemoWebPartProps> {
   private lists: IPropertyPaneDropdownOption[];
   private listsDropdownDisabled: boolean = true;
   private shouldBeReactive: boolean = false;
   private isPropertyPaneBusy: boolean = true;

   private setBusy(busy:boolean){
    if (busy){      
        this.context.statusRenderer.displayLoadingIndicator(this.domElement,"BUSY BAZMEK", 1);            
    }
    else{
        this.context.statusRenderer.clearLoadingIndicator(this.domElement);      
        this.render();
    }
   }

  public render(): void {        
    const element: React.ReactElement<ITtDemoProps> = React.createElement(
      TtDemo,
      {
        listName: this.properties.listName,
        description: this.properties.description,                
        httpClient: this.context.spHttpClient,
        siteUrl: this.context.pageContext.web.absoluteUrl,
        isBusy: busy => this.setBusy(busy)
      }
    );
  
    ReactDom.render(element, this.domElement);
    if (Environment.type === EnvironmentType.ClassicSharePoint) {
      const buttons: NodeListOf<any> = this.domElement.getElementsByTagName('button');
      if (buttons && buttons.length) {
        for (let i: number = 0; i < buttons.length; i++) {
          if (buttons[i]) {
            /* tslint:disable */
            // Disable the button onclick postback
            buttons[i].onclick = function() { return false; };
            /* tslint:enable */
          }
        }
      }
    }
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected onPropertyPaneConfigurationStart(){      
      var promise: Promise<any>;
      if (Environment.type == EnvironmentType.Local){
        promise = new Promise<IPropertyPaneDropdownOption[]>((resolve: (options: IPropertyPaneDropdownOption[]) => void, reject: (error: any) => void) => {
          setTimeout((): void => {
            resolve([{
              key: 'sharedDocuments',
              text: 'Shared Documents'
            },
            {
              key: 'myDocuments',
              text: 'My Documents'
            }]);
          }, 3000);
        }).then(res => {
          this.lists = res;
          this.listsDropdownDisabled = false;                          
        });
      }
      else{
        promise = this.context.spHttpClient.get(this.context.pageContext.web.absoluteUrl + "/_api/web/lists?$filter=BaseTemplate%20eq%20100&$Select=BaseTemplate,BaseType,Title", 
        SPHttpClient.configurations.v1,
        {
            headers: {
              'Accept': 'application/json;odata=nometadata',
              'odata-version': ''
            }
        }).then(res => {
          return res.json();        
        }).then(ret => {
          this.lists = ret.value.map(a => { return {
            key: a.Title, text: a.Title};
          });
          this.listsDropdownDisabled = false;         
        });
      }

      promise.then(() => {
        this.isPropertyPaneBusy = false;
        this.context.propertyPane.refresh();
        this.render();
      });      
  }

  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any){
    console.log(propertyPath);
    if (propertyPath.indexOf('listName') > -1){
      this.shouldBeReactive = false;
      this.context.propertyPane.refresh();    
    }
    else{
      this.shouldBeReactive = true;
      this.context.propertyPane.refresh();    
      this.render();
    }
  }

  protected get disableReactivePropertyChanges(): boolean { 
    return !this.shouldBeReactive; 
  }   

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {    
    return {   
      showLoadingIndicator: this.isPropertyPaneBusy,
      loadingIndicatorDelayTime: 1,
      pages: [
        {
          header: {            
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneDropdown('listName', {
                  label: strings.ListNameFieldLabel,                  
                  options: this.lists,
                  disabled: this.listsDropdownDisabled
                }),
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel,                  
                })                               
              ]
            }
          ]
        }
      ]
    };
  }
}
