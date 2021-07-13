import asyncio
import websockets

tables = [True,True,True,True,True]
            


async def serv(websocket, path):
    async for message in websocket:
        packetrecv = message
        #print(f"< {packetrecv}")

        #greeting = f"packet recieved: {packetrecv}"

        #await websocket.send(greeting)
        #print(f"> {greeting}")

        if packetrecv.lower() == 'availabletables':
            num=0
            tablesString=''
            for x in tables:
                if num == 0:
                    tablesString = tablesString + str(x)
                else:
                    tablesString = tablesString + '|' + str(x)
            
                num = num + 1

            await websocket.send(tablesString)
        
        if packetrecv.lower().startswith('order'):
            print(tables[int(packetrecv.lower().split('|')[0][6:])])
            print(int(packetrecv.lower().split('|')[0][6:]))
            print(packetrecv.lower().split('|')[0][6:])

            if tables[int(packetrecv.lower().split('|')[0][6:])] == False:
                await websocket.send('refusal')
                return await websocket.close()
            
            else:
                tables[int(packetrecv.lower().split('|')[0][6:])] = False

            print(tables)

            #print(packetrecv.lower().split('|'))
            price = 0

            for x in packetrecv.lower().split('|'):
                if x == 'order':
                    continue
                else:
                    temporaryPrice=0
                    for y in x.split(','):
                        if y == 'none':
                            temporaryPrice = 0
                        elif y == 'pasta':
                            temporaryPrice = 3
                        elif y == 'pizza':
                            temporaryPrice = 6
                        elif y == 'salmon':
                            temporaryPrice = 8
                        elif y == 'burger':
                            temporaryPrice = 4
                        elif y == 'scorpion':
                            temporaryPrice = 9
                        elif y == 'garlic':
                            temporaryPrice = 2
                        elif y == 'dough':
                            temporaryPrice = 0.50
                        elif y == 'chips':
                            temporaryPrice = 1
                        elif y == 'whitebread':
                            temporaryPrice = 0.50
                        elif y == 'brownbread':
                            temporaryPrice = 0.50
                        elif y == 'water':
                            temporaryPrice = 0.20
                        elif y == 'cola':
                            temporaryPrice = 0.50
                        elif y == 'tango':
                            temporaryPrice = 0.50


                        #print(temporaryPrice)
                        price = price + temporaryPrice
                    
                    
            #print(price)
            await websocket.send(str(round(price, 3)))

            try:
                f = open('orders.txt', 'a')
                orderString = ''
                num=0
                for x in packetrecv.lower().split('|'):
                    if num == 0:
                        print('ignored')
                    elif num == 1:
                        for y in x.split(','):
                            orderString = orderString + str(y) + ', '

                    else:
                        for y in x.split(','):
                            orderString = orderString + str(y) + ', '
                    
                    num = num + 1

                f.write('Table: {}\n{}\nPrice: {}\n\n'.format(int(packetrecv.lower().split('|')[0][6:]), orderString[:-2], price))
                f.close()
            except: 
                f = open('orders.txt', 'x')
                f = open('orders.txt', 'w')
                orderString = ''
                num=0
                for x in packetrecv.lower().split('|'):
                    if num == 0:
                        print('ignored')
                    elif num == 1:
                        for y in x.split(','):
                            orderString = orderString + str(y) + ', '

                    else:
                        for y in x.split(','):
                            orderString = orderString + str(y) + ', '
                    
                    num = num + 1

                f.write('Table: {}\n{}\nPrice: {}\n\n'.format(int(packetrecv.lower().split('|')[0][6:]), orderString[:-2], price))
                f.close()


            
            await websocket.send('success')
                        


    

start_server = websockets.serve(serv, "localhost", 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()

