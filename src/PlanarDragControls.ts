import { Vector2, Plane, Raycaster, Vector3, Matrix4 } from "three"

import ThreejsApp from "./ThreejsApp"
import NamedEventEmitter from "./NamedEventEmitter"
import Entity from "./Entity"

// TODO: use intersector
class PlanarDragControls {
  app: ThreejsApp
  plane: Plane
  selected: any = null
  pointer = new Vector2()
  worldPosition = new Vector3()
  raycaster = new Raycaster()
  inverseMatrix = new Matrix4()
  offset = new Vector3()

  eventEmitter = new NamedEventEmitter()

  constructor(app: ThreejsApp) {
    this.app = app
    this.plane = new Plane(new Vector3(0, 1, 0))
    const { domElement } = app.renderer

    domElement.addEventListener("pointerdown", this.onPointerDown)
    domElement.addEventListener("pointerup", this.onPointerUp)
    domElement.addEventListener("pointermove", this.onPointerMove)
  }

  onPointerMove = (event: PointerEvent) => {
    this.updatePointer(event)

    this.raycaster.setFromCamera(this.pointer, this.app.camera)

    if (!this.selected) return

    const intersection = new Vector3()
    if (!this.raycaster.ray.intersectPlane(this.plane, intersection)) return
    this.selected.position.copy(
      intersection.sub(this.offset).applyMatrix4(this.inverseMatrix)
    )
  }

  onPointerDown = (event: PointerEvent) => {
    this.updatePointer(event)
    this.raycaster.setFromCamera(this.pointer, this.app.camera)

    // TODO: figure out exactly what gets moved
    const objects = this.app.entityManager.entities.map(({ hitbox }) => hitbox)
    const [intersect] = this.raycaster.intersectObjects(objects, true)

    if (!intersect) return

    this.app.renderer.domElement.style.cursor = "move"

    this.selected = intersect.object.parent

    const intersection = new Vector3()

    // Plane should be set to intersect the point of intersection
    this.plane.constant = -intersect.point.y

    if (this.raycaster.ray.intersectPlane(this.plane, intersection)) {
      this.inverseMatrix.copy(this.selected.parent.matrixWorld).invert()

      this.offset
        .copy(intersection)
        .sub(
          this.worldPosition.setFromMatrixPosition(this.selected.matrixWorld)
        )
    }

    this.eventEmitter.trigger("dragStart")
  }

  onPointerUp = () => {
    this.app.renderer.domElement.style.cursor = "auto"
    if (!this.selected) return
    this.selected = null
    this.eventEmitter.trigger("dragEnd")
  }

  updatePointer = ({ clientX, clientY }: PointerEvent) => {
    const { left, top, width, height } =
      this.app.renderer.domElement.getBoundingClientRect()
    this.pointer.x = ((clientX - left) / width) * 2 - 1
    this.pointer.y = -((clientY - top) / height) * 2 + 1
  }
}

export default PlanarDragControls
