document.addEventListener("DOMContentLoaded", function () {
    const TOGGLE_BUTTON_ID = 'bionic-reading-toggle';
    const TEXT_NODE = 3;
    const ELEMENT_NODE = 1;
    const TEXT_CONTAINERS = ["P", "DIV"];

    const toggleButton = document.getElementById(TOGGLE_BUTTON_ID);

    function makeBold(word) {
        const boldLength = word.length <= 2 ? 1 :
            word.length <= 4 ? 2 :
                word.length <= 6 ? 3 :
                    word.length <= 8 ? 4 :
                        word.length <= 10 ? 5 :
                            word.length <= 12 ? 6 : 7;
        return `<b class="bionic-reading">${word.substring(0, boldLength)}</b><span class="transparent">${word.substring(boldLength)}</span>`;
    }

    function processTextNodes(node) {
        if (node.nodeType === TEXT_NODE) {
            const words = node.nodeValue.split(/\b/);
            const newContent = words.map(word => /\w/.test(word) ? makeBold(word) : word).join('');
            if (/\w/.test(node.nodeValue)) {
                const newNode = document.createElement('span');
                newNode.innerHTML = newContent;
                node.parentNode.replaceChild(newNode, node);
            } else {
                node.nodeValue = newContent;
            }
        } else if (node.nodeType === ELEMENT_NODE && TEXT_CONTAINERS.includes(node.nodeName)) {
            node.childNodes.forEach(child => processTextNodes(child));
        }
    }

    function restoreOriginalText(node) {
        if (node.nodeType === ELEMENT_NODE && TEXT_CONTAINERS.includes(node.nodeName)) {
            const spans = node.querySelectorAll('span');
            spans.forEach(span => {
                if (span.querySelector('b.bionic-reading')) {
                    const textNode = document.createTextNode(span.textContent);
                    span.parentNode.replaceChild(textNode, span);
                }
            });
        }
    }

    function toggleBionicReading() {
        const demoRrElements = document.querySelectorAll('.demo-rr ' + TEXT_CONTAINERS.join(', .demo-rr '));
        demoRrElements.forEach(element => {
            if (element.classList.contains('bionic-processed')) {
                element.classList.remove('bionic-processed');
                restoreOriginalText(element);
            } else {
                element.classList.add('bionic-processed');
                processTextNodes(element);
            }
        });
        toggleButton.classList.toggle('active');
        localStorage.setItem('bionicReadingEnabled', toggleButton.classList.contains('active'));
    }

    toggleButton.addEventListener('click', toggleBionicReading);

    if (localStorage.getItem('bionicReadingEnabled') === 'true') {
        toggleButton.checked = true;
        toggleBionicReading();
    }
});

const style = document.createElement('style');
style.innerHTML = `
    .transparent {
        opacity: 1; /* Adjust the transparency level as needed */
    }
    .bionic-reading {
        font-weight: bold;
    }
`;
document.head.appendChild(style);