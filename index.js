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
    { id: 1, label: 'LinkedLists' },
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
        const el = document.createElement('div');
        el.className = 'sidebar-item' + (item.id === activeId ? ' active' : '');
        el.innerHTML = `
        <span class="sidebar-item-number">${i + 1}</span>
        <span class="sidebar-item-label">${item.label}</span>
      `;
        const environment = environments[item.id];
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
            stage.add(environment.layer);
            stage.add(environment.uLayer);
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

// Tool Tip

const lead = new Konva.Layer();
stage.add(lead);

const textBox = new Konva.Rect({
    x : stage.width() - 330,
    y : 25,
    width : 320,
    height : 50,
    fill : "#aecee08e",
    stroke : "#666666",
    cornerRadius : 8,
})

const textLabel = new Konva.Text({
    x : stage.width() - 330,
    y : 25,
    width : 320,
    height : 50,
    fill : "#666666",
    align : "center",
    verticalAlign : "middle",
})

lead.add(textBox);
lead.add(textLabel);

const tooltip = {
    layer : new Konva.Layer(),
    text : "",

    setText : (txt) => {
        this.text = txt;
        textLabel.setAttr("text", txt);
        if (txt == "") {
            textBox.hide();
            textLabel.show();
        } else {
            const newWidth = textLabel.textWidth + 20;

            textBox.setAttr("width", newWidth);
            textLabel.setAttr("width", newWidth);
            textBox.x(stage.width() - newWidth - 30);
            textLabel.x(stage.width() - newWidth - 30);

            textBox.show();
            textLabel.show();
        }
    },
};

tooltip.setText("");


// 1: Linked Lists

const e1Layer = new Konva.Layer();
const e1uLayer = new Konva.Layer();
environments[1] = {
    started : false,
    links : new Set(),
    layer : e1Layer,
    uLayer : e1uLayer,
    selectedLink : null,
    pauseActions: false,
    hoverLink : null,

    renderer : new Konva.Animation((frame) => {
        if (activeId == 1) {
            const layer = e1Layer;
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
    }, e1Layer),

    updateArrows : function() {
        environments[1].links.forEach((link) => {
            const arrow = link.arrow;
            arrow[link.next ? "show" : "hide"]();
            if (link.next) {
                const nextGroup = link.next.kGroup;
                arrow.points([60, 20, nextGroup.x() - link.kGroup.x(), nextGroup.y() + 20 - link.kGroup.y()]);
            }
        })
    },

    keyDown : function(key) {
        if (this.hoverLink && key.length == 1) {
            this.hoverLink.setValue(key);
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
        });

        const valueInd = new Konva.Text({
            x : 0,
            y : 0,
            width : 40,
            height : 40,
            text : "",
            fontSize : 10,
            align : "center",
            verticalAlign : "middle",
            fill : "#252525",
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
                this.selectedLink = L;
            } else {
                this.selectedLink = null;
            }
        };

        L.setValue = (val) => {
            L.value = val;
            valueInd.setAttr("text", val.toString());
        };

        L.kGroup.on("click", () => {
            L.toggleSelect();
        });

        L.kGroup.on("dragmove", this.updateArrows);

        valueInd.on("mouseenter", () => {
            this.hoverLink = L;
            itemBox.setAttr("fill", "#e4dcf7");
            tooltip.setText("press key to enter value");
        });

        valueInd.on("mouseout", () => {
            this.hoverLink = null;
            itemBox.setAttr("fill", "#d9d2e9");
            tooltip.setText("");
        });

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

                this.pauseActions = false;
                this.updateArrows();
            }
        };

        buttons.removeFirst = async () => {

        };

        buttons.removeLast = async () => {

        };

        buttons.get = async () => {

        };

        buttons.size = async () => {

        };

        let i = 0
        Object.keys(buttons).forEach((key) => {
            const callback = buttons[key];
            const newButton = makeButton();

            newButton.setX(40 + i*160);
            newButton.setY(570);
            newButton.setWidth(140);
            newButton.setHeight(35);
            newButton.setText(key + "()");
            newButton.callback = callback;
            this.uLayer.add(newButton.kGroup);

            buttons[key] = newButton;
            i++;
        });

        this.layer.add(starting.kGroup);
        this.renderer.start();
    },
};

// 10: Dijkstra's

const e2Layer = new Konva.Layer();
const e2uLayer = new Konva.Layer();
environments[9] = {
    started : false,
    items : {},
    layer : e2Layer,
    uLayer : e2uLayer,
    
    start : function() {
        
    },
};

// Start

renderSidebar();