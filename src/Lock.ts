import Entity from "./Entity"
import ThreejsApp from "./ThreejsApp"
// @ts-ignore
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"

class Lock extends Entity {
  constructor(app: ThreejsApp, params: {}) {
    super(app, params)
    console.log("Hi")
    this.loadModel()
  }

  loadModel = () => {
    const loader = new GLTFLoader()
    loader.load(
      "/models/lock.glb",
      this.onModelLoaded,
      this.onModelLoading,
      this.onModelError
    )
  }

  onModelLoaded = (model: any) => {
    this.mesh = model.scene
    this.mesh.scale.setScalar(0.5)
    this.mesh.translateY(-0.8)
    this.group.add(this.mesh)
  }

  onModelLoading = (xhr: any) => {
    // console.log(xhr)
  }

  onModelError = (error: any) => {
    console.error(error)
  }
}

export default Lock
