import { json } from "node:stream/consumers"
import { getRabbitMQChannel, profile_exchange } from "../config/rabbitMQ.config"

export const sendProfileMessage=(data:any)=>{
   const channel=getRabbitMQChannel()
   console.log("message gaya");
   
   channel.publish(profile_exchange,"profile_routing_key",Buffer.from(JSON.stringify(data)))
   console.log("message dal gaya");
   
}