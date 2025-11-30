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

// Track applied signature style - stores the exact style name if one was applied
let appliedSigStyle = null;

// Preview scale - show smaller preview by default (30% of actual size)
const PREVIEW_SCALE = 0.3;
let originalPreviewSize = { width: 0, height: 0 };
// Whether the preview container is currently scaled for UX (ignore ResizeObserver updates while true)
let isPreviewScaled = true;

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

// Check whether the current state exactly matches a given signature style
function doesStateMatchSignature(sigStyle) {
    if (!sigStyle || !SigStyles[sigStyle]) return false;
    const s = SigStyles[sigStyle];

    const bgMatch = state.bgColor === s.background;
    const colorMatch = state.textColor === s.color;
    const fontMatch = state.fonts === s.fontFamily;
    const alignMatch = state.alignment === s.textAlign;
    const watermarkMatch = state.showWatermark === !!s.showWatermark;
    const authorMatch = state.showAuthor === !!s.showAuthor;

    return bgMatch && colorMatch && fontMatch && alignMatch && watermarkMatch && authorMatch;
}

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
    
    // Set initial width and height from inputs (user-specified or defaults)
    const container = document.getElementById('print');
    const heightInput = document.getElementById('heightInput');
    const widthInput = document.getElementById('widthInput');
    
    // Read from inputs first (these may have been set by user or defaults)
    const inputHeight = parseInt(heightInput.value, 10);
    const inputWidth = parseInt(widthInput.value, 10);
    
    if (inputHeight > 0) state.height = inputHeight;
    if (inputWidth > 0) state.width = inputWidth;
    
    // Sync back to inputs in case they were empty
    heightInput.value = state.height;
    widthInput.value = state.width;
    
    // Set preview container to SCALED SIZE for better UX (not full state dimensions)
    // On mobile, use smaller scale (25%) to fit in viewport; on desktop use 30%
    const isMobile = window.innerWidth <= 600;
    const effectiveScale = isMobile ? 0.25 : PREVIEW_SCALE;
    const previewWidth = Math.round(state.width * effectiveScale);
    const previewHeight = Math.round(state.height * effectiveScale);
    container.style.height = previewHeight + 'px';
    container.style.width = previewWidth + 'px';
    // mark that preview is currently scaled (so ResizeObserver won't overwrite the authoritative state)
    isPreviewScaled = true;
    // Store original preview size for later restoration
    originalPreviewSize = { width: previewWidth, height: previewHeight };
    
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
    
    // Track that a signature style is applied
    appliedSigStyle = sigStyle;
    
    updateQuoteDisplay();
    updateWatermark();
}

// Set background color
function setBgColor(color) {
    state.bgColor = color;
    document.getElementById('print').style.background = color;
    initializeColorSelectors(); // Refresh to show checkmark
    updateWatermark();
}

// Set text color
function setTextColor(color) {
    state.textColor = color;
    document.getElementById('quoteContent').style.color = color;
    document.getElementById('authorContent').style.color = color;
    document.querySelector('.BottomNavigationAction[onclick*="textColorPanel"]').querySelector('i').style.color = color;
    initializeColorSelectors(); // Refresh to show checkmark
    updateWatermark();
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
    
    // Show "WisdomWise - Signature Style" if:
    // Condition 1: All default conditions match
    // - background: white
    // - text color: black  
    // - alignment: left
    // - font: Amethysta
    const isDefaultCondition = state.bgColor === 'white' && 
                               state.textColor === 'black' && 
                               state.alignment === 'left' && 
                               state.fonts === 'Amethysta';
    
    // OR Condition 2: A signature style is currently applied AND the current state still matches it
    let isSignatureStyle = false;
    if (appliedSigStyle !== null) {
        if (doesStateMatchSignature(appliedSigStyle)) {
            isSignatureStyle = true;
        } else {
            // The user modified something after applying a signature; clear the applied flag
            appliedSigStyle = null;
            isSignatureStyle = false;
        }
    }

    if (!state.showWatermark) {
        watermark.style.display = 'none';
    } else {
        watermark.style.display = 'block';
        if (isDefaultCondition || isSignatureStyle) {
            watermark.innerHTML = 'WisdomWise - Signature Style <i class="fas fa-check-circle"></i>';
        } else {
            watermark.innerHTML = 'WisdomWise';
        }
    }
}

// Setup event listeners
function setupEventListeners() {
    // Font size slider - use 'input' for live updates while dragging
    document.getElementById('fontSizeSlider').addEventListener('input', (e) => {
        state.fontSize = parseInt(e.target.value);
        updateQuoteDisplay();
    });
    
    // Font selector
    document.getElementById('fontSelect').addEventListener('change', (e) => {
        state.fonts = e.target.value;
        updateQuoteDisplay();
        updateWatermark();
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
        // user has explicitly changed size — stop treating the preview as scaled
        isPreviewScaled = false;
        const container = document.getElementById('print');
        container.style.height = state.height + 'px';
    });
    
    // Width input
    document.getElementById('widthInput').addEventListener('change', (e) => {
        state.width = parseInt(e.target.value);
        document.getElementById('selectSize').value = 'free-size';
        // user has explicitly changed size — stop treating the preview as scaled
        isPreviewScaled = false;
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
                // If the preview is scaled for UX, don't overwrite the authoritative state
                if (isPreviewScaled) continue;

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
            // user intends to resize freely — stop treating preview as scaled
            isPreviewScaled = false;
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
    // an explicit programmatic size choice should stop preview-scaled mode
    isPreviewScaled = false;
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

        // Use state dimensions (user-set values) instead of visual size
        // On mobile, getBoundingClientRect() gives scaled viewport dimensions, not intended export size
        let downloadWidth = state.width;
        let downloadHeight = state.height;

        // Fallback to offsetWidth/offsetHeight if state dimensions are not set
        if (!downloadWidth || downloadWidth <= 0) {
            downloadWidth = original.offsetWidth || Math.round(document.getElementById('widthInput').value);
        }
        if (!downloadHeight || downloadHeight <= 0) {
            downloadHeight = original.offsetHeight || Math.round(document.getElementById('heightInput').value);
        }

        // Ensure reasonable bounds
        downloadWidth = Math.max(100, Math.round(downloadWidth));
        downloadHeight = Math.max(100, Math.round(downloadHeight));

        // TEMPORARILY scale preview container to full size for export
        const originalWidth = original.style.width;
        const originalHeight = original.style.height;
        original.style.width = downloadWidth + 'px';
        original.style.height = downloadHeight + 'px';

        // clone and inline styles
        const cloned = cloneWithInlineStyles(original);

        // Restore preview to original scaled size immediately
        original.style.width = originalWidth;
        original.style.height = originalHeight;

        // create wrapper to isolate cloned element and place it off-screen
        const wrapper = document.createElement('div');
        wrapper.style.position = 'fixed';
        wrapper.style.left = '-9999px';
        wrapper.style.top = '0px';
        wrapper.style.width = downloadWidth + 'px';
        wrapper.style.height = downloadHeight + 'px';
        wrapper.style.overflow = 'hidden';
        wrapper.style.padding = '0';
        wrapper.style.margin = '0';
        wrapper.appendChild(cloned);
        document.body.appendChild(wrapper);

        // ensure cloned root has exact size
        cloned.style.width = downloadWidth + 'px';
        cloned.style.height = downloadHeight + 'px';
        cloned.style.margin = '0';
        cloned.style.padding = '0';

        // Use devicePixelRatio (at least 1) to improve image quality on high-DPI devices
        const devicePR = window.devicePixelRatio || 1;
        // cap scale to avoid extremely large canvases (3x should be enough for quality)
        const scale = Math.min(3, Math.max(1, Math.round(devicePR)));

        // wait for fonts to be ready to ensure correct rendering
        if (document.fonts && document.fonts.ready) {
            await document.fonts.ready;
        }

        html2canvas(cloned, { 
            width: downloadWidth, 
            height: downloadHeight, 
            scale: scale, 
            useCORS: true, 
            backgroundColor: null,
            allowTaint: true,
            logging: false
        }).then(canvas => {
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
