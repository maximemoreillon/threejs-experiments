import { Vector2, Plane, Raycaster, Vector3, Matrix4, Line3 } from "three"

import ThreejsApp from "./ThreejsApp"

class LinearDragControls {
  app: ThreejsApp

  // TODO: use entityManager
  objects: any[]

  plane: Plane
  selected: any
  axis: string
  pointer = new Vector2()
  worldPosition = new Vector3()
  raycaster = new Raycaster()
  inverseMatrix = new Matrix4()
  offset = new Vector3()

  constructor(app: ThreejsApp, objects: any[], axis: string) {
    this.app = app
    this.objects = objects
    this.selected = null
    // Plane needed for intersections, but what orientation?
    // Must at leas be coplanar with axis
    // IDEA: have two planes and their intersection would be the axis?
    this.plane = new Plane(new Vector3(0, 1, 0))
    this.axis = axis

    const { domElement } = app.renderer

    domElement.addEventListener("pointerdown", this.onPointerDown)
    domElement.addEventListener("pointerup", this.onPointerUp)
    domElement.addEventListener("pointermove", this.onPointerMove)
  }

  onPointerMove = (event: PointerEvent) => {
    this.updatePointer(event)

    this.raycaster.setFromCamera(this.pointer, this.app.camera)

    if (!this.selected) return

    // This is the intesection with the plane
    const intersection = new Vector3()
    if (!this.raycaster.ray.intersectPlane(this.plane, intersection)) return

    const newPosition = intersection
      .sub(this.offset)
      .applyMatrix4(this.inverseMatrix)

    if (this.axis === "x") this.selected.position.x = newPosition.x
    if (this.axis === "y") this.selected.position.z = newPosition.z
    if (this.axis === "z") this.selected.position.z = newPosition.z
  }

  onPointerDown = (event: PointerEvent) => {
    this.updatePointer(event)
    this.raycaster.setFromCamera(this.pointer, this.app.camera)

    const [intersect] = this.raycaster.intersectObjects(this.objects, true)

    if (!intersect) return

    this.app.renderer.domElement.style.cursor = "move"

    this.selected = intersect.object

    const intersection = new Vector3()

    // Plane should be set to intersect the point of intersection
    this.plane.constant = -intersect.point.y
    // this.line.set(intersect.point, intersect.point.add(this.axis))

    if (this.raycaster.ray.intersectPlane(this.plane, intersection)) {
      this.inverseMatrix.copy(this.selected.parent.matrixWorld).invert()

      this.offset
        .copy(intersection)
        .sub(
          this.worldPosition.setFromMatrixPosition(this.selected.matrixWorld)
        )
    }

    // TODO: dispatchEvent
  }

  onPointerUp = () => {
    this.app.renderer.domElement.style.cursor = "auto"
    if (!this.selected) return

    this.selected = null
    // TODO: dispatchEvent
  }

  updatePointer = ({ clientX, clientY }: PointerEvent) => {
    const { left, top, width, height } =
      this.app.renderer.domElement.getBoundingClientRect()
    this.pointer.x = ((clientX - left) / width) * 2 - 1
    this.pointer.y = -((clientY - top) / height) * 2 + 1
  }
}

export default LinearDragControls
