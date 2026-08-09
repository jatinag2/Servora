import { getRabbitMQChannel,profile_queue_name } from "../config/rabbitmq.config"
import {createUserProfileService} from "../services/profile.service"

export const profileConsumer=async()=>{
 const channel=getRabbitMQChannel()

  const message=channel.consume(profile_queue_name,async(msg)=>{
   if(msg!=null){
    try {
        console.log("yaha tak aagaya");
        
        await createUserProfileService(JSON.parse(msg.content.toString()));
        channel.ack(msg)
        console.log("user consume hogaya");
        console.log(JSON.parse(msg.content.toString()));
        
        
    } catch (error) {
          channel.nack(msg,false,true)
         console.log(error);
    }
   }
  })
}