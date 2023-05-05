import Entity from "./Entity"
import ThreejsApp from "./ThreejsApp"
import EventEmitter from "./NamedEventEmitter"

class EntityManager {
  app: ThreejsApp
  // Are both needed?
  entities: Entity[]
  entitiesMap: Map<number, Entity>
  eventEmitter: EventEmitter

  constructor(app: ThreejsApp) {
    this.app = app
    this.entities = []
    this.entitiesMap = new Map()
    this.eventEmitter = new EventEmitter()
  }

  add = (newEntity: Entity) => {
    this.entities.push(newEntity)
    this.entitiesMap.set(newEntity.group.id, newEntity)
    this.eventEmitter.trigger("entityAdded", newEntity.group.id)

    // In the original code:
    // newEntity.setParent(this)
  }

  remove = (entityId: number) => {
    const entityToRemove = this.entitiesMap.get(entityId)
    if (!entityToRemove) return
    this.app.scene.remove(entityToRemove.group)
    this.entities = this.entities.filter((e) => e !== entityToRemove)
    this.entitiesMap.delete(entityId)
    this.eventEmitter.trigger("entityRemoved", entityId)
  }
}

export default EntityManager
