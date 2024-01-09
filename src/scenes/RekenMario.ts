"use strict";
import Phaser from "phaser";
import "../../public/style.css";
import { MotionController } from "../ts/motioncontroller";

interface AnswerContainer extends Phaser.GameObjects.Text {
  isCorrect: boolean;
}

export class RekenMario extends Phaser.Scene {
  // physics in the game
  private _player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private _ground!: Phaser.Physics.Arcade.StaticGroup;
  private _cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private _heart!: Phaser.GameObjects.Group;
  private _scoreText!: Phaser.GameObjects.Text;
  private _score!: number;
  private _gameOver: boolean = false;

  // educational part
  private _firstNumber!: number;
  private _secondNumber!: number;
  private _sumText!: Phaser.GameObjects.Text;
  private _answer!: number;
  private _answers: number[] = [];
  private _answerContainers: Phaser.GameObjects.Container[] = [];
  private _x_position!: number;

  //sounds
  private _theme_sound!: Phaser.Sound.BaseSound;
  private _correct_sound!: Phaser.Sound.BaseSound;
  private _wrong_sound!: Phaser.Sound.BaseSound;
  private _gameOver_sound!: Phaser.Sound.BaseSound;
  private _jump_sound!: Phaser.Sound.BaseSound;

  //mediapipe
  private _tracking_start: boolean = false;
  private _motion_controller!: MotionController;
  private _spaceBar!: Phaser.Input.Keyboard.Key;
  private _kKey!: Phaser.Input.Keyboard.Key;

  constructor() {
    super({ key: "RekenMario" });
  }

  preload() {
    this.loadImages();
  }

  create() {
    this.SetImages();
    this.createSounds();
    this._theme_sound.play();
    this.configPlayer();
    this.createSumObject(this.cameras.main.centerX, 70, this.generateSumText());
    this.generateAnswers();
    this.resetSum();

    //mediapipe
    this._motion_controller = new MotionController(
      (window as any).poseMarker,
      this
    );
    this._spaceBar = this.input!.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this._kKey = this.input!.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.K);

    //reset score
    this._score = 0;
    // score
    this._scoreText = this.add.text(
      30,
      20,
      "score: " + this._score.toString(),
      {
        fontSize: "45px",
        fontFamily: "SuperMario",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 15,
        align: "center",
      }
    );

    // Enable physics debugging to see physics bodies
    // this.physics.world.createDebugGraphic();

    // let's the player collide with the platform
    this.physics.add.collider(this._player, this._ground);
    // Add collider between player and each answer
    this.physics.add.collider(
      this._player,
      this._answerContainers,
      (player, answerContainer) => {
        const answer = answerContainer as AnswerContainer;

        // animatie on collision
        if (answerContainer instanceof Phaser.GameObjects.Container) {
          this.tweens.add({
            targets: answerContainer,
            y: answerContainer.y - 15,
            ease: "Linear",
            duration: 100,
            yoyo: true,
            repeat: 0,
          });
        }

        if (answer.isCorrect) {
          this._score += 10;
          this._scoreText.setText("score: " + this._score.toString());
          // animate coin
          if (answerContainer instanceof Phaser.GameObjects.Container) {
            this.animateCoin(answerContainer.x, answerContainer.y - 110);
          }
          // play sound
          this._correct_sound.play();
          // reset the sum with a delay
          setTimeout(() => {
            this.resetSum();
          }, 300);
        } else {
          // remove 1 heart if the answer is wrong
          let heartObject = this._heart.getChildren()[0];
          heartObject.destroy();
          this._wrong_sound.play();

          if (this._heart.getLength() === 0) {
            // Game over als er geen hartjes meer zijn
            this.physics.pause();
            this._player.setTint(0xff0000);
            this._gameOver_sound.play();
            this._gameOver = true;
            this._theme_sound.pause();
            this.scene.start("GameOverScene", { score: this._score });
          } else {
            // reset the sum with a delay
            setTimeout(() => {
              this.resetSum();
            }, 300);
          }
        }
      }
    );

    this._heart = this.add.group({
      key: "heart",
      repeat: 2,
      setXY: { x: 1120, y: 50, stepX: 60 },
    });

    this._cursors = this.input!.keyboard!.createCursorKeys();
  }

  update(deltime: any) {
    // this.playerMovementKeyboard(deltime);
    // this.playerMovementMotionTracking(deltime);
    if (this._spaceBar.isDown) {
      this._tracking_start = true;
    }
    if (this._kKey.isDown) {
      this._tracking_start = false;
    }
    if (this._tracking_start) {
      this._motion_controller.MovePlayer(this, this._player);
    } else {
      this.playerMovementKeyboard(deltime);
    }
  }

  private loadImages() {
    this.load.image("background", "../../public/assets/background.png");
    this.load.image("ground", "../../public/assets/ground.png");
    this.load.image("heart", "../../public/assets/pixel_heart.png");
    this.load.spritesheet("sprite", "../../public/assets/sprite.png", {
      frameWidth: 55,
      frameHeight: 85,
    });
    this.load.image("answer-block", "../../public/assets/mario-block.png");
    this.load.image("coin", "../../public/assets/coin.png");

    //load sounds
    this.load.audio("theme", "../../public/assets/sounds/theme-music.mp3");
    this.load.audio("correct", "../../public/assets/sounds/correct.wav");
    this.load.audio("wrong", "../../public/assets/sounds/fireworks.wav");
    this.load.audio("gameover", "../../public/assets/sounds/mariodie.wav");
    this.load.audio("jump", "../../public/assets/sounds/jump-small.wav");
  }
  private SetImages(): void {
    let background = this.physics.add.staticGroup();
    background.create(0, 110, "background").setOrigin(0, 0).refreshBody();
    this._ground = this.physics.add.staticGroup();
    this._ground.create(0, 650, "ground").setOrigin(0, 0).refreshBody();
  }
  private createSounds() {
    // add sounds to variables
    this._theme_sound = this.sound.add("theme", { loop: true });
    this._correct_sound = this.sound.add("correct");
    this._wrong_sound = this.sound.add("wrong");
    this._gameOver_sound = this.sound.add("gameover");
    this._jump_sound = this.sound.add("jump");
  }

  private configPlayer(): void {
    this._player = this.physics.add.sprite(
      this.cameras.main.centerX - 120,
      500,
      "sprite"
    );
    this._player.setScale(1.2);
    this._player.setCollideWorldBounds(true);
    this._player.body.setGravityY(2000);

    this.anims.create({
      key: "running",
      frames: this.anims.generateFrameNumbers("sprite", { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "turn",
      frames: [{ key: "sprite", frame: 8 }],
      frameRate: 20,
    });
    this.anims.create({
      key: "jump",
      frames: [{ key: "sprite", frame: 7 }],
      frameRate: 20,
    });
  }

  private generateSumText(): string {
    this._firstNumber = Math.ceil(Math.random() * 10);
    this._secondNumber = Math.ceil(Math.random() * 10);

    return `${this._firstNumber} x ${this._secondNumber} = ?`;
  }

  // Function to create a sum object
  private createSumObject(x: number, y: number, text: string) {
    this._sumText = this.add.text(x, y, text, {
      fontFamily: "SuperMario",
      fontSize: 60,
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 15,
    });
    this._sumText.setOrigin(0.5, 0.5);

    return this._sumText;
  }

  private generateAnswers() {
    this._answers = []; // clear the array
    // Generate answers for the sum
    this._answer = this._firstNumber * this._secondNumber;

    const calculateAnswer = (
      answer: number,
      firstNumber: number,
      secondNumber: number
    ) => {
      if (firstNumber === secondNumber) {
        return answer + (firstNumber + 2);
      } else {
        return answer + firstNumber;
      }
    };

    // push 3 answers in the array
    this._answers.push(
      this._answer,
      this._answer - this._secondNumber,
      calculateAnswer(this._answer, this._firstNumber, this._secondNumber)
    );

    // randomize the array
    this._answers.sort(() => Math.random() - 0.5);

    // generate 3 answers and position them in the canvas
    for (let i = 0; i < this._answers.length; i++) {
      this.createAnswerObject(
        this._x_position,
        280,
        this._answers[i].toString(),
        this._answers[i] === this._answer
      );

      this._x_position = this._x_position + 433;
    }
  }

  private createAnswerObject(
    x: number,
    y: number,
    text: string,
    isCorrect: boolean
  ): Phaser.GameObjects.Container {
    // background answer objects
    let background = this.add.image(0, 0, "answer-block"); // Positie relatief aan de container
    background.setScale(1.1); // Pas dit aan naar behoefte
    background.setOrigin(0.5, 0.5);

    // // Add text to the object
    let answerText = this.add.text(5, 0, text, {
      fontFamily: "SuperMario",
      fontSize: 45,
      color: "#ffffff ",
      stroke: "#000000",
      strokeThickness: 10,
    });
    answerText.setOrigin(0.5, 0.5);

    // Container for the answer object
    let container = this.add.container(x, y, [background, answerText]);
    container.setSize(background.width, background.height);

    // add physics to the container
    this.physics.add.existing(container);

    // make the answerText immovable
    const physicsBody = container.body as Phaser.Physics.Arcade.Body;

    // set the collision to only collide with the player from the bottom
    physicsBody.checkCollision.up = false;
    physicsBody.checkCollision.down = true;
    physicsBody.checkCollision.left = false;
    physicsBody.checkCollision.right = false;

    physicsBody.setImmovable(true);
    physicsBody.setAllowGravity(false);

    // add a custom property to the answerText to check if it is the correct answer
    (container as any).isCorrect = isCorrect;

    // push the container to the answerContainers array for colliding
    this._answerContainers.push(container);

    return container;
  }

  private animateCoin(x: number, y: number) {
    let coin = this.add.sprite(x, y, "coin");
    // start the animation
    this.tweens.add({
      targets: coin,
      y: y - 50,
      alpha: 0, // fade out
      ease: "Power1",
      duration: 1000,
      onComplete: () => {
        coin.destroy(); // destroy the coin after the animation
      },
    });
  }

  private resetSum() {
    // Reset the sum
    this._sumText.setText(this.generateSumText());

    // Reset the answers
    this._answerContainers.forEach((container) => {
      container.destroy();
    });

    this._x_position = 220;
    this.generateAnswers();
  }

  private playerMovementKeyboard(deltaTime: number) {
    const velocityChange = 600;
    const jumpVelocity = -1080;
    // const normalizedDelta = deltaTime / 1000;

    // check if the player is on the ground and if you can jump
    if (this._cursors.up.isDown && this._player.body.touching.down) {
      this._player.setVelocityY(jumpVelocity);
      this._jump_sound.play();
      this._player.anims.play("jump");
    } else {
      // If the player is not on the ground, move the player left and right
      if (this._cursors.left.isDown) {
        this._player.setVelocityX(-velocityChange);
        this._player.flipX = false;
        if (this._player.body.touching.down) {
          this._player.anims.play("running", true);
        }
      } else if (this._cursors.right.isDown) {
        this._player.setVelocityX(velocityChange);
        this._player.flipX = true;
        if (this._player.body.touching.down) {
          this._player.anims.play("running", true);
        }
      } else {
        this._player.setVelocityX(0);
        if (this._player.body.touching.down) {
          this._player.anims.play("turn");
        }
      }
    }
  }
  private playerMovementMotionTracking(deltaTime: number) {}
}
