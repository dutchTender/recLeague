export interface  APIResponse {

code?: number;
data?: any;
message?: string;
metaData?: MetaData;

}


export interface  MetaData {
  stats: string;
  uri: string;
}
