// TODO: Figure out if no better name
// TODO: add named events
class EventEmitter {
  handlers: Function[] = []

  on = (handler: Function) => {
    this.handlers.push(handler)
  }

  off = (handler: Function) => {
    this.handlers = this.handlers.filter((h) => h !== handler)
  }

  trigger = () => {
    this.handlers.forEach((handler) => handler())
  }
}

export default EventEmitter
