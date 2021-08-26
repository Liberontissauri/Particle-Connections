import '../scss/app.scss';
import Victor from 'victor';
import p5 from 'p5';

let WIDTH;
let HEIGHT;
const BACKGROUND_COLOR = "#010014";
const BALL_COLORS = ["#FBF5FF", "#BFC9D4", "#7F909A", "#AD8F9A"];

function selectColor(color_list) {
    return color_list[Math.floor(color_list.length * Math.random())];
}
function calcAlpha(distance, range) {
    let alpha = (distance / range) * 255
    return 255 - alpha
}

let particle_list = [];

class particleBall {
    constructor(s, position, velocity, radius, color) {
        this.s = s;
        this.position = position;
        this.velocity = velocity;
        this.radius = radius;
        this.color = color;
    }
    draw() {
        this.s.fill(this.color)
        this.s.stroke(0, 0, 0, 0)
        this.s.circle(this.position.x, this.position.y, this.radius * 2);
    }
    update() {
        this.draw();
        this.position.add(this.velocity)
        this.isCollidingWithWall()
    }
    isCollidingWithWall() {
        if(this.position.x - this.radius < 0) {
            this.position.x = this.radius;
            this.velocity.invertX();
        }
        if(this.position.y - this.radius < 0) {
            this.position.y = this.radius;
            this.velocity.invertY();
        }
        if(this.position.x + this.radius > WIDTH) {
            this.position.x = WIDTH - this.radius;
            this.velocity.invertX();
        }
        if(this.position.y + this.radius > HEIGHT) {
            this.position.y = HEIGHT - this.radius;
            this.velocity.invertY();
        }
    }
}
function connectDots(s, particleList, range) {
    for (let index = 0; index < particleList.length; index++) {
        const particle = particleList[index];
        for (let j = index + 1; j < particleList.length; j++) {
            const particle2 = particleList[j];
            const distance = particle.position.distance(particle2.position);
            if(distance < range) {
                const color = s.color(particle.color);
                const color2 = s.color(particle2.color);
                const line_color = s.color(
                    (s.red(color) + s.red(color2)) / 2,
                    (s.green(color) + s.green(color2)) / 2,
                    (s.blue(color) + s.blue(color2)) / 2,
                    calcAlpha(distance, range)
                )
                s.stroke(line_color)
                s.line(particle.position.x, particle.position.y, particle2.position.x, particle2.position.y)
            }
        }
        
    }
}

const sketch = (s) => {
    s.setup = () => {
        WIDTH = s.windowWidth;
        HEIGHT = s.windowHeight;
        s.createCanvas(WIDTH, HEIGHT);
        for (let index = 0; index < 50; index++) {
            const x = Math.floor(s.random(WIDTH));
            const y = Math.floor(s.random(HEIGHT));
            const vel_x = Math.floor(s.random(100));
            const vel_y = Math.floor(s.random(100));
            const velocity = new Victor(vel_x, vel_y).normalize()
            if(Math.floor(s.random(100)) % 2 == 0) velocity.invertX();
            if(Math.floor(s.random(100)) % 2 == 0) velocity.invertY();
            particle_list.push(new particleBall(s, new Victor(x, y), velocity, 10, selectColor(BALL_COLORS)))
        }
    };

    s.draw = () => {
        s.background(BACKGROUND_COLOR);
        const center_x = WIDTH / 2;
        const center_y = HEIGHT / 2;
        connectDots(s, particle_list, 300)
        particle_list.forEach(particle => {
            particle.update();
        });
        
    };

    s.windowResized =() => {
        WIDTH = s.windowWidth;
        HEIGHT = s.windowHeight;
        s.resizeCanvas(WIDTH, HEIGHT);
    }
};

const sketchInstance = new p5(sketch);