// export const BASE_URL = "https://log1.app/api/v2/"; //prod
//export const BASE_URL = "http://68.183.87.215:8000/api/v2/"; //dev
export const BASE_URL = "http://13.234.118.120:8000/api/v2/"; //temp-dev
 // export const BASE_URL = "http://10.211.5.3:8000/api/v2/"; //local

let obj = {
    get(url) {
        const METHOD = 'get';
        return doHttpCall(url, METHOD);
    },
    post(url, body) {
        const METHOD = 'post';
        return doHttpCall(url, METHOD, body);
    },
    attachment(url, body) {
        const METHOD = 'post';
        const type="attachment"
        return doHttpCall(url, METHOD, body,type);
    },
    attachment_update(url, body) {
        const METHOD = 'put';
        const type="attachment"
        return doHttpCall(url, METHOD, body,type);
    },
    put(url, body) {
        const METHOD = 'put';
        return doHttpCall(url, METHOD, body);
    },
    delete(url, body) {
        const METHOD = 'delete';
        return doHttpCall(url, METHOD, body);
    }
};

async function doHttpCall(url, method, body,type = {}) {
    const data = JSON.parse(localStorage.getItem('DATA'));
    var token;
    if(data){
        token = data.token;
    }
    else{
        token=""
    }

    const NEW_URL = BASE_URL + url;
    let header;
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + token,
    }
    const form_header = {
        'Authorization': 'Token ' + token,
    }
    if (type === 'attachment') {
        header = form_header
    }
    else {
        header = headers
    }
    const promise = new Promise((resolve, reject) => {
        let options = {
            method: method,
            headers: header
        };
        if (method === 'post' || method === 'put') {
            options.body = JSON.stringify(body)
        }
        if (type === 'attachment') {
            options.body = body
        }
        fetch(NEW_URL, options)
            .then((response) => {
                resolve(response)
            }).catch((message) => {
            reject(message);
        });
    });
    return promise;
}

export default obj;
