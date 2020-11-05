class Circle {
    constructor(x, y, radius, theta, freq, n) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.theta = theta;
        this.freq = freq;
        this.n = n;
        this.point = createVector((this.x - this.radius * Math.cos(this.theta)), (this.y - this.radius * Math.sin(this.theta)));
    }

    stepTime(time) {
        this.point.x = (this.x - this.radius * Math.cos(this.freq * time + this.theta));
        this.point.y = (this.y - this.radius * Math.sin(this.freq * time + this.theta));

        // this.point.x += this.radius * (Math.cos(this.i * this.theta) / this.i);
        // this.point.y += this.radius * (Math.sin(this.i * this.theta) / this.i);

        if (this.nextCircle) {
            this.nextCircle.x = this.point.x;
            this.nextCircle.y = this.point.y;
        }
    }

    show() {
        noFill();
        stroke(255, 50);

        ellipse(this.x, this.y, this.radius * 2);

        fill(255, 100);
        ellipse(this.point.x, this.point.y, 8 / this.n);

        line(this.x, this.y, this.point.x, this.point.y);
    }
}

function createEpicycles(x, y, theta, fourier) {
    let allCircles = [];
    let currX = x;
    let currY = y;
    let prevCircle = null;

    for (let i = 0; i < fourier.length; i++) {
        let newCircle = new Circle(currX, currY, fourier[i].amp, fourier[i].phase + theta, fourier[i].freq, i);
        
        if (prevCircle)
            prevCircle.nextCircle = newCircle;

        prevCircle = newCircle;
        currX = newCircle.point.x;
        currY = newCircle.point.y;

        allCircles.push(newCircle);
    }

    return allCircles;
}

let circles = [];
let allCircles = [];
let path = [];

let time = 0;

let drawing = [];

let input = [];
let fourier = [];

let increment = 0;

let isDrawing = false;
let isDoneDrawing = false;

function mousePressed() {
    if (isDrawing) {
        stopDrawing();
    } else if (isDoneDrawing) {
        isDoneDrawing = false;
        path = [];
        drawing = [];
        allCircles = [];
        circles = [];
        time = 0;
        increment = 0;
        input = [];
        fourier = [];
        startDrawing();
    } else {
        startDrawing();
    }
}

function setup() {
    createCanvas(1800, 800)

    
    increment = Math.PI * 2 / fourier.length;
    
    circles = createEpicycles(0, 0, 0, fourier);
    allCircles = [...circles ];
}

function startDrawing() {
    isDrawing = true;
}

function stopDrawing() {
    isDrawing = false;
    
    fourier = findFourier(drawing);
    increment = Math.PI * 2 / fourier.length;
    
    circles = createEpicycles(0, 0, 0, fourier);
    allCircles = [...circles ];

    isDoneDrawing = true;
}

function findFourier(drawing) {
    const skip = 2;
    for (let i = 0; i < drawing.length; i += skip) {
        const c = new ComplexNum(-drawing[i].x, -drawing[i].y);
        input.push(c);
    }
    
    let fourier = dft(input);
    fourier.sort((a, b) => b.amp - a.amp);

    return fourier;
}

function draw() {
    background(20);

    if (isDoneDrawing) {
        time += increment;

        for (let circle of allCircles) {
            circle.stepTime(time);
            circle.show();
        }

        let lastPoint = allCircles[allCircles.length - 1].point;

        path.push(createVector(lastPoint.x, lastPoint.y));

        if (path.length > input.length)
            path.shift();

        beginShape();
        noFill();
        stroke(255);
        for (let i = 0; i < path.length; i++) {
            vertex(path[i].x, path[i].y);
        }
        endShape();
    } else if (isDrawing) {
        const x = mouseX;
        const y = mouseY;
        drawing.push({ x, y });

        beginShape();
        noFill();
        stroke(255);
        for (let i = 0; i < drawing.length; i++) {
            vertex(drawing[i].x, drawing[i].y);
        }
        endShape();
    }
    // stroke(255, 20);
    // line(lastXPoint.x, lastXPoint.y, path[path.length - 1].x, path[path.length - 1].y);
    // line(lastYPoint.x, lastYPoint.y, path[path.length - 1].x, path[path.length - 1].y);
}