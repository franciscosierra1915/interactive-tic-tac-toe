import * as THREE from "three";
import { useEffect } from "react";
import SceneInit from "./lib/SceneInit";
import TicTacToe from "./lib/TicTacToe";
import "./App.css"

function App() {
  useEffect(() => {
    const experience = new SceneInit("three-canvas");
    experience.initScene();
    experience.animate();

    const ticTacToe = new TicTacToe();
    experience.scene.add(ticTacToe.board);

    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    function onMouseDown(event) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, experience.camera);
      const intersects = raycaster.intersectObjects(
        ticTacToe.hiddenTiles.children
      );
      if (intersects.length > 0) {
        const xOffset = intersects[0].object.position.x;
        const yOffset = intersects[0].object.position.y;
        ticTacToe.addCrossOrCircle(xOffset, yOffset);
        ticTacToe.checkWinConditions();
        const index = ticTacToe.hiddenTiles.children.findIndex(
          (c) => c.uuid === intersects[0].object.uuid
        );
        ticTacToe.hiddenTiles.children.splice(index, 1);
      }
    }

    window.addEventListener("mousedown", onMouseDown, false);

    const scaleUp = (obj) => {
      if (obj.scale.x < 1) {
        obj.scale.x += 0.02;
      }
      if (obj.scale.y < 1) {
        obj.scale.y += 0.02;
      }
      if (obj.scale.z < 1) {
        obj.scale.z += 0.02;
      }
    };

    // NOTE: Animate board and player moves.
    const animate = () => {
      ticTacToe.boardLines.children.forEach(scaleUp);
      ticTacToe.circles.children.forEach(scaleUp);
      ticTacToe.crosses.children.forEach(scaleUp);
      ticTacToe.winLine.children.forEach(scaleUp);
      ticTacToe.board.rotation.y += 0.001;
      requestAnimationFrame(animate);
    };
    animate();
  });

  return (
    <div id="canvas-container">
      <canvas id="three-canvas"/>
    </div>
  );
}

export default App;
