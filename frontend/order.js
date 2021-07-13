let orderData = {};

let items = {
    none: {
        name: 'None',
        price: 0
    },
    pasta: {
        name: 'Pasta',
        price: 3
    },
    pizza: {
        name: 'Pizza',
        price: 6
    },
    salmon: {
        name: 'Salmon',
        price: 8
    },
    burger: {
        name: 'Burger',
        price: 4
    },
    scorpion: {
        name: 'Scorpion',
        price: 9
    },
    garlic: {
        name: 'Garlic Bread',
        price: 2
    },
    dough: {
        name: 'Dough Balls',
        price: '0.50'
    },
    chips: {
        name: 'Chips',
        price: 1
    },
    whiteBread: {
        name: 'White Bread',
        price: '0.50'
    },
    brownBread: {
        name: 'Brown Bread',
        price: '0.50'
    },
    water: {
        name: 'Water',
        price: '0.20'
    },
    cola: {
        name: 'Coca Cola',
        price: '0.50'
    },
    tango: {
        name: 'Tango',
        price: '0.50'
    },
}

function updateText() {
    let data = '';
    let price = 0;
    document.getElementById('toRemove').innerHTML = '';
    Object.entries(orderData).forEach(x => {
        data += `${x[0]}:<br>Main: ${items[x[1].main].name} ${items[x[1].main].price} GBP<br>Side: ${items[x[1].side].name} ${items[x[1].side].price} GBP<br>Drink: ${items[x[1].drink].name} ${items[x[1].drink].price} GBP<br><br>`;
                
        document.getElementById('toRemove').innerHTML += `<option value="${x[0]}">${x[0]}</option>`;

        price = price + parseFloat(items[x[1].main].price) + parseFloat(items[x[1].side].price) + parseFloat(items[x[1].drink].price);
                
    });



    document.getElementById('order').innerHTML = data;
    document.getElementById('price').innerHTML = price.toFixed(2) + ' GBP';

}

submitUpdate.onclick = () => {
    orderData[Math.round(Math.random()*100)] = {
        main: document.getElementById('primary').value,
        side: document.getElementById('side').value,
        drink: document.getElementById('drink').value
    }

    updateText();

            
}

clearOrder.onclick = () => {
    orderData = {};
    updateText();
}

remove.onclick = () => {
    delete orderData[document.getElementById('toRemove').value];
    updateText();
}

        
submitOrder.onclick = () => {
    let searchParams = window.location.href.split('?')[1].split('&');
    let ws = new WebSocket('ws://localhost:8765');
    let tableIsAvailable;
    ws.onopen = () => {ws.send('availabletables')};

    ws.onmessage = s => {
        if (s.data.startsWith('True') || s.data.startsWith('False')) {
            //console.log(s.data.toLowerCase().split('|').filter(x=>Boolean(x)));
            let array=s.data.toLowerCase().split('|').filter(x => x == 'true' ? x = true : x = false);
            console.log(array);
            tableIsAvailable = s.data.toLowerCase().split('|').filter(x=>(x === 'true'))[parseInt(searchParams[0].split('=')[1].split('table')[1])];
            console.log(tableIsAvailable, Object.entries(orderData).length);

            if (tableIsAvailable && Object.entries(orderData).length) {
                let temporary = 'order,' + parseInt(searchParams[0].split('=')[1].split('table')[1]); 
                Object.entries(orderData).forEach(x=>{
                    console.log(x[0], x[1]);
                    temporary += `|${x[1].main},${x[1].side},${x[1].drink}`
                });
                ws.send(temporary);
            }
        } else if(s.data === 'refusal') {
            document.getElementsByTagName('body')[0].innerHTML = '<h1>table is taken</h1>'
            ws.close();
        } else if(s.data === 'success') {
            document.getElementsByTagName('body')[0].innerHTML = '<h1>success</h1>    <p id="order"></p><p id="price"></p>'
            ws.close();
            updateText();
        } else {
            console.log(s.data);
        }
    }

            
}  