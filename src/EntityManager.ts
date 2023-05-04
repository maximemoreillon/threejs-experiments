import Entity from "./Entity"
import ThreejsApp from "./ThreejsApp"

class EntityManager {
  app: ThreejsApp
  // Are both needed?
  entities: Entity[]
  entitiesMap: Map<number, Entity>

  constructor(app: ThreejsApp) {
    this.app = app
    this.entities = []
    this.entitiesMap = new Map()
  }

  add = (newEntity: Entity) => {
    this.entities.push(newEntity)
    this.entitiesMap.set(newEntity.group.id, newEntity)

    // In the original code:
    // newEntity.setParent(this)
  }

  remove = (entityId: number) => {
    const entityToRemove = this.entitiesMap.get(entityId)
    if (!entityToRemove) return
    this.app.scene.remove(entityToRemove.group)
    this.entities = this.entities.filter((e) => e !== entityToRemove)
    this.entitiesMap.delete(entityId)
  }
}

export default EntityManager
