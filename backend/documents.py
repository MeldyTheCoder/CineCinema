import jinja2

import models
import settings
import fn_utils as func
from models import SeatType


async def render_ticket_pdf(order: models.Order):
    with open(
            settings.PROJECT_ROOT /
            'document_templates/' /
            'ticket.html', 'r'
    ) as file:
        template = jinja2.Template(file.read(), enable_async=True)

        schedule_date = func.create_datetime(order.schedule.day_id, order.schedule.year, order.schedule.time)

        html_template = await template.render_async(
            region=order.office.region.title,
            branch_name=order.office.title,
            branch_address=order.office.address,
            movie_title=order.schedule.film.title,
            showtime_date=schedule_date.strftime('%d.%m.%Y'),
            showtime_time=schedule_date.strftime('%H:%M'),
            seats=[f"{seat.row} ряд {seat.column} место" for seat in await order.seats.all()]
        )

        return html_template

async def render_receipt(order: models.Order):
    with open(
        settings.PROJECT_ROOT /
        'document_templates/' /
        'receipt.html', 'r'
    ) as file:
        template = jinja2.Template(file.read(), enable_async=True)
        payment = await order.payments.first()

        schedule_date = func.create_datetime(order.schedule.day_id, order.schedule.year, order.schedule.time)
        payment_date = payment.created_at

        seat_types = {
            SeatType.STANDART: "STANDART",
            SeatType.VIP: "VIP",
            "": "???",
        }

        seats = [
            {
                "row": seat.row,
                "column": seat.column,
                "type": seat_types[seat.type],
                "price": (order.schedule.film.price * order.schedule.hall.price_factor * seat.price_factor) // 100,
            }
            for seat in await order.seats.all()
        ]

        amount = sum([seat['price'] for seat in seats])

        return await template.render_async(
            region=order.office.region.title,
            branch_name=order.office.title,
            branch_address=order.office.address,
            hall_name=order.schedule.hall.title,
            hall_type="STANDART",
            movie_title=order.schedule.film.title,
            show_date=schedule_date.strftime('%d.%m.%Y'),
            show_time=schedule_date.strftime('%H:%M'),
            tickets=seats,
            # subtotal=amount,
            # "service_fee": 150,
            total=amount,
            payment_method="Карта •••• 1234",
            payment_date=payment_date.strftime('%d.%m.%Y'),
            payment_time=payment_date.strftime('%H:%M:%S'),
            transaction_id="CHK789456123",
            generated_at=func.get_now().strftime("%d.%m.%Y %H:%M:%S"),
        )