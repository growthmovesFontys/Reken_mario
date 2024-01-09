import Phaser from "phaser";

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameOverScene" });
  }

  create(data: { score: number }) {
    // Weergave van 'Game Over' tekst
    this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY - 100,
        "Game Over",
        {
          fontSize: "64px",
          fontFamily: "SuperMario",
        }
      )
      .setOrigin(0.5);

    // Weergave van de score
    this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        `Score: ${data.score}`,
        {
          fontSize: "48px",
        }
      )
      .setOrigin(0.5);

    // Voeg een knop of tekst toe om opnieuw te spelen
    let restartButton = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY + 100,
      "Opnieuw Spelen",
      {
        fontSize: "32px",
        fontFamily: "SuperMario",
      }
    );
    restartButton.setInteractive();
    restartButton.setOrigin(0.5);

    restartButton.on("pointerdown", () => {
      this.scene.start("RekenMario");
    });
  }
}
