// State variables
let state = {
    bgColor: 'white',
    textColor: 'black',
    authorColor: 'rgba(0, 0, 0, 0.8)',
    showWatermark: true,
    showAuthor: true,
    fonts: 'Amethysta',
    fontSize: 25,
    height: 1500,
    width: 1500,
    textOpacity: 1,
    alignment: 'left',
    quote: { text: '', author: '' }
};

// Signature Styles
const SigStyles = {
    'signature4': {
        fontFamily: 'Shadows Into Light',
        color: 'black',
        textAlign: 'center',
        background: 'linear-gradient(to right, #f83600 0%, #f9d423 100%)',
        showWatermark: true,
        showAuthor: true
    },
    'signature5': {
        fontFamily: 'Tangerine',
        color: 'black',
        textAlign: 'center',
        background: 'linear-gradient(-225deg, #2CD8D5 0%, #6B8DD6 48%, #8E37D7 100%)',
        showWatermark: true,
        showAuthor: true
    },
    'signature6': {
        fontFamily: 'Caveat',
        color: 'black',
        textAlign: 'center',
        background: 'linear-gradient(-225deg, #5271C4 0%, #B19FFF 48%, #ECA1FE 100%)',
        showWatermark: true,
        showAuthor: true
    },
    'signature7': {
        fontFamily: 'Dancing Script',
        color: 'black',
        textAlign: 'center',
        background: 'linear-gradient(-225deg, #FFE29F 0%, #FFA99F 48%, #FF719A 100%)',
        showWatermark: true,
        showAuthor: true
    },
    'signature8': {
        fontFamily: 'Great Vibes',
        color: 'black',
        textAlign: 'center',
        background: 'linear-gradient(-225deg, #22E1FF 0%, #1D8FE1 48%, #625EB1 100%)',
        showWatermark: true,
        showAuthor: true
    },
    'signature9': {
        fontFamily: 'Indie Flower',
        color: 'black',
        textAlign: 'center',
        background: 'linear-gradient(-225deg, #5D9FFF 0%, #B8DCFF 48%, #6BBBFF 100%)',
        showWatermark: true,
        showAuthor: true
    },
    'signature1': {
        fontFamily: 'Pacifico',
        color: 'black',
        textAlign: 'center',
        background: 'linear-gradient(90deg, hsla(235, 100%, 78%, 1) 0%, hsla(222, 77%, 33%, 1) 100%)',
        showWatermark: true,
        showAuthor: true
    },
    'signature2': {
        fontFamily: 'Parisienne',
        color: 'black',
        textAlign: 'center',
        background: 'linear-gradient(0deg, hsla(228, 17%, 53%, 1) 0%, hsla(229, 28%, 88%, 1) 100%)',
        showWatermark: true,
        showAuthor: true
    },
    'signature10': {
        fontFamily: 'Sacramento',
        color: 'white',
        textAlign: 'center',
        background: 'linear-gradient(to right, #ec77ab 0%, #7873f5 100%)',
        showWatermark: true,
        showAuthor: true
    },
    'signature11': {
        fontFamily: 'Sacramento',
        color: 'white',
        textAlign: 'center',
        background: 'linear-gradient(to top, #cc208e 0%, #6713d2 100%)',
        showWatermark: true,
        showAuthor: true
    },
    'signature12': {
        fontFamily: 'Sacramento',
        color: 'white',
        textAlign: 'center',
        background: 'linear-gradient(to top, #000000, #e74c3c)',
        showWatermark: true,
        showAuthor: true
    },
    'signature13': {
        fontFamily: 'Sacramento',
        color: 'white',
        textAlign: 'center',
        background: 'linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.15) 100%), radial-gradient(at top center, rgba(255,255,255,0.40) 0%, rgba(0,0,0,0.40) 120%) #989898',
        showWatermark: true,
        showAuthor: true
    }
};

// Background colors
const colors = [
    '#d62828', '#14213d', '#03045e', '#073b4c', '#ee9b00', 'red', 'blue', 'green', 'yellow', 'purple', 'pink', 'black', 'white',
    'linear-gradient(to right, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
    'linear-gradient(to right, #a1c4fd 0%, #c2e9fb 100%)',
    'linear-gradient(to right, #667eea 0%, #764ba2 60%)',
    'linear-gradient(to right, #ff758c 0%, #ff7eb3 100%)',
    'linear-gradient(to right, #8e2de2, #4a00e0)',
    'linear-gradient(to right, #FFD194, #D1913C)',
    'linear-gradient(to top, #005aa7, #fffde4)',
    'linear-gradient(to top, #a8c0ff, #3f2b96)'
];

// Text colors
const textColors = ['#d62828', '#14213d', '#03045e', '#073b4c', '#ee9b00', 'purple', '#003566', '#293241', 'white', 'black'];

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadQuote();
    initializeColorSelectors();
    initializeSignatureStyles();
    setupEventListeners();
    updateWatermark();
    
    // Set initial width based on container
    const container = document.getElementById('print');
    if (state.width === 0 || state.width === 1500) {
        state.width = container.offsetWidth;
        document.getElementById('widthInput').value = state.width;
    }
    // Initialize text opacity control if present
    const opacitySliderInit = document.getElementById('textOpacitySlider');
    if (opacitySliderInit) {
        opacitySliderInit.value = Math.round(state.textOpacity * 100);
        document.getElementById('quoteContent').style.opacity = state.textOpacity;
        document.getElementById('authorContent').style.opacity = state.textOpacity;
    }
});

// Load quote from URL parameter
function loadQuote() {
    const url = new URL(window.location.href);
    const quoteId = url.pathname.split("/").pop();
    
    // For demo purposes, use sample data
    // In production, fetch from API
    state.quote = {
        text: 'The only way to do great work is to love what you do.',
        author: 'Steve Jobs'
    };
    
    document.getElementById('quoteContent').textContent = state.quote.text;
    document.getElementById('authorContent').textContent = ' - ' + state.quote.author;
}

// Initialize color selectors
function initializeColorSelectors() {
    // Background colors
    const bgSelector = document.getElementById('bgColorSelector');
    bgSelector.innerHTML = '';
    colors.forEach(color => {
        const button = document.createElement('button');
        button.className = 'colorButton';
        button.style.background = color;
        button.onclick = () => setBgColor(color);
        if (state.bgColor === color) {
            button.innerHTML = '<span class="checkmark">✔</span>';
        }
        bgSelector.appendChild(button);
    });
    
    // Add color input
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = state.bgColor;
    colorInput.onchange = (e) => setBgColor(e.target.value);
    bgSelector.appendChild(colorInput);

    // Text colors
    const textSelector = document.getElementById('textColorSelector');
    textSelector.innerHTML = '';
    textColors.forEach(color => {
        const button = document.createElement('button');
        button.className = 'colorButton';
        button.style.background = color;
        button.onclick = () => setTextColor(color);
        if (state.textColor === color) {
            button.innerHTML = '<span class="checkmark">✔</span>';
        }
        textSelector.appendChild(button);
    });
    
    // Add color input for text
    const textColorInput = document.createElement('input');
    textColorInput.type = 'color';
    textColorInput.value = state.textColor;
    textColorInput.onchange = (e) => setTextColor(e.target.value);
    textSelector.appendChild(textColorInput);
}

// Initialize signature styles
function initializeSignatureStyles() {
    const sigSelector = document.getElementById('signatureSelector');
    sigSelector.innerHTML = '';
    
    Object.keys(SigStyles).forEach(sigStyle => {
        const button = document.createElement('button');
        button.className = 'colorButton';
        button.style.fontSize = '20px';
        button.style.fontFamily = SigStyles[sigStyle].fontFamily;
        button.style.color = SigStyles[sigStyle].color;
        button.style.background = SigStyles[sigStyle].background;
        button.textContent = 'A';
        button.onclick = () => applySigStyle(sigStyle);
        sigSelector.appendChild(button);
    });
}

// Apply signature style
function applySigStyle(sigStyle) {
    const style = SigStyles[sigStyle];
    state.fonts = style.fontFamily;
    state.textColor = style.color;
    state.bgColor = style.background;
    state.showWatermark = style.showWatermark;
    state.showAuthor = style.showAuthor;
    state.alignment = style.textAlign;
    
    updateQuoteDisplay();
    updateWatermark();
}

// Set background color
function setBgColor(color) {
    state.bgColor = color;
    document.getElementById('print').style.background = color;
    initializeColorSelectors(); // Refresh to show checkmark
}

// Set text color
function setTextColor(color) {
    state.textColor = color;
    document.getElementById('quoteContent').style.color = color;
    document.getElementById('authorContent').style.color = color;
    document.querySelector('.BottomNavigationAction[onclick*="textColorPanel"]').querySelector('i').style.color = color;
    initializeColorSelectors(); // Refresh to show checkmark
}

// Set alignment
function setAlignment(alignment) {
    state.alignment = alignment;
    document.getElementById('quoteContent').style.textAlign = alignment;
    document.getElementById('authorDiv').style.textAlign = alignment;
    updateWatermark();
}

// Update quote display
function updateQuoteDisplay() {
    const container = document.getElementById('print');
    const quoteContent = document.getElementById('quoteContent');
    const authorDiv = document.getElementById('authorDiv');
    
    container.style.fontFamily = state.fonts;
    container.style.background = state.bgColor;
    quoteContent.style.color = state.textColor;
    quoteContent.style.fontSize = state.fontSize + 'px';
    quoteContent.style.textAlign = state.alignment;
    quoteContent.style.opacity = state.textOpacity;
    authorDiv.style.color = state.textColor;
    authorDiv.style.fontSize = state.fontSize + 'px';
    authorDiv.style.textAlign = state.alignment;
    authorDiv.style.opacity = state.textOpacity;
}

// Update watermark display
function updateWatermark() {
    const watermark = document.getElementById('watermark');
    const isDefault = state.bgColor === 'white' && state.textColor === 'black' && state.alignment === 'left';
    
    if (!state.showWatermark) {
        watermark.style.display = 'none';
    } else {
        watermark.style.display = 'block';
        if (isDefault) {
            watermark.innerHTML = 'WisdomWise - Signature Style <i class="fas fa-check-circle"></i>';
        } else {
            watermark.innerHTML = 'WisdomWise';
        }
    }
}

// Setup event listeners
function setupEventListeners() {
    // Font size slider
    document.getElementById('fontSizeSlider').addEventListener('change', (e) => {
        state.fontSize = parseInt(e.target.value);
        updateQuoteDisplay();
    });
    
    // Font selector
    document.getElementById('fontSelect').addEventListener('change', (e) => {
        state.fonts = e.target.value;
        updateQuoteDisplay();
    });
    
    // Watermark toggle
    document.getElementById('toggleWatermark').addEventListener('click', () => {
        state.showWatermark = !state.showWatermark;
        const btn = document.getElementById('toggleWatermark');
        btn.textContent = state.showWatermark ? 'Hide Watermark' : 'Show Watermark';
        updateWatermark();
    });
    
    // Author toggle
    document.getElementById('toggleAuthor').addEventListener('click', () => {
        state.showAuthor = !state.showAuthor;
        const btn = document.getElementById('toggleAuthor');
        btn.textContent = state.showAuthor ? 'Hide Author' : 'Show Author';
        document.getElementById('authorDiv').style.display = state.showAuthor ? 'block' : 'none';
    });
    
    // Height input
    document.getElementById('heightInput').addEventListener('change', (e) => {
        state.height = parseInt(e.target.value);
        document.getElementById('selectSize').value = 'free-size';
        const container = document.getElementById('print');
        container.style.height = state.height + 'px';
    });
    
    // Width input
    document.getElementById('widthInput').addEventListener('change', (e) => {
        state.width = parseInt(e.target.value);
        document.getElementById('selectSize').value = 'free-size';
        const container = document.getElementById('print');
        container.style.width = state.width + 'px';
    });
    
    // Size selector
    document.getElementById('selectSize').addEventListener('change', (e) => {
        handleSize(e.target.value);
    });

    // Make quote and author editable on click
    const quoteEl = document.getElementById('quoteContent');
    const authorEl = document.getElementById('authorContent');

    function enableEditing(el) {
        el.setAttribute('contenteditable', 'true');
        el.focus();
        // place caret at end
        document.execCommand('selectAll', false, null);
        document.getSelection().collapseToEnd();
    }

    quoteEl.addEventListener('click', (e) => {
        enableEditing(quoteEl);
    });

    authorEl.addEventListener('click', (e) => {
        enableEditing(authorEl);
    });

    // Save edits on blur
    quoteEl.addEventListener('blur', (e) => {
        state.quote.text = quoteEl.textContent.trim();
        quoteEl.removeAttribute('contenteditable');
    });
    authorEl.addEventListener('blur', (e) => {
        state.quote.author = authorEl.textContent.replace(/^[-\s]+/, '').trim();
        authorEl.removeAttribute('contenteditable');
    });

    // Text opacity slider - live updates on input
    const opacitySlider = document.getElementById('textOpacitySlider');
    if (opacitySlider) {
        opacitySlider.addEventListener('input', (e) => {
            const val = parseInt(e.target.value, 10);
            state.textOpacity = Math.max(0, Math.min(1, val / 100));
            // Apply live
            quoteEl.style.opacity = state.textOpacity;
            authorEl.style.opacity = state.textOpacity;
        });
    }

    // Track manual resize of container using ResizeObserver (updates width/height inputs)
    const containerEl = document.getElementById('print');
    if (window.ResizeObserver) {
        const ro = new ResizeObserver(entries => {
            for (let entry of entries) {
                const cr = entry.contentRect;
                state.width = Math.round(cr.width);
                state.height = Math.round(cr.height);
                const wInput = document.getElementById('widthInput');
                const hInput = document.getElementById('heightInput');
                if (wInput) wInput.value = state.width;
                if (hInput) hInput.value = state.height;
            }
        });
        ro.observe(containerEl);
    } else {
        // fallback: update on mouseup
        window.addEventListener('mouseup', () => {
            state.width = containerEl.offsetWidth;
            state.height = containerEl.offsetHeight;
            document.getElementById('widthInput').value = state.width;
            document.getElementById('heightInput').value = state.height;
        });
    }
}

// Handle size changes
function handleSize(postSize) {
    const container = document.getElementById('print');
    
    switch (postSize) {
        case 'square':
            setHeightWidth(600, 600);
            break;
        case 'rectangle':
            setHeightWidth(600, 400);
            break;
        case 'tweet-post':
            setHeightWidth(600, 512);
            break;
        case 'instagram-story':
            setHeightWidth(1080, 720);
            break;
        case 'free-size':
            container.style.resize = 'both';
            break;
        case 'screen-size':
            setHeightWidth(500, 500);
            break;
        default:
            setHeightWidth(300, 300);
    }
}

// Set height and width
function setHeightWidth(height, width) {
    const container = document.getElementById('print');
    state.height = height;
    state.width = width;
    container.style.height = height + 'px';
    container.style.width = width + 'px';
    document.getElementById('heightInput').value = height;
    document.getElementById('widthInput').value = width;
}

// Show panel
function showPanel(panelId) {
    // Hide all panels
    document.querySelectorAll('.dynamicUnit').forEach(panel => {
        panel.style.display = 'none';
    });
    
    // Show selected panel
    document.getElementById(panelId).style.display = 'block';
}

// Download image
function copyComputedStyles(source, target) {
    const computed = window.getComputedStyle(source);
    // copy a set of properties that affect layout/appearance
    const properties = [
        'boxSizing','width','height','margin','padding','border','borderRadius','background','backgroundImage','backgroundColor','backgroundSize','backgroundRepeat','backgroundPosition',
        'color','font','fontFamily','fontSize','fontWeight','lineHeight','textAlign','letterSpacing','textDecoration','verticalAlign','whiteSpace','overflow','display','alignItems','justifyContent',
        'boxShadow','opacity','transform'
    ];

    properties.forEach(prop => {
        try {
            const val = computed.getPropertyValue(prop) || computed[prop];
            if (val) target.style.setProperty(prop, val);
        } catch (err) {
            // ignore unsupported properties
        }
    });
}

function cloneWithInlineStyles(element) {
    const clone = element.cloneNode(true);
    // recursive walker to copy computed style for each element
    const srcNodes = element.querySelectorAll('*');
    const dstNodes = clone.querySelectorAll('*');

    // copy style for root
    copyComputedStyles(element, clone);

    // ensure clone has no outer margin and uses border-box
    clone.style.margin = '0';
    clone.style.boxSizing = 'border-box';

    for (let i = 0; i < srcNodes.length; i++) {
        const s = srcNodes[i];
        const d = dstNodes[i];
        copyComputedStyles(s, d);
        // avoid carrying over absolute/fixed positioning which can shift layout
        if (d.style.position === 'fixed' || d.style.position === 'absolute') {
            d.style.position = 'static';
            d.style.left = '0';
            d.style.top = '0';
        }
    }

    return clone;
}

async function downloadImage() {
    try {
        const original = document.getElementById('print');

        // Ensure any pending edits are saved
        const quoteEl = document.getElementById('quoteContent');
        const authorEl = document.getElementById('authorContent');
        if (quoteEl.isContentEditable) quoteEl.blur();
        if (authorEl.isContentEditable) authorEl.blur();

        // get bounding box of the original element
        const rect = original.getBoundingClientRect();
        const downloadWidth = Math.round(rect.width);
        const downloadHeight = Math.round(rect.height);

        // clone and inline styles
        const cloned = cloneWithInlineStyles(original);

        // create wrapper to isolate cloned element and place it off-screen
        const wrapper = document.createElement('div');
        wrapper.style.position = 'fixed';
        wrapper.style.left = '-9999px';
        wrapper.style.top = '0px';
        wrapper.style.width = downloadWidth + 'px';
        wrapper.style.height = downloadHeight + 'px';
        wrapper.style.overflow = 'hidden';
        wrapper.appendChild(cloned);
        document.body.appendChild(wrapper);

        // ensure cloned root has exact size
        cloned.style.width = downloadWidth + 'px';
        cloned.style.height = downloadHeight + 'px';

        const scale = window.devicePixelRatio || 1;

        // wait for fonts to be ready to ensure correct rendering
        if (document.fonts && document.fonts.ready) {
            await document.fonts.ready;
        }

        html2canvas(cloned, { width: downloadWidth, height: downloadHeight, scale: scale, useCORS: true, backgroundColor: null }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = imgData;
            link.download = downloadHeight + 'x' + downloadWidth + '_quote.png';
            link.click();
            document.body.removeChild(wrapper);
        }).catch(error => {
            console.error('Error rendering canvas:', error);
            document.body.removeChild(wrapper);
            alert('Error downloading image. Please try again.');
        });
    } catch (error) {
        console.error('Error during download:', error);
        alert('Error downloading image. Please try again.');
    }
}

// Scroll to top on page load
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
});
