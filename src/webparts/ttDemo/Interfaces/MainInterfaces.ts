import { SPHttpClient } from '@microsoft/sp-http';
//import { IClientSideWebPartStatusRenderer } from '@microsoft/sp-webpart-base';
import { Selection } from 'office-ui-fabric-react/lib/';
import { MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';

export interface ISPLists {
    value: ISPList[];
}

export interface ISPList {
    Title: string;
    Id: string;
}

export interface  IListItem {
  Title?: string;
  Id: number;
}

export interface ITtDemoWebPartProps {
  description: string;
  listName: string;
}

export interface ITtDemoProps extends ITtDemoWebPartProps {
  httpClient: SPHttpClient;  
  siteUrl: string;
  isBusy(busy:boolean):void;
}

export interface ITtDemoState {
  status?: string;
  items?: IListItem[];
  showModal? : boolean;
  selection?: Selection;
  messageVisible?: boolean;
  messageClass?: string;
  messageType?: MessageBarType;  
}