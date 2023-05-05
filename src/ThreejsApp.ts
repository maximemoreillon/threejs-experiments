import * as THREE from "three"
// @ts-ignore
import { OrbitControls } from "three/addons/controls/OrbitControls.js"

import Light from "./Light"
import Ground from "./Ground"
import PlanarDragControls from "./PlanarDragControls"
import Lock from "./Lock"

// import LinearDragControls from "./LinearDragControls"
import EntitySelector from "./EntitySelector"
import EntityManager from "./EntityManager"
import Intersector from "./Intersector"

class ThreejsApp {
  scene: THREE.Scene
  renderer: THREE.WebGLRenderer
  camera: THREE.PerspectiveCamera
  controls: OrbitControls

  ground: Ground
  groundIntersector: Intersector

  dragControls: PlanarDragControls
  entitySelector: EntitySelector
  entityManager: EntityManager

  editMode = false
  newEntityType: string

  ghost: THREE.Mesh

  constructor() {
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x444444)

    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(this.renderer.domElement)

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    this.camera.position.set(5, 5, 5)
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    // this.controls.enabled = false

    window.addEventListener("resize", this.onWindowResize, false)

    this.entityManager = new EntityManager(this)
    this.entityManager.add(
      new Light(this, { position: new THREE.Vector3(-2, 1, 3) })
    )
    this.entityManager.add(
      new Lock(this, { position: new THREE.Vector3(2, 2, -1) })
    )

    const ambientLight = new THREE.AmbientLight(0xffffff, 1)
    this.scene.add(ambientLight)

    this.ground = new Ground(this)
    this.groundIntersector = new Intersector(this, [this.ground.mesh])

    this.groundIntersector.eventEmitter.on("pointerDown", this.onPointerDown)
    this.groundIntersector.eventEmitter.on("pointerMove", this.onPointerMove)

    this.newEntityType = "light"

    // TODO: ghost should be that of the new device
    this.ghost = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1))

    this.entitySelector = new EntitySelector(this)
    this.dragControls = new PlanarDragControls(this)

    // Prevent orbitcontrols rotation when dragging objects
    this.dragControls.eventEmitter.on("dragStart", () => {
      this.controls.enabled = false
    })

    this.dragControls.eventEmitter.on("dragEnd", () => {
      this.controls.enabled = true
    })

    const { domElement } = this.renderer
    // domElement.addEventListener("pointerdown", this.onPointerDown)
    domElement.addEventListener("pointerup", this.onPointerUp)
    // domElement.addEventListener("pointermove", this.onPointerMove)

    document.getElementById("addLightButton")?.addEventListener("click", () => {
      this.newEntityType = "light"
      this.toggleEditMode()
    })

    document.getElementById("addLockButton")?.addEventListener("click", () => {
      this.newEntityType = "lock"
      this.toggleEditMode()
    })

    document.getElementById("deleteButton")?.addEventListener("click", () => {
      this.removeEntity(this.entitySelector.selected.id)
    })

    this.animate()
  }

  toggleEditMode = () => {
    this.editMode = !this.editMode
    if (this.editMode) this.scene.add(this.ghost)
    else this.scene.remove(this.ghost)
  }

  onPointerDown = (intersect: any) => {
    if (!this.editMode) return
    this.addEntity(intersect.point)
    this.toggleEditMode()
  }
  onPointerUp = () => {}
  onPointerMove = (intersect: any) => {
    this.ghost.position.copy(intersect.point)
  }

  addEntity = (position: THREE.Vector3) => {
    if (this.newEntityType === "light")
      this.entityManager.add(new Light(this, { position }))
    else if (this.newEntityType === "lock")
      this.entityManager.add(new Lock(this, { position }))
  }

  removeEntity = (entityId: number) => {
    this.entityManager.remove(entityId)
  }

  onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  animate = () => {
    requestAnimationFrame(this.animate)
    this.controls.update()
    this.renderer.render(this.scene, this.camera)
  }
}

export default ThreejsApp
