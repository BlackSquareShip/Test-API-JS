let link = 'https://thingproxy.freeboard.io/fetch/https://blackship.amocrm.com/oauth2/access_token'

function getToken(url) {
    let header_token = {
        'Content-Type':'application/json'
    }
    const data = {
        client_id:"931b6731-1810-48d1-9e71-847b7ffdab17",
        client_secret:"Zptu41Xv9Tf8FzJcPx5YQwWubX7Q98hbsv5kfgfEyY6yHnkDywRg8gWZ7NbVGn9q",
        grant_type:"authorization_code",
        code:"def50200f4e95d8466222d9319a7be51b372dee0e21dedde2c9a63fb83aa81a99999fb0c83ca34ceeb03e3455f718f186e6c0f2742aceca51ac81468434b4ffdfb1fd2806a1df5af667c21a7485fd59afecf4983d1d33c5dd1c9dde82e158cb0e4aaa9f77f6a7af9ab25ecf557dd0ace50f25ccfd687add077bc14b1ceaf81bdafa92e4cc79f3541821dd1a2d988dc73627028134971198695d7414b089bced84bab7013af158bb06e65143461585e4cdf2a63d05fb0a0bf5129cfdec5b1d0521188ae47140bd664433a6919b867243edf0a338e7d4e2504eccf5bf7c5f17690acfba83e656e4773f78a68ea4b3dacab75d1e8895461c5c1ce56749a505ea41884968029cad23813b83e979a1fdd8b795c7f58f9ea88fd18a75b06b984e2d4705ed4555a9fd5289b7861b376119bf0e10f3da0d9820261c16f84f8b6d8daac755dfcf102c05dccf4b08cb44d6801b412ecf1278b43ef30336d616f675d9e7b72abf768372be30c765f135dd38129ff8a74ead6db200f2a9f8ad17651b41e3e38ffc8ef17081e81eb17b4e351b7053c4868c89964413c204364f6b7caaca0d7ed7b1a0d5b57b1b06531cd28ce410f7b5481b55821720c1e8c04b3972dccf1109629472cd535d0b7e122d523ee29f0",
        redirect_uri:"https://habr.com/ru/post/650019/"
    }
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: header_token
    }).then(response => {
        return response.json()
    }).then(data => {
        return (data['access_token'])
    })
}
const access_token = getToken(link)

let headers = {
    'Authorization':'Bearer ' + access_token,
    'Content-Type': 'Application/json'
}
let contactLink = 'https://thingproxy.freeboard.io/fetch/https://blackship.amocrm.com/api/v4/contacts?with=leads'
let taskLink = 'https://thingproxy.freeboard.io/fetch/https://blackship.amocrm.com/api/v4/tasks'
const limit = 25;
let page = 1;
let contactId = [];

function getContact(url) {
    return fetch(url, {
        method: 'GET',
        headers: headers,
        data: {
            limit: limit,
            page: page
        }

    }).then(response => {
        if(response.status == 204){
            console.log('Контактов нет');
            return false;
        } else {
            return  response.json()
        }
    }).then(data => {
            if(data) {
                for(let i = 0; i < data['_embedded']['contacts'].length; i++)
                if (data['_embedded']['contacts'][i]['_embedded']['leads'].length == 0) {
                    contactId.push(data['_embedded']['contacts'][i]['id'])
                }
            }
    }).catch(e => {
        console.log('Что-то пошло не так c получением контактов');
        console.log(e);
        return false;
    })
    page++;
}

function createTask(id){
    let body = [{
        text: "Контакт без сделок",
        complete_till: 1588885140,
        entity_id: id,
        entity_type: "contacts"
    }]
    return fetch(taskLink, {
        method: 'POST',
        body: JSON.stringify(body),
        headers:headers,
    })
}

async function addTaskToContactWithoutLeads(){
    await getContact(contactLink)
    for(let i = 0; i < contactId.length; i++) {
        await createTask(contactId[i])
    }
}

addTaskToContactWithoutLeads()

