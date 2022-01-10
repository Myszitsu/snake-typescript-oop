import './styles/index.scss';
import { SnakeGame } from './snake';

const frame = document.querySelector('.frame') as HTMLDivElement;
const arrowButtons = [
	...document.querySelectorAll('.arr'),
] as HTMLButtonElement[];
const play = document.querySelector('.play') as HTMLButtonElement;
const pause = document.querySelector('.pause') as HTMLButtonElement;
const reset = document.querySelector('.reset') as HTMLButtonElement;

const game = new SnakeGame(frame);

function movementHandler(event: KeyboardEvent | Event) {
	if (
		event instanceof KeyboardEvent &&
		event.key.includes('Arrow') &&
		game.movement.isMovementFinished &&
		(event.key !== game.movement.eventIdentifier ||
		game.movement.isPaused)
	) {
		game.movement.isMovementFinished = false;
		game.movement.movementHandler(event);
	}
	if (
		event.target instanceof HTMLButtonElement &&
		event.target.dataset.event &&
		game.movement.isMovementFinished &&
		(event.target.dataset.event !== game.movement.eventIdentifier ||
		game.movement.isPaused)
	) {
		game.movement.isMovementFinished = false;
		game.movement.movementHandler(event);
	}
}

window.addEventListener('keydown', movementHandler);
window.addEventListener('resize', () => {
	game.frame.setSize();
	game.movement.resetGame();
});

arrowButtons.forEach(button => {
	button.addEventListener('click', movementHandler);
});

pause.addEventListener('click', () => {
	game.movement.isMovementFinished = true;
	game.movement.pause();
});
reset.addEventListener('click', () => {
	game.movement.resetGame();
});
play.addEventListener('click', () => {
	if (game.movement.isMovementFinished) {
		game.movement.isMovementFinished = false;
		game.movement.play();
	}
});
