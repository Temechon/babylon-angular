import { Component, ViewChild } from '@angular/core';

import { ElementRef } from '@angular/core';
import {
  Engine,
  Scene,
  Light,
  Mesh,
  Color3,
  Vector3,
  HemisphericLight,
  StandardMaterial,
  DynamicTexture,
  ArcRotateCamera,
  FreeCamera,
  BaseTexture,
  Texture,
  AssetsManager,
  GizmoManager,
  MeshAssetTask,
  AbstractMesh,
  Node
} from 'babylonjs';
import 'babylonjs-loaders'



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'babylon-angular';


  private canvas: HTMLCanvasElement;
  private engine: Engine;
  private camera: ArcRotateCamera;
  private scene: Scene;
  private light: Light;

  private sphere: Mesh;

  private assets: Map<string, Node> = new Map();
  s
  public constructor(
  ) { }

  @ViewChild('rendererCanvas', { static: true })
  public rendererCanvas: ElementRef<HTMLCanvasElement>;


  public ngOnInit(): void {
    this.createScene(this.rendererCanvas);
    this.animate();
  }

  public createScene(canvas: ElementRef<HTMLCanvasElement>): void {

    this.canvas = canvas.nativeElement;
    this.engine = new Engine(this.canvas, true);
    this.scene = new Scene(this.engine);


    // let gizmoManager = new GizmoManager(this.scene);
    // gizmoManager.positionGizmoEnabled = true;

    this.camera = new ArcRotateCamera('', 0, 0, 20, Vector3.Zero(), this.scene);
    this.camera.attachControl(this.canvas, false);


    this.light = new HemisphericLight('light1', new Vector3(0, 1, 0), this.scene);

    this.sphere = Mesh.CreateSphere('sphere1', 16, 2, this.scene);
    // this.sphere.visibility = 0;


    const assetsManager = new AssetsManager(this.scene);


    const meshTask = assetsManager.addMeshTask("chaise", "", "assets/3D/", "Bee.glb");
    meshTask.onSuccess = this.saveMesh.bind(this, "chaise");

    meshTask.onError = (task) => {
      console.log("error");
    }

    assetsManager.onProgress = (rc, total) => {
      console.log(rc, total);
    }

    let gm = new GizmoManager(this.scene);
    gm.positionGizmoEnabled = true;
    // gm.rotationGizmoEnabled = true;
    // gm.scaleGizmoEnabled = true;
    gm.boundingBoxGizmoEnabled = true;

    assetsManager.onFinish = (tasks) => {
      console.log("Finished!");

      let node = this.assets.get("chaise");
      let children = node.getChildMeshes();

      gm.usePointerToAttachGizmos = false;
      gm.attachToNode(node);
    };

    assetsManager.onTaskSuccess = () => {
      console.log("ici");

    };
    assetsManager.load();

    this.scene.debugLayer.show();




    // this.showWorldAxis(8);
  }

  saveMesh(name: string, t: MeshAssetTask) {

    let node = new Mesh(name, this.scene);


    for (let tt of t.loadedMeshes) {
      tt.parent = node;
    }
    // node.isPickable = true;
    this.assets.set(name, node);
  }

  public animate(): void {
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
    window.addEventListener('resize', () => {
      this.engine.resize();
    });
  }

  /**
   * creates the world axes
   *
   * Source: https://doc.babylonjs.com/snippets/world_axes
   *
   * @param size number
   */
  public showWorldAxis(size: number): void {

    const makeTextPlane = (text: string, color: string, textSize: number) => {
      const dynamicTexture = new DynamicTexture('DynamicTexture', 50, this.scene, true);
      dynamicTexture.hasAlpha = true;
      dynamicTexture.drawText(text, 5, 40, 'bold 36px Arial', color, 'transparent', true);
      const plane = Mesh.CreatePlane('TextPlane', textSize, this.scene, true);
      const material = new StandardMaterial('TextPlaneMaterial', this.scene);
      material.backFaceCulling = false;
      material.specularColor = new BABYLON.Color3(0, 0, 0);
      material.diffuseTexture = dynamicTexture;
      plane.material = material;

      return plane;
    };

    const axisX = Mesh.CreateLines(
      'axisX',
      [
        Vector3.Zero(),
        new Vector3(size, 0, 0), new Vector3(size * 0.95, 0.05 * size, 0),
        new Vector3(size, 0, 0), new Vector3(size * 0.95, -0.05 * size, 0)
      ],
      this.scene
    );

    axisX.color = new BABYLON.Color3(1, 0, 0);
    const xChar = makeTextPlane('X', 'red', size / 10);
    xChar.position = new Vector3(0.9 * size, -0.05 * size, 0);

    const axisY = Mesh.CreateLines(
      'axisY',
      [
        Vector3.Zero(), new Vector3(0, size, 0), new Vector3(-0.05 * size, size * 0.95, 0),
        new Vector3(0, size, 0), new Vector3(0.05 * size, size * 0.95, 0)
      ],
      this.scene
    );

    axisY.color = new Color3(0, 1, 0);
    const yChar = makeTextPlane('Y', 'green', size / 10);
    yChar.position = new Vector3(0, 0.9 * size, -0.05 * size);

    const axisZ = Mesh.CreateLines(
      'axisZ',
      [
        Vector3.Zero(), new Vector3(0, 0, size), new Vector3(0, -0.05 * size, size * 0.95),
        new Vector3(0, 0, size), new Vector3(0, 0.05 * size, size * 0.95)
      ],
      this.scene
    );

    axisZ.color = new Color3(0, 0, 1);
    const zChar = makeTextPlane('Z', 'blue', size / 10);
    zChar.position = new Vector3(0, 0.05 * size, 0.9 * size);
  }
}
