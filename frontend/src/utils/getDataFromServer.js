import config from '../config.json'

export default async function GetDataFromServer(handlerSetData, urlServer) {
    try {
        const response = await fetch(config.server+urlServer);
        const dataFromServer = await response.json();
        handlerSetData(dataFromServer);
    } catch (error) {
        console.error('Error:', error);
    }
};

export async function GetDataFromServerContext(handlerSetData, urlServer, additionalData) {
    try {
        const response = await fetch(config.server + urlServer, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(additionalData)
        });

        const dataFromServer = await response.json();
        handlerSetData(dataFromServer);
    } catch (error) {
        console.error('Error:', error);
    }
}
