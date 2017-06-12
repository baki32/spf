import * as React from 'react';
import { DetailsList, MarqueeSelection, Link } from 'office-ui-fabric-react/lib/';
import styles from './TtDemo.module.scss';
import { IListItem } from '../Interfaces/MainInterfaces';
import { IHyperListState, IHyperListProps } from '../Interfaces/HyperInterfaces';

export default class HyperList extends React.Component<IHyperListProps, IHyperListState> {
  private _items : IListItem[];
  private _filterText : string;

  get Items(): IListItem[] {
      if (this._filterText){
       return this._items.filter(i => i.Title.toLowerCase().indexOf(this._filterText.toLowerCase()) > -1);
    }
      return this._items;
  }
  set Items(newItems: IListItem[]) {
      this._items = newItems;
  }

  //private _filteredItems : IListItem[];

  //private _selection: Selection;

   constructor(props: IHyperListProps, state: IHyperListState) {
    super(props);
    this._items = props.items || [] as IListItem[];    
    this._onRenderItemColumn = this._onRenderItemColumn.bind(this);
    
    this.state = {
      selectionDetails: this._getSelectionDetails(),
    };
  }

  public componentWillReceiveProps(nextProps: IHyperListProps): void {
      if ( this.props.items.length != nextProps.items.length){
          //this._selection.setAllSelected(false);
          this.props.selection.setAllSelected(false);
      }        
      this.setState({
        selectionDetails: this._getSelectionDetails()
      });        
  }

  public render(): React.ReactElement<IHyperListProps> {
    //let { selectionDetails } = this.state;    
    
    return (              
          <div className={`ms-Grid-row ms-fontColor-dark ${styles.row} ${styles.detailedList}` }>
            <div>{ this.state.selectionDetails }</div>             
              <MarqueeSelection selection={ this.props.selection }>
                <DetailsList key="dtlLst" 
                  items={ this.props.items }
                  setKey='set'
                  selection={ this.props.selection }
                  onItemInvoked={ (item) => alert(`Item invoked: ${item.Title}`) }
                  onRenderItemColumn={ this._onRenderItemColumn }                           
                  />
              </MarqueeSelection>              
          </div>
    );
  }

 private _onRenderItemColumn(item, index, column) {
    if (column.key === 'name') {
      return <Link data-selection-invoke={ true }>{ item[column.key] }</Link>;
    }

    return item[column.key];
  }

  private _getSelectionDetails(): string {
    let selectionCount = this.props.selection.getSelectedCount();

    switch (selectionCount) {
      case 0:
        return 'No items selected';
      case 1:
        return '1 item selected: ' + (this.props.selection.getSelection()[0] as any).Title;
      default:
        return `${ selectionCount } items selected`;
    }
  }
}

