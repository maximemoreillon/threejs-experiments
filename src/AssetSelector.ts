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

class AssetSelector {
  app: ThreejsApp

  selected: any
  raycaster = new Raycaster()

  boxHelper = new BoxHelper(new Mesh())
  handles: Mesh[]
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

    this.handles = [
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

    this.handles.forEach((h, index) => {
      h.position.setComponent(index, 0.5 * length)
      this.group.add(h)
    })

    domElement.addEventListener("pointerdown", this.onPointerDown)
    domElement.addEventListener("pointerup", this.onPointerUp)
    domElement.addEventListener("pointermove", this.onPointerMove)
  }

  onPointerMove = (event: PointerEvent) => {}

  onPointerDown = (event: PointerEvent) => {
    this.updatePointer(event)
    this.raycaster.setFromCamera(this.pointer, this.app.camera)

    const objects = this.app.entityManager.entities.map(({ hitbox }) => hitbox)
    const intersects = this.raycaster.intersectObjects(objects, false)
    const [intersect] = intersects
    if (!intersect) return

    if (this.selected) this.selected.remove(this.group)

    // Selected becomes the group
    this.selected = intersect.object.parent

    this.selected.add(this.group)
  }

  onPointerUp = () => {}

  updatePointer = ({ clientX, clientY }: PointerEvent) => {
    const { left, top, width, height } =
      this.app.renderer.domElement.getBoundingClientRect()
    this.pointer.x = ((clientX - left) / width) * 2 - 1
    this.pointer.y = -((clientY - top) / height) * 2 + 1
  }
}

export default AssetSelector
