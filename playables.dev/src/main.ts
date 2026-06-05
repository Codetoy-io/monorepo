//@ts-expect-error
if (window.ytgame) {
//@ts-expect-error
  console.log("YT Game", window.ytgame);

//@ts-expect-error
  await ytgame.game.firstFrameReady();
//@ts-expect-error
  await ytgame.game.gameReady();
} else {
  console.log("YT Game not found");
}

import './style.css'
// import { setupCounter } from './counter.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button">Boop</button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`
