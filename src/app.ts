import './styles/index.scss'
import Game from './snake'

const wrapper = document.querySelector('.wrapper') as HTMLDivElement
const frame = document.querySelector('.frame') as HTMLDivElement
console.log(wrapper, frame);

console.log(wrapper.scrollWidth, wrapper.scrollHeight);

const game = new Game(wrapper, frame)
console.log(game);

console.log('Hello World!');

window.addEventListener('keydown', event => {
   if (event.key.includes('Arrow') && game.movement.isMovementFinished) {
      game.movement.isMovementFinished = false
      game.movement.movementHandler(event)
   }
})