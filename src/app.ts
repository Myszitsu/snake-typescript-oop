import './styles/index.scss'
import Game from './snake'

const wrapper = document.querySelector('.wrapper') as HTMLDivElement
const frame = document.querySelector('.frame') as HTMLDivElement
const arrowButtons = [...document.querySelectorAll('.arr')]
console.log(wrapper, frame);


const game = new Game(frame)
console.log(game);

console.log('Hello World!');

function movementHandler(event: KeyboardEvent | Event) {
      if (event instanceof KeyboardEvent && event.key.includes('Arrow') && game.movement.isMovementFinished) {
         game.movement.isMovementFinished = false
         game.movement.movementHandler(event)
      } else if (event.target instanceof HTMLButtonElement && event.target.dataset.event && game.movement.isMovementFinished) {
         game.movement.isMovementFinished = false
         game.movement.movementHandler(event)
      }   

}

window.addEventListener('keydown', movementHandler)

arrowButtons.forEach(button => {
   button.addEventListener('click', movementHandler)
})