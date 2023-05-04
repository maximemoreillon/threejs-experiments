import { Mesh, PlaneGeometry, MeshBasicMaterial } from "three"
import ThreejsApp from "./ThreejsApp"

// This could be a more complicated geometry in the future

class Ground {
  mesh: Mesh
  app: ThreejsApp

  constructor(app: ThreejsApp) {
    this.app = app
    const material = new MeshBasicMaterial({ color: 0x000044 })
    const geomery = new PlaneGeometry(10, 10, 10, 10)
    this.mesh = new Mesh(geomery, material)
    this.mesh.rotateX(-0.5 * Math.PI)
    this.app.scene.add(this.mesh)
  }
}

export default Ground
