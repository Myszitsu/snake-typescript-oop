class SnakeFrame {
	width: number = 0;
	height: number = 0;

	constructor(public wrapper: HTMLDivElement, public frame: HTMLDivElement) {}

	setWidth() {
		this.width = 0;
		const wWidth = this.wrapper.clientWidth;
		while (this.width + 30 <= wWidth) {
			this.width += 30;
		}
		console.log(this.width);
		this.frame.style.width = `${this.width}px`;
	}

	setHeight() {
		this.height = 0;
		const wHeight = this.wrapper.clientHeight;
		console.log(wHeight);
		while (this.height + 30 <= wHeight) {
			this.height += 30;
		}
		this.frame.style.height = `${this.height}px`;
	}

	setSize() {
		this.setHeight();
		this.setWidth();
	}
}

class Snake {
	head: HTMLDivElement = this.frameDiv.querySelector('#head') as HTMLDivElement;
	body: HTMLDivElement[] = [this.head];
	position = {
		x: this.getPosition(this.head).x,
		y: this.getPosition(this.head).y,
	};
	constructor(public frame: SnakeFrame, public frameDiv: HTMLDivElement) {
		this.head.classList.add('snake');
	}

	getPosition(bodyPart: HTMLDivElement) {
		if (!bodyPart.style.transform && bodyPart === this.head) {
			this.setNewPosition();
		}

		return {
			x: +bodyPart.style.transform
				.split('(')[1]
				.slice(0, -1)
				.split(',')[0]
				.slice(0, -2),
			y: +bodyPart.style.transform
				.split('(')[1]
				.slice(0, -1)
				.split(',')[1]
				.slice(0, -2),
		};
	}

	setNewPosition() {
		this.head.style.transform = `translate(${this.frame.width / 2 - 15}px, ${
			this.frame.height / 2 - 15
		}px)`;
	}

	grow() {
		const newSnakePart = document.createElement('div');
		newSnakePart.classList.add('snake');
		newSnakePart.style.transform =
			this.body[this.body.length - 1].style.transform;

		this.frameDiv.append(newSnakePart);
		this.body.push(newSnakePart);
	}
}

class Apple {
	fruit: HTMLDivElement = this.frameDiv.querySelector(
		'#apple'
	) as HTMLDivElement;
	constructor(
		public frame: SnakeFrame,
		public snake: Snake,
		public frameDiv: HTMLDivElement
	) {}

	setNewPosition() {
		const snakeTranslateStyles = this.snake.body.map(el => el.style.transform);

		do {
			this.fruit.style.transform = `translate(${
				Math.floor(Math.random() * (this.frame.width / 15)) * 15
			}px, ${Math.floor(Math.random() * (this.frame.height / 15)) * 15}px)`;
		} while (snakeTranslateStyles.includes(this.fruit.style.transform));
	}
}

class SnakeMovement {
	isMovementFinished = true;
	directionModifier: number = 0;
	direction: number = 0;
	hasSwitchedSides = false;
	interval: any;
	lastKeyEvent = '';

	constructor(
		public frame: SnakeFrame,
		public snake: Snake,
		public apple: Apple
	) {}

	movementHandler(event: KeyboardEvent) {
		let status: string | null = null;
		const isNewMovement = this.setDirection(event);
		this.interval = setInterval(() => {
			if (isNewMovement) {
				switch (true) {
					case event.key === 'ArrowLeft' || event.key === 'ArrowRight':
						this.horizontalMovement();
						break;
					case event.key === 'ArrowUp' || event.key === 'ArrowDown':
						this.verticalMovement();
						break;
				}
			}

			this.updatePosition();
			for (let i = this.snake.body.length - 1; i > 0; i--) {
				this.snake.body[i].style.transform =
					this.snake.body[i - 1].style.transform;
			}
			this.snake.head.style.transform = `translate(${this.snake.position.x}px, ${this.snake.position.y}px)`;

			if (
				this.snake.head.style.transform === this.apple.fruit.style.transform
			) {
				this.snake.grow();
				this.apple.setNewPosition();
				status = 'apple';
			}

			for (let i = this.snake.body.length - 1; i > 1; i--) {
				if (
					this.snake.body[i].style.transform === this.snake.head.style.transform
				) {
					status = 'snake';
				}
			}
			this.isMovementFinished = true;
		}, 50);
		if (status) {
			return status;
		}
		return;
	}

	setDirection(event: KeyboardEvent) {
		let previousDirection = this.directionModifier;
		let keyboardEvent = event.key;
		if (keyboardEvent === 'ArrowLeft' || keyboardEvent === 'ArrowUp') {
			this.directionModifier = -1;
			clearInterval(this.interval);
		} else if (
			keyboardEvent === 'ArrowRight' ||
			keyboardEvent === 'ArrowDown'
		) {
			this.directionModifier = 1;
			clearInterval(this.interval);
		}
		if (
			keyboardEvent.includes('Arrow') &&
			previousDirection === this.directionModifier &&
			keyboardEvent === this.lastKeyEvent
		) {
			return false;
		}
		return true;
	}

	verticalMovement() {
		if (this.snake.body.length > 1) {
			if (
				this.snake.position.y + 15 * this.directionModifier ===
					this.snake.getPosition(this.snake.body[1]).y ||
				(this.hasSwitchedSides && this.direction === this.directionModifier)
			) {
				this.directionModifier *= -1;
			}
		}
		this.snake.position.y += 15 * this.directionModifier;
	}

	horizontalMovement() {
		if (this.snake.body.length > 1) {
			if (
				this.snake.position.x + 15 * this.directionModifier ===
					this.snake.getPosition(this.snake.body[1]).x ||
				(this.hasSwitchedSides && this.direction === this.directionModifier)
			) {
				this.directionModifier *= -1;
			}
		}
		this.snake.position.x += 15 * this.directionModifier;
	}

	updatePosition() {
		const position = this.snake.getPosition(this.snake.head);
		const switchSides = () =>
			(this.snake.head.style.transform = `translate(${position.x}px, ${position.y}px)`);
		const modifyDirection = () => (this.direction = -this.directionModifier);

		switch (true) {
			case position.x + 15 === this.frame.width && this.directionModifier > 0:
				this.snake.position.x = 0;
				switchSides();
				this.hasSwitchedSides = true;
				break;
			case position.x === 0 && this.directionModifier < 0:
				this.snake.position.x = this.frame.width - 15;
				switchSides();
				modifyDirection;
				this.hasSwitchedSides = true;
				break;
			case position.y + 15 === this.frame.height && this.directionModifier > 0:
				this.snake.position.y = 0;
				switchSides();
				this.hasSwitchedSides = true;
				break;
			case position.y === 0 && this.directionModifier < 0:
				this.snake.position.y = this.frame.height - 15;
				switchSides();
				this.hasSwitchedSides = true;
				break;
			default:
				this.hasSwitchedSides = false;
				break;
		}
	}
}

export default class SnakeGame {
	frame: SnakeFrame;
	snake: Snake;
	apple: Apple;
	movement: SnakeMovement;
	constructor(public wrapper: HTMLDivElement, public frameDiv: HTMLDivElement) {
		this.frame = new SnakeFrame(this.wrapper, this.frameDiv);
		this.frame.setSize();
		this.snake = new Snake(this.frame, frameDiv);
		this.apple = new Apple(this.frame, this.snake, frameDiv);
		this.apple.setNewPosition();
		this.movement = new SnakeMovement(this.frame, this.snake, this.apple);
	}
}
