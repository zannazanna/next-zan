import { getSession } from "next-auth/react"
import Order from "../../../../models/Order";
import db from "../../../../utils/db";

const handler = async (res, req) =>{
    const session = getSession(req);

    if(!session){
        return res.status(401).send("signin required")
    }

    db.connect()
    const order = await Order.findById(req.query.id)

    if(order){
        if(order.isPaid){
            return res.status(401).send({message:"order id already pay"})
        }
        order.isPaid = true;
        order.paiAt = Date.now();
        order.paymentResult = {
            id:req.body.id,
            status:req.body.status,
            email_address:req.body.email_address
        }

        const paidOrder = await order.save()
        await db.disconnect()

        return res.send({message:"order paid", order:paidOrder})
    }else{
        await db.disconnect()
        res.status(404).send({message:"non founf order"})
    }
}

export default handler