export type status = {
    connected: boolean,
    target: number,
    temperature: number
}
export const default_status: status = {
    connected: false,
    target: 0,
    temperature: 0
}

class Controller {
    static api_link: string = 'http://192.168.1.102';

    static async getStatus(): Promise<status> {
        try {
            let fetchAbort = new AbortController();
            let fetchTimeout = setTimeout(() => fetchAbort.abort(), 2000);
            let response = await fetch(`${this.api_link}/status`, { signal: fetchAbort.signal });
            clearTimeout(fetchTimeout);

            let data = await response.json();
            data.connected = true;
            return data;
        } catch {
            return default_status;
        }
    }

    static async setTemperature(temp: number) {
        fetch(`${this.api_link}/set?target=${temp}`)
    }
}

export default Controller