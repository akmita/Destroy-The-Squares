# Destroy-The-Squares
A simple HTML canvas-based 2-player game. One of my first personal projects.

### How to run
download repo, open DTS.html using a web browser

### Gameplay
Players can control two squares, and shoot and destroy each other. Control left side with wasd and left shift, 
right side is controlled with the arrow keys and right shift

### How it works
- Developed in JavaScript, using object oriented principles.
- Each player is an object, with fields such as x, y position, speed, health.. ect. 
- Each player also has methods for directional movement, shooting, and drawing itself on screen.
- There is a main loop that runs 30 times a second, that wipes the canvas, listens for user input, and draws game objects with their updated position.   


