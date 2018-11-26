import {LevelDb} from './leveldb'
//import WriteStream from 'level-ws'

export class Metric {
  public timestamp: string
  public value: number

  constructor(ts: string, v: number) {
    this.timestamp = ts
    this.value = v
  }
}

export class MetricsHandler {
  private db: any

  constructor(path: string) {
    this.db = LevelDb.open(path)
  }

  public delete(key: string, callback: (err: Error | null) => void){
    const stream = this.db.createReadStream()

    stream.on('error', callback)
    .on('end', (err:Error) =>{
      callback(null)
    })
    .on('data', (data:any) => {
      const [ , k, timestamp] = data.key.split(":")

      if (key !== k) {
        console.log(`LevelDB error : ${data} does not match key ${key}`)
        callback(new Error())
      }
      else {
        this.db.del(key, function (err: Error) {
            if (err)
              callback(new Error())
            });
      }
    })

  }

   public save(key: string, metrics: Metric[], callback: (error: Error | null) => void) {
    metrics.forEach((m: Metric) => {
      this.db.put(`metric:${key}:${m.timestamp}`, m.value).then(function () {callback(null) })
    })
}

  public get(key: string, callback: (err: Error | null, result?: Metric[]) => void) {
    const stream = this.db.createReadStream()
    var met: Metric[] = []

    stream.on('error', callback)
    .on('end', (err:Error) =>{
      callback(null, met)
    })
    .on('data', (data:any) => {
      const [ , k, timestamp] = data.key.split(":")
      const value = data.value

      if (key !== k) {
        console.log(`LevelDB error : ${data} does not match key ${key}`)
      }
      else {
        met.push(new Metric(timestamp, value))
      }
    })
  }


}
