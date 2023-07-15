import music from './music.ogg';
import { ACESFilmicToneMapping } from 'three';
import { Renin } from 'renin/lib/renin';
import { PostFx } from './PostFx';

export const renin = new Renin({
    music: {
        src: music,
        bpm: 146,
        subdivision: 16,
        beatOffset: 4,
        beatsPerBar: 4,
    },
    root: PostFx,
    productionMode: import.meta.env.PROD,
    rendererOptions: {
        powerPreference: 'high-performance',
    },
    aspectRatio: 16 / 9,
    // toneMapping: ACESFilmicToneMapping,
});

renin.loop();
