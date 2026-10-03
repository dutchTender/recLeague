export interface  APIResponse {

status?: number;
data?: any;
message?: string;
metaData?: MetaData;

}


export interface  MetaData {
  stats: string;
  uri: string;
}
