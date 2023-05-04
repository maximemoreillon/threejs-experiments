import { CylinderGeometry, Mesh, Raycaster, MeshBasicMaterial } from "three"
import ThreejsApp from "./ThreejsApp"

// TODO: independent class for click events

class Button {
  app: ThreejsApp
  raycaster = new Raycaster()
  handlers: Function[] = []
  mesh: Mesh

  constructor(app: ThreejsApp) {
    this.app = app
    app.renderer.domElement.addEventListener("click", this.onRendererClicked)

    const material = new MeshBasicMaterial({ color: 0xc00000 })
    const geometry = new CylinderGeometry(0.5, 0.5, 0.5)
    this.mesh = new Mesh(geometry, material)

    this.app.scene.add(this.mesh)
  }

  addListener = (handler: Function) => {
    this.handlers.push(handler)
  }

  triggerClicked = () => {
    this.handlers.forEach((handler) => handler())
  }

  onRendererClicked = ({ clientX, clientY }: MouseEvent) => {
    const { left, top, width, height } =
      this.app.renderer.domElement.getBoundingClientRect()

    const pointer = {
      x: ((clientX - left) / width) * 2 - 1,
      y: -((clientY - top) / height) * 2 + 1,
    }

    this.raycaster.setFromCamera(pointer, this.app.camera)
    const [intersect] = this.raycaster.intersectObjects([this.mesh], true)
    if (!intersect) return
    this.triggerClicked()
  }
}

export default Button
