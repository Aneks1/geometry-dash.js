import axios from "axios";
import params from '../Utils/params'
import { format } from "util";
/**
 * A class that acts as a wrapper around axios to make http stuff easier
 */
export class HttpClient {

    public constructor() {
        axios.defaults.headers.common["User-Agent"] = "";
    }

    private static baseURLGenerator(endpoint : string)  {
        return new URL(`${endpoint}.php`, params.baseUrl);
    }

    public async post<T extends string[]>(endpoint: string, urlSearchParams? : Record<string, string> & { secret : string }) : Promise<T> {
        const url = HttpClient.baseURLGenerator(endpoint);
        const data = await axios.post(url.toString(), new URLSearchParams(urlSearchParams))
            .then( res =>
                res.data as ( string | -1 | -2 )
        );
        if(data === -1) {
            throw Error(format(`${endpoint}.php: Got -1 as response (not found). Params: `, urlSearchParams))
        }
        if(data === -2) {
            throw Error(format(`${endpoint}.php: Got -2 as response (empty list).`))
        }
        return data.split('|') as T;

    }

    public async patch<T>(endpoint: string, data : T) {
        const url = HttpClient.baseURLGenerator(endpoint);
        return axios.patch<T>(url.toString(), data)
    }

    public async delete(endpoint : string) {
        const url = HttpClient.baseURLGenerator(endpoint);
        return axios.delete(url.toString())
    }

    public async put<T>(endpoint : string, data : T) {
        const url = HttpClient.baseURLGenerator(endpoint);
        return axios.put(url.toString(), data)
    }

}

export default new HttpClient()