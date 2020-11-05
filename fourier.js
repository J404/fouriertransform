class ComplexNum {
    constructor(a, b) {
        this.re = a;
        this.im = b;
    }

    mag() {
        return Math.sqrt(this.re * this.re + this.im * this.im);
    }

    phase() {
        return  Math.atan2(this.im, this.re);
    }

    static add(a, b) {
        const re = a.re + b.re;
        const im = a.im + b.im;
        return new ComplexNum(re, im);
    }

    static mult(a, b) {
        const re = a.re * b.re - a.im * b.im;
        const im = a.re * b.im + a.im * b.re;
        return new ComplexNum(re, im);
    }
}

function dft(x) {
    let X = [];
    const N = x.length;

    for (let k = 0; k < N; k++) {
        let sum = new ComplexNum(0, 0);

        for (let n = 0; n < x.length; n++) {
            const theta = (2 * Math.PI * k * n) / N;
            
            const c = new ComplexNum(Math.cos(theta), -Math.sin(theta));
            sum = ComplexNum.add(sum, ComplexNum.mult(x[n], c));
        }

        sum.re /= N;
        sum.im /= N;

        const amp = sum.mag(); 
        const freq = k;
        const phase = sum.phase();

        X[k] = { amp, freq, phase, re: sum.re, im: sum.im };
    }

    return X;
}