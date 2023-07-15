import { easeIn, smoothstep } from 'renin/lib/interpolations';
import { Renin } from 'renin/lib/renin';
import { ReninNode } from 'renin/lib/ReninNode';
import {
    AmbientLight,
    FloatType,
    LinearEncoding,
    Mesh,
    MeshBasicMaterial,
    MeshPhongMaterial,
    MeshPhysicalMaterial,
    MeshStandardMaterial,
    PerspectiveCamera,
    PointLight,
    Scene,
    TorusKnotGeometry,
    WebGLRenderer,
    WebGLRenderTarget,
} from 'three';

export class Dancer extends ReninNode {
    startFrame = 0;
    endFrame = 2000;

    scene = new Scene();
    camera = new PerspectiveCamera();

    donut: Mesh<TorusKnotGeometry, MeshPhongMaterial>;

    /* The renderTarget for this node. */
    renderTarget = new WebGLRenderTarget(640, 360, {
        type: FloatType,
    });

    constructor(renin: Renin) {
        super(renin);

        this.donut = new Mesh(
            new TorusKnotGeometry(2, 0.5, 200, 200, 3, 8),
            new MeshPhongMaterial({ color: 0xff0000 })
        );

        const light = new AmbientLight(0xffffff); // soft white light
        this.scene.add(light);

        const pointLight = new PointLight(0xff9999, 1000, 100);
        pointLight.position.set(50, 50, 50);
        this.scene.add(pointLight);

        this.scene.add(this.donut);
        this.camera.position.z = 7;
        this.camera.position.y = 0;
        this.camera.position.x = 1;
        this.camera.fov = 75;
        this.camera.aspect = 16 / 9;
        this.camera.updateProjectionMatrix();
    }
    //tror vi lager en beat og bpm i main, kan hente inn dem?
    //kjøre modulo og lage litt rykk på 1-eren elns?
    public render(frame: number, renderer: WebGLRenderer, renin: Renin) {
        // let beat = ((frame * renin.sync.music.bpm) / 60 / 60) | 0;
        // let beat = renin.sync.step;
        // let angle = (frame * renin.sync.music.bpm) / 60 / 60;
        // angle = (angle | 0) + easeIn(0, 1, angle % 1) ** 2;
        // angle *= (Math.PI * 2) / 4;
        // let bars = (beat / 4) | 0;
        //tror beat er et saa lavt tall at du ikke ser noe forskjell 0-3
        // jeg er ikke så flink i matte, men blir den ikke mellom 0 og 3? når det er mo
        // let inBeat = (beat | 0) % 4;

        // let flash = renin.sync.flash(frame, 32);

        // For every step, we want to move 0.1 deg per step
        // For the last 16 steps, we want to move an additional 0.8 deg per step (so that we land on the last step)

        // So for every 64 step, we want to move ... degrees

        let step = renin.sync.stepForFrame(frame);
        let beat = (step / 16) | 0;
        let stepsInBar = step % 64;
        let bar = (step / 64) | 0;

        let endOfBarBeatSteps = Math.max(stepsInBar - 64 + 16, 0);

        // const segmentFrame = renin.sync.frameForStep(step);
        /* Number of frames since the start of the current segment */
        // const segmentRelativeFrame = frame - segmentFrame;

        let rotPerBar = 16 + 64 * 0.1;

        let rotation =
            bar * rotPerBar + smoothstep(0, 16, endOfBarBeatSteps / 16) + stepsInBar * 0.1;

        this.donut.rotation.x = rotation / 10;
        this.donut.rotation.y = rotation / 20;

        // console.log('bars', bars);
        // this.donut.rotation.x += 0.3 + inBeat * 0.1;
        // this.donut.rotation.y += 0.6 + inBeat * 0.2;
        // this.donut.rotation.x += angle * 0.3;
        // this.donut.rotation.y += angle * 0.6;

        renderer.setRenderTarget(this.renderTarget);
        renderer.outputEncoding = LinearEncoding;
        renderer.render(this.scene, this.camera);
    }
}
