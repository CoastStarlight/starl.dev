
// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Vector = Matter.Vector,
    Body = Matter.Body,
    Detector = Matter.Detector,
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
        height: window.innerHeight,
        //catpuccin machiato
        background: "#24273a",
        wireframes: false
    }
});


function makeRenderOptions() {
    colors = ["#f5bde6", "#c6a0f6", "#ed8796", "#ee99a0", "#f5a97f", "#eed49f", "#8bd5ca", "#7dc4e4", "#8aadf4"]
    return { render: {
        fillStyle: colors[Math.floor(Math.random() * colors.length)]
    }}
}


var mouse = Mouse.create(render.canvas)
var mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse
})

Events.on(mouseConstraint, "mousemove", function(event) {
    Body.setPosition(mouseBody, Vector.create(event.mouse.position.x, event.mouse.position.y))
})


// create two boxes and a ground
// var boxA = Bodies.rectangle(400, 200, 80, 80, makeRenderOptions());
// var boxB = Bodies.rectangle(450, 50, 80, 80, makeRenderOptions());
var mouseBody = Bodies.circle(-300, 100, 20, { isStatic: true, render: { fillStyle: "#24273a"}});
var killGround = Bodies.rectangle(400, window.innerHeight+100, 8100, 60, { isStatic: true });
var leftWall = Bodies.rectangle(-50, 0, 100, 10000000, { isStatic: true})
var rightWall = Bodies.rectangle(window.innerWidth+50, 0, 100, 1000000, { isStatic: true})





// Events.on(mouseConstraint, "mousemove", function(){
//     Body.setPosition(mouseBody, Vector.create(mouseConstraint.mouse.absolute.x, mouseConstraint.mouse.absolute.y))
// })
// add all of the bodies to the world
Composite.add(engine.world, [mouseBody, killGround, leftWall, rightWall]);

var KillPlateDetector = Detector.create({bodies: [killGround]})

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);

Events.on(engine, "collisionStart", function(e) {
    var pairs = e.pairs
    // console.log(pairs)

    for (let i = 0; i < pairs.length; i++) {
        // console.log(pairs[i])
        const pair = pairs[i];
        if(pair.bodyA.id == killGround.id) {
            Matter.World.remove(engine.world, pair.bodyB)
            // console.log(pair.bodyB)
        }
    }
})
setInterval(function() {
    Composite.add(engine.world, Bodies.circle(Math.random()*window.innerWidth, 0, 40))
    // var collisions = Detector.collisions(KillPlateDetector)

    // for (let i = 0; i  < collisions.length; i++) {
    //     var body1 = collisions[i].bodyA
    //     var body2 = collisions[i].bodyB


    //     console.log("hi")
    //    if(body1 != killGround && body1 != mouseBody) {
    //     Matter.World.remove(body1)
    //     continue
    //    }
    //    if(body2 != killGround && body2 != mouseBody) {
    //     Matter.World.remove(body2)
    //    }
    // }
    // Detector.clear(KillPlateDetector)
}, 1000)

window.onerror = function(msg, url, line, col, error) {
    // Catch the error and do whatever is necessary
    return true; // Prevent the original error message from appearing in the console
};