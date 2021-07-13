let ws=new WebSocket('ws://localhost:8765');
ws.onopen = () => {
    ws.send('availabletables');
}

ws.onmessage = s => {
    let array=s.data.toLowerCase().split('|').filter(x=>Boolean(x));
    console.log(array);
    let data='<select name="table" id="table">';
    array.forEach(function(val, index) {
        if (val !== 'false') {
            console.log(index,val);
            data += `<option value="table${index}">Table ${index}</option>`;
        };
    });
    data += '</select><input type="submit">';
    form.innerHTML = data;
}