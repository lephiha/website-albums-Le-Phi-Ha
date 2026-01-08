// Scroll animations - ADD CLASS VISIBLE
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all album cards and section titles
document.querySelectorAll('.album-card, .section-title').forEach(el => {
    observer.observe(el);
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Parallax effect on floating shapes
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const shapes = document.querySelectorAll('.floating-shape');
    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.3;
        shape.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
    });
});

function sendEmail(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=phihasky@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent('From: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + message)}`;
    
    window.open(gmailLink, '_blank');
}

// Cursor trail effect
let lastTrailTime = 0;
document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastTrailTime < 50) return;
    lastTrailTime = now;
    
    const trail = document.createElement('div');
    trail.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: rgba(161, 98, 7, 0.3);
        pointer-events: none;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        transform: translate(-50%, -50%);
        animation: trailFade 1s ease-out forwards;
        z-index: 9999;
    `;
    document.body.appendChild(trail);
    
    setTimeout(() => trail.remove(), 1000);
});

// Add trail fade animation
const style = document.createElement('style');
style.textContent = `
    @keyframes trailFade {
        to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(2);
        }
    }
`;
document.head.appendChild(style);

// Fireworks Animation
const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

class Particle {
    constructor(x, y, color, angle, speed) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.angle = angle;
        this.speed = speed;
        this.velocity = {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed
        };
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.01;
        this.size = Math.random() * 3 + 2;
        this.gravity = 0.05;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.globalAlpha = this.alpha * 0.5;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.velocity.y += this.gravity;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= this.decay;
    }
}

class Firework {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.particles = [];
        this.colors = ['#ff6b6b', '#4ecdc4', '#ffd700', '#ff8c42', '#95e1d3', '#a8e6cf', '#dda0dd', '#87ceeb'];
        this.createParticles();
    }

    createParticles() {
        const particleCount = Math.random() * 80 + 80;
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = Math.random() * 4 + 3;
            this.particles.push(new Particle(this.x, this.y, color, angle, speed));
        }
    }

    update() {
        this.particles = this.particles.filter(p => p.alpha > 0);
        this.particles.forEach(p => {
            p.update();
            p.draw();
        });
    }
}

class Rocket {
    constructor(x, targetY) {
        this.x = x;
        this.y = canvas.height;
        this.targetY = targetY;
        this.speed = 8;
        this.exploded = false;
        this.trail = [];
    }

    draw() {
        ctx.save();
        for (let i = 0; i < this.trail.length; i++) {
            const alpha = i / this.trail.length;
            ctx.globalAlpha = alpha * 0.7;
            ctx.fillStyle = '#ffd700';
            ctx.beginPath();
            ctx.arc(this.trail[i].x, this.trail[i].y, 2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    update() {
        if (this.y > this.targetY) {
            this.trail.push({ x: this.x, y: this.y });
            if (this.trail.length > 20) this.trail.shift();
            
            this.y -= this.speed;
            this.draw();
            return false;
        } else {
            this.exploded = true;
            return true;
        }
    }
}

let fireworks = [];
let rockets = [];

function createFirework() {
    const x = Math.random() * canvas.width;
    const targetY = Math.random() * canvas.height * 0.4 + canvas.height * 0.1;
    rockets.push(new Rocket(x, targetY));
}

function animate() {
    ctx.fillStyle = 'rgba(255, 247, 237, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    rockets = rockets.filter(rocket => {
        const exploded = rocket.update();
        if (exploded) {
            fireworks.push(new Firework(rocket.x, rocket.y));
            return false;
        }
        return true;
    });

    fireworks = fireworks.filter(fw => fw.particles.length > 0);
    fireworks.forEach(fw => fw.update());

    requestAnimationFrame(animate);
}

setInterval(createFirework, 1000);

for (let i = 0; i < 2; i++) {
    setTimeout(createFirework, i * 500);
}

animate();