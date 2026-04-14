var body = document.body,
    html = document.documentElement;

var height = Math.max( body.scrollHeight, body.offsetHeight,
                       html.clientHeight, html.scrollHeight, html.offsetHeight );
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
var bgColor = "#24273a"
var mousePos = [-100, -100]
// create a renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: window.innerWidth,
        height: height,
        //catpuccin machiato
        background: bgColor,
        wireframes: false
    }
});

var collidableTextIDs = ["title", "aboutme"]

function makeRenderOptions() {
    colors = ["#f5bde6", "#c6a0f6", "#ed8796", "#ee99a0", "#f5a97f", "#eed49f", "#8bd5ca", "#7dc4e4", "#8aadf4"]
    return {
        fillStyle: colors[Math.floor(Math.random() * colors.length)]
    }
}


var mouse = Mouse.create(render.canvas)
var mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse
})

// Events.on(mouseConstraint, "mousemove", function(event) {
//     Body.setPosition(mouseBody, Vector.create(event.mouse.position.x, event.mouse.position.y))
// })


// create two boxes and a ground
// var boxA = Bodies.rectangle(400, 200, 80, 80, makeRenderOptions());
// var boxB = Bodies.rectangle(450, 50, 80, 80, makeRenderOptions());
var mouseBody = Bodies.circle(-300, 100, 20, { isStatic: true, render: { fillStyle: bgColor}});
var killGround = Bodies.rectangle(0, height+100, 100000, 60, { isStatic: true });
var leftWall = Bodies.rectangle(-50, 0, 100, 10000000, { isStatic: true})
var rightWall = Bodies.rectangle(window.innerWidth+50, 0, 100, 1000000, { isStatic: true})
var mover = Bodies.rectangle(window.innerWidth/2, 800, 100, 20, { isStatic: true, render: makeRenderOptions()})




// Events.on(mouseConstraint, "mousemove", function(){
//     Body.setPosition(mouseBody, Vector.create(mouseConstraint.mouse.absolute.x, mouseConstraint.mouse.absolute.y))
// })
// add all of the bodies to the world
Composite.add(engine.world, [mouseBody, killGround, leftWall, rightWall, mover]);

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

setInterval(spawnBall, 500)

function spawnBall() {
    Composite.add(engine.world, Bodies.circle(Math.random()*window.innerWidth, 0, 40, {restitution:1, render: makeRenderOptions()}))
}
spawnBall()

window.onerror = function(msg, url, line, col, error) {
    // Catch the error and do whatever is necessary
    return true; // Prevent the original error message from appearing in the console
};

onresize = (e) => {
    render.canvas.width=window.innerWidth
    render.canvas.height=height
    Body.setPosition(rightWall, Vector.create(window.innerWidth+50, 0))
    Body.setPosition(killGround, Vector.create(0, height+100))
}

function setupTextCollision() {
    var elements = document.getElementsByClassName("collide")
    for (let i =0; i<elements.length; i++) {
        var element = elements.item(i)
        var bounds = element.getBoundingClientRect()
        // Composite.add(engine.world,
        //     Bodies.rectangle(bounds.x + 0.5 * bounds.width, bounds.y + 0.5 * bounds.height, bounds.width, bounds.height, {isStatic: true})
        // )
        Composite.add(engine.world,
            Bodies.fromVertices(bounds.x + 0.5 * bounds.width, bounds.y + 0.5 * bounds.height,
                [
                    Vector.create(bounds.x, bounds.y),
                    Vector.create(bounds.x, bounds.y+bounds.height),
                    Vector.create(bounds.x+bounds.width, bounds.y+bounds.height),
                    Vector.create(bounds.x+bounds.width, bounds.y),
                    Vector.create(bounds.x + 0.5*bounds.width, bounds.y-bounds.width*.08)

                ], {
                    isStatic: true,
                    render: {
                        fillStyle: bgColor
                    }
                }
            )
        )
    }

}

setupTextCollision()

onmousemove = (e) => {
    Body.setPosition(mouseBody, Vector.create(e.clientX, e.clientY))
}

Events.on(engine, "beforeUpdate", (event) => {
    Body.setPosition(mover, Vector.create(Math.sin(event.timestamp/500)*(window.innerWidth/2 - 65) + window.innerWidth/2, 950))

})