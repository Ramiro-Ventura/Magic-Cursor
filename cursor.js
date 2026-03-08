const MagicCursor = (() => {

    class MagicCursorParticles {

        #particles;
        #hue;
        #colorIndex;
        #mouseX;
        #mouseY;
        #lastX;
        #lastY;
        #distanceBuffer;
        #isActive;
        #isSpawning = true;

        #container;
        #ctx;
        #resizeObserver;
        #onMouseMove
        #canvas;

        constructor(options = {}) {

            this.options = {

                selector:           options.selector || 'body',
                shape:              options.shape || 'circle', 
                rotation:           options.rotation !== undefined ? options.rotation : [0, 360],
                spin:               options.spin !== undefined ? options.spin : [-0.1, 0.1],
                gravity:            options.gravity !== undefined ? options.gravity : 0,
                friction:           options.friction !== undefined ? options.friction : 1,
                baseSize:           options.baseSize || 4,
                finalSize:          options.finalSize !== undefined ? options.finalSize : 0,
                decay:              options.decay || 0.015,
                speedMultiplier:    options.speedMultiplier || 0,
                colors:             options.colors || 'rainbow',
                spawnDistance:      options.spawnDistance || 20,
                spawnChance:        options.spawnChance !== undefined ? options.spawnChance : 1,
                bounce:             options.bounce !== undefined ? options.bounce : 0.7, 
                useCollision:       options.useCollision !== undefined ? options.useCollision : false,
                lifetime:           options.lifetime !== undefined ? options.lifetime : 0,
                spawnAmount:        options.spawnAmount !== undefined ? options.spawnAmount : 1,
            };

            this.#particles         = [];
            this.#hue               = 0;
            this.#colorIndex        = 0;
            this.#mouseX            = 0;
            this.#mouseY            = 0;
            this.#lastX             = null;
            this.#lastY             = null;
            this.#distanceBuffer    = 0;
            this.#isActive          = true;
            this.#init();
        }

        //Inclusive
        #parseRange(val) {

            if (val !== null && val.constructor === ({}).constructor && !Array.isArray(val)) {
                const choices = Object.values(val);
                return choices[Math.floor(Math.random() * choices.length)];
            }
            else if (Array.isArray(val) && val.length === 2) 
                return Math.random() * (val[1] - val[0]) + val[0];

            return val;
        }

        #getNextColor() {

            const c = this.options.colors;

            if (c === 'rainbow') {

                this.#hue = (this.#hue + (this.options.hueSpeed || 2)) % 360; 
                return `hsla(${this.#hue}, 100%, 50%, 1)`;

            } else if (Array.isArray(c)) {

                const color = c[this.#colorIndex];
                this.#colorIndex = (this.#colorIndex + 1) % c.length;
                return color;
            }

            return c;
        }

        #init() {

            this.#container = document.querySelector(this.options.selector);
            if (!this.#container) return;

            this.#canvas = document.createElement('canvas');
            this.#ctx = this.#canvas.getContext('2d');

            if (getComputedStyle(this.#container).position === 'static')
                this.#container.style.position = 'relative';

            Object.assign(this.#canvas.style, {
                position: 'absolute', 
                top: '0', 
                left: '0',
                pointerEvents: 'none', 
                zIndex: '9999', 
                display: 'block'
            });

            this.#container.appendChild(this.#canvas);
            this.#resizeObserver = new ResizeObserver(() => this.#resize());
            this.#resizeObserver.observe(this.#container);

            this.#onMouseMove = (e) => {

                const rect = this.#container.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                if (this.#lastX === null) {
                    this.#lastX = x;
                    this.#lastY = y;
                    return;
                }

                const dx = x - this.#lastX;
                const dy = y - this.#lastY;
                const moveDist = Math.sqrt(dx * dx + dy * dy);
                
                this.#distanceBuffer += moveDist;

                if(this.#isSpawning){
                    const targetDistance = this.#parseRange(this.options.spawnDistance);

                    if (this.#distanceBuffer >= targetDistance) {
                        
                        const particlesToSpawn = Math.floor(this.#distanceBuffer / targetDistance);
                        
                        for (let i = 0; i < particlesToSpawn; i++) {

                            const pct = (i + 1) / particlesToSpawn;
                            const spawnX = this.#lastX + (dx * pct);
                            const spawnY = this.#lastY + (dy * pct);

                            if (Math.random() <= this.#parseRange(this.options.spawnChance)) {
                                const amount = Math.round(this.#parseRange(this.options.spawnAmount));
                                for (let j = 0; j < amount; j++)
                                    this.#createParticle(spawnX, spawnY);
                            }
                        }
                        this.#distanceBuffer %= targetDistance;
                    }
                }

                this.#lastX = x;
                this.#lastY = y;
            };

            this.#container.addEventListener('mousemove', this.#onMouseMove);
            this.#resize();
            this.#animate();

        }

        #createParticle(x, y) {
            
            const bSize = this.#parseRange(this.options.baseSize);
            const fSize = this.#parseRange(this.options.finalSize);
            const lTime = this.#parseRange(this.options.lifetime);
            const dcy   = this.#parseRange(this.options.decay);
            const totalLifeFrames = lTime + (1 / dcy);

            this.#particles.push({
                x, y,
                vx: (Math.random() - 0.5) * this.#parseRange(this.options.speedMultiplier),
                vy: (Math.random() - 0.5) * this.#parseRange(this.options.speedMultiplier),
                shape: this.#parseRange(this.options.shape),
                startSize: bSize,
                currentSize: bSize,
                finalSize: fSize,
                gravity: this.#parseRange(this.options.gravity),
                friction: this.#parseRange(this.options.friction),
                decay: dcy,
                life: lTime,
                bounce: this.#parseRange(this.options.bounce),
                progress: 0,
                invTotalLife: 1 / totalLifeFrames,
                color: this.#getNextColor(),
                opacity: 1,
                rotation: (this.#parseRange(this.options.rotation) * Math.PI) / 180,
                spin: this.#parseRange(this.options.spin)
            });
        }

        #update() {

            const w = this.#canvas.width;
            const h = this.#canvas.height;

            for (let i = this.#particles.length - 1; i >= 0; i--) {

                const p = this.#particles[i];

                p.vx *= p.friction;
                p.vy *= p.friction;
                p.vy += p.gravity;
                p.x += p.vx;
                p.y += p.vy;
                p.rotation += p.spin;

                if (this.options.useCollision) {
                    if (p.x + p.currentSize > w)        { p.x = w - p.currentSize;  p.vx *= -p.bounce; }
                    else if (p.x - p.currentSize < 0)   { p.x = p.currentSize;      p.vx *= -p.bounce; }
                    if (p.y + p.currentSize > h)        { p.y = h - p.currentSize;  p.vy *= -p.bounce; }
                    else if (p.y - p.currentSize < 0)   { p.y = p.currentSize;      p.vy *= -p.bounce; }
                }

                p.progress += p.invTotalLife;
                p.currentSize = p.startSize + (p.finalSize - p.startSize) * Math.min(p.progress, 1);

                if (p.life > 0) p.life -= 1;
                else p.opacity -= p.decay;

                if (p.opacity <= 0 || p.currentSize <= 0.1) this.#particles.splice(i, 1);
            }
        }

        #draw() {

            this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

            for (const p of this.#particles) {

                const shape = p.shape;

                this.#ctx.globalAlpha = p.opacity;
                this.#ctx.fillStyle = p.color;
                this.#ctx.save();
                this.#ctx.translate(p.x, p.y);
                this.#ctx.rotate(p.rotation);

                if (shape instanceof HTMLImageElement || shape instanceof HTMLCanvasElement) {

                    const size = p.currentSize * 2; 
                    this.#ctx.drawImage(shape, -size/2, -size/2, size, size);
                    
                } else if (shape === 'triangle') {

                    this.#ctx.beginPath();
                    this.#ctx.moveTo(0, -p.currentSize);
                    this.#ctx.lineTo(p.currentSize, p.currentSize);
                    this.#ctx.lineTo(-p.currentSize, p.currentSize);
                    this.#ctx.closePath();
                    this.#ctx.fill();

                }  else if (shape === 'circle'){

                    this.#ctx.beginPath();
                    this.#ctx.arc(0, 0, p.currentSize, 0, Math.PI * 2);
                    this.#ctx.fill();

                } else this.#ctx.fillRect(-p.currentSize, -p.currentSize, p.currentSize * 2, p.currentSize * 2);

                this.#ctx.restore();
            }
        }

        #animate() {
            if (!this.#isActive) return;
            this.#update();
            this.#draw();
            requestAnimationFrame(() => this.#animate());
        }

        #resize() {
            if (!this.#container || !this.#canvas) return;
            this.#canvas.width = this.#container.offsetWidth;
            this.#canvas.height = this.#container.offsetHeight;
        }

        #checkParticles = () => {

            if (this.#particles.length === 0) {

                this.#resizeObserver?.disconnect();

                if (this.#container && this.#onMouseMove) 
                    this.#container.removeEventListener('mousemove', this.#onMouseMove);
    
                this.#canvas?.remove();

                this.#canvas = null;
                this.#ctx = null;
                this.#container = null;
                this.#resizeObserver = null;
                this.#onMouseMove = null;
                this.#particles = null;
                this.#isActive = false;
                this.#isSpawning = false;

            } else requestAnimationFrame(this.#checkParticles);
        };

        pause = () => this.#isSpawning = false;

        play = () => this.#isSpawning = true;

        destroy() {

            this.pause();
            this.#checkParticles();
        }
        
    }

    return class MagicCursor {

        #cursor;
        #delay;
        #className;
        #mouseX;
        #mouseY;
        #followerX;
        #followerY;
        #width;
        #height;
        #follower;
        #particles;
        #defaultParticlesOptions;


        constructor(options = {}) {


            this.#cursor     = options.cursor || 'default';
            this.#delay      = options.delay || 0.10;
            this.#className  = options.className;

            this.#mouseX     = 0;
            this.#mouseY     = 0;
            this.#followerX  = 0;
            this.#followerY  = 0;

            this.#width     = options.width || "20px";
            this.#height    = options.height || "20px";

            this.#setCursor(this.#cursor);

            if(options.particles && options.particles != "") this.addParticles(options.particles);

            if(this.#className && this.#className != ""){

                this.#follower = document.querySelector('#follower');
                
                if(!this.#follower)
                    this.#follower = document.createElement('div');

                document.body.appendChild(this.#follower);

                this.#follower.classList.add(this.#className);

                const [first, second] = options.position.split(' ').map(val => parseInt(val));

                this.#follower.style.position       = "absolute";
                this.#follower.style.pointerEvents  = "none";
                this.#follower.style.willChange     = "transform";
                this.#follower.style.top            = "0";
                this.#follower.style.left           = "0";
                this.#follower.style.display        = "none";
                this.#follower.style.width          = options.width || "20px";
                this.#follower.style.height         = options.height || "20px";
                this.#follower.style.marginLeft     = first ? `-${(first / 100) * parseInt(this.#follower.style.width)}px` : "0";
                this.#follower.style.marginTop      = second ? `-${(second / 100) * parseInt(this.#follower.style.height)}px` : "0";

                console.log((first / 100) * parseInt(this.#follower.style.width), parseInt(this.#follower.style.height));

                window.addEventListener('mousemove', (e) => {

                    if(this.#follower.style.display == "none")
                        this.#follower.style.removeProperty('display');

                    this.#mouseX = e.clientX;
                    this.#mouseY = e.clientY;

                    if (this.#followerX === 0 && this.#followerY === 0){
                        this.#followerX = e.clientX;
                        this.#followerY = e.clientY;
                    }

                });        

                this.#animate();
            }
            
        }

        #animate = () => {

            if (!this.#follower) return;

            this.#followerX += (this.#mouseX - this.#followerX) * this.#delay;
            this.#followerY += (this.#mouseY - this.#followerY) * this.#delay;

            this.#follower.style.transform = `translate3d(${this.#followerX}px, ${this.#followerY}px, 0)`;
            
            requestAnimationFrame(this.#animate);
        }

        onHover(options = {}){

            let elements = [];

            if (typeof options.selector === 'string') elements = Array.from(document.querySelectorAll(options.selector));

            elements.forEach(element => {

                element.addEventListener('mouseenter', () => {

                    if(options.className && options.className != "")
                        this.#follower.classList.add(options.className);
                    
                    this.#setCursor(options.cursor);

                    if(options.particles && options.particles != ""){

                        this.#particles?.destroy();
                        this.#particles = new MagicCursorParticles(options.particles);
                    }

                    if(options.onEnter) options.onEnter(element);

                    if(options.width) this.#follower.style.width = options.width;
                    if(options.height) this.#follower.style.height = options.height;
                });

                element.addEventListener('mouseleave', () => {

                    if(options.className && options.className != "")
                        this.#follower.classList.remove(options.className);

                    this.#setCursor(this.#cursor);

                    if(this.#defaultParticlesOptions && this.#defaultParticlesOptions != ""){

                        this.#particles?.destroy();
                        this.#particles = new MagicCursorParticles(this.#defaultParticlesOptions);

                    }

                    if(options.onLeave) options.onLeave(element);

                    if(this.#width) this.#follower.style.width = this.#width;
                    if(this.#height) this.#follower.style.height = this.#height;

                });
            });


        }
    
        addParticles(options){

            if(options && options != "") {
                
                this.#defaultParticlesOptions = options;
                this.#particles = new MagicCursorParticles(options);

            }
        }

        #setCursor(cursor){

             if(cursor && cursor != ""){

                let svg = `data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 100 100' style='fill:black;font-size:48px;'%3E%3Ctext y='50%25'%3E${cursor}%3C/text%3E%3C/svg%3E`

                if(cursor.indexOf('http') == 0) document.body.style.cursor = `url('${cursor}') 24 24, auto`;
                else if (this.#isChar(cursor)) document.body.style.cursor = `url("${svg}") 20 0, auto`;
                else document.body.style.cursor = cursor;
            } 
        }

        #isChar = (val) => {

            if (typeof val !== 'string') return false;
            const segments = [...new Intl.Segmenter().segment(val)];
            return segments.length === 1;
        };
    
    };

})();
