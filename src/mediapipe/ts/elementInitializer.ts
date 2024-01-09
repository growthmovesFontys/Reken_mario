export class ElementInitializer {


    public static createVideoElement = (divElement: HTMLDivElement, id: string) : HTMLVideoElement => {

        const element = document.createElement("video") as HTMLVideoElement;
        element.autoplay = true;
        element.id = id;
        divElement.appendChild(element);

        return element;

    }

    public static createButtonElement = (divElement: HTMLDivElement, id: string) : HTMLButtonElement => {

        var element;

        element = document.createElement("button") as HTMLButtonElement;
        element.textContent = 'Enable Webcam';
        element.id = id;
        divElement.appendChild(element);

        return element;

    }

    public static createCanvasElement = (divElement: HTMLDivElement, id: string) : HTMLCanvasElement => {

        var element;

        element = document.createElement("canvas") as HTMLCanvasElement;
        element.id = id;
        divElement.appendChild(element);

        return element;

    }

}
