// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Vector = Matter.Vector,
    Body = Matter.Body,
    Composite = Matter.Composite,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Events = Matter.Events;

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight
    }
});

var mouse = Mouse.create(render.canvas)
var mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse
})

Events.on(mouseConstraint, "mousemove", function(event) {
    Body.setPosition(mouseBody, Vector.create(event.mouse.position.x, event.mouse.position.y))
})


// create two boxes and a ground
var boxA = Bodies.rectangle(400, 200, 80, 80);
var boxB = Bodies.rectangle(450, 50, 80, 80);
var mouseBody = Bodies.circle(300, 100, 20, { isStatic: true});
var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
var leftWall = Bodies.rectangle(-50, 0, 100, 10000000, { isStatic: true})
var rightWall = Bodies.rectangle(window.innerWidth+50, 0, 100, 1000000, { isStatic: true})

Body.vis

// Events.on(mouseConstraint, "mousemove", function(){
//     Body.setPosition(mouseBody, Vector.create(mouseConstraint.mouse.absolute.x, mouseConstraint.mouse.absolute.y))
// })
// add all of the bodies to the world
Composite.add(engine.world, [boxA, boxB, ground, mouseBody, leftWall, rightWall]);

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);
