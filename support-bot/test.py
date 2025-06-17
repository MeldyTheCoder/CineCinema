import asyncio
import datetime
import random

import socketio

sio = socketio.AsyncClient()

@sio.on('adminMessage')
async def handle_admin_message(*args, **kwargs):
    print(args, kwargs)

@sio.on('connect')
async def handle_connect(*_, **kwargs):
    print('Connected!')
    await sio.emit('userMessage', {
        'id': random.randint(0, 9999),
        'text': 'Привет, мир!!!',
        'created_at': datetime.datetime.now().isoformat(),
        'user': {'firstName': 'Кирилл', 'lastName': 'Грошелев'},
    })

async def main():
    await sio.connect('http://127.0.0.1:5000/', retry=True)
    await sio.wait()


if __name__ == '__main__':
    asyncio.run(main())
