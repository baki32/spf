import * as React from 'react';
import {   
  Button, 
  DetailsList,
  MarqueeSelection,
  Selection,
  TextField,
  Link,
  Callout
 } from 'office-ui-fabric-react/lib/';
import styles from './TtDemo.module.scss';


import {SPHttpClient} from '@microsoft/sp-http';
import * as Ctx from '@microsoft/sp-page-context'

import {
  Environment,
  EnvironmentType
} from '@microsoft/sp-core-library';

import MockHttpClient from '../MockHttpClient';


import { ITtDemoWebPartProps } from '../ITtDemoWebPartProps';

export interface ITtDemoProps extends ITtDemoWebPartProps {
  httpClient: SPHttpClient;
  //mockHttpClient: MockHttpClient;
  siteUrl: string;
}

export interface ITtDemoState {
  status?: string;
  items?: IListItem[];
  selectionDetails?: string;
}

export interface IListItem {
  Title?: string;
  Id: number;
}

let _items : IListItem[];

export default class TtDemo extends React.Component<ITtDemoProps, ITtDemoState> {
  
  private _menuButtonElement: HTMLElement;
  private listItemEntityTypeName: string = undefined;
  private _selection: Selection;

  constructor(props: ITtDemoProps, state: ITtDemoState) {
    super(props);

    _items = _items || [] as IListItem[];

    this._onRenderItemColumn = this._onRenderItemColumn.bind(this);
    this._selection = new Selection({
      onSelectionChanged: () => this.setState({ 
        selectionDetails: this._getSelectionDetails(),
        status: 'Selection Changed',
        items: _items
      })
    });


    this.state = {
      status: this.listNotConfigured(this.props) ? 'Please configure list in Web Part properties' : 'Ready',
      items: _items,
      selectionDetails: this._getSelectionDetails()
    };
  }

  private _onRenderItemColumn(item, index, column) {
    if (column.key === 'name') {
      return <Link data-selection-invoke={ true }>{ item[column.key] }</Link>;
    }

    return item[column.key];
  }

  private _getSelectionDetails(): string {
    let selectionCount = this._selection.getSelectedCount();

    switch (selectionCount) {
      case 0:
        return 'No items selected';
      case 1:
        return '1 item selected: ' + (this._selection.getSelection()[0] as any).Title;
      default:
        return `${ selectionCount } items selected`;
    }
  }


  public componentWillReceiveProps(nextProps: ITtDemoProps): void {
    this.listItemEntityTypeName = undefined;
    this.setState({
      status: this.listNotConfigured(nextProps) ? 'Please configure list in Web Part properties' : 'Ready',
      items: _items,
      selectionDetails: this._getSelectionDetails()
    });
  }

  
  public render(): React.ReactElement<ITtDemoProps> {
    //let { items, selectionDetails } = this.state;
    

    const items: JSX.Element[] = this.state.items.map((item: IListItem, i: number): JSX.Element => {
      return (
        <li>{item.Title} ({item.Id}) </li>
      );
    });
    
    return (
      <div className={styles.helloWorld}>
        <div className={styles.container}>
          <div className={`ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}` }>
            <div className='ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1'>
              <span className='ms-font-xl ms-fontColor-white'>
                Sample SharePoint CRUD operations in React
              </span>
            </div>
          </div>
          <div className={`ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}` }>
            <div className='ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1'>
              <Button disabled={this.listNotConfigured(this.props) } onClick={() => this.createItem() }>Create item</Button>              
            </div>
          </div>
          <div className={`ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}` }>
            <div className='ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1'>
              <Button disabled={this.listNotConfigured(this.props) } onClick={() => this.readItems() }>Read all items</Button>
            </div>
          </div>
          <div className={`ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}` }>
            <div className='ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1'>              
              <Button disabled={this.listNotConfigured(this.props) } onClick={() => this.deleteItem() }>Delete last item</Button>
            </div>
          </div>
          <div className={`ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}` }>
            <div className='ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1'>
              {this.state.status}
              <ul>
                {items}
              </ul>
            </div>
          </div>
          <div className={`ms-Grid-row ms-fontColor-dark ${styles.row} ${styles.detailedList}` }>
            <div>{ this.state.selectionDetails }</div>
              <TextField
                label='Filter by name:'
                onChanged={ text => this.setState({ 
                  selectionDetails: this._getSelectionDetails(), 
                  status: `Query for filter: ${text}`,
                  items: text ? _items.filter(i => i.Title.toLowerCase().indexOf(text.toLowerCase()) > -1) : _items }) 
                }
              />
              <MarqueeSelection selection={ this._selection }>
                <DetailsList
                  items={ this.state.items }
                  setKey='set'
                  selection={ this._selection }
                  onItemInvoked={ (item) => alert(`Item invoked: ${item.Title}`) }
                  onRenderItemColumn={ this._onRenderItemColumn }
                  />
              </MarqueeSelection>
          </div>
        </div>
      </div>
    );
  }
  
  private listNotConfigured(props: ITtDemoProps): boolean {
    return props.listName === undefined ||
      props.listName === null ||
      props.listName.length === 0;
  }

  private createItem(): void {
    

    // this.getListItemEntityTypeName()
    //   .then((listItemEntityTypeName: string): Promise<Response> => {
    //     const body: string = JSON.stringify({
    //       '__metadata': {
    //         'type': listItemEntityTypeName
    //       },
    //       'Title': `Item ${new Date()}`
    //     });
    //     return this.props.httpClient.post(`${this.props.siteUrl}/_api/web/lists/getbytitle('${this.props.listName}')/items`, null,null);
    //   })
    this.setState({
      status: 'Creating item...',
      items: _items,
      selectionDetails : this._getSelectionDetails()
    });

    MockHttpClient.addItem(`Item ${new Date()}`)
      .then((response: IListItem[]): boolean => {
      _items = response;
      this.setState({
        status: "Item Added",
        items: _items,
        selectionDetails: this._getSelectionDetails()
      });
        return true;
      });
      // .then((item: IListItem): void => {
      //   this.setState({
      //     status: `Item '${item.Title}' (ID: ${item.Id}) successfully created`,
      //     items: []
      //   });
      // }, (error: any): void => {
      //   this.setState({
      //     status: 'Error while creating the item: ' + error,
      //     items: []
      //   });
      // });
      
    
  }

  private readItems(): void {
    this.setState({
      status: 'Loading all items...',
      items: [],
      selectionDetails: ""
    });
    
    MockHttpClient.getItems(this.props.siteUrl)
      .then((data: IListItem[]) => {
        
        return data;
      }).then((response: IListItem[]): void => {
        _items = response;
        this.setState({
          status: `Successfully loaded items`,
          items: _items,
          selectionDetails: ""
      });
      });
  }

  private deleteItem(): void {
    // if (!window.confirm('Are you sure you want to delete the latest item?')) {
    //   return;
    // }
    
    MockHttpClient.deleteLastItem()
      .then((data: IListItem[]) => {        
        return data;
      }).then((response: IListItem[]): void => {
        _items = response
        this.setState({
          status: `Successfully deleted last item`,
          items: _items,
          selectionDetails: this._getSelectionDetails()
        });
      });
  }
}
