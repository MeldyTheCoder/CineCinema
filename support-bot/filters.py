from typing import Any, Union, Dict

from aiogram import types, filters
from aiogram.filters.callback_data import CallbackData

import settings

class AllowedUsersFilter(filters.BaseFilter):
    async def __call__(self, message: types.Message) -> bool:
        return message.from_user.id in settings.ALLOWED_USERS


class ReplyMessageCallback(CallbackData, prefix="reply"):
    receiver: str
