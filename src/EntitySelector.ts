import {
  Vector2,
  Raycaster,
  Vector3,
  Matrix4,
  Mesh,
  BoxGeometry,
  Group,
  BoxHelper,
  MeshBasicMaterial,
} from "three"
import ThreejsApp from "./ThreejsApp"

class EntitySelector {
  app: ThreejsApp

  selected: any

  // Not using intersector because Entities do not update
  raycaster = new Raycaster()

  boxHelper = new BoxHelper(new Mesh())
  group = new Group()

  pointer = new Vector2()
  worldPosition = new Vector3()
  inverseMatrix = new Matrix4()
  offset = new Vector3()

  constructor(app: ThreejsApp) {
    this.app = app
    this.selected = null

    const { domElement } = app.renderer

    const thickness = 0.2
    const length = 2

    const handles = [
      new Mesh(
        new BoxGeometry(length, thickness, thickness),
        new MeshBasicMaterial({ color: 0xff0000 })
      ),
      new Mesh(
        new BoxGeometry(thickness, length, thickness),
        new MeshBasicMaterial({ color: 0x00ff00 })
      ),
      new Mesh(
        new BoxGeometry(thickness, thickness, length),
        new MeshBasicMaterial({ color: 0x0000ff })
      ),
    ]

    handles.forEach((h, index) => {
      h.position.setComponent(index, 2)
      this.group.add(h)
    })

    const selectionBox = new Mesh(
      new BoxGeometry(2, 2, 2),
      new MeshBasicMaterial({
        color: 0xffff00,
        transparent: true,
        opacity: 0.25,
      })
    )

    this.group.add(selectionBox)

    domElement.addEventListener("pointerdown", this.onPointerDown)
  }

  onPointerDown = ({ clientX, clientY }: PointerEvent) => {
    const { left, top, width, height } =
      this.app.renderer.domElement.getBoundingClientRect()

    const pointer = {
      x: ((clientX - left) / width) * 2 - 1,
      y: -((clientY - top) / height) * 2 + 1,
    }

    this.raycaster.setFromCamera(pointer, this.app.camera)

    const objects = this.app.entityManager.entities.map(({ hitbox }) => hitbox)
    const intersects = this.raycaster.intersectObjects(objects, false)
    const [intersect] = intersects
    if (!intersect) return

    if (this.selected) this.selected.remove(this.group)

    // Selected becomes the group
    this.selected = intersect.object.parent

    this.selected.add(this.group)
  }

  updatePointer = ({ clientX, clientY }: PointerEvent) => {
    const { left, top, width, height } =
      this.app.renderer.domElement.getBoundingClientRect()
    this.pointer.x = ((clientX - left) / width) * 2 - 1
    this.pointer.y = -((clientY - top) / height) * 2 + 1
  }
}

export default EntitySelector
