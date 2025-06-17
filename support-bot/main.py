import asyncio
import datetime
import logging
import random
import uuid

import aiogram
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from aiogram import F, Dispatcher
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import StatesGroup, State
from aiogram.fsm.storage.memory import MemoryStorage
from aiohttp import web
import keyboard
from filters import AllowedUsersFilter, ReplyMessageCallback
from aiogram.filters import CommandStart
import settings
import socketio

bot = aiogram.Bot(token=settings.BOT_TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
storage = MemoryStorage()
dp = Dispatcher(app=bot, storage=storage)
socket = socketio.AsyncServer(reconnection=True, logger=True, cors_allowed_origins='*')
app = web.Application()
socket.attach(app)


class ReplyForm(StatesGroup):
    text = State()

async def send_admin_messages(**kwargs):
    for admin_id in settings.ALLOWED_USERS:
        await bot.send_message(**kwargs, chat_id=admin_id)

@socket.on('connect')
async def handle_client_connect(sid: str, *args, **kwargs):
    logging.info(f"{sid} подключился к серверу.")
    print(args, kwargs)

@socket.on('disconnect')
async def handle_client_disconnect(sid: str, *args, **kwargs):
    logging.info(f"{sid} отключился от сервера.")
    print(args, kwargs)

@socket.on('userMessage')
async def handle_message(sio: str, data: dict):
    receiver = sio
    text = data.get('text')
    user = data.get('user')

    first_name = user.get('firstName')
    last_name = user.get('lastName')

    formatted_text = """
    -----------------------------------------
    <b>Новое сообщение</b>
    от: <code>{first_name} {last_name}</code>
    -----------------------------------------
    <i>{text}</i>
    """.format(
        first_name=first_name,
        last_name=last_name,
        text=text,
    )

    await send_admin_messages(
        text=formatted_text,
        reply_markup=keyboard.reply_inline_keyboard(receiver),
    )

@dp.message(ReplyForm.text)
async def handle_message_text_input(message: aiogram.types.Message, state: FSMContext):
    data = await state.get_data()
    text = message.html_text

    await socket.emit(
        'adminMessage',
        {
                'text': text,
                'date_time': datetime.datetime.now().isoformat(),
                'user': None,
             },
            to=data['receiver'],
    )

    await state.clear()
    await message.answer("<b>Сообщение успешно отправлено!</b>")

@dp.callback_query(ReplyMessageCallback.filter())
async def handle_reply_message(
        query: aiogram.types.CallbackQuery,
        state: FSMContext,
        callback_data: ReplyMessageCallback,
):
    receiver = callback_data.receiver
    if not receiver:
        return await query.answer("Запрашиваемое Вами сообщение не найдено.")

    await state.set_state(ReplyForm.text)
    await state.update_data(receiver=receiver)

    await query.message.edit_text(text="<b>Введите Ваше сообщение пользователю: </b>")

@dp.message(CommandStart())
async def handle_greet_user(message: aiogram.types.Message):
    return await message.answer(f"Добро пожаловать в бот чата тех.поддержки, {message.from_user.first_name}.")

@dp.message(AllowedUsersFilter())
async def handle_message_send(message: aiogram.types.Message):
    return await message.answer(f"<b>Ошибка:</b> Сообщение не отправлено, т.к на сообщение пользователя можно ответить только один раз.")


async def start_bot():
    """Запуск бота aiogram"""
    await bot.delete_webhook(drop_pending_updates=True)
    await dp.start_polling(bot)


async def start_web_server():
    """Запуск HTTP сервера для Socket.IO"""
    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, settings.HOST, 5000)
    await site.start()
    print(f"Socket.IO server started at http://{settings.HOST}:5000")
    return runner


async def main():
    """Основная точка входа"""
    bot_task = asyncio.create_task(start_bot())
    server_task = asyncio.create_task(start_web_server())

    try:
        await asyncio.gather(bot_task, server_task)
    except asyncio.CancelledError:
        print("Shutting down...")
    finally:
        await bot.close()
        runner = await server_task
        await runner.cleanup()

if __name__ == '__main__':
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("Application stopped")
