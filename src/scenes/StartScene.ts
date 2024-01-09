import Phaser from "phaser";

export class StartScene extends Phaser.Scene {
  private _start_sound!: Phaser.Sound.BaseSound;

  constructor() {
    super({ key: "StartScene" });
  }

  preload() {
    this.load.audio("start", "../../public/assets/sounds/title-screen.mp3");
    this.load.image("startscreen", "../../public/assets/startscreen.png");
  }

  create() {
    this._start_sound = this.sound.add("start");
    this._start_sound.play();

    let background = this.physics.add.staticGroup();
    background.create(0, 0, "startscreen").setOrigin(0, 0).refreshBody();

    // Maak een startknop (tekst of sprite)
    let startButton = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY + 70,
      "Start Game",
      {
        fontSize: 60,
        fontFamily: "SuperMario",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 6,
      }
    );
    startButton.setInteractive();
    startButton.setOrigin(0.5);

    // Voeg een event listener toe voor de klik
    startButton.on("pointerdown", () => {
      this._start_sound.stop();
      // Start het spel of ga naar een andere scene
      this.scene.start("RekenMario"); // Vervang 'GameScene' met de key van je hoofdgame scene
    });
  }
}
