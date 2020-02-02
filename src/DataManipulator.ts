import { ServerRespond } from './DataStreamer';

export interface Row {
  // Update the object with the correct attributes that align with the schema. There has to be a connection and gotta be consistent.
  price_abc: number,
  price_def: number,
  ratio: number,
  timestamp: Date,
  //When the ratio crossess the bounds, it will show the trigger alerts. Will following as the graph is plotted.
  upper_bound: number,
  lower_bound: number,
  trigger_alert: number | undefined,
}


export class DataManipulator {
  static generateRow(serverRespond: ServerRespond[]): Row {
    const priceABC = (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price) / 2;
    const priceDEF = (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price) / 2;
    const ratio = priceABC / priceDEF;
    const upperBound = 1 + 0.035;
    const lowerBound = 1 - 0.035;
    
    return {
        price_abc: priceABC,
        price_def: priceDEF,
        ratio,
        timestamp: serverRespond[0].timestamp > serverRespond[1].timestamp ?
          serverRespond[0].timestamp : serverRespond[1].timestamp,
        upper_bound: upperBound,
        lower_bound: lowerBound,
        trigger_alert: (ratio > upperBound || ratio < lowerBound) ? ratio : undefined,
    };
  }
}
