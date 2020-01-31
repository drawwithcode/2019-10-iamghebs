//variable to manage the mesh
var turtle, turtles = [];

//var for the background song
var rapide;

//var to manage ftt and volume
var analyzer;

function preload() {
  turtle = loadModel("assets/turtleMesh.obj", true); //free download from cadnav.com

  rapide = loadSound("assets/Rapide.mp3");
  //music credits: Mahmood - Rapide (Universal Music Italia 2020)

  adlib = loadFont('assets/adlib.ttf');
}

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(DEGREES);

  //toggle the sound file by clicking anywhere on the canvas
  cnv.mouseClicked(togglePlay);
  fft = new p5.FFT();
  rapide.amp(0.2); //set volume
  analyzer = new p5.Amplitude();

  //managing and styling text through DOM
  var text = createDiv('Click to toggle "Rapide" by Mahmood');
  text.style("position: absolute; top: 4%; left: 50%; transform: translateX(-50%); color: white; text-align: center; font-family: adlib; font-size: 2vw");

  for (var i = 0; i <= 7; i++) {
    //creating the array of the orbiting turtles
    turtles.push(new Tartaruga());
  }
}

function draw() {
  scale(width * height / 700000);

  fft.analyze();
  var trib = 2 * fft.getEnergy('bass') + 1; //getting bass volume
  var trim = 2 * fft.getEnergy('mid') + 1; //getting mid volume
  var trit = 2 * fft.getEnergy('treble') + 1; //getting treble volume

  background(trit / 2); //background color changes based on treble

  rotateZ(180); //turn mesh upside-down

  //gentle smooth rotations
  rotateX(frameCount * 0.5);
  rotateY(frameCount * 0.5);

  //changing light position according to mouse position
  let locX = mouseX - width / 2;
  let locY = mouseY - height / 2;

  //lights color changing by music
  pointLight(204 + trib, 160 + trib, 79 + trib, locX, locY, 50);
  pointLight(55 + trim, 138 + trim, 136 + trim, -locX, -locY, 50);

  noStroke();

  //shiny material for the meshes
  specularMaterial(245);
  model(turtle);

  //tracking sound values
  print('sound:');
  print(trib);
  print(trim);
  print(trit);

  //setting camera parallel to XY plane
  ortho();
  camera(-width / 2, height / 2, 0, 0, 0, 0, 0, 1, 0);

  //displaying orbiting turtles
  for (var i = 0; i < turtles.length; i++) {
    turtles[i].spawn();
  }
}

function togglePlay() {
  if (rapide.isPlaying()) {
    rapide.pause();
  } else {
    rapide.loop();
  }
}

//creating an object to manage the turtles
function Tartaruga() {

  //managing position, size and movements
  this.x = width/5;
  this.y = height/5;
  this.z = random(-30, 30);

  this.rotation = random(-1, 1);
  this.size = random(0.5, 1.5);

  this.spawn = function() {
    push();
    scale(this.size);
    rotateY(frameCount * this.rotation);
    rotateZ(frameCount * this.rotation);
    translate(this.x, this.y, this.z);
    model(turtle);
    pop();
  }
}
