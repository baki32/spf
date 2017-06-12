import { IListItem } from './interfaces/MainInterfaces';

export interface MockHttpClientResponse{
    value: Array<IListItem>;
}

export default class MockHttpClient {

    private static _items : MockHttpClientResponse = {value : [{ Title: 'Mock Item', Id: 1 },
                                        { Title: 'Mock Item 2', Id: 2 },
                                        { Title: 'Mock Item 3', Id: 3 }] as IListItem[]
                                         };
    
    public static getItems(restUrl: string, options?: any): Promise<MockHttpClientResponse> {
        return new Promise<MockHttpClientResponse>((retVal) => {
            MockHttpClient._items.value = MockHttpClient._items.value || [] as IListItem[];
            return retVal(MockHttpClient._items);
        });
    }

    public static addItem(itemTitle: string, options?: any): Promise<MockHttpClientResponse>{
        return new Promise<{ value :IListItem[]}>((retVal) => {
        var id: number;
        if (MockHttpClient._items.value.length == 0){
            id = 0;
        }
        else{
            id = MockHttpClient._items.value[MockHttpClient._items.value.length - 1].Id;
        }
            var item: IListItem = {Title: itemTitle, Id: id + 1};
            MockHttpClient._items.value.push(item);
            retVal(MockHttpClient._items);
        });
    } 

    public static deleteItem(id: number): Promise<MockHttpClientResponse>{
        return new Promise<{ value :IListItem[]}>((retVal) => {
          var itemToDelete = MockHttpClient._items.value.filter(a => a.Id == id);

          if (itemToDelete){
              MockHttpClient._items.value.splice(MockHttpClient._items.value.indexOf(itemToDelete[0]), 1);
          }
          retVal(MockHttpClient._items);
        });
    }
}