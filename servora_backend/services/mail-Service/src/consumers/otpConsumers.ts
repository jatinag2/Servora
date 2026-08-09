import { getRabbitMQChannel, mail_queue } from "../config/rabbitMQ.config"
import { sendEmailService } from "../services/mail.services"

export const mailOtpConsumer=()=>{
    const channel=getRabbitMQChannel()

    channel.consume(mail_queue,async(msg)=>{
        if(msg!=null){
             try {
                   const info=await sendEmailService(JSON.parse(msg.content.toString()))
                   channel.ack(msg)
             } catch (error) {
                channel.nack(msg)
                console.log(error);
                
             }
        }
    })
}