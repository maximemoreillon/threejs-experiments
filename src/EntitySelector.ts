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
import Intersector from "./Intersector"
import ThreejsApp from "./ThreejsApp"

class EntitySelector {
  app: ThreejsApp

  selected: any
  intersector: Intersector

  boxHelper = new BoxHelper(new Mesh())
  group = new Group()

  pointer = new Vector2()
  worldPosition = new Vector3()
  inverseMatrix = new Matrix4()
  offset = new Vector3()

  constructor(app: ThreejsApp) {
    this.app = app
    this.selected = null

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

    // handles.forEach((h, index) => {
    //   h.position.setComponent(index, 0.5 * length)
    //   this.group.add(h)
    // })

    const selectionBox = new Mesh(
      new BoxGeometry(2, 2, 2),
      new MeshBasicMaterial({
        color: 0xffff00,
        opacity: 0.25,
        transparent: true,
      })
    )

    this.group.add(selectionBox)

    // FIXME: does not update if entities are added
    const objects = this.app.entityManager.entities.map(({ hitbox }) => hitbox)
    this.intersector = new Intersector(this.app, objects)
    this.intersector.eventEmitter.on("pointerDown", this.onPointerDown)

    this.app.entityManager.eventEmitter.on("entityAdded", () => {
      this.intersector.objects = this.app.entityManager.entities.map(
        ({ hitbox }) => hitbox
      )
    })
  }

  onPointerDown = (intersect: any) => {
    if (this.selected) this.selected.remove(this.group)

    // Selected becomes the group
    this.selected = intersect.object.parent

    this.selected.add(this.group)
  }
}

export default EntitySelector
