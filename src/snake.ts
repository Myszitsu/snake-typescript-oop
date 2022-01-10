class SnakeFrame {
		width: number = 0;
		height: number = 0;

		constructor(public frame: HTMLDivElement) {}

		setWidth() {
			this.width = 0;
         const remSize = +window.getComputedStyle(document.body).fontSize.slice(0, -2) 
			while (this.width + 30 <= window.innerWidth * 0.9 && this.width + 60 <= (remSize * 80)) {
				this.width += 30;
			}
			this.frame.style.width = `${this.width}px`;
		}

		setHeight() {
			this.height = 0;
			while (this.height + 30 <= window.innerHeight * 0.5) {
				this.height += 30;
			}
			this.frame.style.height = `${this.height}px`;
		}

		setSize() {
			this.setHeight();
			this.setWidth();
		}
	}

	class SnakeBody {
		head: HTMLDivElement;
		body: HTMLDivElement[];
		position: {
			x: number;
			y: number;
		};
		constructor(public frame: SnakeFrame, public frameDiv: HTMLDivElement) {
			this.head = this.frameDiv.querySelector('#head') as HTMLDivElement;
			this.head.classList.add('snake');
			this.body = [this.head];
			this.position = {
				x: this.getPosition(this.head).x,
				y: this.getPosition(this.head).y,
			};
		}

		reset() {
			this.body.forEach((el, idx) => {
				if (idx > 0) {
					el.remove();
				}
			});
			this.body = this.body.filter(
				(_: HTMLDivElement, idx: number) => idx === 0
			);
			this.setNewHeadPosition();
			this.position = this.getPosition(this.head);
		}

		getPosition(bodyPart: HTMLDivElement) {
			if (!bodyPart.style.transform && bodyPart === this.head) {
				this.setNewHeadPosition();
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

		setNewHeadPosition() {
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
      appleCount: number = 0;
		fruit: HTMLDivElement;
		constructor(
			public frame: SnakeFrame,
			public snake: SnakeBody,
			public frameDiv: HTMLDivElement
		) {
			this.fruit = this.frameDiv.querySelector('#apple') as HTMLDivElement;
			this.fruit.classList.add('apple');
		}

		setNewPosition() {
			const snakeTranslateStyles = this.snake.body.map(
				el => el.style.transform
			);

			do {
				this.fruit.style.transform = `translate(${
					Math.floor(Math.random() * (this.frame.width / 15)) * 15
				}px, ${Math.floor(Math.random() * (this.frame.height / 15)) * 15}px)`;
			} while (snakeTranslateStyles.includes(this.fruit.style.transform));
		}

      setAppleCount(reset?: boolean) {
			const frame = this.frameDiv.querySelector('#h2') as HTMLElement
         if (reset) {
            this.appleCount = 0
            frame.textContent = 'APPLES : 0'
            return
         }
         frame.textContent = `APPLES : ${++this.appleCount}`
      }
	}

	class SnakeMovement {
		isMovementFinished = true;
		direction: number = 1;
		interval: any;
		eventIdentifier = '';
      movementSpeed: number = 50
		wasXUpdated: boolean = false;
		wasYUpdated: boolean = false;
		isPaused: boolean = false;
		updateDirection: number = 0

		constructor(
			public frame: SnakeFrame,
			public snake: SnakeBody,
			public apple: Apple
		) {}

      resetGame() {
			this.resetMovement();
			setTimeout(() => {
				this.snake.reset();
				this.apple.setNewPosition();
            this.apple.setAppleCount(true)
			}, this.movementSpeed);
		}

		resetMovement() {
			clearInterval(this.interval);
			this.eventIdentifier = '';
			this.direction = 1;
			this.wasXUpdated = false;
			this.wasYUpdated = false;
			this.updateDirection = 0
			setTimeout(() => {
				this.isMovementFinished = true;
			}, this.movementSpeed);
		}

		pause() {
			this.isPaused = true
			clearInterval(this.interval);
			setTimeout(() => {
				this.isMovementFinished = true;
			}, this.movementSpeed);
		}

		play() {
			this.pause();
			setTimeout(() => {
				this.eventIdentifier = this.eventIdentifier || 'ArrowRight'
				this.movementHandler();
			}, this.movementSpeed);
		}

		movementHandler(event?: KeyboardEvent | Event) {
			this.isPaused = false
			if (event) {
				this.setDirection(event);
				clearInterval(this.interval);
			}
			this.interval = setInterval(() => {
				switch (true) {
					case this.eventIdentifier === 'ArrowLeft' ||
						this.eventIdentifier === 'ArrowRight':
						this.horizontalMovement();
						break;
					case this.eventIdentifier === 'ArrowUp' ||
						this.eventIdentifier === 'ArrowDown':
						this.verticalMovement();
						break;
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
               this.apple.setAppleCount()
				}

				for (let i = this.snake.body.length - 1; i > 1; i--) {
					if (
						this.snake.body[i].style.transform ===
						this.snake.head.style.transform
					) {
                  this.resetGame()
					}
				}
				this.isMovementFinished = true;
            return this.apple.appleCount
			}, this.movementSpeed);
		}

		setDirection(event: KeyboardEvent | Event) {
			if (event instanceof KeyboardEvent) {
				this.eventIdentifier = event.key;
			} else {
				const target = event.target as HTMLButtonElement;
				this.eventIdentifier = target.dataset.event as string;
			}

			if (
				this.eventIdentifier === 'ArrowLeft' ||
				this.eventIdentifier === 'ArrowUp'
			) {
				this.direction = -1;
			} else if (
				this.eventIdentifier === 'ArrowRight' ||
				this.eventIdentifier === 'ArrowDown'
			) {
				this.direction = 1;
			}
		}

		verticalMovement() {
			const position = this.snake.getPosition(this.snake.head);
			if (
				this.snake.body.length > 1 &&
				(position.y + 15 * this.direction ===
					this.snake.getPosition(this.snake.body[1]).y || (this.wasYUpdated && this.updateDirection === -this.direction))
			) {
				this.direction *= -1;
			}

			this.snake.position.y += 15 * this.direction;
		}

		horizontalMovement() {
			const position = this.snake.getPosition(this.snake.head);
			if (
				this.snake.body.length > 1 &&
				(position.x + 15 * this.direction ===
					this.snake.getPosition(this.snake.body[1]).x || (this.wasXUpdated && this.updateDirection === -this.direction))
			) {
				this.direction *= -1;
			}
			this.snake.position.x += 15 * this.direction;
		}

		updatePosition() {
			const position = this.snake.getPosition(this.snake.head);
			const switchSides = () =>
				(this.snake.head.style.transform = `translate(${position.x}px, ${position.y}px)`);

			switch (true) {
				case position.x === this.frame.width - 15 && this.direction > 0:
					this.snake.position.x = 0;
					switchSides();
					this.wasXUpdated = true
					this.updateDirection = this.direction
					break;
				case position.x === 0 && this.direction < 0:
					this.snake.position.x = this.frame.width - 15;
					switchSides();
					this.wasXUpdated = true
					this.updateDirection = this.direction
					break;
				case position.y === this.frame.height - 15 && this.direction > 0:
					this.snake.position.y = 0;
					switchSides();
					this.wasYUpdated = true
					this.updateDirection = this.direction
					break;
				case position.y === 0 && this.direction < 0:
					this.snake.position.y = this.frame.height - 15;
					switchSides();
					this.wasYUpdated = true
					this.updateDirection = this.direction
					break;
				default:
					this.wasXUpdated = false
					this.wasYUpdated = false
					break;
			}
		}
	}

	export class SnakeGame {
		frame: SnakeFrame;
		snake: SnakeBody;
		apple: Apple;
		movement: SnakeMovement;
		constructor(public frameDiv: HTMLDivElement) {
			this.frame = new SnakeFrame(this.frameDiv);
			this.frame.setSize();
			this.snake = new SnakeBody(this.frame, frameDiv);
			this.apple = new Apple(this.frame, this.snake, frameDiv);
			this.apple.setNewPosition();
			this.movement = new SnakeMovement(this.frame, this.snake, this.apple);
		}
	}
