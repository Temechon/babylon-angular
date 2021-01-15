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
  FreeCamera
} from 'babylonjs';


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

  public constructor(
  ) { }

  @ViewChild('rendererCanvas', { static: true })
  public rendererCanvas: ElementRef<HTMLCanvasElement>;


  public ngAfterViewInit(): void {
    this.createScene(this.rendererCanvas);
    this.animate();
  }

  public createScene(canvas: ElementRef<HTMLCanvasElement>): void {

    this.canvas = canvas.nativeElement;
    this.engine = new Engine(this.canvas, true);
    this.scene = new Scene(this.engine);


    this.camera = new ArcRotateCamera('', 0, 0, 20, Vector3.Zero(), this.scene);

    let camera = new FreeCamera("camera1", new Vector3(0, 5, -10), this.scene);
    this.camera.attachControl(this.canvas, false);


    this.light = new HemisphericLight('light1', new Vector3(0, 1, 0), this.scene);


    this.sphere = Mesh.CreateSphere('sphere1', 16, 2, this.scene);


    this.sphere.visibility = 0;

    let cube = Mesh.CreateBox('box', 1, this.scene);

    // simple rotation along the y axis
    this.scene.registerAfterRender(() => {


      cube.translate(
        new Vector3(0, 0.02, 0),
        1,
        BABYLON.Space.LOCAL
      );

      // cube.position.x += 0.1

    });

    this.showWorldAxis(8);
  }

  public animate(): void {


    window.addEventListener('DOMContentLoaded', () => {
      this.engine.runRenderLoop(() => {
        this.scene.render();
      });
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
