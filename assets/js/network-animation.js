// Configuration for network animation
const CONFIG = {
    // Node (particle) settings
    NODE_MIN_SIZE: 2,          // Minimum size of nodes
    NODE_MAX_SIZE: 6,        // Maximum size of nodes
    NODE_OPACITY: 0.8,         // Opacity of nodes (0-1)
    
    // Connection line settings
    LINE_WIDTH: 1.3,           // Width of connection lines
    LINE_MAX_DISTANCE: 300,    // Maximum distance for connecting nodes
    LINE_OPACITY: 0.6,         // Base opacity for connection lines
    
    // Animation settings
    PARTICLE_COUNT: 150,       // Number of particles
    PARTICLE_SPEED: 0.6        // Speed of particle movement
};

class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.speed = CONFIG.PARTICLE_SPEED;
        this.directionX = Math.random() * 2 - 1;
        this.directionY = (Math.random() * 0.5 - 0.25) * this.speed;
        // Use configured node size range
        this.size = Math.random() * (CONFIG.NODE_MAX_SIZE - CONFIG.NODE_MIN_SIZE) + CONFIG.NODE_MIN_SIZE;
        // Use configured connection distance
        this.connectDistance = CONFIG.LINE_MAX_DISTANCE;
    }

    update() {
        this.x += this.speed * this.directionX;
        this.y += this.directionY;
        
        // Reset position when particle goes off screen
        if (this.x > this.canvas.width) {
            this.x = 0;
        } else if (this.x < 0) {
            this.x = this.canvas.width;
        }

        // Bounce off top and bottom with dampening
        if (this.y > this.canvas.height || this.y < 0) {
            this.directionY = -this.directionY * 0.8;
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        // Use configured node opacity
        ctx.fillStyle = `rgba(255, 255, 255, ${CONFIG.NODE_OPACITY})`;
        ctx.fill();
    }
}

class NetworkAnimation {
    constructor() {
        this.canvas = document.getElementById('network-animation');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        // Use configured particle count
        this.numberOfParticles = CONFIG.PARTICLE_COUNT;
        this.init();
        this.animate();
        
        // Handle resize
        window.addEventListener('resize', () => this.resize());
    }

    init() {
        this.resize();
        this.createParticles();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        for (let i = 0; i < this.numberOfParticles; i++) {
            this.particles.push(new Particle(this.canvas));
        }
    }

    connect() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.particles[i].connectDistance) {
                    const opacity = 1 - (distance / this.particles[i].connectDistance);
                    this.ctx.beginPath();
                    // Use configured line opacity
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * CONFIG.LINE_OPACITY})`;
                    // Use configured line width
                    this.ctx.lineWidth = CONFIG.LINE_WIDTH;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.update();
            particle.draw(this.ctx);
        });
        
        this.connect();
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize animation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NetworkAnimation();
});
