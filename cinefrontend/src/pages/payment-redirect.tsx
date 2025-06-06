import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { payOrderFx } from "../effector/orders.store";

export function PaymentRedirect() {
    const navigate = useNavigate();
    const {paymentId} = useParams();

    useEffect(() => {
        if (!paymentId) {
            return;
        }
        payOrderFx({paymentId: +paymentId}).then((redirectUrl) => navigate(redirectUrl));
    }, [paymentId]);

    return null;
}