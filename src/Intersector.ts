import { Object3D, Raycaster, Vector2 } from "three"
import ThreejsApp from "./ThreejsApp"
import NamedEventEmitter from "./NamedEventEmitter"

class Intersector {
  app: ThreejsApp

  // TODO: consider an array of objects instead
  objects: Object3D[]

  raycaster = new Raycaster()
  pointer = new Vector2()
  eventEmitter = new NamedEventEmitter()

  constructor(app: ThreejsApp, objects: Object3D[]) {
    this.app = app
    this.objects = objects
    this.raycaster = new Raycaster()

    const { domElement } = app.renderer
    domElement.addEventListener("pointerdown", this.onPointerDown)
    domElement.addEventListener("pointerup", this.onPointerUp)
    domElement.addEventListener("pointermove", this.onPointerMove)
  }

  onPointerMove = (event: PointerEvent) => {
    this.updatePointer(event)
    this.raycaster.setFromCamera(this.pointer, this.app.camera)
    const [intersect] = this.raycaster.intersectObjects(this.objects, false)
    if (!intersect) return
    this.eventEmitter.trigger("pointerMove", intersect)
  }

  onPointerDown = (event: PointerEvent) => {
    this.updatePointer(event)
    this.raycaster.setFromCamera(this.pointer, this.app.camera)
    const [intersect] = this.raycaster.intersectObjects(this.objects, false)
    if (!intersect) return
    this.eventEmitter.trigger("pointerDown", intersect)
  }

  onPointerUp = () => {
    this.eventEmitter.trigger("pointerUp")
  }

  updatePointer = ({ clientX, clientY }: PointerEvent) => {
    const { left, top, width, height } =
      this.app.renderer.domElement.getBoundingClientRect()
    this.pointer.x = ((clientX - left) / width) * 2 - 1
    this.pointer.y = -((clientY - top) / height) * 2 + 1
  }
}

export default Intersector
