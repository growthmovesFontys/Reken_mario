# Reken mario
Reken mario is een educatief spel voor kinderen op de basisschool met een leerachterstand. Dit wordt gebruikt ter ondersteuning van de extra huiswerk oefeningen die ze mee naar huis krijgen. Deze zijn vaak saai en demotiverend, waarbij Growthmoves een rol zal spelen om deze twee aspecten te verbeteren door het leerproces voor deze kinderen leuker en meer stimulerend te maken​​.

## De bedoeling van het spel
Het is een 2D spel waarbij je in de rol stapt als Mario. Op je scherm krijg je een reken som te zien die mario op moet lossen. Er verschijnen ook 3 antwoord blokken waar je tegen aan kunt springen. Spring je tegen het juiste blokje aan dan verdien je muntjes. Spring je niet tegen het juiste blokje aan dan gaat er een leven af. Je hebt 3 levens. Kan jij je score verbeteren?

## Hoe download ik dit
Clone deze repository op je eigen lokale pc. Als je dat gedaan hebt, moet je een aantal stappen doen om het werkend te maken met bijvoorbeeld de extensie Live Server voor Visual Studio Code. Houd er rekening mee dat je Node.js geïnstalleerd moet hebben op je pc.

### Open een nieuwe terminal en type dit:
```
npm install
```

PS: check of je in de juiste map zit.

### Dan type je dit in dezelfde terminal:
```
npx webpack
```
Dit is om al je typescript te bundelen zodat de browser typescript kan lezen.
Open nu de public/dist/index.html met liveserver en je bent klaar om het spel te spelen.


## Hier heb je een kleine preview van het spel
![Reken skiën GIF](https://github.com/growthmovesFontys/reken_mario/blob/main/Reken-mario-gif.gif)


# Documentatie phaser.js 
Phaser.js is een krachtig HTML5 2D game framework dat ontwikkelaars in staat stelt om snel en efficiënt interactieve spellen te ontwikkelen. Het biedt ondersteuning voor zowel Canvas als WebGL, waardoor het flexibel en compatibel is met een breed scala aan apparaten.

## Kernfuncties van Phaser.js
Renderen: Phaser ondersteunt zowel Canvas als WebGL, waardoor het optimaal presteert op een breed scala aan apparaten.
Preloader: Eenvoudig beheer van game assets zoals afbeeldingen, audio en animaties.
Fysica: Ingebouwde ondersteuning voor populaire fysica-engines zoals Arcade Physics, Ninja Physics en de geavanceerde P2 Physics.
Input: Uitgebreide input-ondersteuning, inclusief toetsenbord, muis, touch en gamepad.
Animaties: Ondersteuning voor sprite-sheet animaties, particle systems, en meer.

## Aan de Slag met Phaser.js
Om te beginnen met Phaser, moet je eerst de Phaser-bibliotheek in je project opnemen. Dit kan door het downloaden van de Phaser bibliotheek of door het linken naar een CDN.

Voorbeeldcode: Een Basis Phaser Spel

```javascript
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload() {
    this.load.image('sky', 'assets/sky.png');
    // Voeg hier meer assets toe
}

function create() {
    this.add.image(400, 300, 'sky');
    // Creëer hier het spel
}

function update() {
    // Spellogica bijwerken
}```

