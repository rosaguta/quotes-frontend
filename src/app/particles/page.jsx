"use client"
import { animate, createTimer, utils } from 'animejs';
import { useEffect } from 'react';

export default function Page() {
  useEffect(() => {
    const $animationWrapper = document.querySelector('#animation-wrapper');
    const $circle = document.querySelector('#circle');
    console.log($circle)
    
    const viewport = { w: window.innerWidth * .5, h: window.innerHeight * .5 };
    const rows = 1;
    const baseRadius = $circle.offsetWidth / 1.85;
    const activeRadius = $circle.offsetWidth / .75;
    const pointer = { x: 0, y: 0, isDown: false, radius: baseRadius };
    
    const radiusTimeOut = createTimer({
      duration: 150,
      onComplete: () => pointer.radius = baseRadius
    });

    function animateParticule($el, particleIndex) {
      // Calculate unique angle for each particle
      const totalParticles = rows * rows;
      const angleStep = (Math.PI * 2) / totalParticles;
      let currentAngle = particleIndex * angleStep;
      
      createTimer({
        frameRate: 60,
        onUpdate: () => {
          // Slowly rotate the angle to create circular motion
          currentAngle += 0.02; // Adjust this value to control rotation speed
          
          const radius = pointer.isDown ? activeRadius : baseRadius;
          
          animate($el, {
            x: { 
              to: (Math.cos(currentAngle) * radius) + pointer.x, 
              duration: () => utils.random(500, 1000) // Faster duration for smoother movement
            },
            y: { 
              to: (Math.sin(currentAngle) * radius) + pointer.y, 
              duration: () => utils.random(500, 1000) 
            },
            backgroundColor: '#FF0000',
            scale: .5 + utils.random(.1, 1, 2),
            duration: () => utils.random(1000, 1500),
            ease: `inOut(${utils.random(1, 5)})`,
            composition: 'blend'
          });
        }
      })
    }

    document.addEventListener('mousemove', e => {
      pointer.x = e.pageX - viewport.w;
      pointer.y = e.pageY - viewport.h;
      pointer.radius = (pointer.isDown ? activeRadius : baseRadius * 1.25);
      radiusTimeOut.restart();
      utils.set($circle, { translateX: pointer.x, translateY: pointer.y });
    });

    document.addEventListener('mousedown', e => {
      pointer.isDown = true;
      animate($circle, { scale: .5, opacity: 1, filter: 'saturate(1.25)' });
    });

    document.addEventListener('mouseup', e => {
      pointer.isDown = false;
      animate($circle, { scale: 1, opacity: .3, filter: 'saturate(1)' });
    });

    const colors = ['red', 'orange', 'lightorange'];
    for (let i = 0; i < (rows * rows); i++) {
      const $particle = document.createElement('div');
      $particle.classList.add('particle');
      utils.set($particle, { color: `var(--${colors[utils.random(0, colors.length - 1)]})` });
      $animationWrapper.appendChild($particle);
      animateParticule($particle, i); // Pass the index to create unique angles
    }
  }, [])

  return (
    <div id="animation-wrapper">
      <div id="circle"></div>
    </div>
  )
}