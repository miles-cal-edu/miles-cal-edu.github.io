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
                    }
                }
                environment.layer.show();
            });
            stage.add(environment.layer);
            if (!environment.started) {
                environment.started = true;
                environment.start();
            }
            environment.layer.hide();
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
    draggable: false,
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
    e.evt.preventDefault();
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    const mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
    };
    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const newScale = Math.max(Math.min(10, direction > 0 ? oldScale * scaleBy : oldScale / scaleBy), 0.1);
    console.log(newScale);
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

// 1: Linked Lists

environments[1] = {
    started : false,
    links : new Set(),
    layer : new Konva.Layer(),
    selectedLink : null,
    pauseActions: false,

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

        L.kGroup.on("click", () => {
            L.toggleSelect();
        });

        L.kGroup.on("dragmove", this.updateArrows);

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
            this.layer.add(newButton.kGroup);

            buttons[key] = newButton;
            i++;
        });

        this.layer.add(starting.kGroup);
    },
};

// 10: Dijkstra's

environments[9] = {
    started : false,
    items : {},
    layer : new Konva.Layer(),
    
    start : function() {
        
    },
};

// Start

renderSidebar();