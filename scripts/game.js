let selectedobjs = [];
let connections = [];
let objectCounter = 0;

const objProperties = {
    'server': { name: 'server', price: 1000, connection_count: 0, status: 'off' },
    'generator': { name: 'generator', price: 500, connection_count: 0, status: 'off' },
    'router': { name: 'router', price: 300, connection_count: 0, status: 'on' },
    'firewall': { name: 'firewall', price: 5000, connection_count: 0, status: 'on' },
    'datacenter': { name: 'datacenter', price: 90000, connection_count: 0, status: 'on' },
    'checkpoint': { name: 'checkpoint', price: 20000, connection_count: 0, status: 'on' }
};

const cloud = document.getElementById('cloud-obj');
cloud.dataset.properties = JSON.stringify({"name":"Cloud","price":0,"connection_count":0});
handleDrag(cloud);

const powerline = document.getElementById('powerline-obj');
powerline.dataset.properties = JSON.stringify({"name":"powerline","price":0,"connection_count":0});
handleDrag(powerline);

function handleDrag(element) {
    let isDragging = false;
    let offsetX, offsetY;
    let startX, startY;

    element.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        startY = e.clientY;

        isDragging = false;
        offsetX = e.clientX - element.getBoundingClientRect().left;
        offsetY = e.clientY - element.getBoundingClientRect().top;
        element.style.cursor = 'grabbing';

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    function onMouseMove(e) {
        if (!isDragging) {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            if (Math.sqrt(dx * dx + dy * dy) > 5) {
                isDragging = true;
            }
        }
        if (isDragging) {
            // remove the tooltip if it has one
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) tooltip.remove();
            
            element.style.left = `${e.clientX - offsetX}px`;
            element.style.top = `${e.clientY - offsetY}px`;

            updateConnections(element);
        }
    }

    function onMouseUp(e) {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        // Select Object
        if (!isDragging) {
            element.classList.add('outline');
            selectedobjs.push(element);
            console.log(element.dataset.properties);

            if (selectedobjs.length === 2) {
                if (selectedobjs[0] !== selectedobjs[1]) {
                    createConnection(selectedobjs[0], selectedobjs[1]);
                }
                selectedobjs[0].classList.remove('outline');
                selectedobjs[1].classList.remove('outline');
                selectedobjs = [];
            }
        }
        element.style.cursor = 'grab';
    }
}

function createConnection(obj1, obj2) {
    const connectionExists = connections.find(connection => 
        (connection.obj1 === obj1 && connection.obj2 === obj2) ||
        (connection.obj1 === obj2 && connection.obj2 === obj1)
    );
    // Load properties
    const obj1Properties = JSON.parse(obj1.dataset.properties);
    const obj2Properties = JSON.parse(obj2.dataset.properties);

    if (connectionExists) {
        obj1Properties.connection_count -= 1;
        obj2Properties.connection_count -= 1;
        const svg = document.getElementById('connections');
        if (connectionExists.line) {
            svg.removeChild(connectionExists.line);
        }
        connections = connections.filter(connection => connection !== connectionExists);
    } else {
        obj1Properties.connection_count += 1;
        obj2Properties.connection_count += 1;

        const svg = document.getElementById('connections');
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');

        line.setAttribute('x1', obj1.getBoundingClientRect().left + obj1.clientWidth / 2);
        line.setAttribute('y1', obj1.getBoundingClientRect().top + obj1.clientHeight / 2);
        line.setAttribute('x2', obj2.getBoundingClientRect().left + obj2.clientWidth / 2);
        line.setAttribute('y2', obj2.getBoundingClientRect().top + obj2.clientHeight / 2);
        line.setAttribute('stroke', 'black');
        line.setAttribute('stroke-width', '2');

        svg.appendChild(line);
        connections.push({ obj1, obj2, line });
    }
    // Save properties
    obj1.dataset.properties = JSON.stringify(obj1Properties);
    obj2.dataset.properties = JSON.stringify(obj2Properties);
}

function updateConnections(movedobj) {
    connections.forEach(connection => {
        if (connection.obj1 === movedobj || connection.obj2 === movedobj) {
            const obj1Rect = connection.obj1.getBoundingClientRect();
            const obj2Rect = connection.obj2.getBoundingClientRect();

            connection.line.setAttribute('x1', obj1Rect.left + connection.obj1.clientWidth / 2);
            connection.line.setAttribute('y1', obj1Rect.top + connection.obj1.clientHeight / 2);
            connection.line.setAttribute('x2', obj2Rect.left + connection.obj2.clientWidth / 2);
            connection.line.setAttribute('y2', obj2Rect.top + connection.obj2.clientHeight / 2);
        }
    });
}

const objs = document.querySelectorAll('.menu-obj');
objs.forEach(obj => {
    obj.addEventListener('mousedown', (e) => {
        objectCounter++ // New object
        const clone = obj.cloneNode(true);
        clone.style.position = 'relative';        
        // Create Div
        const container = document.createElement('div');
        container.className = 'draggable';        
        container.style.position = 'absolute';
        container.style.left = `${e.clientX - obj.width / 2}px`;
        container.style.top = `${e.clientY - obj.height / 2}px`;
        container.style.cursor = 'grabbing';
        // Set properties of object (div)
        const objType = getobjType(obj.src);
        const properties = { id: objectCounter, ...objProperties[objType] };
        container.dataset.properties = JSON.stringify(properties);
        if (properties.status === 'off') {
            container.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
        }
        let text = '0/6';
        if (properties.name === 'datacenter' || properties.name === 'server' || properties.name === 'checkpoint') {
            text = '';
        } else if (properties.name === 'generator') {
            text = '0/5';
        }
        // Create Text
        const overlapText = document.createElement('p');
        overlapText.className = 'overlap-text';
        overlapText.textContent = text;
        overlapText.id = 'obj-text' + objectCounter;
        // Add the new div to the DOM
        container.appendChild(clone); // Add icon
        container.appendChild(overlapText); // Add text
        document.body.appendChild(container);
        handleDrag(container);
    });
});

function getobjType(src) {
    if (src.includes('server')) return 'server';
    if (src.includes('generator')) return 'generator';
    if (src.includes('router')) return 'router';
    if (src.includes('firewall')) return 'firewall';
    if (src.includes('datacenter')) return 'datacenter';
    if (src.includes('checkpoint')) return 'checkpoint';
    return 'unknown';
}
