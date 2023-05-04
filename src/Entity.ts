import * as THREE from "three"
import { BoxGeometry } from "three"
// @ts-ignore
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import ThreejsApp from "./ThreejsApp"

class Asset {
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
    this.hitbox = new THREE.Mesh(new BoxGeometry())
    this.mesh = new THREE.Mesh()

    this.app.scene.add(this.group)
    this.group.add(this.hitbox)

    this.loadModel()
  }

  // TODO: Loading the model for each asset is inefficient
  loadModel = () => {
    const loader = new GLTFLoader()
    loader.load(
      "/models/lock.glb",
      this.onModelLoaded,
      this.onModelLoading,
      this.onModelError
    )
  }

  remove = () => {
    // TODO: remove from asset list
    this.app.scene.remove(this.group)
    // OR could call the remove of the ThreejsApp
  }

  onModelLoaded = (model: any) => {
    this.mesh = model.scene
    this.group.add(this.mesh)
  }

  onModelLoading = (xhr: any) => {
    // console.log(xhr)
  }

  onModelError = (error: any) => {
    console.error(error)
  }
}

export default Asset
