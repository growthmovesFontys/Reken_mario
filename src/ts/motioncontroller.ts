import "phaser";
import * as MediaPipe from "../mediapipe/ts/index";

export class MotionController {
  private positionMarker: MediaPipe.PositionMarker;
  private gameScene: Phaser.Scene;

  constructor(
    positionMarker: MediaPipe.PositionMarker,
    gameScene: Phaser.Scene
  ) {
    this.positionMarker = positionMarker;
    this.gameScene = gameScene;
  }

  public MovePlayer(
    gameScene: Phaser.Scene,
    player: Phaser.Physics.Arcade.Sprite
  ): void {
    var xPos = 0;
    var yPos = 0;
    var positions = this.ReadPosition();

    if (positions.length > 0) {
      xPos = positions[0];
      yPos = positions[1];
    }

    if (player.body) {
      // Jumping
      if (yPos < 0.5 && player.body.touching.down) {
        player.setVelocityY(-1080); // adjust the value as needed
        player.anims.play("jump");
        this.gameScene.sound.play("jump");
      } else {
        // Horizontal Movement
        if (xPos > 0 && xPos < 0.33) {
          player.setVelocityX(-500);
          player.flipX = false;
          if (player.body.touching.down) {
            player.anims.play("running", true);
          }
        } else if (xPos >= 0.33 && xPos < 0.66) {
          player.setVelocityX(0);
          if (player.body.touching.down) {
            player.anims.play("turn");
          }
        } else if (xPos >= 0.66 && xPos <= 1.0) {
          player.setVelocityX(500);
          player.flipX = true;
          if (player.body.touching.down) {
            player.anims.play("running", true);
          }
        }
      }
    }
  }

  private ReadPosition(): [number, number] {
    const dataPoints = this.positionMarker.readPosition([
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    ]);

    var totalXVal = 0;
    var totalYVal = 0;

    dataPoints.forEach(addUp);

    function addUp(item: MediaPipe.Landmark) {
      totalXVal = totalXVal + item.x;
      totalYVal = totalYVal + item.y;
    }

    const xPosition = totalXVal / dataPoints.length;
    const yPosition = totalYVal / dataPoints.length;

    return [xPosition, yPosition];
  }
}

export default MotionController;
