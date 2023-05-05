interface EventHandler {
  event: string
  handler: Function
}

class EventEmitter {
  handlers: EventHandler[] = []

  on = (event: string, handler: Function) => {
    this.handlers.push({ event, handler })
  }

  off = (event: string, handlerToRemove: Function) => {
    this.handlers = this.handlers.filter(
      ({ handler }) => handler !== handlerToRemove
    )
  }

  trigger = (eventName: string, data: any = undefined) => {
    this.handlers
      .filter(({ event }) => event == eventName)
      .forEach(({ handler }) => handler(data))
  }
}

export default EventEmitter
