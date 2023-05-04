import Entity from "./Entity"
import ThreejsApp from "./ThreejsApp"
// @ts-ignore
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"

class Light extends Entity {
  constructor(app: ThreejsApp, params: {}) {
    super(app, params)
    console.log("Hi")
    this.loadModel()
  }

  loadModel = () => {
    const loader = new GLTFLoader()
    loader.load(
      "/models/light.glb",
      this.onModelLoaded,
      this.onModelLoading,
      this.onModelError
    )
  }

  onModelLoaded = (model: any) => {
    this.mesh = model.scene
    this.mesh.scale.setScalar(0.075)
    this.mesh.translateZ(1.75)
    this.group.add(this.mesh)
  }

  onModelLoading = (xhr: any) => {
    // console.log(xhr)
  }

  onModelError = (error: any) => {
    console.error(error)
  }
}

export default Light
