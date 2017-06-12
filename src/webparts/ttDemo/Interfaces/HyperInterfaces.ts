import { IListItem } from './MainInterfaces';
import { Selection } from 'office-ui-fabric-react/lib/';

export interface IHyperListState {
  selectionDetails?: string;
}

export interface IHyperListProps {
  items: IListItem[];
  selection : Selection;  
  //isBusy(busy:boolean):boolean;
}

export interface IHyperModalState {

}

export interface IHyperModalProps {
  visible: boolean;
  //isBusy(busy:boolean):boolean;
}