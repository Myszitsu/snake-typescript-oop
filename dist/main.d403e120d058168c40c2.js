/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/styles/index.scss":
/*!*******************************!*\
  !*** ./src/styles/index.scss ***!
  \*******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/snake.ts":
/*!**********************!*\
  !*** ./src/snake.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ SnakeGame; }
/* harmony export */ });
class SnakeFrame {
    constructor(wrapper, frame) {
        this.wrapper = wrapper;
        this.frame = frame;
        this.width = 0;
        this.height = 0;
    }
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
    constructor(frame, frameDiv) {
        this.frame = frame;
        this.frameDiv = frameDiv;
        this.head = this.frameDiv.querySelector('#head');
        this.body = [this.head];
        this.position = {
            x: this.getPosition(this.head).x,
            y: this.getPosition(this.head).y,
        };
        this.head.classList.add('snake');
    }
    getPosition(bodyPart) {
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
        this.head.style.transform = `translate(${this.frame.width / 2 - 15}px, ${this.frame.height / 2 - 15}px)`;
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
    constructor(frame, snake, frameDiv) {
        this.frame = frame;
        this.snake = snake;
        this.frameDiv = frameDiv;
        this.fruit = this.frameDiv.querySelector('#apple');
    }
    setNewPosition() {
        const snakeTranslateStyles = this.snake.body.map(el => el.style.transform);
        do {
            this.fruit.style.transform = `translate(${Math.floor(Math.random() * (this.frame.width / 15)) * 15}px, ${Math.floor(Math.random() * (this.frame.height / 15)) * 15}px)`;
        } while (snakeTranslateStyles.includes(this.fruit.style.transform));
    }
}
class SnakeMovement {
    constructor(frame, snake, apple) {
        this.frame = frame;
        this.snake = snake;
        this.apple = apple;
        this.isMovementFinished = true;
        this.directionModifier = 0;
        this.direction = 0;
        this.hasSwitchedSides = false;
        this.lastKeyEvent = '';
    }
    movementHandler(event) {
        let status = null;
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
            if (this.snake.head.style.transform === this.apple.fruit.style.transform) {
                this.snake.grow();
                this.apple.setNewPosition();
                status = 'apple';
            }
            for (let i = this.snake.body.length - 1; i > 1; i--) {
                if (this.snake.body[i].style.transform === this.snake.head.style.transform) {
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
    setDirection(event) {
        let previousDirection = this.directionModifier;
        let keyboardEvent = event.key;
        if (keyboardEvent === 'ArrowLeft' || keyboardEvent === 'ArrowUp') {
            this.directionModifier = -1;
            clearInterval(this.interval);
        }
        else if (keyboardEvent === 'ArrowRight' ||
            keyboardEvent === 'ArrowDown') {
            this.directionModifier = 1;
            clearInterval(this.interval);
        }
        if (keyboardEvent.includes('Arrow') &&
            previousDirection === this.directionModifier &&
            keyboardEvent === this.lastKeyEvent) {
            return false;
        }
        return true;
    }
    verticalMovement() {
        if (this.snake.body.length > 1) {
            if (this.snake.position.y + 15 * this.directionModifier ===
                this.snake.getPosition(this.snake.body[1]).y ||
                (this.hasSwitchedSides && this.direction === this.directionModifier)) {
                this.directionModifier *= -1;
            }
        }
        this.snake.position.y += 15 * this.directionModifier;
    }
    horizontalMovement() {
        if (this.snake.body.length > 1) {
            if (this.snake.position.x + 15 * this.directionModifier ===
                this.snake.getPosition(this.snake.body[1]).x ||
                (this.hasSwitchedSides && this.direction === this.directionModifier)) {
                this.directionModifier *= -1;
            }
        }
        this.snake.position.x += 15 * this.directionModifier;
    }
    updatePosition() {
        const position = this.snake.getPosition(this.snake.head);
        const switchSides = () => (this.snake.head.style.transform = `translate(${position.x}px, ${position.y}px)`);
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
class SnakeGame {
    constructor(wrapper, frameDiv) {
        this.wrapper = wrapper;
        this.frameDiv = frameDiv;
        this.frame = new SnakeFrame(this.wrapper, this.frameDiv);
        this.frame.setSize();
        this.snake = new Snake(this.frame, frameDiv);
        this.apple = new Apple(this.frame, this.snake, frameDiv);
        this.apple.setNewPosition();
        this.movement = new SnakeMovement(this.frame, this.snake, this.apple);
    }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _styles_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./styles/index.scss */ "./src/styles/index.scss");
/* harmony import */ var _snake__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./snake */ "./src/snake.ts");


const wrapper = document.querySelector('.wrapper');
const frame = document.querySelector('.frame');
console.log(wrapper, frame);
console.log(wrapper.scrollWidth, wrapper.scrollHeight);
const game = new _snake__WEBPACK_IMPORTED_MODULE_1__["default"](wrapper, frame);
console.log(game);
console.log('Hello World!');
window.addEventListener('keydown', event => {
    if (event.key.includes('Arrow') && game.movement.isMovementFinished) {
        game.movement.isMovementFinished = false;
        game.movement.movementHandler(event);
    }
});

}();
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUVsQixPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBRTVCLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLEVBQUU7SUFDeEMsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLGtCQUFrQixFQUFFO1FBQ2xFLElBQUksQ0FBQyxRQUFRLENBQUMsa0JBQWtCLEdBQUcsS0FBSztRQUN4QyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUM7S0FDdEM7QUFDSixDQUFDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9ucG0vLi9zcmMvc3R5bGVzL2luZGV4LnNjc3M/Mjc3NSIsIndlYnBhY2s6Ly9ucG0vLi9zcmMvc25ha2UudHMiLCJ3ZWJwYWNrOi8vbnBtL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL25wbS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vbnBtL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vbnBtL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vbnBtLy4vc3JjL2FwcC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCJjbGFzcyBTbmFrZUZyYW1lIHtcclxuXHR3aWR0aDogbnVtYmVyID0gMDtcclxuXHRoZWlnaHQ6IG51bWJlciA9IDA7XHJcblxyXG5cdGNvbnN0cnVjdG9yKHB1YmxpYyB3cmFwcGVyOiBIVE1MRGl2RWxlbWVudCwgcHVibGljIGZyYW1lOiBIVE1MRGl2RWxlbWVudCkge31cclxuXHJcblx0c2V0V2lkdGgoKSB7XHJcblx0XHR0aGlzLndpZHRoID0gMDtcclxuXHRcdGNvbnN0IHdXaWR0aCA9IHRoaXMud3JhcHBlci5jbGllbnRXaWR0aDtcclxuXHRcdHdoaWxlICh0aGlzLndpZHRoICsgMzAgPD0gd1dpZHRoKSB7XHJcblx0XHRcdHRoaXMud2lkdGggKz0gMzA7XHJcblx0XHR9XHJcblx0XHRjb25zb2xlLmxvZyh0aGlzLndpZHRoKTtcclxuXHRcdHRoaXMuZnJhbWUuc3R5bGUud2lkdGggPSBgJHt0aGlzLndpZHRofXB4YDtcclxuXHR9XHJcblxyXG5cdHNldEhlaWdodCgpIHtcclxuXHRcdHRoaXMuaGVpZ2h0ID0gMDtcclxuXHRcdGNvbnN0IHdIZWlnaHQgPSB0aGlzLndyYXBwZXIuY2xpZW50SGVpZ2h0O1xyXG5cdFx0Y29uc29sZS5sb2cod0hlaWdodCk7XHJcblx0XHR3aGlsZSAodGhpcy5oZWlnaHQgKyAzMCA8PSB3SGVpZ2h0KSB7XHJcblx0XHRcdHRoaXMuaGVpZ2h0ICs9IDMwO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5mcmFtZS5zdHlsZS5oZWlnaHQgPSBgJHt0aGlzLmhlaWdodH1weGA7XHJcblx0fVxyXG5cclxuXHRzZXRTaXplKCkge1xyXG5cdFx0dGhpcy5zZXRIZWlnaHQoKTtcclxuXHRcdHRoaXMuc2V0V2lkdGgoKTtcclxuXHR9XHJcbn1cclxuXHJcbmNsYXNzIFNuYWtlIHtcclxuXHRoZWFkOiBIVE1MRGl2RWxlbWVudCA9IHRoaXMuZnJhbWVEaXYucXVlcnlTZWxlY3RvcignI2hlYWQnKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuXHRib2R5OiBIVE1MRGl2RWxlbWVudFtdID0gW3RoaXMuaGVhZF07XHJcblx0cG9zaXRpb24gPSB7XHJcblx0XHR4OiB0aGlzLmdldFBvc2l0aW9uKHRoaXMuaGVhZCkueCxcclxuXHRcdHk6IHRoaXMuZ2V0UG9zaXRpb24odGhpcy5oZWFkKS55LFxyXG5cdH07XHJcblx0Y29uc3RydWN0b3IocHVibGljIGZyYW1lOiBTbmFrZUZyYW1lLCBwdWJsaWMgZnJhbWVEaXY6IEhUTUxEaXZFbGVtZW50KSB7XHJcblx0XHR0aGlzLmhlYWQuY2xhc3NMaXN0LmFkZCgnc25ha2UnKTtcclxuXHR9XHJcblxyXG5cdGdldFBvc2l0aW9uKGJvZHlQYXJ0OiBIVE1MRGl2RWxlbWVudCkge1xyXG5cdFx0aWYgKCFib2R5UGFydC5zdHlsZS50cmFuc2Zvcm0gJiYgYm9keVBhcnQgPT09IHRoaXMuaGVhZCkge1xyXG5cdFx0XHR0aGlzLnNldE5ld1Bvc2l0aW9uKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0eDogK2JvZHlQYXJ0LnN0eWxlLnRyYW5zZm9ybVxyXG5cdFx0XHRcdC5zcGxpdCgnKCcpWzFdXHJcblx0XHRcdFx0LnNsaWNlKDAsIC0xKVxyXG5cdFx0XHRcdC5zcGxpdCgnLCcpWzBdXHJcblx0XHRcdFx0LnNsaWNlKDAsIC0yKSxcclxuXHRcdFx0eTogK2JvZHlQYXJ0LnN0eWxlLnRyYW5zZm9ybVxyXG5cdFx0XHRcdC5zcGxpdCgnKCcpWzFdXHJcblx0XHRcdFx0LnNsaWNlKDAsIC0xKVxyXG5cdFx0XHRcdC5zcGxpdCgnLCcpWzFdXHJcblx0XHRcdFx0LnNsaWNlKDAsIC0yKSxcclxuXHRcdH07XHJcblx0fVxyXG5cclxuXHRzZXROZXdQb3NpdGlvbigpIHtcclxuXHRcdHRoaXMuaGVhZC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlKCR7dGhpcy5mcmFtZS53aWR0aCAvIDIgLSAxNX1weCwgJHtcclxuXHRcdFx0dGhpcy5mcmFtZS5oZWlnaHQgLyAyIC0gMTVcclxuXHRcdH1weClgO1xyXG5cdH1cclxuXHJcblx0Z3JvdygpIHtcclxuXHRcdGNvbnN0IG5ld1NuYWtlUGFydCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cdFx0bmV3U25ha2VQYXJ0LmNsYXNzTGlzdC5hZGQoJ3NuYWtlJyk7XHJcblx0XHRuZXdTbmFrZVBhcnQuc3R5bGUudHJhbnNmb3JtID1cclxuXHRcdFx0dGhpcy5ib2R5W3RoaXMuYm9keS5sZW5ndGggLSAxXS5zdHlsZS50cmFuc2Zvcm07XHJcblxyXG5cdFx0dGhpcy5mcmFtZURpdi5hcHBlbmQobmV3U25ha2VQYXJ0KTtcclxuXHRcdHRoaXMuYm9keS5wdXNoKG5ld1NuYWtlUGFydCk7XHJcblx0fVxyXG59XHJcblxyXG5jbGFzcyBBcHBsZSB7XHJcblx0ZnJ1aXQ6IEhUTUxEaXZFbGVtZW50ID0gdGhpcy5mcmFtZURpdi5xdWVyeVNlbGVjdG9yKFxyXG5cdFx0JyNhcHBsZSdcclxuXHQpIGFzIEhUTUxEaXZFbGVtZW50O1xyXG5cdGNvbnN0cnVjdG9yKFxyXG5cdFx0cHVibGljIGZyYW1lOiBTbmFrZUZyYW1lLFxyXG5cdFx0cHVibGljIHNuYWtlOiBTbmFrZSxcclxuXHRcdHB1YmxpYyBmcmFtZURpdjogSFRNTERpdkVsZW1lbnRcclxuXHQpIHt9XHJcblxyXG5cdHNldE5ld1Bvc2l0aW9uKCkge1xyXG5cdFx0Y29uc3Qgc25ha2VUcmFuc2xhdGVTdHlsZXMgPSB0aGlzLnNuYWtlLmJvZHkubWFwKGVsID0+IGVsLnN0eWxlLnRyYW5zZm9ybSk7XHJcblxyXG5cdFx0ZG8ge1xyXG5cdFx0XHR0aGlzLmZydWl0LnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGUoJHtcclxuXHRcdFx0XHRNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAodGhpcy5mcmFtZS53aWR0aCAvIDE1KSkgKiAxNVxyXG5cdFx0XHR9cHgsICR7TWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKHRoaXMuZnJhbWUuaGVpZ2h0IC8gMTUpKSAqIDE1fXB4KWA7XHJcblx0XHR9IHdoaWxlIChzbmFrZVRyYW5zbGF0ZVN0eWxlcy5pbmNsdWRlcyh0aGlzLmZydWl0LnN0eWxlLnRyYW5zZm9ybSkpO1xyXG5cdH1cclxufVxyXG5cclxuY2xhc3MgU25ha2VNb3ZlbWVudCB7XHJcblx0aXNNb3ZlbWVudEZpbmlzaGVkID0gdHJ1ZTtcclxuXHRkaXJlY3Rpb25Nb2RpZmllcjogbnVtYmVyID0gMDtcclxuXHRkaXJlY3Rpb246IG51bWJlciA9IDA7XHJcblx0aGFzU3dpdGNoZWRTaWRlcyA9IGZhbHNlO1xyXG5cdGludGVydmFsOiBhbnk7XHJcblx0bGFzdEtleUV2ZW50ID0gJyc7XHJcblxyXG5cdGNvbnN0cnVjdG9yKFxyXG5cdFx0cHVibGljIGZyYW1lOiBTbmFrZUZyYW1lLFxyXG5cdFx0cHVibGljIHNuYWtlOiBTbmFrZSxcclxuXHRcdHB1YmxpYyBhcHBsZTogQXBwbGVcclxuXHQpIHt9XHJcblxyXG5cdG1vdmVtZW50SGFuZGxlcihldmVudDogS2V5Ym9hcmRFdmVudCkge1xyXG5cdFx0bGV0IHN0YXR1czogc3RyaW5nIHwgbnVsbCA9IG51bGw7XHJcblx0XHRjb25zdCBpc05ld01vdmVtZW50ID0gdGhpcy5zZXREaXJlY3Rpb24oZXZlbnQpO1xyXG5cdFx0dGhpcy5pbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcclxuXHRcdFx0aWYgKGlzTmV3TW92ZW1lbnQpIHtcclxuXHRcdFx0XHRzd2l0Y2ggKHRydWUpIHtcclxuXHRcdFx0XHRcdGNhc2UgZXZlbnQua2V5ID09PSAnQXJyb3dMZWZ0JyB8fCBldmVudC5rZXkgPT09ICdBcnJvd1JpZ2h0JzpcclxuXHRcdFx0XHRcdFx0dGhpcy5ob3Jpem9udGFsTW92ZW1lbnQoKTtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlIGV2ZW50LmtleSA9PT0gJ0Fycm93VXAnIHx8IGV2ZW50LmtleSA9PT0gJ0Fycm93RG93bic6XHJcblx0XHRcdFx0XHRcdHRoaXMudmVydGljYWxNb3ZlbWVudCgpO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMudXBkYXRlUG9zaXRpb24oKTtcclxuXHRcdFx0Zm9yIChsZXQgaSA9IHRoaXMuc25ha2UuYm9keS5sZW5ndGggLSAxOyBpID4gMDsgaS0tKSB7XHJcblx0XHRcdFx0dGhpcy5zbmFrZS5ib2R5W2ldLnN0eWxlLnRyYW5zZm9ybSA9XHJcblx0XHRcdFx0XHR0aGlzLnNuYWtlLmJvZHlbaSAtIDFdLnN0eWxlLnRyYW5zZm9ybTtcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLnNuYWtlLmhlYWQuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZSgke3RoaXMuc25ha2UucG9zaXRpb24ueH1weCwgJHt0aGlzLnNuYWtlLnBvc2l0aW9uLnl9cHgpYDtcclxuXHJcblx0XHRcdGlmIChcclxuXHRcdFx0XHR0aGlzLnNuYWtlLmhlYWQuc3R5bGUudHJhbnNmb3JtID09PSB0aGlzLmFwcGxlLmZydWl0LnN0eWxlLnRyYW5zZm9ybVxyXG5cdFx0XHQpIHtcclxuXHRcdFx0XHR0aGlzLnNuYWtlLmdyb3coKTtcclxuXHRcdFx0XHR0aGlzLmFwcGxlLnNldE5ld1Bvc2l0aW9uKCk7XHJcblx0XHRcdFx0c3RhdHVzID0gJ2FwcGxlJztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Zm9yIChsZXQgaSA9IHRoaXMuc25ha2UuYm9keS5sZW5ndGggLSAxOyBpID4gMTsgaS0tKSB7XHJcblx0XHRcdFx0aWYgKFxyXG5cdFx0XHRcdFx0dGhpcy5zbmFrZS5ib2R5W2ldLnN0eWxlLnRyYW5zZm9ybSA9PT0gdGhpcy5zbmFrZS5oZWFkLnN0eWxlLnRyYW5zZm9ybVxyXG5cdFx0XHRcdCkge1xyXG5cdFx0XHRcdFx0c3RhdHVzID0gJ3NuYWtlJztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy5pc01vdmVtZW50RmluaXNoZWQgPSB0cnVlO1xyXG5cdFx0fSwgNTApO1xyXG5cdFx0aWYgKHN0YXR1cykge1xyXG5cdFx0XHRyZXR1cm4gc3RhdHVzO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuO1xyXG5cdH1cclxuXHJcblx0c2V0RGlyZWN0aW9uKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XHJcblx0XHRsZXQgcHJldmlvdXNEaXJlY3Rpb24gPSB0aGlzLmRpcmVjdGlvbk1vZGlmaWVyO1xyXG5cdFx0bGV0IGtleWJvYXJkRXZlbnQgPSBldmVudC5rZXk7XHJcblx0XHRpZiAoa2V5Ym9hcmRFdmVudCA9PT0gJ0Fycm93TGVmdCcgfHwga2V5Ym9hcmRFdmVudCA9PT0gJ0Fycm93VXAnKSB7XHJcblx0XHRcdHRoaXMuZGlyZWN0aW9uTW9kaWZpZXIgPSAtMTtcclxuXHRcdFx0Y2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcclxuXHRcdH0gZWxzZSBpZiAoXHJcblx0XHRcdGtleWJvYXJkRXZlbnQgPT09ICdBcnJvd1JpZ2h0JyB8fFxyXG5cdFx0XHRrZXlib2FyZEV2ZW50ID09PSAnQXJyb3dEb3duJ1xyXG5cdFx0KSB7XHJcblx0XHRcdHRoaXMuZGlyZWN0aW9uTW9kaWZpZXIgPSAxO1xyXG5cdFx0XHRjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWwpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKFxyXG5cdFx0XHRrZXlib2FyZEV2ZW50LmluY2x1ZGVzKCdBcnJvdycpICYmXHJcblx0XHRcdHByZXZpb3VzRGlyZWN0aW9uID09PSB0aGlzLmRpcmVjdGlvbk1vZGlmaWVyICYmXHJcblx0XHRcdGtleWJvYXJkRXZlbnQgPT09IHRoaXMubGFzdEtleUV2ZW50XHJcblx0XHQpIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG5cclxuXHR2ZXJ0aWNhbE1vdmVtZW50KCkge1xyXG5cdFx0aWYgKHRoaXMuc25ha2UuYm9keS5sZW5ndGggPiAxKSB7XHJcblx0XHRcdGlmIChcclxuXHRcdFx0XHR0aGlzLnNuYWtlLnBvc2l0aW9uLnkgKyAxNSAqIHRoaXMuZGlyZWN0aW9uTW9kaWZpZXIgPT09XHJcblx0XHRcdFx0XHR0aGlzLnNuYWtlLmdldFBvc2l0aW9uKHRoaXMuc25ha2UuYm9keVsxXSkueSB8fFxyXG5cdFx0XHRcdCh0aGlzLmhhc1N3aXRjaGVkU2lkZXMgJiYgdGhpcy5kaXJlY3Rpb24gPT09IHRoaXMuZGlyZWN0aW9uTW9kaWZpZXIpXHJcblx0XHRcdCkge1xyXG5cdFx0XHRcdHRoaXMuZGlyZWN0aW9uTW9kaWZpZXIgKj0gLTE7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHRoaXMuc25ha2UucG9zaXRpb24ueSArPSAxNSAqIHRoaXMuZGlyZWN0aW9uTW9kaWZpZXI7XHJcblx0fVxyXG5cclxuXHRob3Jpem9udGFsTW92ZW1lbnQoKSB7XHJcblx0XHRpZiAodGhpcy5zbmFrZS5ib2R5Lmxlbmd0aCA+IDEpIHtcclxuXHRcdFx0aWYgKFxyXG5cdFx0XHRcdHRoaXMuc25ha2UucG9zaXRpb24ueCArIDE1ICogdGhpcy5kaXJlY3Rpb25Nb2RpZmllciA9PT1cclxuXHRcdFx0XHRcdHRoaXMuc25ha2UuZ2V0UG9zaXRpb24odGhpcy5zbmFrZS5ib2R5WzFdKS54IHx8XHJcblx0XHRcdFx0KHRoaXMuaGFzU3dpdGNoZWRTaWRlcyAmJiB0aGlzLmRpcmVjdGlvbiA9PT0gdGhpcy5kaXJlY3Rpb25Nb2RpZmllcilcclxuXHRcdFx0KSB7XHJcblx0XHRcdFx0dGhpcy5kaXJlY3Rpb25Nb2RpZmllciAqPSAtMTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0dGhpcy5zbmFrZS5wb3NpdGlvbi54ICs9IDE1ICogdGhpcy5kaXJlY3Rpb25Nb2RpZmllcjtcclxuXHR9XHJcblxyXG5cdHVwZGF0ZVBvc2l0aW9uKCkge1xyXG5cdFx0Y29uc3QgcG9zaXRpb24gPSB0aGlzLnNuYWtlLmdldFBvc2l0aW9uKHRoaXMuc25ha2UuaGVhZCk7XHJcblx0XHRjb25zdCBzd2l0Y2hTaWRlcyA9ICgpID0+XHJcblx0XHRcdCh0aGlzLnNuYWtlLmhlYWQuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZSgke3Bvc2l0aW9uLnh9cHgsICR7cG9zaXRpb24ueX1weClgKTtcclxuXHRcdGNvbnN0IG1vZGlmeURpcmVjdGlvbiA9ICgpID0+ICh0aGlzLmRpcmVjdGlvbiA9IC10aGlzLmRpcmVjdGlvbk1vZGlmaWVyKTtcclxuXHJcblx0XHRzd2l0Y2ggKHRydWUpIHtcclxuXHRcdFx0Y2FzZSBwb3NpdGlvbi54ICsgMTUgPT09IHRoaXMuZnJhbWUud2lkdGggJiYgdGhpcy5kaXJlY3Rpb25Nb2RpZmllciA+IDA6XHJcblx0XHRcdFx0dGhpcy5zbmFrZS5wb3NpdGlvbi54ID0gMDtcclxuXHRcdFx0XHRzd2l0Y2hTaWRlcygpO1xyXG5cdFx0XHRcdHRoaXMuaGFzU3dpdGNoZWRTaWRlcyA9IHRydWU7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgcG9zaXRpb24ueCA9PT0gMCAmJiB0aGlzLmRpcmVjdGlvbk1vZGlmaWVyIDwgMDpcclxuXHRcdFx0XHR0aGlzLnNuYWtlLnBvc2l0aW9uLnggPSB0aGlzLmZyYW1lLndpZHRoIC0gMTU7XHJcblx0XHRcdFx0c3dpdGNoU2lkZXMoKTtcclxuXHRcdFx0XHRtb2RpZnlEaXJlY3Rpb247XHJcblx0XHRcdFx0dGhpcy5oYXNTd2l0Y2hlZFNpZGVzID0gdHJ1ZTtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSBwb3NpdGlvbi55ICsgMTUgPT09IHRoaXMuZnJhbWUuaGVpZ2h0ICYmIHRoaXMuZGlyZWN0aW9uTW9kaWZpZXIgPiAwOlxyXG5cdFx0XHRcdHRoaXMuc25ha2UucG9zaXRpb24ueSA9IDA7XHJcblx0XHRcdFx0c3dpdGNoU2lkZXMoKTtcclxuXHRcdFx0XHR0aGlzLmhhc1N3aXRjaGVkU2lkZXMgPSB0cnVlO1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlIHBvc2l0aW9uLnkgPT09IDAgJiYgdGhpcy5kaXJlY3Rpb25Nb2RpZmllciA8IDA6XHJcblx0XHRcdFx0dGhpcy5zbmFrZS5wb3NpdGlvbi55ID0gdGhpcy5mcmFtZS5oZWlnaHQgLSAxNTtcclxuXHRcdFx0XHRzd2l0Y2hTaWRlcygpO1xyXG5cdFx0XHRcdHRoaXMuaGFzU3dpdGNoZWRTaWRlcyA9IHRydWU7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0dGhpcy5oYXNTd2l0Y2hlZFNpZGVzID0gZmFsc2U7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTbmFrZUdhbWUge1xyXG5cdGZyYW1lOiBTbmFrZUZyYW1lO1xyXG5cdHNuYWtlOiBTbmFrZTtcclxuXHRhcHBsZTogQXBwbGU7XHJcblx0bW92ZW1lbnQ6IFNuYWtlTW92ZW1lbnQ7XHJcblx0Y29uc3RydWN0b3IocHVibGljIHdyYXBwZXI6IEhUTUxEaXZFbGVtZW50LCBwdWJsaWMgZnJhbWVEaXY6IEhUTUxEaXZFbGVtZW50KSB7XHJcblx0XHR0aGlzLmZyYW1lID0gbmV3IFNuYWtlRnJhbWUodGhpcy53cmFwcGVyLCB0aGlzLmZyYW1lRGl2KTtcclxuXHRcdHRoaXMuZnJhbWUuc2V0U2l6ZSgpO1xyXG5cdFx0dGhpcy5zbmFrZSA9IG5ldyBTbmFrZSh0aGlzLmZyYW1lLCBmcmFtZURpdik7XHJcblx0XHR0aGlzLmFwcGxlID0gbmV3IEFwcGxlKHRoaXMuZnJhbWUsIHRoaXMuc25ha2UsIGZyYW1lRGl2KTtcclxuXHRcdHRoaXMuYXBwbGUuc2V0TmV3UG9zaXRpb24oKTtcclxuXHRcdHRoaXMubW92ZW1lbnQgPSBuZXcgU25ha2VNb3ZlbWVudCh0aGlzLmZyYW1lLCB0aGlzLnNuYWtlLCB0aGlzLmFwcGxlKTtcclxuXHR9XHJcbn1cclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIGRlZmluaXRpb24pIHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqLCBwcm9wKSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTsgfSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0ICcuL3N0eWxlcy9pbmRleC5zY3NzJ1xyXG5pbXBvcnQgR2FtZSBmcm9tICcuL3NuYWtlJ1xyXG5cclxuY29uc3Qgd3JhcHBlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy53cmFwcGVyJykgYXMgSFRNTERpdkVsZW1lbnRcclxuY29uc3QgZnJhbWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZnJhbWUnKSBhcyBIVE1MRGl2RWxlbWVudFxyXG5jb25zb2xlLmxvZyh3cmFwcGVyLCBmcmFtZSk7XHJcblxyXG5jb25zb2xlLmxvZyh3cmFwcGVyLnNjcm9sbFdpZHRoLCB3cmFwcGVyLnNjcm9sbEhlaWdodCk7XHJcblxyXG5jb25zdCBnYW1lID0gbmV3IEdhbWUod3JhcHBlciwgZnJhbWUpXHJcbmNvbnNvbGUubG9nKGdhbWUpO1xyXG5cclxuY29uc29sZS5sb2coJ0hlbGxvIFdvcmxkIScpO1xyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBldmVudCA9PiB7XHJcbiAgIGlmIChldmVudC5rZXkuaW5jbHVkZXMoJ0Fycm93JykgJiYgZ2FtZS5tb3ZlbWVudC5pc01vdmVtZW50RmluaXNoZWQpIHtcclxuICAgICAgZ2FtZS5tb3ZlbWVudC5pc01vdmVtZW50RmluaXNoZWQgPSBmYWxzZVxyXG4gICAgICBnYW1lLm1vdmVtZW50Lm1vdmVtZW50SGFuZGxlcihldmVudClcclxuICAgfVxyXG59KSJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==