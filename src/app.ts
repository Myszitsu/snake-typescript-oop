import './styles/index.scss';
import Game from './snake';

const wrapper = document.querySelector('.wrapper') as HTMLDivElement;
const frame = document.querySelector('.frame') as HTMLDivElement;
const arrowButtons = [
	...document.querySelectorAll('.arr'),
] as HTMLButtonElement[];
const play = document.querySelector('.play') as HTMLButtonElement;
const pause = document.querySelector('.pause') as HTMLButtonElement;
const reset = document.querySelector('.reset') as HTMLButtonElement;
console.log(play);
console.log(wrapper, frame);

const game = new Game(frame);
console.log(game);

console.log('Hello World!');

function movementHandler(event: KeyboardEvent | Event) {
	if (
		(event instanceof KeyboardEvent &&
			event.key.includes('Arrow') &&
			game.movement.isMovementFinished) ||
		(event.target instanceof HTMLButtonElement &&
			event.target.dataset.event &&
			game.movement.isMovementFinished)
	) {
		game.movement.isMovementFinished = false;
		game.movement.movementHandler(event);

	}
}

window.addEventListener('keydown', movementHandler);
window.addEventListener('resize', () => {
   game.frame.setSize()
   game.reset()
})

arrowButtons.forEach(button => {
	button.addEventListener('click', movementHandler);
});

pause.addEventListener('click', () => {
	console.log('clicked');
	game.movement.isMovementFinished = true;
	game.movement.pause();
});
reset.addEventListener('click', () => {
   game.reset()
})
play.addEventListener('click', () => {
	console.log('clicked');
	if (game.movement.isMovementFinished) {
		game.movement.isMovementFinished = false;
		game.movement.play();
	}
});
