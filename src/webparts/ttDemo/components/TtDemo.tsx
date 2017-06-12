import * as React from 'react';
import { DefaultButton, TextField, Selection } from 'office-ui-fabric-react/lib/';
//import { Modal } from 'office-ui-fabric-react/lib/Modal';
import styles from './TtDemo.module.scss';
import HyperList from './HyperList';
import HyperModal from './HyperModal';
//import { IWebPartContext} from '@microsoft/sp-webpart-base';
//import { Environment, EnvironmentType } from '@microsoft/sp-core-library';
//import MockHttpClient from '../MockHttpClient';
import { IListItem, ITtDemoProps, ITtDemoState } from '../Interfaces/MainInterfaces';
//import { SPHttpClientResponse  } from '@microsoft/sp-http';
import ListOperations from '../classes/ListOperations';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';

export default class TtDemo extends React.Component<ITtDemoProps, ITtDemoState> {
  private readonly classFadeIn: string = "ms-u-fadeIn100";
  private readonly classFadeOut: string = "ms-u-slideUpOut10";
  
  private _items : IListItem[];
  private _filterText : string;
  private _operations : ListOperations;
  private _messageClass: string;
  private _selection: Selection;

  get Items(): IListItem[] {
      if (this._filterText){
       return this._items.filter(i => i.Title.toLowerCase().indexOf(this._filterText.toLowerCase()) > -1);
    }
      return this._items;
  }
  set Items(newItems: IListItem[]) {
      this._items = newItems;
  }
  
  constructor(props: ITtDemoProps, state: ITtDemoState) {
    super(props);

    this._items = this._items || [] as IListItem[];    
    this._messageClass = styles.hide;
    this._operations = new ListOperations(this.props.httpClient, this.props.siteUrl, this.props.listName);
    this._selection = new Selection({
      onSelectionChanged: () => {
        this.setState({
          selection: this._selection
        });
      }
    });
    this.state = {
      status: this.listNotConfigured(this.props) ? 'Please configure list in Web Part properties' : 'Ready',
      items: this.Items,
      showModal: false,
      selection: this._selection,
      messageVisible: true,
      messageClass: styles.hide,
      messageType: MessageBarType.success
    };
  }


  public componentWillReceiveProps(nextProps: ITtDemoProps): void {
    this.setState({
      status: this.listNotConfigured(nextProps) ? 'Please configure list in Web Part properties' : 'Ready',
      items: this.Items,
    });
    this._operations = new ListOperations(this.props.httpClient, this.props.siteUrl, nextProps.listName);
  }
 
  public render(): React.ReactElement<ITtDemoProps> {
    //let { items, status } = this.state;
    
    return (
      <div className={styles.helloWorld}>
        <div className={styles.container}>
          <div>
           { this.state.messageVisible && 
              <MessageBar messageBarType={this.state.messageType} className={`${this.state.messageClass} ${styles.over}`} 
                onDismiss={() => {
                  this.setState({
                      messageClass: this.classFadeOut,
                      status: ""
                  });                
                }}>
              <span>{this.state.status}</span>
              </MessageBar>
          }
          </div>
          <div className={`ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}` }>
             
            <div className='ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1'>             
              <span className='ms-font-xl ms-fontColor-white'>
                Sample SharePoint CRUD operations in React
              </span>
            </div>
            <div className='ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1'>             
              <span className='ms-font-l ms-fontColor-white'>
                Currently working with: {this.props.listName}
              </span>              
            </div>
            <div className='ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1'>             
              <span className='ms-font-s ms-fontColor-white'>
                Description set in property pane: {this.props.description}
              </span>              
            </div>
          </div>
          <div className={`ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}` }>
            <div className='ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1'>
              <DefaultButton disabled={this.listNotConfigured(this.props) } onClick={() => this.createItem() }>Create item</DefaultButton>              
            </div>
          </div>
          <div className={`ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}` }>
            <div className='ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1'>
              <DefaultButton disabled={this.listNotConfigured(this.props) } onClick={() => this.readItems() }>Read all items</DefaultButton>
            </div>
          </div>

          <div className={`ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}` }>
            <div className='ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1'>              
              <DefaultButton disabled={this.listNotConfigured(this.props) } onClick={() => this.deleteSelectedItems() }>Delete selected items</DefaultButton>
            </div>
          </div>
          <div className={`ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}` }>
            <div className='ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1'>              
              <DefaultButton disabled={this.listNotConfigured(this.props) } onClick={() => this.errorBazmek() }>Error bazmek</DefaultButton>
            </div>
          </div>
          <div className={`ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}` }>
            <div className='ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1'>
              {this.state.status}
              {/*<ul>
                {itemsR}
              </ul>*/}
            </div>
          </div>
          <div className={`ms-Grid-row ms-fontColor-dark ${styles.row} ${styles.detailedList}`} >
             <TextField className={`ms-Grid-row ms-fontColor-dark ${styles.row} ${styles.detailedList}`}
                label='Filter by name:'                
                onChanged={ text => {
                    this.setState({                   
                      status: `Query for filter: ${text}`,                      
                      items: this.Items
                      });
                      this._filterText = text;
                      this.setState({
                        status : `Query for filter: ${text}`,                     
                        items: this.Items
                      });
                  }
                 }
              />
            <HyperList items = {this.state.items} selection = {this.state.selection} />
            <HyperModal visible = {this.state.showModal} />            
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
    this.setState({
      status: 'Creating item...',
    });
    this._showModal();
    this._operations.createItem(`Item ${new Date()}`)
    .then((resonse: IListItem[]): void => {      
      this._items = resonse;
      this.setState({
          status: "Item Added",
          items: this.Items
        });
        this._closeModal();
        this.reportSuccess();
    },
    (reason) => { 
      this.setState({
        status: reason
      }) ;
      this._closeModal();
    });
  }

  private readItems() {
    this.setState({
      status: 'Loading all items...',
    });
    this._showModal();
    this._operations.readItems()
    .then((response: IListItem[]): void => {     
          this._items = response;            
          this.setState({
          status: `Successfully loaded items`,
          items: this.Items,
          });
        this._closeModal();
        this.reportSuccess();
    }, reason => {
      console.log(reason);
    });    
  }
  
  private async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async deleteSelectedItems(){      
      this._showModal();
      var promisMega: Promise<boolean>[] = new Array<Promise<boolean>>();
      var deletedIDs = this._selection.getSelection().map(a => (a as IListItem).Id).join(',');
      this._selection.getSelection().forEach(async (item: IListItem) => {
        promisMega.push(this.deleteItem(item.Id));
      });
      try{
        await Promise.all(promisMega);
        this.setState({
          status: `Sucessfully deleted items: ${deletedIDs}`          
        });
        this.reportSuccess();
      }
      catch(ex){
        this.setState({
          status: `Error deleting items: ${deletedIDs} ${ex}`          
        });
        this.reportError();
      }
      finally{
        this._closeModal();    
      }
  }

   private deleteItem(id: number): Promise<boolean> {               
    return new Promise<boolean>((resolve) => {      
      this.state.selection.setAllSelected(false);
      this._operations.deleteItem(id).then((res) => {
      this._items = res;
      this.setState({
        status: `Successfully deleted item ${id}`,
        items: this.Items,
      });         
    })
    .then(() => {
      resolve(true);
    });      
    });
   }

  private errorBazmek(){
    this.setState({
      status: "ERROR BAZMEK"
    });
    this.reportError();

  }

  private _showModal() {
    this.setState({
      showModal: true
    });    
  }

  private _closeModal() {    
    this.setState({
      showModal: false
    });
  }

  private reportSuccess(){
    this.setState({
        messageType: MessageBarType.success,
        messageClass: this.classFadeIn
      });
    
    this.delay(2000).then(() =>{
      this.setState({
        messageClass: this.classFadeOut
      });
    });
  }

  private reportError(){
    this.setState({
        messageType: MessageBarType.error,
        messageClass: this.classFadeIn
      });        
  }
}
