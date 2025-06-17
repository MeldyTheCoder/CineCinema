import json

from aiogram.utils.keyboard import InlineKeyboardBuilder, ReplyKeyboardBuilder

import filters


def reply_inline_keyboard(receiver: str):
    keyboard = InlineKeyboardBuilder()
    keyboard.button(text='Ответить', callback_data=filters.ReplyMessageCallback(receiver=receiver).pack())
    return keyboard.as_markup()


