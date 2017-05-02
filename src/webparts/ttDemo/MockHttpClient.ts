import { IListItem } from './components/TtDemo';

export default class MockHttpClient {

    private static _items: IListItem[] = [{ Title: 'Mock Item', Id: 1 },
                                        { Title: 'Mock Item 2', Id: 2 },
                                        { Title: 'Mock Item 3', Id: 3 }];
    
    public static getItems(restUrl: string, options?: any): Promise<IListItem[]> {
    return new Promise<IListItem[]>((retVal) => {
            MockHttpClient._items = MockHttpClient._items || [] as IListItem[];
            retVal(MockHttpClient._items);
        });
    }

    public static addItem(itemTitle: string, options?: any): Promise<IListItem[]>{
        return new Promise<IListItem[]>((retVal) => {
        var id: number;
        if (MockHttpClient._items.length == 0){
            id = 0
        }
        else{
            id = MockHttpClient._items[MockHttpClient._items.length - 1].Id;
        }
            var item: IListItem = {Title: itemTitle, Id: id + 1};
            MockHttpClient._items.push(item);
            retVal(MockHttpClient._items);
        })
    } 

    public static deleteLastItem(): Promise<IListItem[]>{
        return new Promise<IListItem[]>((retVal) => {
          MockHttpClient._items.pop();
          retVal(MockHttpClient._items || [] as IListItem[]);
        });
    }
}