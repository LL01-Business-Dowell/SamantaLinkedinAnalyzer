import axios from 'axios';

const apiKey = "1b834e07-c68b-4bf6-96dd-ab7cdc62f07f";
const baseUrl = "https://www.dowelldatacube.uxlivinglab.online/db_api";

interface Payload {
  api_key: string;
  db_name: string;
  coll_name?: string;
  operation?: string;
  data?: any;
  filters?: any;
  limit?: number;
  offset?: number;
  payment?: boolean;
  query?: any;
  update_data?: any;
  coll_names?: string;
  num_collections?: number;
}

async function datacubeDataInsertion(apiKey: string, databaseName: string, collectionName: string, data: any): Promise<any> {
  const url = `${baseUrl}/crud/`;
  const payload: Payload = {
    api_key: apiKey,
    db_name: databaseName,
    coll_name: collectionName,
    operation: "insert",
    data: data,
    payment: false
  };
  const response = await axios.post(url, payload);
  return response.data;
}

async function datacubeDataRetrieval(apiKey: string, databaseName: string, collectionName: string, filters: any, limit: number, offset: number, payment: boolean): Promise<any> {
  const url = `${baseUrl}/get_data/`;
  const payload: Payload = {
    api_key: apiKey,
    db_name: databaseName,
    coll_name: collectionName,
    operation: "fetch",
    filters: filters,
    limit: limit,
    offset: offset,
    payment: payment
  };
  const response = await axios.post(url, payload);
  return response.data;
}

async function datacubeDataUpdate(apiKey: string, databaseName: string, collectionName: string, query: any, updateData: any): Promise<any> {
  const url = `${baseUrl}/crud/`;
  const payload: Payload = {
    api_key: apiKey,
    db_name: databaseName,
    coll_name: collectionName,
    operation: "update",
    query: query,
    update_data: updateData,
    payment: false
  };
  const response = await axios.put(url, payload);
  return response.data;
}

async function datacubeCreateCollection(apiKey: string, databaseName: string, collectionName: string): Promise<any> {
  const url = `${baseUrl}/add_collection/`;
  const payload: Payload = {
    api_key: apiKey,
    db_name: databaseName,
    coll_names: collectionName,
    num_collections: 1
  };
  const response = await axios.post(url, payload);
  return response.data;
}

async function datacubeCollectionRetrieval(apiKey: string, databaseName: string): Promise<any> {
  const url = `${baseUrl}/collections/`;
  const payload: Payload = {
    api_key: apiKey,
    db_name: databaseName,
    payment: false
  };
  const response = await axios.get(url, { data: payload });
  return response.data;
}

async function datacubeDataDelete(apiKey: string, databaseName: string, collectionName: string, query: any): Promise<any> {
  const url = `${baseUrl}/crud/`;
  const payload: Payload = {
    api_key: apiKey,
    db_name: databaseName,
    coll_name: collectionName,
    operation: "delete",
    query: query
  };
  const response = await axios.delete(url, { data: payload });
  return response.data;
}

export { 
  datacubeDataInsertion, 
  datacubeDataRetrieval, 
  datacubeDataUpdate, 
  datacubeCreateCollection, 
  datacubeCollectionRetrieval, 
  datacubeDataDelete 
};
