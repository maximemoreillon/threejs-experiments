import * as THREE from "three"
import { BoxGeometry } from "three"
// @ts-ignore
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import ThreejsApp from "./ThreejsApp"

class Entity {
  app: ThreejsApp
  params: any
  group: THREE.Group
  hitbox: THREE.Mesh
  mesh: THREE.Mesh

  constructor(app: any, params: any) {
    this.app = app
    this.params = params

    this.group = new THREE.Group()
    this.group.position.copy(this.params.position)

    // TODO: figure out if a hitbox is a good idea
    // TODO: consider if a hitbox class could be a good idea
    // TODO: hitbox sizing
    // TODO: hitbox material
    this.hitbox = new THREE.Mesh(new BoxGeometry())
    this.hitbox.visible = false
    this.mesh = new THREE.Mesh()

    this.app.scene.add(this.group)
    this.group.add(this.hitbox)
  }

  remove = () => {
    this.app.entityManager.remove(this.group.id)
  }
}

export default Entity
