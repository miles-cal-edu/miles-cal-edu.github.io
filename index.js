// @ts-nocheck
const Konva = window.Konva;

// ── Theme switching ──
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme') || 'light';

// Apply saved theme on load
document.documentElement.setAttribute('data-theme', savedTheme);

// Toggle theme
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// ── Sidebar items ──
const defaultItems = [
    { id: 1, label: 'Linked Lists' },
    { id: 2, label: 'Circular Arrays' },
    { id: 3, label: 'Disjoint Sets' },
    { id: 4, label: 'Binary Search Trees' },
    { id: 5, label: 'Maps' },
    { id: 6, label: 'Red Black Trees' },
    { id: 7, label: 'Heaps' },
    { id: 8, label: 'Graph/Tree Traversals' },
    { id: 9, label: 'Dijkstra\'s Algorithm' },
    { id: 10, label: 'Prim\'s Algorithm' },
    { id: 11, label: 'Hashing' },
    { id: 12, label: 'Tries' },
    { id: 13, label: 'Comparison Sorts' },
    { id: 14, label: 'Radix Sorts' },
];

let items = [...defaultItems];
let activeId = null;
let nextId = 15;

const sidebarList = document.getElementById('sidebarList');
const addBtn = document.getElementById('addBtn');
const watermark = document.getElementById('watermark');

function renderSidebar() {
    sidebarList.innerHTML = '';
    items.forEach((item, i) => {
        const environment = environments[item.id];
        const el = document.createElement('div');
        el.className = 'sidebar-item' + (item.id === activeId ? ' active' : '') + (environment ? '' : ' wip');
        el.innerHTML = `
        <span class="sidebar-item-number">${(environment ? i + 1 : "🚫")}</span>
        <span class="sidebar-item-label">${item.label}</span>
      `;
        if (environment) {
            el.addEventListener('click', () => {
                activeId = item.id;
                renderSidebar();
                watermark.style.display = 'none';
                document.getElementById('projectName').textContent = item.label;
                for (let i = 0; i < 14; i++) {
                    const e = environments[i + 1];
                    if (e) {
                        e.layer.hide();
                        e.uLayer.hide();
                    }
                }
                environment.layer.show();
                environment.uLayer.show();
            });
            mLayer.add(environment.layer);
            mLayer.add(environment.uLayer);
            if (!environment.started) {
                environment.started = true;
                environment.start();
            }
            environment.layer.hide();
            environment.uLayer.hide();
        }
        sidebarList.appendChild(el);
    });
}

addBtn.addEventListener('click', () => {

});

// ── Resize handle ──
const sidebar = document.getElementById('sidebar');
const handle = document.getElementById('resizeHandle');
let dragging = false;

handle.addEventListener('mousedown', (e) => {
    dragging = true;
    handle.classList.add('dragging');
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
});

window.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const w = Math.max(180, Math.min(e.clientX, 500));
    sidebar.style.width = w + 'px';
});

window.addEventListener('mouseup', () => {
    if (dragging) {
        dragging = false;
        handle.classList.remove('dragging');
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
    }
});

// ── Konva stage ──
const container = document.getElementById('konva-container');
const canvasArea = document.getElementById('canvasArea');

const stage = new Konva.Stage({
    container: 'konva-container',
    width: canvasArea.offsetWidth,
    height: canvasArea.offsetHeight,
});

const mLayer = new Konva.Layer();
stage.add(mLayer);

// Track mouse position
stage.on('mousemove', () => {
    const pos = stage.getRelativePointerPosition();
    if (pos) {
        document.getElementById('statusCoords').textContent =
            `${Math.round(pos.x)}, ${Math.round(pos.y)}`;
    }
});

// Zoom with scroll
const scaleBy = 1.08;
stage.on('wheel', (e) => {
    return;
    e.evt.preventDefault();
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    const mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
    };
    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const newScale = Math.max(Math.min(10, direction > 0 ? oldScale * scaleBy : oldScale / scaleBy), 0.1);

    stage.scale({ x: newScale, y: newScale });
    stage.position({
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
    });
    document.getElementById('statusZoom').textContent =
        Math.round(newScale * 100) + '%';
});

// Resize observer
const ro = new ResizeObserver(() => {
    stage.width(canvasArea.offsetWidth);
    stage.height(canvasArea.offsetHeight);
});
ro.observe(canvasArea);


// #################

const environments = {};

const pressed = new Set();

window.addEventListener("keydown", (event) => {
    if (environments[activeId]) {
        environments[activeId].keyDown(event.key);
    }
    pressed.add(event.key);
});

window.addEventListener("keyup", (event) => {
    pressed.delete(event.key);
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function makeButton() {
    const button = {};

    const itemBox = new Konva.Rect({
        x : 0,
        y : 0,
        width : 120,
        height : 35,
        fill : "#ffffff",
        stroke : "#666666",
        cornerRadius : 8,
    })

    const textLabel = new Konva.Text({
        x : 0,
        y : 0,
        width : 120,
        height : 35,
        text : "placeholder",
        fontSize : 12,
        align : "center",
        verticalAlign : "middle",
        fill : "#252525",
        fontFamily : "DM Sans",
    })

    button.kGroup = new Konva.Group({
        x : 50,
        y : 50,
    });

    button.callback = () => {};

    button.setX = (x) => {
        button.kGroup.setAttr("x", x);  
    };

    button.setY = (y) => {
        button.kGroup.setAttr("y", y);  
    };

    button.setText = (s) => {
        textLabel.setAttr("text", s);
    }

    button.setWidth = (w) => {
        itemBox.setAttr("width", w);
        textLabel.setAttr("width", w);
    }

    button.setHeight = (h) => {
        itemBox.setAttr("height", h);
        textLabel.setAttr("height", h);
    }

    textLabel.on("mouseenter", () => {
        itemBox.setAttr("fill", "#e8e8e8");
    });

    textLabel.on("mouseleave", () => {
        itemBox.setAttr("fill", "#ffffff");
    });

    textLabel.on("click", () => {
        button.callback();
    });

    button.kGroup.add(itemBox);
    button.kGroup.add(textLabel);
    return button;
}

function makeDragger(layer, num) {
    return (frame) => {
        if (activeId == num) {
            if (pressed.has("w")) {
                layer.y(layer.y() + frame.timeDiff);
            }
    
            if (pressed.has("s")) {
                layer.y(layer.y() - frame.timeDiff);
            }
    
            if (pressed.has("a")) {
                layer.x(layer.x() + frame.timeDiff);
            }
    
            if (pressed.has("d")) {
                layer.x(layer.x() - frame.timeDiff);
            }
        }
    }
}

// Tool Tip

const lead = new Konva.Layer();
stage.add(lead);

const textBox = new Konva.Rect({
    x : stage.width() - 330,
    y : 25,
    width : 320,
    height : 30,
    fill : "#c0d4e03f",
    stroke : "#666666",
    strokeWidth : 1,
    cornerRadius : 8,
})

const textLabel = new Konva.Text({
    x : stage.width() - 330,
    y : 25,
    width : 320,
    height : 30,
    fill : "#666666",
    align : "center",
    verticalAlign : "middle",
})

lead.add(textBox);
lead.add(textLabel);

textBox.hide();
textLabel.hide();

const tooltip = {
    layer : new Konva.Layer(),
    texts : {},

    update : () => {
        let toptext = "";
        let topval = 0;

        Object.values(tooltip.texts).forEach(element => {
            if (element.ind > topval) {
                topval = element.ind;
                toptext = element.text;
            }
        });

        if (toptext == "") {
            textBox.hide();
            textLabel.hide();
        } else {
            textLabel.setAttr("width", 600)
            textLabel.setAttr("text", toptext);
            const newWidth = textLabel.textWidth + 20;

            textBox.setAttr("width", newWidth);
            textLabel.setAttr("width", newWidth);
            textBox.x(stage.width() - newWidth - 30);
            textLabel.x(stage.width() - newWidth - 30);

            textBox.show();
            textLabel.show();
        }
    },

    delText : (name) => {
        delete tooltip.texts[name];
        tooltip.update();
    },

    setText : (name, txt, idx) => {
        tooltip.texts[name] = {
            ind : idx,
            text : txt,
        };
        tooltip.update();
    },
};

const gAttr = {
    x : 0,
    y : 0,
    draggable : false,
}

// 1: Linked Lists

const e1Layer = new Konva.Group(gAttr);
const e1uLayer = new Konva.Group(gAttr); 
environments[1] = {
    started : false,
    links : new Set(),
    layer : e1Layer,
    uLayer : e1uLayer,
    selectedLink : null,
    pauseActions: false,
    hoverLink : null,
    renderer : new Konva.Animation(makeDragger(e1Layer, 1), mLayer),
    displayer : new Konva.Text({}),
    isInputHover : false,
    input : 0,
    output : "null",

    linkDisplay : function(L) {
        const visited = new Set();

        const h = (s) => {
            if (visited.has(L)) {
                return s + "inf...]";
            } else if (L.value != null) {
                s += L.value;
            };
            visited.add(L);
            L = L.next;
            return L ? h(s + ", ") : s + "]";
        };

        return h("[")
    },

    updateDisplay : function(L) {
        this.displayer.setAttr("text", "Current List: " + (L ? this.linkDisplay(L) : "None"));
    },

    updateArrows : function() {
        const t = environments[1];
        t.links.forEach((link) => {
            const arrow = link.arrow;
            arrow[link.next ? "show" : "hide"]();
            if (link.next) {
                const nextGroup = link.next.kGroup;
                arrow.points([60, 20, nextGroup.x() - link.kGroup.x(), nextGroup.y() + 20 - link.kGroup.y()]);
            }
            t.updateDisplay(t.selectedLink);
        });
    },

    boxUpdate : function() {},

    keyDown : function(key) {
        if (key.length == 1 && key != " " && Number.isFinite(+key)) {
            if (this.hoverLink) {
                this.hoverLink.setValue(key);
            }

            if (this.isInputHover) {
                this.input = key.toString();
                this.boxUpdate();
            }
        }
        
        if (key == " " && this.selectedLink) {
            this.selectedLink.next = this.hoverLink;
            this.updateArrows();
        }
    },
 
    makeLink : function() {
        const L = {};
        L.value = 0;
        L.next = null;

        this.links.add(L);

        const itemBox = new Konva.Rect({
            x : 0,
            y : 0,
            width : 40,
            height : 40,
            fill : "#d9d2e9",
            stroke : "#666666",
        });

        const nextBox = new Konva.Rect({
            x : 40,
            y : 0,
            width : 40,
            height : 40,
            fill : "#ffffff",
            stroke : "#666666",
        });

        const valueText = new Konva.Text({
            x : 0,
            y : 40,
            width : 40,
            height : 20,
            text : "value",
            fontSize : 10,
            align : "center",
            verticalAlign : "middle",
            fill : "#252525",
            fontFamily : "DM Sans",
        });

        const nextText = new Konva.Text({
            x : 40,
            y : 40,
            width : 40,
            height : 20,
            text : "next",
            fontSize : 10,
            align : "center",
            verticalAlign : "middle",
            fill : "#252525",
            fontFamily : "DM Sans",
        });

        const valueInd = new Konva.Text({
            x : 0,
            y : 0,
            width : 40,
            height : 40,
            text : "",
            fontSize : 13,
            align : "center",
            verticalAlign : "middle",
            fill : "#4b4b4b",
            fontStyle : "normal",
            fontFamily : "DM Sans",
        });

        const arrow = new Konva.Arrow({
            stroke : "#666666",
            fill : "#666666",
            points : [],
        });

        L.arrow = arrow;

        L.kGroup = new Konva.Group({
            x : 50,
            y : 50,
            draggable : true,
        });

        L.kGroup.add(itemBox);
        L.kGroup.add(nextBox);
        L.kGroup.add(valueText);
        L.kGroup.add(nextText);
        L.kGroup.add(valueInd);
        L.kGroup.add(arrow);

        arrow.hide();

        L.selected = false; 

        L.toggleSelect = () => {
            L.selected = !L.selected;
            nextBox.setAttr("stroke", L.selected ? "#efd062" : "#666666");
            itemBox.setAttr("stroke", L.selected ? "#efd062" : "#666666");
            if (L.selected) {
                if (this.selectedLink) {
                    this.selectedLink.toggleSelect();
                }
                tooltip.setText("space_add", "Hover on a link and press space to reassign next", 1);
                this.selectedLink = L;
                this.updateDisplay(L);
            } else {
                tooltip.delText("space_add");
                this.selectedLink = null;
                this.updateDisplay();
            }
        };

        L.setValue = (val) => {
            L.value = val;
            valueInd.setAttr("text", val.toString());
            this.updateDisplay(this.selectedLink);
        };

        L.kGroup.on("click", () => {
            L.toggleSelect();
        });

        L.kGroup.on("dblclick dbltap", () => {
            if (this.selectedLink) {
                this.selectedLink.next = L;
            }
        });

        L.kGroup.on("dragmove", this.updateArrows);

        valueInd.on("mouseenter", () => {
            this.hoverLink = L;
            itemBox.setAttr("fill", "#e4dcf7");
            tooltip.setText("link_input", "Press key to enter value", 2);
        });

        valueInd.on("mouseout", () => {
            this.hoverLink = null;
            itemBox.setAttr("fill", "#d9d2e9");
            tooltip.delText("link_input");
        });

        L.setValue("0");

        return L;
    },
    
    start : function() {
        const starting = this.makeLink();

        const buttons = {};

        buttons.addFirst = async () => {
            if (this.selectedLink) {
                const link = this.selectedLink;
                this.selectedLink.toggleSelect();

                const prevLink = this.makeLink();
                prevLink.kGroup.setAttr("x", link.kGroup.getAttr("x") - 150);
                prevLink.kGroup.setAttr("y", link.kGroup.getAttr("y"));
                this.layer.add(prevLink.kGroup);

                prevLink.next = link;
                prevLink.setValue(this.input.toString());

                prevLink.toggleSelect();
                this.updateArrows();
            }
        };

        buttons.addLast = async () => {
            if (!this.pauseActions && this.selectedLink) {
                const link = this.selectedLink;
                this.pauseActions = true;

                const indicator = new Konva.Circle({
                    x : 0,
                    y : 0,
                    fill : "#666666",
                    stroke : "#666666",
                    width : 5,
                });

                this.layer.add(indicator);

                let nextLink = link.next;
                let last = link;
                while (nextLink) {
                    indicator.setAttr("x", nextLink.kGroup.getAttr("x") + 40);
                    indicator.setAttr("y", nextLink.kGroup.getAttr("y") - 8);
                    await sleep(250);
                    last = nextLink;
                    nextLink = nextLink.next;
                }
                
                indicator.destroy();

                const lastLink = this.makeLink();
                lastLink.kGroup.setAttr("x", last.kGroup.getAttr("x") + 150);
                lastLink.kGroup.setAttr("y", last.kGroup.getAttr("y"));
                this.layer.add(lastLink.kGroup);

                last.next = lastLink;

                lastLink.setValue(this.input);

                this.pauseActions = false;
                this.updateArrows();
            }
        };

        buttons.get = async () => {
            if (!this.pauseActions && this.selectedLink) {
                const link = this.selectedLink;
                this.pauseActions = true;

                const indicator = new Konva.Circle({
                    x : 0,
                    y : 0,
                    fill : "#666666",
                    stroke : "#666666",
                    width : 5,
                });

                this.layer.add(indicator);

                let nextLink = link;
                let last = link;
                let togo = this.input;
                while (nextLink &&  0 <= togo) {
                    togo--;
                    indicator.setAttr("x", nextLink.kGroup.getAttr("x") + 40);
                    indicator.setAttr("y", nextLink.kGroup.getAttr("y") - 8);
                    await sleep(250);
                    last = nextLink;
                    nextLink = nextLink.next;
                }
                
                indicator.destroy();

                if (0 <= togo) {
                    this.output = "ERROR: bounds"
                } else {
                    this.output = last.value;
                }

                this.boxUpdate();

                this.pauseActions = false;
                this.updateArrows();
            }
        };

        buttons.removeFirst = async () => {
            if (this.selectedLink) {
                const link = this.selectedLink;
                this.selectedLink.toggleSelect();

                this.links.delete(link);

                this.links.forEach((e) => {
                    if (e.next && e.next == link) {
                        e.next = null;
                    } 
                });

                if (link.next) {
                    link.next.toggleSelect();
                }

                link.kGroup.destroy();

                this.updateArrows();
            }
        };

        buttons.removeLast = async () => {
            if (!this.pauseActions && this.selectedLink) {
                const link = this.selectedLink;
                this.pauseActions = true;

                const indicator = new Konva.Circle({
                    x : 0,
                    y : 0,
                    fill : "#666666",
                    stroke : "#666666",
                    width : 5,
                });

                this.layer.add(indicator);

                let nextLink = link.next;
                let last = link;
                while (nextLink) {
                    indicator.setAttr("x", nextLink.kGroup.getAttr("x") + 40);
                    indicator.setAttr("y", nextLink.kGroup.getAttr("y") - 8);
                    await sleep(250);
                    last = nextLink;
                    nextLink = nextLink.next;
                }
                
                indicator.destroy();

                this.links.delete(last);

                this.links.forEach((e) => {
                    if (e.next && e.next == last) {
                        e.next = null;
                    } 
                });

                if (last == this.selectedLink) {
                    this.selectedLink.toggleSelect();
                }

                last.kGroup.destroy();

                this.pauseActions = false;
                this.updateArrows();
            }
        };

        buttons.size = async () => {
            if (!this.pauseActions && this.selectedLink) {
                const link = this.selectedLink;
                this.pauseActions = true;

                const indicator = new Konva.Circle({
                    x : 0,
                    y : 0,
                    fill : "#666666",
                    stroke : "#666666",
                    width : 5,
                });

                this.layer.add(indicator);

                let nextLink = link.next;
                let i = 1;
                while (nextLink) {
                    indicator.setAttr("x", nextLink.kGroup.getAttr("x") + 40);
                    indicator.setAttr("y", nextLink.kGroup.getAttr("y") - 8);
                    await sleep(250);
                    i++;
                    nextLink = nextLink.next;
                }
                
                indicator.destroy();

                this.output = i.toString();
                this.boxUpdate();
                this.pauseActions = false;
            }
        };

        const hasInput = new Set();
        hasInput.add("addFirst");
        hasInput.add("addLast");
        hasInput.add("get");

        let i = 0
        Object.keys(buttons).forEach((key) => {
            const callback = buttons[key];
            const newButton = makeButton();

            newButton.setX(stage.width()/2 - 280 + (i % 3)*160);
            newButton.setY(stage.height() - 90 + Math.floor(i / 3)*35);
            newButton.setWidth(140);
            newButton.setHeight(25);
            newButton.setText(key + (hasInput.has(key) ? "(input)" : "()"));
            newButton.callback = callback;
            this.uLayer.add(newButton.kGroup);

            buttons[key] = newButton;
            i++;
        });

        this.displayer.setAttr("text", "Current List: None");
        this.displayer.setAttr("x", stage.width()/2 - 280);
        this.displayer.setAttr("y", stage.height() - 115);
        this.displayer.setAttr("fill", "#737070");
        this.displayer.setAttr("fontSize", 13);
        this.displayer.setAttr("fontStyle", "italic");
        this.displayer.setAttr("fontFamily", "DM Sans");

        const iBox = new Konva.Rect({
            x : stage.width()/2 - 395,
            y : stage.height() - 90,
            width : 90,
            height : 30,
            fill : "#c0d4e03f",
            stroke : "#666666",
            strokeWidth : 1,
            cornerRadius : 6,
        });

        const iBoxText = new Konva.Text({
            text : "input",
            x : stage.width()/2 - 395 + 5,
            y : stage.height() - 105,
            fill : "#737070",
            fontSize : 13,
            fontStyle : "normal",
            fontFamily : "DM Sans",
        });

        const iBoxInput = new Konva.Text({
            text : "0",
            x : stage.width()/2 - 395,
            y : stage.height() - 90,
            width : 90,
            height : 30,
            fill : "#737070",
            fontSize : 13,
            fontStyle : "normal",
            fontFamily : "DM Sans",
            align : "center",
            verticalAlign : "middle",
        });

        const oBox = new Konva.Rect({
            x : stage.width()/2 + 205,
            y : stage.height() - 90,
            width : 90,
            height : 30,
            fill : "#c0d4e03f",
            stroke : "#666666",
            strokeWidth : 1,
            cornerRadius : 6,
        });

        const oBoxText = new Konva.Text({
            text : "output",
            x : stage.width()/2 + 205 + 5,
            y : stage.height() - 105,
            fill : "#737070",
            fontSize : 13,
            fontStyle : "normal",
            fontFamily : "DM Sans",
        });

        const oBoxOutput = new Konva.Text({
            text : "null",
            x : stage.width()/2 + 205,
            y : stage.height() - 90,
            width : 90,
            height : 30,
            fill : "#737070",
            fontSize : 13,
            fontStyle : "normal",
            fontFamily : "DM Sans",
            align : "center",
            verticalAlign : "middle",
        });

        iBoxInput.on("mouseenter", () => {
            this.isInputHover = true;
            iBox.setAttr("fill", "#c0d4e01e");
            tooltip.setText("input_box", "Press key to enter value", 3);
        });

        iBoxInput.on("mouseout", () => {
            this.isInputHover = false;
            iBox.setAttr("fill", "#c0d4e03f");
            tooltip.delText("input_box");
        });

        this.boxUpdate = () => {
            iBoxInput.setAttr("text", this.input.toString());
            oBoxOutput.setAttr("text", this.output.toString());
        };

        this.uLayer.add(iBoxText);
        this.uLayer.add(oBoxText);
        this.uLayer.add(iBox);
        this.uLayer.add(oBox);
        this.uLayer.add(iBoxInput);
        this.uLayer.add(oBoxOutput);

        this.layer.add(starting.kGroup);
        this.uLayer.add(this.displayer);
        this.renderer.start();
    },
};

// 3 : Disjoint Sets

const e3Layer = new Konva.Group(gAttr);
const e3uLayer = new Konva.Group(gAttr);
environments[3] = {
    started : false,
    nodes : new Set(),
    layer : e3Layer,
    uLayer : e3uLayer,
    isInputHover : false,
    displayer : new Konva.Text({}),
    input : 0,

    makeNode : function() {
        const N = {}

        this.nodes.add(N);

        N.Box = new Konva.Rect({
            x : 0,
            y : 0,
            width : 32,
            height : 32,
            fill : "#b6d7a8",
            stroke : "#bcbcbc",
        });

        N.label = new Konva.Text({
            x : 0,
            y : 0,
            width : 32,
            height : 32,
            text : (this.nodes.size - 1).toString(),
            fontSize : 10,
            align : "center",
            verticalAlign : "middle",
            fill : "#252525",
            fontFamily : "DM Sans",
        });

        N.kGroup = new Konva.Group({
            draggable : true,
            x : 50,
            y : 50,
        });

        N.kGroup.add(N.Box);
        N.kGroup.add(N.label);

        return N
    },

    updateDisplay : function(L) {
        this.displayer.setAttr("text", "Current List: None");
    },

    keyDown : function(key) {
        if (key.length == 1 && key != " " && Number.isFinite(+key)) {
            if (this.isInputHover) {
                this.input = key.toString();
                this.boxUpdate();
            }
        }
    },
    
    start : function() {
        const starting = this.makeNode();

        let buttons = {}
        let hasInput = new Set();

        buttons.addNode = () => {
            let n = this.makeNode();

            this.layer.add(n.kGroup);
        };

        let i = 0
        Object.keys(buttons).forEach((key) => {
            const callback = buttons[key];
            const newButton = makeButton();

            newButton.setX(stage.width()/2 - 280 + (i % 3)*160);
            newButton.setY(stage.height() - 90 + Math.floor(i / 3)*35);
            newButton.setWidth(140);
            newButton.setHeight(25);
            newButton.setText(key + (hasInput.has(key) ? "(input)" : "()"));
            newButton.callback = callback;
            this.uLayer.add(newButton.kGroup);

            buttons[key] = newButton;
            i++;
        });

        this.displayer.setAttr("text", "Current List: None");
        this.displayer.setAttr("x", stage.width()/2 - 280);
        this.displayer.setAttr("y", stage.height() - 115);
        this.displayer.setAttr("fill", "#737070");
        this.displayer.setAttr("fontSize", 13);
        this.displayer.setAttr("fontStyle", "italic");
        this.displayer.setAttr("fontFamily", "DM Sans");

        const iBox = new Konva.Rect({
            x : stage.width()/2 - 395,
            y : stage.height() - 90,
            width : 90,
            height : 30,
            fill : "#c0d4e03f",
            stroke : "#666666",
            strokeWidth : 1,
            cornerRadius : 6,
        });

        const iBoxText = new Konva.Text({
            text : "input",
            x : stage.width()/2 - 395 + 5,
            y : stage.height() - 105,
            fill : "#737070",
            fontSize : 13,
            fontStyle : "normal",
            fontFamily : "DM Sans",
        });

        const iBoxInput = new Konva.Text({
            text : "0",
            x : stage.width()/2 - 395,
            y : stage.height() - 90,
            width : 90,
            height : 30,
            fill : "#737070",
            fontSize : 13,
            fontStyle : "normal",
            fontFamily : "DM Sans",
            align : "center",
            verticalAlign : "middle",
        });

        const oBox = new Konva.Rect({
            x : stage.width()/2 + 205,
            y : stage.height() - 90,
            width : 90,
            height : 30,
            fill : "#c0d4e03f",
            stroke : "#666666",
            strokeWidth : 1,
            cornerRadius : 6,
        });

        const oBoxText = new Konva.Text({
            text : "output",
            x : stage.width()/2 + 205 + 5,
            y : stage.height() - 105,
            fill : "#737070",
            fontSize : 13,
            fontStyle : "normal",
            fontFamily : "DM Sans",
        });

        const oBoxOutput = new Konva.Text({
            text : "null",
            x : stage.width()/2 + 205,
            y : stage.height() - 90,
            width : 90,
            height : 30,
            fill : "#737070",
            fontSize : 13,
            fontStyle : "normal",
            fontFamily : "DM Sans",
            align : "center",
            verticalAlign : "middle",
        });

        iBoxInput.on("mouseenter", () => {
            this.isInputHover = true;
            iBox.setAttr("fill", "#c0d4e01e");
            tooltip.setText("input_box", "Press key to enter value", 3);
        });

        iBoxInput.on("mouseout", () => {
            this.isInputHover = false;
            iBox.setAttr("fill", "#c0d4e03f");
            tooltip.delText("input_box");
        });

        this.boxUpdate = () => {
            iBoxInput.setAttr("text", this.input.toString());
            oBoxOutput.setAttr("text", this.output.toString());
        };

        this.uLayer.add(iBoxText);
        this.uLayer.add(oBoxText);
        this.uLayer.add(iBox);
        this.uLayer.add(oBox);
        this.uLayer.add(iBoxInput);
        this.uLayer.add(oBoxOutput);
        this.uLayer.add(this.displayer);

        this.layer.add(starting.kGroup);
    },
};

// 9: Dijkstra's

const e9Layer = new Konva.Group(gAttr);
const e9uLayer = new Konva.Group(gAttr);
environments[9] = {
    started : false,
    nodes : new Set(),
    layer : e9Layer,
    uLayer : e9uLayer,
    isInputHover : false,
    displayer : new Konva.Text({}),
    selectedNode : null,
    input : 1,
    output : "Null",
    hoverNode : null,
    points : [
        [0, 16],
        [21, 0],
        [42, 16],
        [21, 32],
    ],

    st_nodes : [
        [0, 2, [[1, 2], [2, 1]]],
        [2, 1, [[3, 11], [4, 3], [2, 5]]],
        [4, 3, [[4, 1], [5, 15]]],
        [6, 0, [[4, 2], [6, 1]]],
        [6, 2, [[6, 5], [5, 4]]],
        [6, 4, [[6, 1]]],
        [8, 2, []],
    ],

    getPoints : function(x, y) {
        let tp;
        let dist = Infinity;

        this.points.forEach(p => {
            const d = (p[0] - x)**2 + (p[1] - y)**2
            if (d < dist) {
                dist = d
                tp = p
            }
        });

        return tp;
    },

    updateArrows : function() {
        const t = environments[9];
        t.nodes.forEach((node) => {
            t.nodes.forEach((node2) => {
                if (node.next.has(node2)) {
                    const connection = node.next.get(node2);

                    const p = environments[9].getPoints(node2.kGroup.x() + 21 - node.kGroup.x(), node2.kGroup.y() + 16 - node.kGroup.y());
                    const pi = environments[9].getPoints(node.kGroup.x() + 21 - node2.kGroup.x(), node.kGroup.y() + 16 - node2.kGroup.y());

                    if (p && pi) {
                        connection.arrow.points([
                            node.kGroup.x() + p[0],
                            node.kGroup.y() + p[1],
                            node2.kGroup.x() + pi[0],
                            node2.kGroup.y() + pi[1],
                        ]);
                        connection.arrow.show();

                        connection.txt.x((node.kGroup.x() + p[0] + node2.kGroup.x() + pi[0])/2 - 9);
                        connection.txt.y((node.kGroup.y() + p[1] + node2.kGroup.y() + pi[1])/2 - 9);

                        connection.cut.x((node.kGroup.x() + p[0] + node2.kGroup.x() + pi[0])/2);
                        connection.cut.y((node.kGroup.y() + p[1] + node2.kGroup.y() + pi[1])/2);
                    }
                }
            });
        });
    },

    makeNode : function() {
        const N = {}
        N.next = new WeakMap();
        N.selected = false;

        N.Box = new Konva.Rect({
            x : 0,
            y : 0,
            width : 42,
            height : 32,
            fill : "#b6d7a8",
            stroke : "#666666",
        });

        N.label = new Konva.Text({
            x : 0,
            y : 0,
            width : 42,
            height : 32,
            text : String.fromCharCode((this.nodes.size % 26) + 65) + (Math.floor(this.nodes.size / 26) || "").toString(),
            fontSize : 14,
            align : "center",
            verticalAlign : "middle",
            fill : "#252525",
            fontFamily : "DM Sans",
        });

        N.kGroup = new Konva.Group({
            draggable : true,
            x : 50,
            y : 50,
        });

        N.toggleSelect = () => {
            N.selected = !N.selected;
            N.Box.setAttr("stroke", N.selected ? "#efd062" : "#666666");
            if (N.selected) {
                if (this.selectedNode) {
                    this.selectedNode.toggleSelect();
                }
                tooltip.setText("edit_next", "Hover on a node and press space/backspace to add/remove next", 1)
                this.selectedNode = N;
            } else {
                tooltip.delText("edit_next");
                this.selectedNode = null;
            }
        }

        N.addNode = (node, dist) => {
            if (N.next.has(node)) {
                N.next.get(node).len = dist;
                N.next.get(node).txt.setAttr("text", dist.toString());
            } else {
                const nArrow = new Konva.Arrow({
                    stroke : "#666666",
                    fill : "#666666",
                    points : [],
                });

                const nLabel = new Konva.Text({
                    x : 0,
                    y : 0,
                    width : 18,
                    height : 18,
                    text : dist.toString(),
                    fontSize : 18,
                    align : "center",
                    verticalAlign : "middle",
                    fill : "#4b4b4b",
                    fontStyle : "normal",
                    fontFamily : "DM Sans",
                });

                const cut = new Konva.Circle({
                    x : 0,
                    y : 0,
                    fill : "#666666",
                    radius : 22,
                    globalCompositeOperation : "destination-out",
                });

                N.next.set(node, {
                    len : dist,
                    arrow : nArrow,
                    txt : nLabel,
                    cut : cut,
                });

                this.uLayer.add(nArrow);
                this.uLayer.add(cut);
                this.uLayer.add(nLabel);
            };
            this.updateArrows();
        }

        N.delNode = (node) => {
            if (N.next.has(node)) {
                const n = N.next.get(node);
                n.arrow.destroy();
                n.txt.destroy();
                N.cut.destroy();
                N.next.delete(node);
            }
            this.updateArrows();
        }

        N.kGroup.on("dragmove", this.updateArrows);

        N.label.on("mouseenter", () => {
            this.hoverNode = N;
            N.Box.setAttr("fill", "#cde7c1");
        });

        N.label.on("mouseout", () => {
            this.hoverNode = null;
            N.Box.setAttr("fill", "#b6d7a8");
        });

        N.kGroup.on("click", () => {
            N.toggleSelect();
        });

        N.kGroup.add(N.Box);
        N.kGroup.add(N.label);
        this.nodes.add(N);

        return N
    },

    keyDown : function(key) {
        if (key.length == 1 && key != " " && Number.isFinite(+key)) {
            if (this.isInputHover) {
                this.input = parseInt(key.toString());
                this.boxUpdate();
            };
        };

        if (this.selectedNode && this.hoverNode && this.selectedNode != this.hoverNode) {
            if (key == " " && this.input > 0) {
                this.selectedNode.addNode(this.hoverNode, this.input);
            } else if (key == "Backspace") {
                console.log('go');
                this.selectedNode.delNode(this.hoverNode);
            }
        };
    },
    
    start : function() {
        let buttons = {}
        let hasInput = new Set();

        buttons.addNode = () => {
            let n = this.makeNode();

            this.layer.add(n.kGroup);
        };

        let i = 0
        Object.keys(buttons).forEach((key) => {
            const callback = buttons[key];
            const newButton = makeButton();

            newButton.setX(stage.width()/2 - 280 + (i % 3)*160);
            newButton.setY(stage.height() - 90 + Math.floor(i / 3)*35);
            newButton.setWidth(140);
            newButton.setHeight(25);
            newButton.setText(key + (hasInput.has(key) ? "(input)" : "()"));
            newButton.callback = callback;
            this.uLayer.add(newButton.kGroup);

            buttons[key] = newButton;
            i++;
        });

        this.displayer.setAttr("text", "Current List: None");
        this.displayer.setAttr("x", stage.width()/2 - 280);
        this.displayer.setAttr("y", stage.height() - 115);
        this.displayer.setAttr("fill", "#737070");
        this.displayer.setAttr("fontSize", 13);
        this.displayer.setAttr("fontStyle", "italic");
        this.displayer.setAttr("fontFamily", "DM Sans");

        const iBox = new Konva.Rect({
            x : stage.width()/2 - 395,
            y : stage.height() - 90,
            width : 90,
            height : 30,
            fill : "#c0d4e03f",
            stroke : "#666666",
            strokeWidth : 1,
            cornerRadius : 6,
        });

        const iBoxText = new Konva.Text({
            text : "input",
            x : stage.width()/2 - 395 + 5,
            y : stage.height() - 105,
            fill : "#737070",
            fontSize : 13,
            fontStyle : "normal",
            fontFamily : "DM Sans",
        });

        const iBoxInput = new Konva.Text({
            text : "1",
            x : stage.width()/2 - 395,
            y : stage.height() - 90,
            width : 90,
            height : 30,
            fill : "#737070",
            fontSize : 13,
            fontStyle : "normal",
            fontFamily : "DM Sans",
            align : "center",
            verticalAlign : "middle",
        });

        const oBox = new Konva.Rect({
            x : stage.width()/2 + 205,
            y : stage.height() - 90,
            width : 90,
            height : 30,
            fill : "#c0d4e03f",
            stroke : "#666666",
            strokeWidth : 1,
            cornerRadius : 6,
        });

        const oBoxText = new Konva.Text({
            text : "output",
            x : stage.width()/2 + 205 + 5,
            y : stage.height() - 105,
            fill : "#737070",
            fontSize : 13,
            fontStyle : "normal",
            fontFamily : "DM Sans",
        });

        const oBoxOutput = new Konva.Text({
            text : "null",
            x : stage.width()/2 + 205,
            y : stage.height() - 90,
            width : 90,
            height : 30,
            fill : "#737070",
            fontSize : 13,
            fontStyle : "normal",
            fontFamily : "DM Sans",
            align : "center",
            verticalAlign : "middle",
        });

        iBoxInput.on("mouseenter", () => {
            this.isInputHover = true;
            iBox.setAttr("fill", "#c0d4e01e");
            tooltip.setText("input_box", "Press key to enter value", 3);
        });

        iBoxInput.on("mouseout", () => {
            this.isInputHover = false;
            iBox.setAttr("fill", "#c0d4e03f");
            tooltip.delText("input_box");
        });

        this.boxUpdate = () => {
            iBoxInput.setAttr("text", this.input.toString());
            oBoxOutput.setAttr("text", this.output.toString());
        };

        this.uLayer.add(iBoxText);
        this.uLayer.add(oBoxText);
        this.uLayer.add(iBox);
        this.uLayer.add(oBox);
        this.uLayer.add(iBoxInput);
        this.uLayer.add(oBoxOutput);
        this.uLayer.add(this.displayer);
        
        const starters = [];

        this.st_nodes.forEach((n) => {
            const node = this.makeNode();
            node.kGroup.x(n[0]*20);
            node.kGroup.y(n[1]*20);
            starters.push(node);
        });

        this.st_nodes.forEach((n) => {
            
        });
    },
};

// Start

renderSidebar();