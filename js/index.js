const el_default = {
  "text_decoration_color": "#eeeeee",
  "background_color": "",
  "border_color": "#000000",
  "border_radius": "0",
  "border_style": "solid",
  "border_width": "1",
  "color": "#eeeeee",
  "font_family": "sans-serif",
  "font_size": "20",
  "font_weight": "400",
  "height": "100",
  "left": "100",
  "line_height": "20",
  "padding_bottom": "0",
  "padding_left": "0",
  "padding_right": "0",
  "padding_top": "0",
  "top": "100",
  "width": "100",
  "z_index": "0",
  "background_image": "",
  "opacity": "1",
  "transform": ""
}

const postfixes = {
  "border_radius": "px",
  "border_width": "px",
  "font_size": "px",
  "height": "px",
  "left": "px",
  "line_height": "px",
  "padding_bottom": "px",
  "padding_left": "px",
  "padding_right": "px",
  "padding_top": "px",
  "top": "px",
  "width": "px",
  "background_image": "')"
}

const prefixes = {
  "background_image": "url('"
}

const el_default_buttons = {
  "Bold": false,
  "Center​": false,
  "Cover": false,
  "Italic": false,
  "Justify": false,
  "Left": true,
  "Center": false,
  "Repeat": false,
  "Right": false,
  "Line-Through": false,
  "Underline": false
}

const attrs = {
  "Bold": "font-weight",
  "Center​": "background-position",
  "Cover": "background-size",
  "Italic": "font-style",
  "Justify": "text-align",
  "Left": "text-align",
  "Center": "text-align",
  "Repeat": "background-repeat",
  "Right": "text-align",
  "Line-Through": "text-decoration-line",
  "Underline": "text-decoration-line"
}

let shiftKey = false;

var storage = JSON.parse(localStorage.storage || "{}");

var artboards = [];

if (artboards.length == 0) {
  artboards.push({});
}

var canvas = artboards[0];

renderCanvas()

function renderABS() {
  document.querySelector("#artboard_select").innerHTML = "";
  document.querySelector("#merge_artboards").innerHTML = "";
  for (var i = 0; i < artboards.length; i++) {
    let op = document.createElement("option");
    op.value = i;
    op.innerHTML = `Artboard ${i+1}`;
    let op2 = document.createElement("option");
    op2.value = i;
    op2.innerHTML = `Artboard ${i+1}`;
    document.querySelector("#artboard_select").appendChild(op);
    document.querySelector("#merge_artboards").appendChild(op2);
  }
}
renderABS();

function changeArtBoard() {
  let v = parseInt(document.querySelector("#artboard_select").value);
  canvas = artboards[v]
  id = Object.keys(canvas)[0];
  renderCanvas();
  renderGS();
  renderActions();
  renderElements();
}

document.querySelector("#close").addEventListener("click", () => {
  document.querySelector("#menu").style.display = "none";
  document.querySelector("#open").style.display = "block";
});

document.querySelector("#open").addEventListener("click", () => {
  document.querySelector("#open").style.display = "none";
  document.querySelector("#menu").style.display = "block";
});

document.addEventListener("keydown", (e) => {
  shiftKey = e.shiftKey;
  renderCanvas();
});
document.addEventListener("keyup", (e) => {
  shiftKey = e.shiftKey;
  renderCanvas();
});

function renderCanvas() {
  loadFont();
  let can = document.querySelector("#canvas");
  can.innerHTML = "";

  for (var el in canvas) {
    if (canvas.hasOwnProperty(el) && el != "groups") {

      let div = document.createElement("div");
      div.style.position = "absolute";
      div.dataset.name = el;
      div.innerHTML = canvas[el].innerHTML || "";

      for (var style in el_default) {
        if (el_default.hasOwnProperty(style)) {
          div.style[style.replace(/_/g,"-").replace(/​/g,"")] = (prefixes[style] || "") + (canvas[el][style] || el_default[style]) + (postfixes[style] || "");
        }
      }

      for (var style in el_default_buttons) {
        if (el_default_buttons.hasOwnProperty(style)) {
          if (canvas[el][style]) {
            div.style[attrs[style]] = style.toLowerCase();
          }
        }
      }

      if (canvas[el].Repeat) {
        div.style[attrs[style]] = "repeat";
      } else {
        div.style[attrs[style]] = "no-repeat";
      }

      can.appendChild(div);
    }
  }
  localStorage.storage = JSON.stringify(storage);
  if (!shiftKey) {
    renderGroups();
  }
}

var zoom = 1;

function zoomIn() {
  zoom += 0.1;
  document.querySelector("#canvas").style.transform = `scale(${zoom})`;
  document.querySelector("#amount").innerHTML = zoom.toFixed(1);
}

function zoomOut() {
  zoom -= 0.1;
  document.querySelector("#canvas").style.transform = `scale(${zoom})`;
  document.querySelector("#amount").innerHTML = zoom.toFixed(1);
}

function download_file() {
  let filename = Math.floor(Math.random()*1000000);
  let text = JSON.stringify(storage);
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename+".pos.csp");

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function loadFont() {
  for (var el in canvas) {
    if (canvas.hasOwnProperty(el)) {
      if (canvas[el].font_family) {
        try {
          WebFont.load({
            google: {
              families: [canvas[el].font_family]
            }
          });
        } catch (e) {
          let doesnothing = e;
        }
      }
    }
  }
}

function openFile(event) {
  var input = event.target;
  var reader = new FileReader();
  reader.onload = function(){
    var text = reader.result;
    let name = document.querySelector("input[type=file]").value;
    if (name.indexOf(".pos.csp") > -1) {
      storage = JSON.parse(text);
      artboards = storage.None;
      renderPL();
    } else {
      artboards = JSON.parse(text);
      storage.None = JSON.parse(JSON.stringify(artboards));
    }
    canvas = artboards[0];
    id = Object.keys(canvas)[0];
    renderCanvas();
    renderABS();
    renderGS();
    renderActions();
  };
  reader.readAsText(input.files[0]);
};


function readImg() {
  if (document.querySelector("#background_image").files && document.querySelector("#background_image").files[0]) {
    var FR= new FileReader();
    FR.addEventListener("load", function(e) {
      console.log("Read");
      canvas[id].background_image = e.target.result;
      renderCanvas();
    });
    console.log("reading");
    FR.readAsDataURL(document.querySelector("#background_image").files[0]);
  }
}

function removeIMG() {
  canvas[id].background_image = "";
  renderCanvas();
}

if (Object.keys(canvas)[0]) {
  console.log("init rendering");
  id = Object.keys(canvas)[0];
  renderCanvas();
}

document.querySelector("#canvas").addEventListener("mousedown", click);

function click(e) {
  let name = e.target.dataset.name;
  if (e.shiftKey && name != undefined) {
    if (e.which == 1) {
      // left
      addElement(name);
    } else if (e.which == 3) {
      // right
      removeElement(name);
    }
  }
  e.preventDefault();
}

function addElement(name) {
  let group = canvas.groups[document.querySelector("#group_selector").value].elements;
  if (group.indexOf(name) == -1) {
    group.push(name);
    renderElements();
    renderCanvas();
  }
}

function removeElement() {
  let group = canvas.groups[document.querySelector("#group_selector").value].elements;
  let name = document.querySelector("#element_selector").value
  if (group.indexOf(name) != -1) {
    group.splice(group.indexOf(name), 1);
    renderElements();
    renderCanvas();
  }
}

function renderElements() {
  let group = canvas.groups[document.querySelector("#group_selector").value];
  if (group) {
    group = group.elements;
  } else {
    group = [];
  }
  document.querySelector("#element_selector").innerHTML = "";
  for (var i = 0; i < group.length; i++) {
    let op = document.createElement("option");
    op.value = group[i];
    op.innerHTML = group[i];
    document.querySelector("#element_selector").appendChild(op);
  }
  renderActions();
}

function renderGS() {
  document.querySelector("#group_selector").innerHTML = "";
  canvas.groups = canvas.groups || {};
  for (var i = 0; i < Object.keys(canvas.groups).length; i++) {
    let op = document.createElement("option");
    op.value = Object.keys(canvas.groups)[i];
    op.innerHTML = Object.keys(canvas.groups)[i];
    document.querySelector("#group_selector").appendChild(op);
  }
  renderElements();
}

function createGroup() {
  if (!canvas.groups) {
    canvas.groups = {};
  }
  let group = document.querySelector("#group_id").value;
  canvas.groups[group] = {
    elements: [],
    styles: {}
  };
  document.querySelector("#group_id").value = "";
  renderGS();
  renderActions();
}

function renderGroups() {
  document.querySelector("#canvas").style.transform = `scale(1)`;
  let groups = canvas.groups || {};
  for (var a = 0; a < Object.keys(groups).length; a++) {
    let group = groups[Object.keys(groups)[a]];
    if (group.elements.length > 0) {
      let div = document.createElement("div");
      let box = getBoundingBox(group.elements);
      div.style = `position: absolute; top: ${box.y+(parseInt(group.y) || 0)}px; left: ${box.x+(parseInt(group.x) || 0)}px; width: ${box.width}px; height: ${box.height}px; transform: ${Object.values(group.styles || {}).join(" ")}; z-index: ${group.zindex}; display: ${group.display};`;
      for (var b = 0; b < group.elements.length; b++) {
        let element = group.elements[b];
        let child = document.querySelector(`div[data-name="${element}"]`);
        child.style.top = (parseInt(canvas[element].top || el_default.top)-box.y)+"px";
        child.style.left = (parseInt(canvas[element].left || el_default.left)-box.x)+"px";
        div.append(child);
      }
      div.dataset.group = Object.keys(groups)[a];
      document.querySelector("#canvas").append(div);
    }
  }
  document.querySelector("#canvas").style.transform = `scale(${zoom})`;
}

function getBoundingBox(names) {
  let ogX = window.scrollX;
  let ogY = window.scrollY;
  window.scrollTo(0,0);
  let box = document.querySelector(`div[data-name="${names[0]}"]`).getBoundingClientRect();
  box = JSON.parse(JSON.stringify(box));
  box.width = box.x + box.width;
  box.height = box.y + box.height;
  for (var i = 1; i < names.length; i++) {
    let el = document.querySelector(`div[data-name="${names[i]}"]`).getBoundingClientRect();
    box.x = Math.min(box.x, el.x);
    box.y = Math.min(box.y, el.y);
    box.width = Math.max(box.width, el.x + el.width);
    box.height = Math.max(box.height, el.y + el.height);
  }
  delete box.top;
  delete box.bottom;
  delete box.left;
  delete box.right;

  window.scrollTo(ogX, ogY);

  box.width = box.width-box.x;
  box.height = box.height-box.y;

  return box;
}

function renameGroup() {
  let new_key = document.querySelector("#rename_group").value;
  let old_key = document.querySelector("#group_selector").value;
  if (old_key !== new_key) {
    Object.defineProperty(canvas.groups, new_key,
        Object.getOwnPropertyDescriptor(canvas.groups, old_key));
    delete canvas.groups[old_key];
  }
  let op = document.querySelector(`option[value="${old_key}"]`);
  op.value = new_key;
  op.innerHTML = new_key;
  document.querySelector("#rename_group").value = "";
}

function deleteGroup() {
  let el_id = document.querySelector("#group_selector").value;
  delete canvas.groups[el_id];
  let op = document.querySelector(`option[value="${el_id}"]`);
  if (op != null) {
    document.querySelector("#group_selector").removeChild(op);
    document.querySelector("#rename_group").value = "";

    renderActions();
    renderElements();
    renderCanvas();
  }
}

function renderActions() {
  let group = canvas.groups[document.querySelector("#group_selector").value];

  document.querySelector("#group_rotate").value = (group.styles.rotate || "rotate(0deg)").slice(7,-4);
  document.querySelector("#group_zindex").value = parseInt(group.zindex) || 0;
  document.querySelector("#top").value = group.y || 0;
  document.querySelector("#left").value = group.x || 0;
}

function rotate(e) {
  let group = canvas.groups[document.querySelector("#group_selector").value];
  group.styles.rotate = `rotate(${e.value}deg)`;
  renderCanvas();
}

function zindex(e) {
  let group = canvas.groups[document.querySelector("#group_selector").value];
  group.zindex = e.value;
  renderCanvas();
}

function hide(e) {
  let group = canvas.groups[document.querySelector("#group_selector").value];
  let v = e.classList.toggle("active");
  if (v) {
    group.display = "none";
  } else {
    group.display = "inherit";
  }
  renderCanvas();
}

function translateGroup() {
  let group = canvas.groups[document.querySelector("#group_selector").value];
  group.x = document.querySelector("#left").value;
  group.y = document.querySelector("#top").value;
  renderCanvas();
}

function mergeArtboards() {
  let ab = document.querySelector("#merge_artboards").selectedOptions;
  let groups = {...artboards[parseInt(ab[0].value)].groups, ...artboards[parseInt(ab[1].value)].groups};
  artboards[parseInt(ab[0].value)] = {...artboards[parseInt(ab[0].value)], ...artboards[parseInt(ab[1].value)]};
  artboards[parseInt(ab[0].value)].groups = groups;
  artboards.splice(1,1);
  document.querySelector("#artboard_select").value = 0;
  changeArtBoard();
  renderABS();
}

function createPosition() {
  let name = document.querySelector("#position_id").value;
  if (name != "") {
    storage[name] = artboards;
    document.querySelector("#position_id").value = "";
    renderPL();
  }
}

function savePosition() {
  let name = document.querySelector("#position_selector").value;
  if (name != "" && name != "None") {
    storage[name] = JSON.parse(JSON.stringify(artboards));
  }
}

function deletePosition() {
  let name = document.querySelector("#position_selector").value;
  if (name != "" && name != "None") {
    delete storage[name];
    renderPL();
  }
}

function loadPosition() {
  let name = document.querySelector("#position_selector").value;
  if (name != "") {
    artboards = storage[name];
    canvas = artboards[0];
    id = Object.keys(canvas)[0];
    renderCanvas();
    renderABS();
    renderGS();
    renderActions();
  }
}

function renderPL() {
  document.querySelector("#position_selector").innerHTML = "";
  let pos = Object.keys(storage);
  for (var i = 0; i < pos.length; i++) {
    let op = document.createElement("option");
    op.value = pos[i];
    op.innerHTML = pos[i];
    document.querySelector("#position_selector").appendChild(op);
  }
}
