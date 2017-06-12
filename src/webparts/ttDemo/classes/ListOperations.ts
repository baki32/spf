import { IListItem } from '../Interfaces/MainInterfaces';
import { SPHttpClient, SPHttpClientResponse  } from '@microsoft/sp-http';
import MockHttpClient from '../MockHttpClient';
import { Environment, EnvironmentType } from '@microsoft/sp-core-library';

export default class ListOperations{
    private _client: SPHttpClient;
    private _siteUrl: string;
    private _listTitle: string;
    private _listItemEntityTypeName: string;

    constructor(client: SPHttpClient, url: string, listName: string){
        this._client = client;
        this._siteUrl = url;
        this._listTitle = listName;
    }


    private delay(time: number){
        return new Promise((resolve) => 
          setTimeout(() => resolve(resolve), time));
    }

    private getListItemEntityTypeName(listName: string): Promise<string> {
    return new Promise<string>((resolve: (listItemEntityTypeName: string) => void, reject: (error: any) => void): void => {
      if (this._listItemEntityTypeName) {
        return resolve(this._listItemEntityTypeName);        
      }

     this._client.get(`${this._siteUrl}/_api/web/lists/getbytitle('${listName}')?$select=ListItemEntityTypeFullName`,
        SPHttpClient.configurations.v1,
        {
          headers: {
            'Accept': 'application/json;odata=nometadata',
            'odata-version': ''
          }
        })
        .then((response: SPHttpClientResponse): Promise<{ ListItemEntityTypeFullName: string }> => {
          return response.json();
        }, (error: any): void => {
          reject(error);
        })
        .then((response: { ListItemEntityTypeFullName: string }): void => {
          this._listItemEntityTypeName = response.ListItemEntityTypeFullName;
          resolve(this._listItemEntityTypeName);
        });
    });
  }

    public createItem(itemTitle: string): Promise<IListItem[]>{
         if (Environment.type == EnvironmentType.Local){
            return this.delay(1000).then(
                (or) => MockHttpClient.addItem(itemTitle).then((a) => {
                    return a.value;
                },
                    reason => console.log(reason)
                ),
                    reason => console.log(reason)
                );    
        }
        else{
            return this.getListItemEntityTypeName(this._listTitle).then((listItemEntityTypeName: string) => {
                const body: string = JSON.stringify({
                    '__metadata': {
                    'type': listItemEntityTypeName
                    },
                    'Title': `Item ${new Date().getMilliseconds()}`            
                });
                return body;
            }).then((body) => {
                this._client.post(`${this._siteUrl}/_api/web/lists/getbytitle('${this._listTitle}')/items`,
                SPHttpClient.configurations.v1,
                {
                    headers: {
                        'Accept': 'application/json;odata=nometadata',
                        'Content-type': 'application/json;odata=verbose',
                        'odata-version': ''
                    },
                    body: body
                }).then ((res) => {
                    return res.json();
                });
            }).then((res) =>{
                return this.readItems();
            }).then((finalRes) => { 
                return finalRes;
            });            
        }
    }

    public readItems(): Promise<IListItem[]> {     
        if (Environment.type == EnvironmentType.Local){
            return this.delay(1000).then(
                (or) => MockHttpClient.getItems(this._siteUrl).then((a) => {
                    return a.value;
                },
                    reason => console.log(reason)
                ),
                    reason => console.log(reason)
                );    
        }
        else{
            return this._client.get(`${this._siteUrl}/_api/web/lists/getbytitle('${this._listTitle}')/items?$select=Title,Id`, SPHttpClient.configurations.v1,
            {
                headers: {
                    'Accept': 'application/json;odata=nometadata',
                    'odata-version': ''
                }
            }).then((response: SPHttpClientResponse): Promise<{ value: IListItem[] }> => {
                return response.json();
            })
            .then((a) => {
                let res : IListItem[] = [];
                a.value.forEach(value => {
                    var temp : IListItem = { Title: value.Title, Id: value.Id };
                    res.push(temp);
                });
                return res;
            });   
        }
    }

    public deleteItem(id: number): Promise<IListItem[]>{
        if (Environment.type == EnvironmentType.Local){
            return this.delay(1000).then(
            (or) => MockHttpClient.deleteItem(id).then((a) => {
                return a.value;
            },
                reason => console.log(reason)
            ),
                reason => console.log(reason)
            );            
        }
        else{
            return this._client.get(`${this._siteUrl}/_api/web/lists/getbytitle('${this._listTitle}')/items(${id})?$select=Id`,
            SPHttpClient.configurations.v1,
            {
                headers: {
                    'Accept': 'application/json;odata=nometadata',
                    'odata-version': ''
                }
            }).then(res => {                
                this._client.post(`${this._siteUrl}/_api/web/lists/getbytitle('${this._listTitle}')/items(${id})`,
                SPHttpClient.configurations.v1,
                {
                    headers: {
                        'Accept': 'application/json;odata=nometadata',
                        'Content-type': 'application/json;odata=verbose',
                        'odata-version': '',
                        'IF-MATCH': `${res.headers.get('ETag')}`,
                        'X-HTTP-Method': 'DELETE'
                    }
                })
                .then((finRes) => {
                    return finRes.json;
                });
            }).then(jsonRes => {
              console.log(jsonRes);
              return this.readItems();
            });    
        }
    }
}