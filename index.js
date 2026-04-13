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
    { id: 8, label: 'Graph Traversals' },
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

// 2 : Circular Arrays

const e2Layer = new Konva.Group(gAttr);
const e2uLayer = new Konva.Group(gAttr);
environments[2] = {
    started      : false,
    layer        : e2Layer,
    uLayer       : e2uLayer,
    displayer    : new Konva.Text({}),
    isInputHover : false,
    input        : 0,
    lastInput    : 0,
    output       : "null",
    pauseActions : false,

    // ── data (WQU-free array deque) ──────────────────────────
    MIN_CAP   : 8,
    cap       : 8,
    size      : 0,
    nextFirst : 7,
    nextLast  : 0,
    arr       : null,

    // ── visuals ──────────────────────────────────────────────
    boxes        : [],
    nextFirstPtr : new Konva.Text({}),
    nextLastPtr  : new Konva.Text({}),

    // ── visual constants ─────────────────────────────────────
    BOX_W   : 54,
    BOX_H   : 40,
    BOX_GAP : 4,
    ARRAY_Y : 150,

    COLOR_EMPTY  : "#ffffff",
    COLOR_FILLED : "#d9d2e9",
    COLOR_HIT    : "#efd062",
    COLOR_REM    : "#e8a0a0",

    boxUpdate : function() {},

    // ── build (or rebuild) the row of boxes ──────────────────
    buildVisual : function() {
        this.boxes.forEach(b => b.group.destroy());
        this.boxes = [];

        const totalW = this.cap * (this.BOX_W + this.BOX_GAP) - this.BOX_GAP;
        const startX = stage.width() / 2 - totalW / 2;

        for (let i = 0; i < this.cap; i++) {
            const grp = new Konva.Group({
                x : startX + i * (this.BOX_W + this.BOX_GAP),
                y : this.ARRAY_Y,
            });

            const box = new Konva.Rect({
                x : 0, y : 0,
                width       : this.BOX_W,
                height      : this.BOX_H,
                fill        : this.COLOR_EMPTY,
                stroke      : "#666666",
                strokeWidth : 2,
            });

            const val = new Konva.Text({
                x : 0, y : 0,
                width         : this.BOX_W,
                height        : this.BOX_H,
                text          : "",
                fontSize      : 14,
                align         : "center",
                verticalAlign : "middle",
                fill          : "#252525",
                fontFamily    : "DM Sans",
            });

            const idxLabel = new Konva.Text({
                x : 0, y : this.BOX_H + 2,
                width      : this.BOX_W,
                text       : i.toString(),
                fontSize   : 10,
                align      : "center",
                fill       : "#888888",
                fontFamily : "DM Sans",
            });

            grp.add(box);
            grp.add(val);
            grp.add(idxLabel);
            this.layer.add(grp);
            this.boxes.push({ group: grp, box, val, idxLabel });
        }

        this.nextFirstPtr.moveToTop();
        this.nextLastPtr.moveToTop();
        this.updateValues();
    },

    // ── is this raw index a live (in-list) slot? ────────────
    isLive : function(i) {
        if (this.size === 0) return false;
        const first = (this.nextFirst + 1) % this.cap;
        const last  = (this.nextLast  - 1 + this.cap) % this.cap;
        if (first <= last) return i >= first && i <= last;
        return i >= first || i <= last;
    },

    // ── refresh slot contents + pointer positions + displayer ─
    updateValues : function() {
        for (let i = 0; i < this.cap; i++) {
            const b = this.boxes[i];
            b.val.text(this.arr[i].toString());
            b.box.fill(this.isLive(i) ? this.COLOR_FILLED : this.COLOR_EMPTY);
        }
        this.updatePointers();
        this.updateDisplayer();
    },

    updatePointers : function() {
        const fGrp = this.boxes[this.nextFirst].group;
        this.nextFirstPtr.x(fGrp.x() + this.BOX_W / 2 - 40);
        this.nextFirstPtr.y(fGrp.y() - 20);

        const lGrp = this.boxes[this.nextLast].group;
        this.nextLastPtr.x(lGrp.x() + this.BOX_W / 2 - 40);
        this.nextLastPtr.y(lGrp.y() + this.BOX_H + 18);
    },

    updateDisplayer : function() {
        const items = [];
        for (let i = 0; i < this.size; i++) {
            const idx = (this.nextFirst + 1 + i) % this.cap;
            items.push(this.arr[idx]);
        }
        this.displayer.setAttr("text", "Current List: [" + items.join(", ") + "]");
    },

    // ── resize (rebuild internal array in logical order) ─────
    resize : function(newCap) {
        const newArr = new Array(newCap).fill(0);
        for (let i = 0; i < this.size; i++) {
            const src = (this.nextFirst + 1 + i) % this.cap;
            newArr[i] = this.arr[src];
        }
        this.arr       = newArr;
        this.cap       = newCap;
        this.nextFirst = newCap - 1;
        this.nextLast  = this.size;
        this.buildVisual();
    },

    // ── operations ───────────────────────────────────────────
    addFirst : async function(val) {
        if (this.pauseActions) return;
        this.pauseActions = true;

        if (this.size === this.cap) this.resize(this.cap * 2);

        const target = this.nextFirst;
        this.boxes[target].box.fill(this.COLOR_HIT);
        await sleep(220);

        this.arr[target] = val;
        this.nextFirst   = (this.nextFirst - 1 + this.cap) % this.cap;
        this.size++;
        this.updateValues();

        this.pauseActions = false;
    },

    addLast : async function(val) {
        if (this.pauseActions) return;
        this.pauseActions = true;

        if (this.size === this.cap) this.resize(this.cap * 2);

        const target = this.nextLast;
        this.boxes[target].box.fill(this.COLOR_HIT);
        await sleep(220);

        this.arr[target] = val;
        this.nextLast    = (this.nextLast + 1) % this.cap;
        this.size++;
        this.updateValues();

        this.pauseActions = false;
    },

    remFirst : async function() {
        if (this.pauseActions) return;
        if (this.size === 0) {
            this.output = "null";
            this.boxUpdate();
            return;
        }
        this.pauseActions = true;

        const first = (this.nextFirst + 1) % this.cap;
        this.boxes[first].box.fill(this.COLOR_REM);
        await sleep(220);

        const v = this.arr[first];
        this.nextFirst  = first;
        this.size--;
        this.output     = v.toString();

        if (this.cap > this.MIN_CAP && this.size * 4 < this.cap) {
            this.resize(this.cap / 2);
        } else {
            this.updateValues();
        }
        this.boxUpdate();
        this.pauseActions = false;
    },

    remLast : async function() {
        if (this.pauseActions) return;
        if (this.size === 0) {
            this.output = "null";
            this.boxUpdate();
            return;
        }
        this.pauseActions = true;

        const last = (this.nextLast - 1 + this.cap) % this.cap;
        this.boxes[last].box.fill(this.COLOR_REM);
        await sleep(220);

        const v = this.arr[last];
        this.nextLast  = last;
        this.size--;
        this.output    = v.toString();

        if (this.cap > this.MIN_CAP && this.size * 4 < this.cap) {
            this.resize(this.cap / 2);
        } else {
            this.updateValues();
        }
        this.boxUpdate();
        this.pauseActions = false;
    },

    get : async function(i) {
        if (this.pauseActions) return;
        if (i < 0 || i >= this.size) {
            this.output = "ERROR: bounds";
            this.boxUpdate();
            return;
        }
        this.pauseActions = true;

        for (let k = 0; k <= i; k++) {
            const idx = (this.nextFirst + 1 + k) % this.cap;
            this.boxes[idx].box.fill(this.COLOR_HIT);
            await sleep(200);
            if (k < i) this.boxes[idx].box.fill(this.COLOR_FILLED);
        }

        const finalIdx = (this.nextFirst + 1 + i) % this.cap;
        this.output = this.arr[finalIdx].toString();
        this.boxUpdate();
        await sleep(320);
        this.updateValues();

        this.pauseActions = false;
    },

    // ── key handler ──────────────────────────────────────────
    keyDown : function(key) {
        if (this.pauseActions) return;
        if (key.length == 1 && key != " " && Number.isFinite(+key)) {
            if (this.isInputHover) {
                if (Date.now() - this.lastInput < 500) {
                    this.input = this.input * 10 + parseInt(key);
                } else {
                    this.input = parseInt(key);
                }
                this.lastInput = Date.now();
                this.boxUpdate();
            }
        }
    },

    // ── start ────────────────────────────────────────────────
    start : function() {
        this.arr = new Array(this.cap).fill(0);

        this.nextFirstPtr = new Konva.Text({
            text       : "nextFirst",
            width      : 80,
            fontSize   : 11,
            align      : "center",
            fill       : "#a65a5a",
            fontStyle  : "bold",
            fontFamily : "DM Sans",
        });
        this.nextLastPtr = new Konva.Text({
            text       : "nextLast",
            width      : 80,
            fontSize   : 11,
            align      : "center",
            fill       : "#5a7aa6",
            fontStyle  : "bold",
            fontFamily : "DM Sans",
        });
        this.layer.add(this.nextFirstPtr);
        this.layer.add(this.nextLastPtr);

        this.buildVisual();

        const buttons = {};
        buttons.get      = () => this.get(this.input);
        buttons.addFirst = () => this.addFirst(this.input);
        buttons.addLast  = () => this.addLast(this.input);
        buttons.remFirst = () => this.remFirst();
        buttons.remLast  = () => this.remLast();
        buttons.size     = () => {
            this.output = this.size.toString();
            this.boxUpdate();
        };

        const hasInput = new Set();
        hasInput.add("get");
        hasInput.add("addFirst");
        hasInput.add("addLast");

        let i = 0;
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
            tooltip.setText("input_box", "Press digits to enter value", 3);
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
    },
};

// 3 : Disjoint Sets

const e3Layer = new Konva.Group(gAttr);
const e3uLayer = new Konva.Group(gAttr);
environments[3] = {
    started      : false,
    nodes        : new Set(),
    layer        : e3Layer,
    uLayer       : e3uLayer,
    isInputHover : false,
    displayer    : new Konva.Text({}),
    input        : 0,
    lastInput    : 0,
    output       : "null",
    hoverNode    : null,

    // ── DSU data (negative-weight WQU) ───────────────────────
    // id[i] < 0  →  i is a root, subtree size = -id[i]
    // id[i] >= 0 →  id[i] is i's parent
    N        : 10,
    id       : [],
    nodeObjs : [],
    selected : -1,   // representative of selected group, or -1

    // ── visual constants ──────────────────────────────────────
    NODE_W   : 40,
    NODE_H   : 36,
    H_GAP    : 14,
    TREE_GAP : 28,
    V_GAP    : 58,
    TOP_Y    : 60,

    COLOR_DEFAULT  : "#b7d7a8",
    COLOR_SELECTED : "#efd062",
    COLOR_STROKE   : "#555555",

    // ── DSU operations ────────────────────────────────────────
    find : function(i) {
        while (this.id[i] >= 0) i = this.id[i];
        return i;
    },

    union : function(a, b) {
        const ra = this.find(a);
        const rb = this.find(b);
        if (ra === rb) return false;
        // more-negative = larger tree; attach smaller under larger
        if (this.id[ra] <= this.id[rb]) {
            this.id[ra] += this.id[rb];
            this.id[rb]  = ra;
        } else {
            this.id[rb] += this.id[ra];
            this.id[ra]  = rb;
        }
        return true;
    },

    isConnected : function(a, b) {
        return this.find(a) === this.find(b);
    },

    resetDSU : function() {
        for (let i = 0; i < this.N; i++) this.id[i] = -1;
        this.clearSelection();
    },

    // ── selection (whole group) ───────────────────────────────
    getGroup : function(i) {
        const root = this.find(i);
        const g = [];
        for (let j = 0; j < this.N; j++) {
            if (this.find(j) === root) g.push(j);
        }
        return g;
    },

    clearSelection : function() {
        if (this.selected === -1) return;
        for (const j of this.getGroup(this.selected)) {
            this.nodeObjs[j].box.stroke(this.COLOR_STROKE);
            this.nodeObjs[j].box.strokeWidth(2);
        }
        this.selected = -1;
    },

    selectGroup : function(i) {
        this.clearSelection();
        this.selected = i;
        for (const j of this.getGroup(i)) {
            this.nodeObjs[j].box.stroke(this.COLOR_SELECTED);
            this.nodeObjs[j].box.strokeWidth(3);
        }
    },

    // ── layout helpers ────────────────────────────────────────
    getChildren : function(i) {
        const ch = [];
        for (let c = 0; c < this.N; c++) {
            if (this.id[c] === i) ch.push(c);
        }
        return ch;
    },

    subtreeWidth : function(i) {
        const ch = this.getChildren(i);
        if (ch.length === 0) return this.NODE_W;
        const total = ch.reduce((s, c) => s + this.subtreeWidth(c), 0);
        return Math.max(this.NODE_W, total + this.H_GAP * (ch.length - 1));
    },

    layoutSubtree : function(i, left, y, pos) {
        const ch = this.getChildren(i);
        if (ch.length === 0) {
            pos[i] = { x: left + this.NODE_W / 2, y };
            return;
        }
        let cx = left;
        for (const c of ch) {
            const w = this.subtreeWidth(c);
            this.layoutSubtree(c, cx, y + this.V_GAP, pos);
            cx += w + this.H_GAP;
        }
        pos[i] = {
            x : (pos[ch[0]].x + pos[ch[ch.length - 1]].x) / 2,
            y,
        };
    },

    // ── reposition (after structural change) ──────────────────
    reposition : function() {
        const roots = [];
        for (let i = 0; i < this.N; i++) {
            if (this.id[i] < 0) roots.push(i);
        }

        const treeSizes = roots.map(r => this.subtreeWidth(r));
        const totalW    = treeSizes.reduce((a, b) => a + b, 0)
                        + this.TREE_GAP * (roots.length - 1);
        let startX = stage.width() / 2 - totalW / 2;

        const pos = new Array(this.N);
        for (let ri = 0; ri < roots.length; ri++) {
            this.layoutSubtree(roots[ri], startX, this.TOP_Y, pos);
            startX += treeSizes[ri] + this.TREE_GAP;
        }

        for (let i = 0; i < this.N; i++) {
            this.nodeObjs[i].kGroup.x(pos[i].x - this.NODE_W / 2);
            this.nodeObjs[i].kGroup.y(pos[i].y);
        }

        this.refreshEdges();
        this.updateDisplayer();
    },

    // ── edges from current kGroup positions ───────────────────
    refreshEdges : function() {
        for (let i = 0; i < this.N; i++) {
            const obj = this.nodeObjs[i];
            if (this.id[i] < 0) {
                if (obj.parentLine) obj.parentLine.visible(false);
            } else {
                const p   = this.id[i];
                const par = this.nodeObjs[p];
                const px  = par.kGroup.x() + this.NODE_W / 2;
                const py  = par.kGroup.y() + this.NODE_H;
                const cx  = obj.kGroup.x() + this.NODE_W / 2;
                const cy  = obj.kGroup.y();

                if (!obj.parentLine) {
                    obj.parentLine = new Konva.Line({
                        points      : [px, py, cx, cy],
                        stroke      : "#888888",
                        strokeWidth : 2,
                        listening   : false,
                    });
                    this.layer.add(obj.parentLine);
                    obj.parentLine.moveToBottom();
                } else {
                    obj.parentLine.points([px, py, cx, cy]);
                    obj.parentLine.visible(true);
                }
            }
        }
    },

    updateDisplayer : function() {
        this.displayer.setAttr("text", "id: [" + this.id.join(", ") + "]");
    },

    // ── visual node factory ───────────────────────────────────
    makeNodeObj : function(i) {
        const obj  = {};
        obj.idx        = i;
        obj.parentLine = null;

        obj.box = new Konva.Rect({
            x : 0, y : 0,
            width       : this.NODE_W,
            height      : this.NODE_H,
            fill        : this.COLOR_DEFAULT,
            stroke      : this.COLOR_STROKE,
            strokeWidth : 2,
        });

        obj.label = new Konva.Text({
            x : 0, y : 0,
            width         : this.NODE_W,
            height        : this.NODE_H,
            text          : i.toString(),
            fontSize      : 15,
            align         : "center",
            verticalAlign : "middle",
            fill          : "#252525",
            fontFamily    : "DM Sans",
        });

        obj.kGroup = new Konva.Group({ x: 0, y: 0, draggable: true });
        obj.kGroup.add(obj.box);
        obj.kGroup.add(obj.label);

        // ── group drag ────────────────────────────────────────
        obj.kGroup.on("dragstart", () => {
            const group = this.getGroup(i);
            obj._dragPeers = group.filter(j => j !== i).map(j => ({
                idx    : j,
                startX : this.nodeObjs[j].kGroup.x(),
                startY : this.nodeObjs[j].kGroup.y(),
            }));
            obj._dragOriginX = obj.kGroup.x();
            obj._dragOriginY = obj.kGroup.y();
        });

        obj.kGroup.on("dragmove", () => {
            const dx = obj.kGroup.x() - obj._dragOriginX;
            const dy = obj.kGroup.y() - obj._dragOriginY;
            for (const peer of obj._dragPeers) {
                this.nodeObjs[peer.idx].kGroup.x(peer.startX + dx);
                this.nodeObjs[peer.idx].kGroup.y(peer.startY + dy);
            }
            this.refreshEdges();
        });

        obj.label.on("mouseenter", () => {
            this.hoverNode = obj;
        });

        obj.label.on("mouseout", () => {
            this.hoverNode = null;
        });

        obj.kGroup.on("dragend", () => {
            obj._dragPeers   = null;
            this.refreshEdges();
        });

        // ── group click-select ────────────────────────────────
        obj.kGroup.on("click", () => {
            const sameGroup = this.selected !== -1 &&
                              this.find(i) === this.find(this.selected);
            if (sameGroup) {
                this.clearSelection();
            } else {
                this.selectGroup(i);
            }
        });

        this.nodes.add(obj);
        this.layer.add(obj.kGroup);
        return obj;
    },

    // ── key handler ───────────────────────────────────────────
    keyDown : function(key) {
        if (key.length == 1 && key != " " && Number.isFinite(+key)) {
            if (this.isInputHover) {
                this.input = parseInt(key);
                this.boxUpdate();
            }
        } else if (key == " ") {
            if (this.hoverNode) {
                this.connect(this.selected, this.hoverNode.idx)
            }
        }
    },

    connect : function(i, j) {
        if (this.selected === -1) return;
        const a = i;
        const b = j;
        if (b < 0 || b >= this.N) return;
        const merged = this.union(a, b);
        this.output = merged ? "connected" : "same set";
        // re-select to refresh group highlight after merge
        const rep = this.find(a);
        this.selected = -1;
        this.selectGroup(rep);
        this.reposition();
        this.boxUpdate();
    },

    // ── start ─────────────────────────────────────────────────
    start : function() {
        for (let i = 0; i < this.N; i++) {
            this.id[i]       = -1;
            this.nodeObjs[i] = this.makeNodeObj(i);
        }
        this.reposition();

        const buttons  = {};
        const hasInput = new Set(["connect", "isConnected"]);

        buttons.connect = () => {
            this.connect(this.selected, this.input);
        };

        buttons.isConnected = () => {
            if (this.selected === -1) return;
            const b = this.input;
            if (b < 0 || b >= this.N) return;
            this.output = this.isConnected(this.selected, b) ? "true" : "false";
            this.boxUpdate();
        };

        buttons.reset = () => {
            this.resetDSU();
            this.reposition();
            this.output = "null";
            this.boxUpdate();
        };

        let i = 0;
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

        this.displayer.setAttr("x", stage.width() / 2 - 280);
        this.displayer.setAttr("y", stage.height() - 115);
        this.displayer.setAttr("fill", "#737070");
        this.displayer.setAttr("fontSize", 13);
        this.displayer.setAttr("fontStyle", "italic");
        this.displayer.setAttr("fontFamily", "DM Sans");

        const iBox = new Konva.Rect({
            x : stage.width() / 2 - 395,
            y : stage.height() - 90,
            width : 90, height : 30,
            fill : "#c0d4e03f", stroke : "#666666",
            strokeWidth : 1, cornerRadius : 6,
        });
        const iBoxText = new Konva.Text({
            text : "input",
            x : stage.width() / 2 - 395 + 5,
            y : stage.height() - 105,
            fill : "#737070", fontSize : 13,
            fontStyle : "normal", fontFamily : "DM Sans",
        });
        const iBoxInput = new Konva.Text({
            text : "0",
            x : stage.width() / 2 - 395,
            y : stage.height() - 90,
            width : 90, height : 30,
            fill : "#737070", fontSize : 13,
            fontFamily : "DM Sans",
            align : "center", verticalAlign : "middle",
        });

        const oBox = new Konva.Rect({
            x : stage.width() / 2 + 205,
            y : stage.height() - 90,
            width : 90, height : 30,
            fill : "#c0d4e03f", stroke : "#666666",
            strokeWidth : 1, cornerRadius : 6,
        });
        const oBoxText = new Konva.Text({
            text : "output",
            x : stage.width() / 2 + 205 + 5,
            y : stage.height() - 105,
            fill : "#737070", fontSize : 13,
            fontStyle : "normal", fontFamily : "DM Sans",
        });
        const oBoxOutput = new Konva.Text({
            text : "null",
            x : stage.width() / 2 + 205,
            y : stage.height() - 90,
            width : 90, height : 30,
            fill : "#737070", fontSize : 13,
            fontFamily : "DM Sans",
            align : "center", verticalAlign : "middle",
        });

        iBoxInput.on("mouseenter", () => {
            this.isInputHover = true;
            iBox.setAttr("fill", "#c0d4e01e");
            tooltip.setText("input_box", "Press 0-9 to set value", 3);
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
    },
};

// 4 : BSTs

const e4Layer = new Konva.Group(gAttr);
const e4uLayer = new Konva.Group(gAttr);
environments[4] = {
    started      : false,
    nodes        : new Set(),
    layer        : e4Layer,
    uLayer       : e4uLayer,
    isInputHover : false,
    displayer    : new Konva.Text({}),
    input        : 50,
    lastInput    : 0,
    activeAction : false,
    output       : "null",
 
    // BST structural root
    bstRoot : null,
 
    // ── visual constants ──────────────────────────────────────
    NODE_W    : 65,
    NODE_H    : 40,
    H_GAP     : 28,   // horizontal gap between siblings at the leaf level
    V_GAP     : 64,   // vertical gap between levels
 
    // ── code-visualizer panel ────────────────────────────────
    // Will be created in start()
    codeLines     : null,   // Konva.Text[]  (one per line)
    codePanel     : null,   // Konva.Rect (background)
    codeHighlight : null,   // Konva.Rect (highlight bar)
 
    CODE : {
        preorder  : [
            { label : "traverse(node):",           },
            { label : "  if node == null: return", },
            { label : "  action(node)",            },
            { label : "  traverse(node.left)",         },
            { label : "  traverse(node.right)",       },
        ],
        inorder   : [
            { label : "traverse(node):",           },
            { label : "  if node == null: return", },
            { label : "  traverse(node.left)",         },
            { label : "  action(node)",            },
            { label : "  traverse(node.right)",       },
        ],
        postorder : [
            { label : "traverse(node):",           },
            { label : "  if node == null: return", },
            { label : "  traverse(node.left)",         },
            { label : "  traverse(node.right)",       },
            { label : "  action(node)",            },
        ],
    },
    
    // indices into the above per order: [left, action, right]
    CODE_IDX : {
        preorder  : { action: 2, left: 3, right: 4 },
        inorder   : { action: 3, left: 2, right: 4 },
        postorder : { action: 4, left: 2, right: 3 },
    },
 
    // line indices for traversal orders
    TRAVERSAL_LINES : {
        preorder  : [2, 3, 4],  // action BEFORE children → show action then left then right
        inorder   : [2, 3, 4],  // same code lines; order of highlighting differs — we pass order explicitly
        postorder : [2, 3, 4],
    },
 
    // ── internal BST node factory ────────────────────────────
    makeBSTNode : function(value, x, y) {
        const N       = {};
        N.value       = value;
        N.left        = null;
        N.right       = null;
        N.parent      = null;
 
        // konva shapes
        N.box = new Konva.Rect({
            x : 0, y : 0,
            width  : this.NODE_W,
            height : this.NODE_H,
            fill   : "#b1dd8b",
            stroke : "#666666",
            strokeWidth : 2,
            cornerRadius : 0,
        });
 
        N.label = new Konva.Text({
            x : 0, y : 0,
            width  : this.NODE_W,
            height : this.NODE_H,
            text   : value.toString(),
            fontSize       : 14,
            align          : "center",
            verticalAlign  : "middle",
            fill           : "#252525",
            fontFamily     : "DM Sans",
        });
 
        N.kGroup = new Konva.Group({
            draggable : false,
            x : x,
            y : y,
        });
 
        N.kGroup.add(N.box);
        N.kGroup.add(N.label);
 
        // edge lines (drawn from parent)
        N.edgeLine = null; // Konva.Line, created when attached to parent
 
        this.nodes.add(N);
        this.layer.add(N.kGroup);
        return N;
    },
 
    // ── BST insert (by value) ────────────────────────────────
    bstInsert : function(value) {
        if (this.bstRoot === null) {
            const cx = stage.width() / 2 - this.NODE_W / 2;
            const cy = 60;
            this.bstRoot = this.makeBSTNode(value, cx, cy);
            return;
        }
 
        let cur    = this.bstRoot;
        let placed = false;
        while (!placed) {
            if (value < cur.value) {
                if (cur.left === null) {
                    cur.left = this.makeBSTNode(value, 0, 0);
                    cur.left.parent = cur;
                    placed = true;
                } else {
                    cur = cur.left;
                }
            } else if (value > cur.value) {
                if (cur.right === null) {
                    cur.right = this.makeBSTNode(value, 0, 0);
                    cur.right.parent = cur;
                    placed = true;
                } else {
                    cur = cur.right;
                }
            } else {
                // duplicate — do nothing
                placed = true;
                return;
            }
        }
        this.reposition();
    },
 
    // ── BST search ───────────────────────────────────────────
    bstSearch : function(value) {
        let cur = this.bstRoot;
        while (cur !== null) {
            if (value === cur.value) return true;
            cur = value < cur.value ? cur.left : cur.right;
        }
        return false;
    },
 
    // ── reposition all nodes using in-order x assignment ────
    reposition : function() {
        // 1. Assign x positions via in-order traversal counter
        let counter = 0;
        const xSlot = new Map();
 
        const assignX = (node) => {
            if (!node) return;
            assignX(node.left);
            xSlot.set(node, counter++);
            assignX(node.right);
        };
        assignX(this.bstRoot);
 
        const total  = counter;
        const slotW  = this.NODE_W + this.H_GAP;
        const startX = stage.width() / 2 - (total * slotW) / 2;
 
        // 2. Assign y positions by depth
        const setPositions = (node, depth) => {
            if (!node) return;
            const nx = startX + xSlot.get(node) * slotW;
            const ny = 60 + depth * this.V_GAP;
            node.kGroup.x(nx);
            node.kGroup.y(ny);
            setPositions(node.left,  depth + 1);
            setPositions(node.right, depth + 1);
        };
        setPositions(this.bstRoot, 0);
 
        // 3. Update / create edge lines
        this.updateEdges(this.bstRoot);
    },
 
    updateEdges : function(node) {
        if (!node) return;
 
        const drawEdge = (child) => {
            if (!child) return;
            const px = node.kGroup.x()  + this.NODE_W / 2;
            const py = node.kGroup.y()  + this.NODE_H;
            const cx = child.kGroup.x() + this.NODE_W / 2;
            const cy = child.kGroup.y();
 
            if (!child.edgeLine) {
                child.edgeLine = new Konva.Arrow({
                    points      : [px, py, cx, cy],
                    stroke      : "#666666",
                    fill        : "#666666",
                    strokeWidth : 1.4,
                    listening   : false,
                });
                this.layer.add(child.edgeLine);
                child.edgeLine.moveToBottom();
            } else {
                child.edgeLine.points([px, py, cx, cy]);
            }
        };
 
        drawEdge(node.left);
        drawEdge(node.right);
        this.updateEdges(node.left);
        this.updateEdges(node.right);
    },
 
    // ── clear entire tree ────────────────────────────────────
    clearTree : function() {
        this.nodes.forEach(n => {
            n.kGroup.destroy();
            if (n.edgeLine) n.edgeLine.destroy();
        });
        this.nodes.clear();
        this.bstRoot  = null;
    },
 
    // ── code visualizer helpers ──────────────────────────────
    highlightCodeLine : function(lineIdx) {
        if (!this.codeHighlight || lineIdx === null) {
            if (this.codeHighlight) this.codeHighlight.visible(false);
            return;
        }
        const LINE_H = 20;
        const panelX = this.codePanel.x();
        const panelY = this.codePanel.y();
        this.codeHighlight.x(panelX + 2);
        this.codeHighlight.y(panelY + 8 + lineIdx * LINE_H);
        this.codeHighlight.visible(true);
    },
 
    // ── traversal runner ────────────────────────────────────
    runTraversal : async function(order) {
        if (this.activeAction || !this.bstRoot) return;
        this.activeAction = true;
    
        this.setCodeOrder(order);
        const idx = this.CODE_IDX[order];
    
        // ── accumulate visited order here ────────────────────
        const result = [];
    
        const stackColor = (depth) => { /* unchanged */ };
    
        const ACTION_COLOR = "#efd062";
        const RETURN_COLOR = "#e8e8e8";
    
        const traverse = async (node, depth = 0) => {
            if (!node) return;
    
            this.highlightCodeLine(1);
            await sleep(360);
    
            node.box.fill(stackColor(depth));
            node.box.strokeWidth(2);
    
            if (order === "preorder") {
                result.push(node.value);                          // ← action fires here
                this.displayer.text(order + ": [" + result.join(", ") + "]");
                node.box.fill(ACTION_COLOR);
                this.highlightCodeLine(idx.action);
                await sleep(820);
                node.box.fill(stackColor(depth));
    
                this.highlightCodeLine(idx.left);
                await sleep(360);
                await traverse(node.left, depth + 1);
    
                this.highlightCodeLine(idx.right);
                await sleep(360);
                await traverse(node.right, depth + 1);
    
            } else if (order === "inorder") {
                this.highlightCodeLine(idx.left);
                await sleep(360);
                await traverse(node.left, depth + 1);
    
                result.push(node.value);                          // ← action fires here
                this.displayer.text(order + ": [" + result.join(", ") + "]");
                node.box.fill(ACTION_COLOR);
                this.highlightCodeLine(idx.action);
                await sleep(820);
                node.box.fill(stackColor(depth));
    
                this.highlightCodeLine(idx.right);
                await sleep(360);
                await traverse(node.right, depth + 1);
    
            } else {
                this.highlightCodeLine(idx.left);
                await sleep(360);
                await traverse(node.left, depth + 1);
    
                this.highlightCodeLine(idx.right);
                await sleep(360);
                await traverse(node.right, depth + 1);
    
                result.push(node.value);                          // ← action fires here
                this.displayer.text(order + ": [" + result.join(", ") + "]");
                node.box.fill(ACTION_COLOR);
                this.highlightCodeLine(idx.action);
                await sleep(820);
                node.box.fill(stackColor(depth));
            }
    
            node.box.fill(RETURN_COLOR);
            node.box.strokeWidth(2);
            await sleep(320);
        };
    
        this.highlightCodeLine(0);
        await sleep(400);
        await traverse(this.bstRoot);
        this.highlightCodeLine(null);
    
        this.nodes.forEach(n => {
            n.box.fill("#b1dd8b");
            n.box.strokeWidth(2);
        });
    
        this.activeAction = false;
    },
 
    // ── key handler ─────────────────────────────────────────
    keyDown : function(key) {
        if (this.activeAction) return;
 
        if (key.length == 1 && key != " " && Number.isFinite(+key)) {
            if (this.isInputHover) {
                if (Date.now() - this.lastInput < 500) {
                    this.input = this.input * 10 + parseInt(key);
                } else {
                    this.input = parseInt(key);
                }
                this.lastInput = Date.now();
                this.boxUpdate();
            }
        }
    },
 
    // ── start ────────────────────────────────────────────────
    start : function() {
        // ── Code Visualizer Panel ────────────────────────
        const LINE_H   = 20;
        const PANEL_W  = 230;
        const PANEL_H  = 14 + this.CODE.length * LINE_H;
        const PANEL_X  = 18;
        const PANEL_Y  = 20;
 
        this.codePanel = new Konva.Rect({
            x      : PANEL_X,
            y      : PANEL_Y,
            width  : PANEL_W,
            height : PANEL_H,
            fill   : "#f0ede830",
            stroke : "#aaaaaa",
            strokeWidth : 1,
            cornerRadius : 6,
        });
 
        this.codeHighlight = new Konva.Rect({
            x       : PANEL_X + 2,
            y       : PANEL_Y + 8,
            width   : PANEL_W - 4,
            height  : LINE_H - 2,
            fill    : "#efd06240",
            cornerRadius : 3,
            visible : false,
            listening : false,
        });
 
        this.uLayer.add(this.codePanel);
        this.uLayer.add(this.codeHighlight);

        this.codeLines = this.CODE.inorder.map((c, i) => {
            const t = new Konva.Text({
                x        : PANEL_X + 10,
                y        : PANEL_Y + 8 + i * LINE_H,
                width    : PANEL_W - 16,
                height   : LINE_H,
                text     : c.label,
                fontSize : 12,
                verticalAlign : "middle",
                fill     : "#444444",
                fontFamily : "DM Mono, monospace",
            });
            this.uLayer.add(t);
            return t;
        });

        this.setCodeOrder = (order) => {
            this.CODE[order].forEach((c, i) => {
                this.codeLines[i].text(c.label);
            });
        };
 
        // ── Buttons ───────────────────────────────────────
        const buttons   = {};
        const hasInput  = new Set(["add", "get"]);
 
        buttons.add = () => {
            if (this.activeAction) return;
            this.bstInsert(this.input);
        };
 
        buttons.get = () => {
            if (this.activeAction) return;
            const found  = this.bstSearch(this.input);
            this.output  = found ? "true" : "false";
            // briefly highlight the found node
            if (found) {
                const highlight = async () => {
                    let cur = this.bstRoot;
                    while (cur) {
                        cur.box.fill("#88d48b");
                        await sleep(280);
                        cur.box.fill("#b1dd8b");
                        if (this.input === cur.value) break;
                        cur = this.input < cur.value ? cur.left : cur.right;
                    }
                };
                highlight();
            }
            this.boxUpdate();
        };
 
        buttons.clear = () => {
            if (this.activeAction) return;
            this.clearTree();
            this.output = "null";
            this.boxUpdate();
        };
 
        buttons.preorder  = () => this.runTraversal("preorder");
        buttons.inorder   = () => this.runTraversal("inorder");
        buttons.postorder = () => this.runTraversal("postorder");
 
        let i = 0
        Object.keys(buttons).forEach((key) => {
            const callback = buttons[key];
            const newButton = makeButton();

            newButton.setX(stage.width()/2 - 280 + (i % 3)*160);
            newButton.setY(stage.height() - 90 + Math.floor(i / 3)*35);
            newButton.setWidth(140);
            newButton.setHeight(25);
            newButton.setText(key + (hasInput.has(key) ? "(input)" : "()"));
            newButton.callback = () => {
                if (!this.activeAction) {
                    callback();
                };
            };
            this.uLayer.add(newButton.kGroup);

            buttons[key] = newButton;
            i++;
        });
 
        // ── Input / Output boxes ──────────────────────────
        this.displayer.setAttr("text", "");
        this.displayer.setAttr("x", stage.width() / 2 - 280);
        this.displayer.setAttr("y", stage.height() - 115);
        this.displayer.setAttr("fill", "#737070");
        this.displayer.setAttr("fontSize", 13);
        this.displayer.setAttr("fontStyle", "italic");
        this.displayer.setAttr("fontFamily", "DM Sans");
 
        const iBox = new Konva.Rect({
            x : stage.width() / 2 - 395,
            y : stage.height() - 90,
            width : 90, height : 30,
            fill : "#c0d4e03f", stroke : "#666666",
            strokeWidth : 1, cornerRadius : 6,
        });
        const iBoxText = new Konva.Text({
            text : "input",
            x : stage.width() / 2 - 395 + 5,
            y : stage.height() - 105,
            fill : "#737070", fontSize : 13,
            fontStyle : "normal", fontFamily : "DM Sans",
        });
        const iBoxInput = new Konva.Text({
            text : "50",
            x : stage.width() / 2 - 395,
            y : stage.height() - 90,
            width : 90, height : 30,
            fill : "#737070", fontSize : 13,
            fontFamily : "DM Sans",
            align : "center", verticalAlign : "middle",
        });
 
        const oBox = new Konva.Rect({
            x : stage.width() / 2 + 205,
            y : stage.height() - 90,
            width : 90, height : 30,
            fill : "#c0d4e03f", stroke : "#666666",
            strokeWidth : 1, cornerRadius : 6,
        });
        const oBoxText = new Konva.Text({
            text : "output",
            x : stage.width() / 2 + 205 + 5,
            y : stage.height() - 105,
            fill : "#737070", fontSize : 13,
            fontStyle : "normal", fontFamily : "DM Sans",
        });
        const oBoxOutput = new Konva.Text({
            text : "null",
            x : stage.width() / 2 + 205,
            y : stage.height() - 90,
            width : 90, height : 30,
            fill : "#737070", fontSize : 13,
            fontFamily : "DM Sans",
            align : "center", verticalAlign : "middle",
        });
 
        iBoxInput.on("mouseenter", () => {
            this.isInputHover = true;
            iBox.setAttr("fill", "#c0d4e01e");
            tooltip.setText("input_box", "Press digits to enter value", 3);
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
 
        // ── Seed a small starter tree ─────────────────────
        [50, 30, 70, 20, 40, 60, 80].forEach(v => this.bstInsert(v));
    },
};

// 7 : Heap

const e7Layer = new Konva.Group(gAttr);
const e7uLayer = new Konva.Group(gAttr);
environments[7] = {
    started      : false,
    nodes        : new Set(),
    layer        : e7Layer,
    uLayer       : e7uLayer,
    isInputHover : false,
    displayer    : new Konva.Text({}),
    input        : 5,
    lastInput    : 0,
    activeAction : false,
    output       : "null",

    // internal heap array and parallel visual node array
    heap      : [],
    heapNodes : [],

    // ── visual constants ──────────────────────────────────────
    NODE_R : 20,   // circle radius
    H_GAP  : 18,   // horizontal gap between siblings at leaf level
    V_GAP  : 64,   // vertical gap between levels

    // ── visual node factory ───────────────────────────────────
    makeHeapNode : function(value, x, y) {
        const N = {};
        N.value = value;

        N.box = new Konva.Circle({
            x : 0, y : 0,
            radius      : this.NODE_R,
            fill        : "#cfe2f3",
            stroke      : "#666666",
            strokeWidth : 2,
        });

        N.label = new Konva.Text({
            x : -this.NODE_R, y : -this.NODE_R,
            width         : this.NODE_R * 2,
            height        : this.NODE_R * 2,
            text          : value.toString(),
            fontSize      : 14,
            align         : "center",
            verticalAlign : "middle",
            fill          : "#252525",
            fontFamily    : "DM Sans",
        });

        N.kGroup = new Konva.Group({ x, y });
        N.kGroup.add(N.box);
        N.kGroup.add(N.label);
        N.edgeLine = null;

        this.nodes.add(N);
        this.layer.add(N.kGroup);
        return N;
    },

    // ── colors ────────────────────────────────────────────────
    COLOR_DEFAULT : "#cfe2f3",
    COLOR_ACTIVE  : "#efd062",   // yellow  – value being tracked
    COLOR_SWAP    : "#f4a261",   // orange  – swap partner
    COLOR_REMOVE  : "#e05c5c",   // red     – root being popped
    COLOR_SETTLE  : "#b1e8b1",   // green   – settled in place

    // ── heap operations ───────────────────────────────────────

    // sync insert used for seeding (no animation)
    _insertSync : function(value) {
        this.heap.push(value);
        this.heapNodes.push(this.makeHeapNode(value, 0, 0));
        let i = this.heap.length - 1;
        while (i > 0) {
            const p = (i - 1) >> 1;
            if (this.heap[p] <= this.heap[i]) break;
            [this.heap[p], this.heap[i]] = [this.heap[i], this.heap[p]];
            this.heapNodes[p].label.text(this.heap[p].toString());
            this.heapNodes[i].label.text(this.heap[i].toString());
            i = p;
        }
        this.reposition();
        this.updateDisplayer();
    },

    heapInsert : async function(value) {
        if (this.activeAction) return;
        this.activeAction = true;

        // add to array and create visual node, then position everything
        this.heap.push(value);
        this.heapNodes.push(this.makeHeapNode(value, 0, 0));
        this.reposition();
        this.updateDisplayer();

        // highlight the newly added node
        let i = this.heap.length - 1;
        this.heapNodes[i].box.fill(this.COLOR_ACTIVE);
        await sleep(300);

        // animate bubble-up
        while (i > 0) {
            const p = (i - 1) >> 1;
            if (this.heap[p] <= this.heap[i]) break;

            this.heapNodes[p].box.fill(this.COLOR_SWAP);
            await sleep(340);

            [this.heap[p], this.heap[i]] = [this.heap[i], this.heap[p]];
            this.heapNodes[p].label.text(this.heap[p].toString());
            this.heapNodes[i].label.text(this.heap[i].toString());

            // yellow cursor moves up to parent slot, old slot resets
            this.heapNodes[i].box.fill(this.COLOR_DEFAULT);
            this.heapNodes[p].box.fill(this.COLOR_ACTIVE);
            this.updateDisplayer();
            await sleep(340);

            i = p;
        }

        // settle
        this.heapNodes[i].box.fill(this.COLOR_SETTLE);
        await sleep(380);
        this.heapNodes[i].box.fill(this.COLOR_DEFAULT);

        this.activeAction = false;
    },

    heapPop : async function() {
        if (this.heap.length === 0) { this.output = "null"; return; }
        if (this.activeAction) return;
        this.activeAction = true;

        const min   = this.heap[0];
        this.output = min.toString();

        // highlight root red – about to be removed
        this.heapNodes[0].box.fill(this.COLOR_REMOVE);
        await sleep(480);

        const lastVal  = this.heap.pop();
        const lastNode = this.heapNodes.pop();
        lastNode.kGroup.destroy();
        if (lastNode.edgeLine) lastNode.edgeLine.destroy();
        this.nodes.delete(lastNode);

        if (this.heap.length === 0) {
            this.updateDisplayer();
            this.activeAction = false;
            return;
        }

        // move last value to root slot, highlight yellow
        this.heap[0] = lastVal;
        this.heapNodes[0].label.text(lastVal.toString());
        this.heapNodes[0].box.fill(this.COLOR_ACTIVE);
        this.updateDisplayer();
        await sleep(340);

        // animate sift-down
        let i = 0;
        while (true) {
            const n = this.heap.length;
            const l = 2*i+1, r = 2*i+2;
            let s = i;
            if (l < n && this.heap[l] < this.heap[s]) s = l;
            if (r < n && this.heap[r] < this.heap[s]) s = r;
            if (s === i) break;

            this.heapNodes[s].box.fill(this.COLOR_SWAP);
            await sleep(340);

            [this.heap[s], this.heap[i]] = [this.heap[i], this.heap[s]];
            this.heapNodes[s].label.text(this.heap[s].toString());
            this.heapNodes[i].label.text(this.heap[i].toString());

            // yellow cursor sinks down to child slot, old slot resets
            this.heapNodes[i].box.fill(this.COLOR_DEFAULT);
            this.heapNodes[s].box.fill(this.COLOR_ACTIVE);
            this.updateDisplayer();
            await sleep(340);

            i = s;
        }

        // settle
        this.heapNodes[i].box.fill(this.COLOR_SETTLE);
        await sleep(380);
        this.heapNodes[i].box.fill(this.COLOR_DEFAULT);

        this.reposition();

        this.activeAction = false;
    },

    // ── layout ────────────────────────────────────────────────
    reposition : function() {
        const n = this.heap.length;
        if (n === 0) return;

        const maxDepth = Math.floor(Math.log2(n));
        const slotW    = this.NODE_R * 2 + this.H_GAP;
        const totalW   = Math.pow(2, maxDepth) * slotW;

        for (let i = 0; i < n; i++) {
            const d   = Math.floor(Math.log2(i + 1));
            const pos = i - (Math.pow(2, d) - 1);
            const levelSlotW = totalW / Math.pow(2, d);
            const x = stage.width() / 2 - totalW / 2 + (pos + 0.5) * levelSlotW;
            const y = 60 + d * this.V_GAP;
            this.heapNodes[i].kGroup.x(x);
            this.heapNodes[i].kGroup.y(y);
        }

        this.updateEdges();
    },

    updateEdges : function() {
        const n = this.heap.length;
        for (let i = 1; i < n; i++) {
            const p   = (i - 1) >> 1;
            const par = this.heapNodes[p];
            const ch  = this.heapNodes[i];
            const px  = par.kGroup.x();
            const py  = par.kGroup.y();
            const cx  = ch.kGroup.x();
            const cy  = ch.kGroup.y();

            if (!ch.edgeLine) {
                ch.edgeLine = new Konva.Line({
                    points      : [px, py, cx, cy],
                    stroke      : "#666666",
                    strokeWidth : 1.4,
                    listening   : false,
                });
                this.layer.add(ch.edgeLine);
                ch.edgeLine.moveToBottom();
            } else {
                ch.edgeLine.points([px, py, cx, cy]);
            }
        }
    },

    updateDisplayer : function() {
        this.displayer.setAttr("text", "heap: [" + this.heap.join(", ") + "]");
    },

    // ── clear ─────────────────────────────────────────────────
    clearHeap : function() {
        this.heapNodes.forEach(n => {
            n.kGroup.destroy();
            if (n.edgeLine) n.edgeLine.destroy();
        });
        this.heapNodes = [];
        this.nodes.clear();
        this.heap   = [];
        this.output = "null";
        this.updateDisplayer();
    },

    // ── key handler ───────────────────────────────────────────
    keyDown : function(key) {
        if (this.activeAction) return;

        if (key.length == 1 && key != " " && Number.isFinite(+key)) {
            if (this.isInputHover) {
                if (Date.now() - this.lastInput < 500) {
                    this.input = this.input * 10 + parseInt(key);
                } else {
                    this.input = parseInt(key);
                }
                this.lastInput = Date.now();
                this.boxUpdate();
            }
        }
    },

    // ── start ─────────────────────────────────────────────────
    start : function() {
        const buttons  = {};
        const hasInput = new Set(["add"]);

        buttons.add = () => {
            this.heapInsert(this.input).then(() => this.boxUpdate());
        };

        buttons.pop = () => {
            this.heapPop().then(() => this.boxUpdate());
        };

        buttons.clear = () => {
            if (this.activeAction) return;
            this.clearHeap();
            this.boxUpdate();
        };

        let i = 0;
        Object.keys(buttons).forEach((key) => {
            const callback = buttons[key];
            const newButton = makeButton();

            newButton.setX(stage.width()/2 - 280 + (i % 3)*160);
            newButton.setY(stage.height() - 90 + Math.floor(i / 3)*35);
            newButton.setWidth(140);
            newButton.setHeight(25);
            newButton.setText(key + (hasInput.has(key) ? "(input)" : "()"));
            newButton.callback = () => {
                if (!this.activeAction) callback();
            };
            this.uLayer.add(newButton.kGroup);

            buttons[key] = newButton;
            i++;
        });

        // ── Input / Output boxes ──────────────────────────────
        this.displayer.setAttr("text", "heap: []");
        this.displayer.setAttr("x", stage.width() / 2 - 280);
        this.displayer.setAttr("y", stage.height() - 115);
        this.displayer.setAttr("fill", "#737070");
        this.displayer.setAttr("fontSize", 13);
        this.displayer.setAttr("fontStyle", "italic");
        this.displayer.setAttr("fontFamily", "DM Sans");

        const iBox = new Konva.Rect({
            x : stage.width() / 2 - 395,
            y : stage.height() - 90,
            width : 90, height : 30,
            fill : "#c0d4e03f", stroke : "#666666",
            strokeWidth : 1, cornerRadius : 6,
        });
        const iBoxText = new Konva.Text({
            text : "input",
            x : stage.width() / 2 - 395 + 5,
            y : stage.height() - 105,
            fill : "#737070", fontSize : 13,
            fontStyle : "normal", fontFamily : "DM Sans",
        });
        const iBoxInput = new Konva.Text({
            text : "5",
            x : stage.width() / 2 - 395,
            y : stage.height() - 90,
            width : 90, height : 30,
            fill : "#737070", fontSize : 13,
            fontFamily : "DM Sans",
            align : "center", verticalAlign : "middle",
        });

        const oBox = new Konva.Rect({
            x : stage.width() / 2 + 205,
            y : stage.height() - 90,
            width : 90, height : 30,
            fill : "#c0d4e03f", stroke : "#666666",
            strokeWidth : 1, cornerRadius : 6,
        });
        const oBoxText = new Konva.Text({
            text : "output",
            x : stage.width() / 2 + 205 + 5,
            y : stage.height() - 105,
            fill : "#737070", fontSize : 13,
            fontStyle : "normal", fontFamily : "DM Sans",
        });
        const oBoxOutput = new Konva.Text({
            text : "null",
            x : stage.width() / 2 + 205,
            y : stage.height() - 90,
            width : 90, height : 30,
            fill : "#737070", fontSize : 13,
            fontFamily : "DM Sans",
            align : "center", verticalAlign : "middle",
        });

        iBoxInput.on("mouseenter", () => {
            this.isInputHover = true;
            iBox.setAttr("fill", "#c0d4e01e");
            tooltip.setText("input_box", "Press digits to enter value", 3);
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

        // ── Seed initial values ───────────────────────────────
        [1, 5, 1, 6, 5, 6, 3, 7, 7, 8].forEach(v => this._insertSync(v));
    },
};

// 8: Graph Traversals

const e8Layer = new Konva.Group(gAttr);
const e8uLayer = new Konva.Group(gAttr);
environments[8] = {
    started : false,
    nodes : new Set(),
    layer : e8Layer,
    uLayer : e8uLayer,
    isInputHover : false,
    displayer : new Konva.Text({}),
    selectedNode : null,
    input : 1,
    output : "Null",
    hoverNode : null,
    lastInput : 0,
    activeAction : false,

    points : [
        [0, 16],
        [21, 0],
        [42, 16],
        [21, 32],
    ],

    st_nodes : [
        // 0
        [30,  130, [[1, 1], [3, 1]]],
        // 1
        [65,  210, [[0, 1], [4, 1]]],
        // 2
        [175, 30,  [[3, 1], [5, 1]]],
        // 3
        [175, 120, [[0, 1], [2, 1], [4, 1], [5, 1]]],
        // 4
        [175, 205, [[1, 1], [3, 1], [5, 1], [7, 1]]],
        // 5
        [275, 110, [[2, 1], [3, 1], [4, 1], [6, 1]]],
        // 6
        [295, 210, [[5, 1]]],
        // 7
        [175, 290, [[4, 1]]],
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
        const t = environments[8];
        t.nodes.forEach((node) => {
            t.nodes.forEach((node2) => {
                if (node.next.has(node2)) {
                    const connection = node.next.get(node2);

                    const p = t.getPoints(node2.kGroup.x() + 21 - node.kGroup.x(), node2.kGroup.y() + 16 - node.kGroup.y());
                    const pi = t.getPoints(node.kGroup.x() + 21 - node2.kGroup.x(), node.kGroup.y() + 16 - node2.kGroup.y());

                    if (p && pi) {
                        connection.arrow.points([
                            node.kGroup.x() + p[0],
                            node.kGroup.y() + p[1],
                            node2.kGroup.x() + pi[0],
                            node2.kGroup.y() + pi[1],
                        ]);
                        connection.arrow.show();
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
            fill : "#c9daf8",
            stroke : "#666666",
        });

        N.label = new Konva.Text({
            x : 0,
            y : 0,
            width : 42,
            height : 32,
            text : String.fromCharCode((this.nodes.size % 26) + 65) + (Math.floor(this.nodes.size / 26) || "").toString(),
            fontSize : 15,
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

        N.addNode = (node) => {
            if (N.next.has(node)) {
            } else {
                const nArrow = new Konva.Arrow({
                    stroke : "#666666",
                    fill : "#666666",
                    strokeWidth : 1.7,
                    points : [],
                });

                N.next.set(node, {
                    arrow : nArrow,
                });

                this.uLayer.add(nArrow);

                nArrow.moveToBottom();
            };
            this.updateArrows();
        }

        N.delNode = (node) => {
            if (N.next.has(node)) {
                const n = N.next.get(node);
                n.arrow.destroy();
                N.next.delete(node);
            }
            this.updateArrows();
        }

        N.kGroup.on("dragmove", this.updateArrows);

        N.label.on("mouseenter", () => {
            if (environments[8].activeAction) {
                return;
            }

            this.hoverNode = N;
            N.Box.setAttr("fill", "#d4e0f5");
        });

        N.label.on("mouseout", () => {
            if (environments[8].activeAction) {
                return;
            }

            this.hoverNode = null;
            N.Box.setAttr("fill", "#c9daf8");
        });

        N.kGroup.on("click", () => {
            if (environments[8].activeAction) {
                return;
            }

            N.toggleSelect();
        });

        N.kGroup.add(N.Box);
        N.kGroup.add(N.label);
        this.nodes.add(N);

        return N
    },

    keyDown : function(key) {
        if (environments[8].activeAction) {
            return;
        }

        if (key.length == 1 && key != " " && Number.isFinite(+key)) {
            if (this.isInputHover) {
                if (Date.now() - this.lastInput < 500) {
                    this.input = this.input*10 + parseInt(key.toString());
                } else {
                    this.input = parseInt(key.toString());
                }
                this.lastInput = Date.now();
                this.boxUpdate();
            };
        };

        if (this.selectedNode && this.hoverNode && this.selectedNode != this.hoverNode) {
            if (key == " " && this.input > 0) {
                this.selectedNode.addNode(this.hoverNode);
            } else if (key == "Backspace") {
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

        const dn = () => {
            if (this.selectedNode) {
                const t = environments[8];
                t.nodes.forEach((node) => {
                    if (node.next.has(this.selectedNode)) {
                        const n = node.next.get(this.selectedNode);
                        n.arrow.destroy();
                    }

                    if (this.selectedNode.next.has(node)) {
                        const n = this.selectedNode.next.get(node);
                        n.arrow.destroy();
                    }
                });

                this.selectedNode.kGroup.destroy();
                this.nodes.delete(this.selectedNode);
            };
        };

        buttons.delNode = dn;

        buttons.clear = () => {
            const t = environments[8];
            t.nodes.forEach((node) => {
                node.toggleSelect();
                dn();
            });
        };

        buttons.dfs_traverse = async () => {
            if (this.selectedNode) {
                this.activeAction = true

                const indicator = new Konva.Circle({
                    x : 0,
                    y : 0,
                    fill : "#666666",
                    stroke : "#666666",
                    width : 5,
                });

                this.layer.add(indicator);

                const marked = new Set();

                travel = async (node) => {
                    if (marked.has(node)) {
                        return; 
                    };

                    marked.add(node);

                    indicator.x(node.kGroup.x() + 40);
                    indicator.y(node.kGroup.y() - 8);
                    node.Box.fill("#ffffff")

                    await sleep(400);

                    const t = environments[8];
                    for (const node2 of t.nodes) {
                        if (node.next.has(node2)) {
                            await travel(node2);
                        };
                    };
                };

                await travel(this.selectedNode);

                indicator.destroy();

                this.activeAction = false;

                marked.forEach((e) => {
                    e.Box.fill('#c9daf8');
                });
            }
        };

        const translate = (l) => {
            let v = ""
            l.forEach((node) => {
                v = v + node.label.text() + ", ";
            });
            return "Fringe: [" + v.slice(0, -2) + "]";
        };

        buttons.bfs_traverse = async () => {
            if (this.selectedNode) {
                this.activeAction = true

                const indicator = new Konva.Circle({
                    x : 0,
                    y : 0,
                    fill : "#666666",
                    stroke : "#666666",
                    width : 5,
                });

                this.layer.add(indicator);

                const marked = new Set();
                const fringe = [];

                fringe.push(this.selectedNode);
                marked.add(this.selectedNode);

                while (fringe[0]) {
                    this.displayer.text(translate(fringe));
                    const node = fringe.shift();

                    indicator.x(node.kGroup.x() + 40);
                    indicator.y(node.kGroup.y() - 8);
                    node.Box.fill("#ffffff")

                    await sleep(600);

                    const t = environments[8];
                    for (const node2 of t.nodes) {
                        if (node.next.has(node2) && !marked.has(node2)) {
                            marked.add(node2);
                            fringe.push(node2);
                        };
                    };
                };

                indicator.destroy();

                this.activeAction = false;

                marked.forEach((e) => {
                    e.Box.fill('#c9daf8');
                });

                this.displayer.text("Fringe: []");
            }
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
            newButton.callback = () => {
                if (!this.activeAction) {
                    callback();
                };
            };
            this.uLayer.add(newButton.kGroup);

            buttons[key] = newButton;
            i++;
        });

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

        this.displayer.setAttr("text", "Fringe: []");
        this.displayer.setAttr("x", stage.width()/2 - 280);
        this.displayer.setAttr("y", stage.height() - 115);
        this.displayer.setAttr("fill", "#737070");
        this.displayer.setAttr("fontSize", 13);
        this.displayer.setAttr("fontStyle", "italic");
        this.displayer.setAttr("fontFamily", "DM Sans");

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
            node.kGroup.x(n[0] * 1.75 + 100);
            node.kGroup.y(n[1] * 1.5);
            starters.push(node);

            this.uLayer.add(node.kGroup);
        });

        for (let i = 0; i < this.st_nodes.length; i++) {
            this.st_nodes[i][2].forEach((e) => {
                starters[i].addNode(starters[e[0]]);
            });
        }
    },
};

// 9: Dijkstra's

const DJ_COL = {
    edgeDefault  : "#666666",
    edgeSettled  : "#222222",
    edgeRelax    : "#e040fb",
    nodeDefault  : "#c9daf8",
    nodeSettled  : "#ffffff",
    nodeCurrent  : "#e040fb",
    distInfinity : "∞",
    distColor    : "#e040fb",
};
 
class MinHeap {
    constructor() { this._h = []; }
    push(item) {
        this._h.push(item);
        this._bubbleUp(this._h.length - 1);
    }
    pop() {
        const top = this._h[0];
        const last = this._h.pop();
        if (this._h.length > 0) { this._h[0] = last; this._siftDown(0); }
        return top;
    }
    get size() { return this._h.length; }
    _bubbleUp(i) {
        while (i > 0) {
            const p = (i - 1) >> 1;
            if (this._h[p].priority <= this._h[i].priority) break;
            [this._h[p], this._h[i]] = [this._h[i], this._h[p]];
            i = p;
        }
    }
    _siftDown(i) {
        const n = this._h.length;
        while (true) {
            let s = i, l = 2*i+1, r = 2*i+2;
            if (l < n && this._h[l].priority < this._h[s].priority) s = l;
            if (r < n && this._h[r].priority < this._h[s].priority) s = r;
            if (s === i) break;
            [this._h[s], this._h[i]] = [this._h[i], this._h[s]];
            i = s;
        }
    }
}
 
function djInit(env, sourceNode) {
    if (env.selectedNode) {
        env.selectedNode.toggleSelect();
    }

    const nodeArr = [...env.nodes];          
 
    env.dj = {
        active      : true,
        done        : false,
        nodeArr,
        distTo      : new Map(),             
        edgeTo      : new Map(),             
        settled     : new Set(),             
        pq          : new MinHeap(),

        lastRelaxed : [],                    
        lastCurrent : null,                 
        stepCount   : 0,
    };
 
    nodeArr.forEach(n => {
        env.dj.distTo.set(n, Infinity);
        env.dj.edgeTo.set(n, null);
    });
    env.dj.distTo.set(sourceNode, 0);
    env.dj.pq.push({ priority: 0, node: sourceNode });
 
    djRefreshTable(env);
    djRefreshFringe(env);
    djRefreshNodeLabels(env);
    djRefreshEdgeColors(env);
}
 
function djStep(env) {
    const s = env.dj;
    if (s.done || s.pq.size === 0) {
        if (s.lastCurrent) {
            s.lastCurrent.Box.stroke("#666666");
            s.lastCurrent.Box.fill(DJ_COL.nodeSettled);
            s.lastCurrent = null;
        }
        s.done = true;
        djRefreshFringe(env);
        return;
    }
 
    s.lastRelaxed.forEach(({ from, to }) => {
        if (from.next.has(to)) {
            const conn = from.next.get(to);
            const inSPT = (s.edgeTo.get(to) === from && s.settled.has(to));
            
            conn.arrow.stroke(inSPT ? DJ_COL.edgeSettled : DJ_COL.edgeDefault);
            conn.arrow.fill (inSPT ? DJ_COL.edgeSettled : DJ_COL.edgeDefault);
        }
    });
    s.lastRelaxed = [];
 
    if (s.lastCurrent) {
        s.lastCurrent.Box.stroke("#666666");
        s.lastCurrent.Box.fill(DJ_COL.nodeSettled);
        s.lastCurrent = null;
    }
 
    let entry;
    do {
        if (s.pq.size === 0) { s.done = true; djRefreshFringe(env); return; }
        entry = s.pq.pop();
    } while (s.settled.has(entry.node));
 
    const u = entry.node;
    s.settled.add(u);
    s.lastCurrent = u;
    u.Box.stroke(DJ_COL.nodeCurrent);
 
    const pred = s.edgeTo.get(u);
    if (pred && pred.next.has(u)) {
        const conn = pred.next.get(u);
        conn.arrow.stroke(DJ_COL.edgeSettled);
        conn.arrow.fill (DJ_COL.edgeSettled);
        conn.arrow.strokeWidth(3.75);
    }
 
    env.nodes.forEach(v => {
        if (!u.next.has(v)) return;
        if (s.settled.has(v)) return;
 
        const conn  = u.next.get(v);
        const w     = conn.len;
        const newD  = s.distTo.get(u) + w;
 
        conn.arrow.stroke(DJ_COL.edgeRelax);
        conn.arrow.fill (DJ_COL.edgeRelax);
        s.lastRelaxed.push({ from: u, to: v });
 
        if (newD < s.distTo.get(v)) {
            s.distTo.set(v, newD);
            s.edgeTo.set(v, u);
            s.pq.push({ priority: newD, node: v });
        }
    });
 
    s.stepCount++;
    djRefreshTable(env);
    djRefreshFringe(env);
    djRefreshNodeLabels(env);
}
 
function djRefreshTable(env) {
    const s = env.dj;
    const lines = ["Node   distTo   edgeTo"];
    s.nodeArr.forEach(n => {
        const label  = n.label.text();
        const dist   = s.distTo.get(n);
        const distS  = dist === Infinity ? "∞" : dist.toString();
        const pred   = s.edgeTo.get(n);
        const predS  = pred ? pred.label.text() : "-";
        lines.push(`${label.padEnd(7)}${distS.padEnd(9)}${predS}`);
    });
    env.tableText.text(lines.join("\n"));
}
 
function djRefreshFringe(env) {
    const s = env.dj;
    if (s.done || s.pq.size === 0) {
        env.fringeText.text("Fringe: []  (done)");
        return;
    }

    const best = new Map();
    s.pq._h.forEach(e => {
        if (!best.has(e.node) || e.priority < best.get(e.node))
            best.set(e.node, e.priority);
    });

    const items = [];
    best.forEach((d, n) => {
        if (!s.settled.has(n))
            items.push({ node: n, d });
    });
    items.sort((a, b) => a.d - b.d);
    const str = items.map(i => {
        const lbl = i.node.label.text();
        const d   = i.d === Infinity ? "∞" : i.d;
        return `(${lbl}: ${d})`;
    }).join(", ");
    env.fringeText.text("Fringe: [" + str + "]");
}
 
function djRefreshNodeLabels(env) {
    const s = env.dj;
    s.nodeArr.forEach(n => {
        const d = s.distTo.get(n);
        const dStr = d === Infinity ? "∞" : d.toString();
        if (!n._distLabel) {
            n._distLabel = new Konva.Text({
                x: 12, y: -16,
                width: 42,
                text: "",
                fontSize: 13,
                align: "center",
                fill: DJ_COL.distColor,
                fontFamily: "DM Sans",
                fontStyle: "bold",
            });
            
            n.kGroup.add(n._distLabel);
        }
        n._distLabel.text(dStr);
    });
}
 
function djRefreshEdgeColors(env) {
    env.nodes.forEach(from => {
        from.Box.fill(DJ_COL.nodeDefault);
        env.nodes.forEach(to => {
            if (from.next.has(to)) {
                const conn = from.next.get(to);
                conn.arrow.stroke(DJ_COL.edgeDefault);
                conn.arrow.fill (DJ_COL.edgeDefault);
                conn.arrow.strokeWidth(1.7);
            }
        });
    });
}
 
function djAddButtons(env, uLayer, stage) {
    env.tableText = new Konva.Text({
        x: 20, y: 20,
        text: "Run Dijkstra to see results",
        fontSize: 13,
        fill: "#555555",
        fontFamily: "DM Mono, monospace",
        lineHeight: 1.6,
    });
    uLayer.add(env.tableText);
 
    env.fringeText = new Konva.Text({
        x: stage.width()/2 - 280,
        y: stage.height() - 115,
        text: "Fringe: (not started)",
        fontSize: 13,
        fill: "#555555",
        fontFamily: "DM Mono, monospace",
        fontStyle: "italic",
    });
    uLayer.add(env.fringeText);
 
    function smallBtn(label, x, y, w, cb) {
        const g    = new Konva.Group({ x, y });
        const rect = new Konva.Rect({
            width: w, height: 25,
            fill: "#c0d4e03f", stroke: "#666666",
            strokeWidth: 1, cornerRadius: 5,
        });
        const txt = new Konva.Text({
            width: w, height: 25,
            text: label,
            fontSize: 12,
            align: "center", verticalAlign: "middle",
            fill: "#444444",
            fontFamily: "DM Sans",
        });
        g.add(rect); g.add(txt);
        g.on("mouseenter", () => rect.fill("#b0c8d860"));
        g.on("mouseleave", () => rect.fill("#c0d4e03f"));
        g.on("click", cb);
        uLayer.add(g);
        return { g, rect, txt };
    }
 
    const bY  = stage.height() - 55;
    const bX0 = stage.width()/2 - 280;
 
    smallBtn("▶ Start Dijkstra", bX0, bY, 140, () => {
        const first = env.selectedNode;
        if (!first) return;

        djRefreshEdgeColors(env);
        djInit(env, first);
    });
 
    smallBtn("Step →", bX0 + 150, bY, 90, () => {
        if (!env.dj || !env.dj.active) return;
        djStep(env);
    });
 
    smallBtn("Run All", bX0 + 250, bY, 90, () => {
        if (!env.dj || !env.dj.active) return;
        while (!env.dj.done && env.dj.pq.size > 0) djStep(env);
        env.dj.done = true;
        djRefreshFringe(env);
    });
 
    smallBtn("↺ Reset", bX0 + 350, bY, 80, () => {
        if (!env.dj) return;
        env.dj.nodeArr.forEach(n => {
            if (n._distLabel) n._distLabel.text("");
            n.Box.stroke("#666666");
        });
        djRefreshEdgeColors(env);
        env.tableText.text("Run Dijkstra to see results");
        env.fringeText.text("Fringe: (not started)");
        env.dj.active = false;
    });
}

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
    lastInput : 0,

    dj : {
        active : false,
    },

    points : [
        [0, 16],
        [21, 0],
        [42, 16],
        [21, 32],
    ],

    st_nodes : [
        // A (0)
        [75, 215, [[1, 2], [2, 1]]],
        // B (1)
        [220, 130, [[3, 11], [4, 3], [2, 5]]],
        // C (2)
        [220, 295, [[5, 15]]],
        // D (3)
        [390, 45, [[4, 2]]],
        // E (4)
        [390, 215, [[2, 1], [6, 5], [5, 4]]],
        // F (5)
        [390, 340, []],
        // G (6)
        [520, 215, [[3, 1], [5, 1]]],
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

                        connection.txt.x((node.kGroup.x() + p[0] + node2.kGroup.x() + pi[0])/2 - 18);
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
            fill : "#c9daf8",
            stroke : "#666666",
        });

        N.label = new Konva.Text({
            x : 0,
            y : 0,
            width : 42,
            height : 32,
            text : String.fromCharCode((this.nodes.size % 26) + 65) + (Math.floor(this.nodes.size / 26) || "").toString(),
            fontSize : 15,
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
                    strokeWidth : 1.7,
                    points : [],
                });

                const nLabel = new Konva.Text({
                    x : -18,
                    y : -9,
                    width : 36,
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

                nArrow.moveToBottom();
            };
            this.updateArrows();
        }

        N.delNode = (node) => {
            if (N.next.has(node)) {
                const n = N.next.get(node);
                n.arrow.destroy();
                n.txt.destroy();
                n.cut.destroy();
                N.next.delete(node);
            }
            this.updateArrows();
        }

        N.kGroup.on("dragmove", this.updateArrows);

        N.label.on("mouseenter", () => {
            if (environments[9].dj.active) {
                return;
            }

            this.hoverNode = N;
            N.Box.setAttr("fill", "#d4e0f5");
        });

        N.label.on("mouseout", () => {
            if (environments[9].dj.active) {
                return;
            }

            this.hoverNode = null;
            N.Box.setAttr("fill", "#c9daf8");
        });

        N.kGroup.on("click", () => {
            if (environments[9].dj.active) {
                return;
            }

            N.toggleSelect();
        });

        N.kGroup.add(N.Box);
        N.kGroup.add(N.label);
        this.nodes.add(N);

        return N
    },

    keyDown : function(key) {
        if (environments[9].dj.active) {
            return;
        }

        if (key.length == 1 && key != " " && Number.isFinite(+key)) {
            if (this.isInputHover) {
                if (Date.now() - this.lastInput < 500) {
                    this.input = this.input*10 + parseInt(key.toString());
                } else {
                    this.input = parseInt(key.toString());
                }
                this.lastInput = Date.now();
                this.boxUpdate();
            };
        };

        if (this.selectedNode && this.hoverNode && this.selectedNode != this.hoverNode) {
            if (key == " " && this.input > 0) {
                this.selectedNode.addNode(this.hoverNode, this.input);
            } else if (key == "Backspace") {
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

        const dn = () => {
            if (this.selectedNode) {
                const t = environments[9];
                t.nodes.forEach((node) => {
                    if (node.next.has(this.selectedNode)) {
                        const n = node.next.get(this.selectedNode);
                        n.arrow.destroy();
                        n.cut.destroy();
                        n.txt.destroy();
                    }

                    if (this.selectedNode.next.has(node)) {
                        const n = this.selectedNode.next.get(node);
                        n.arrow.destroy();
                        n.cut.destroy();
                        n.txt.destroy();
                    }
                });

                this.selectedNode.kGroup.destroy();
                this.nodes.delete(this.selectedNode);
            };
        };

        buttons.delNode = dn;

        buttons.clear = () => {
            const t = environments[9];
            t.nodes.forEach((node) => {
                node.toggleSelect();
                dn();
            });
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
            newButton.callback = () => {
                if (!this.dj.active) {
                    callback();
                };
            };
            this.uLayer.add(newButton.kGroup);

            buttons[key] = newButton;
            i++;
        });

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
            node.kGroup.x(n[0] * 1.25 + 100);
            node.kGroup.y(n[1]);
            starters.push(node);

            this.uLayer.add(node.kGroup);
        });

        for (let i = 0; i < this.st_nodes.length; i++) {
            this.st_nodes[i][2].forEach((e) => {
                starters[i].addNode(starters[e[0]], e[1]);
            });
        }

        djAddButtons(this, this.uLayer, stage);
    },
};

// Start

renderSidebar();