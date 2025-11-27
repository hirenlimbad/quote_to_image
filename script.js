// Data for customization
const colors = [
    '#ffffff', '#000000', '#f44336', '#e91e63', '#9c27b0',
    '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4',
    '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b',
    '#ffc107', '#ff9800', '#ff5722', '#795548', '#607d8b'
];

const gradients = [
    'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
    'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)',
    'linear-gradient(120deg, #fccb90 0%, #d57eeb 100%)',
    'linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)',
    'linear-gradient(to right, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(to right, #fa709a 0%, #fee140 100%)',
    'linear-gradient(to top, #30cfd0 0%, #330867 100%)',
    'linear-gradient(to top, #5f72bd 0%, #9b23ea 100%)',
    'linear-gradient(to top, #09203f 0%, #537895 100%)',
    'linear-gradient(to right, #f83600 0%, #f9d423 100%)',
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
];

const fonts = [
    'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins',
    'Playfair Display', 'Merriweather', 'Nunito', 'Raleway',
    'Quicksand', 'Oswald', 'Dancing Script', 'Pacifico',
    'Bangers', 'Abril Fatface', 'Lobster', 'Roboto Mono'
];

const textColors = [
    '#000000', '#ffffff', '#333333', '#555555',
    '#f44336', '#2196f3', '#4caf50', '#ffeb3b',
    '#ff9800', '#9c27b0', '#795548', '#607d8b'
];

const sizes = [
    { name: 'Instagram Post', width: 1080, height: 1080, icon: 'crop_square' }, // 1:1
    { name: 'Instagram Story', width: 1080, height: 1920, icon: 'smartphone' }, // 9:16
    { name: 'Twitter Post', width: 1600, height: 900, icon: 'featured_video' }, // 16:9
    { name: 'Facebook Post', width: 1200, height: 630, icon: 'facebook' }, // ~1.91:1
    { name: 'YouTube Thumbnail', width: 1280, height: 720, icon: 'play_circle' } // 16:9
];

const templates = [
    { name: 'Classic', bg: '#000000', text: '#ffffff', font: 'Playfair Display', align: 'center' },
    { name: 'Modern', bg: '#ffffff', text: '#000000', font: 'Montserrat', align: 'left' },
    { name: 'Vibrant', bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', text: '#ffffff', font: 'Raleway', align: 'center' },
    { name: 'Sunny', bg: 'linear-gradient(to right, #fa709a 0%, #fee140 100%)', text: '#333333', font: 'Pacifico', align: 'center' },
    { name: 'Elegant', bg: '#1e1e1e', text: '#bb86fc', font: 'Cormorant Garamond', align: 'center' }, // Fallback font if not loaded, but we have others
    { name: 'Bold', bg: '#ffeb3b', text: '#000000', font: 'Oswald', align: 'right' },
    { name: 'Nature', bg: '#4caf50', text: '#ffffff', font: 'Merriweather', align: 'justify' },
    { name: 'Ocean', bg: 'linear-gradient(to top, #09203f 0%, #537895 100%)', text: '#e0e0e0', font: 'Roboto Mono', align: 'center' }
];

// DOM Elements
const canvas = document.getElementById('quote-canvas');
const quoteText = document.getElementById('quote-text');
const authorText = document.getElementById('author-text');
const toolPanel = document.getElementById('tool-panel');
const panelContent = document.getElementById('panel-content');
const panelTitle = document.getElementById('panel-title');
const closePanelBtn = document.getElementById('close-panel');
const navItems = document.querySelectorAll('.nav-item');

// State
let currentTool = null;
let currentSize = sizes[0];

// Initialize
function init() {
    setupEventListeners();
    // Set initial size
    applySize(sizes[0]);
}

function setupEventListeners() {
    // Navigation
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const tool = item.dataset.tool;
            openTool(tool);
        });
    });

    // Close Panel
    closePanelBtn.addEventListener('click', () => {
        closeToolPanel();
    });

    // Text Content Editable Listeners (optional: to prevent empty states)
    quoteText.addEventListener('blur', () => {
        if (quoteText.innerText.trim() === '') quoteText.innerText = '"Write your quote here..."';
    });

    // Global Key Listener for Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeToolPanel();
            hideFormatToolbar();
        }
    });

    // Text Selection Listeners
    setupTextSelectionListeners();
}

// Text Selection and Formatting Toolbar
let selectedRange = null;
let selectedElement = null;

function setupTextSelectionListeners() {
    const formatToolbar = document.getElementById('text-format-toolbar');
    const decreaseSizeBtn = document.getElementById('decrease-size-btn');
    const increaseSizeBtn = document.getElementById('increase-size-btn');
    const boldBtn = document.getElementById('bold-btn');
    const italicBtn = document.getElementById('italic-btn');

    // Listen for text selection on editable elements
    [quoteText, authorText].forEach(element => {
        element.addEventListener('mouseup', handleTextSelection);
        element.addEventListener('touchend', handleTextSelection);
    });

    // Hide toolbar when clicking outside
    document.addEventListener('mousedown', (e) => {
        if (!formatToolbar.contains(e.target) &&
            !quoteText.contains(e.target) &&
            !authorText.contains(e.target)) {
            hideFormatToolbar();
        }
    });

    // Format button handlers
    decreaseSizeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        adjustFontSize(-2);
    });

    increaseSizeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        adjustFontSize(2);
    });

    boldBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleFormat('bold');
    });

    italicBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleFormat('italic');
    });
}

function handleTextSelection(e) {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (selectedText.length > 0) {
        selectedRange = selection.getRangeAt(0);
        selectedElement = e.currentTarget;
        showFormatToolbar(selection);
    } else {
        hideFormatToolbar();
    }
}

function showFormatToolbar(selection) {
    const formatToolbar = document.getElementById('text-format-toolbar');
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    // Position toolbar above the selection
    const toolbarWidth = 180; // Approximate width
    const toolbarX = rect.left + (rect.width / 2) - (toolbarWidth / 2);
    const toolbarY = rect.top - 60; // Slightly higher to avoid finger obstruction

    // Clamp horizontal position
    const minX = 10;
    const maxX = window.innerWidth - toolbarWidth - 10;
    const clampedX = Math.max(minX, Math.min(toolbarX, maxX));

    formatToolbar.style.left = `${clampedX}px`;
    formatToolbar.style.top = `${Math.max(10, toolbarY)}px`;

    formatToolbar.classList.remove('hidden');
    formatToolbar.classList.add('visible');

    // Update button states based on current selection
    updateFormatButtonStates();
}

function hideFormatToolbar() {
    const formatToolbar = document.getElementById('text-format-toolbar');
    formatToolbar.classList.remove('visible');
    formatToolbar.classList.add('hidden');
    selectedRange = null;
    selectedElement = null;
}

function updateFormatButtonStates() {
    if (!selectedRange) return;

    const boldBtn = document.getElementById('bold-btn');
    const italicBtn = document.getElementById('italic-btn');

    // Check if selection has bold/italic
    const container = selectedRange.commonAncestorContainer;
    const parent = container.nodeType === 3 ? container.parentElement : container;

    const isBold = window.getComputedStyle(parent).fontWeight >= 700 ||
        parent.style.fontWeight === 'bold' ||
        parent.closest('b, strong');
    const isItalic = window.getComputedStyle(parent).fontStyle === 'italic' ||
        parent.style.fontStyle === 'italic' ||
        parent.closest('i, em');

    boldBtn.classList.toggle('active', isBold);
    italicBtn.classList.toggle('active', isItalic);
}

function adjustFontSize(delta) {
    if (!selectedRange || !selectedElement) return;

    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;

    // Save the selection
    const range = selectedRange.cloneRange();

    // Get or create a span for the selected text
    const span = wrapSelectionInSpan(range);

    if (span) {
        const currentSize = parseFloat(window.getComputedStyle(span).fontSize);
        const newSize = Math.max(8, currentSize + delta); // Minimum 8px
        span.style.fontSize = newSize + 'px';
    }

    // Restore selection
    restoreSelection(range);
}

function toggleFormat(format) {
    if (!selectedRange || !selectedElement) return;

    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;

    const range = selectedRange.cloneRange();
    const span = wrapSelectionInSpan(range);

    if (span) {
        if (format === 'bold') {
            const currentWeight = window.getComputedStyle(span).fontWeight;
            const isBold = currentWeight >= 700 || span.style.fontWeight === 'bold';
            span.style.fontWeight = isBold ? 'normal' : 'bold';
        } else if (format === 'italic') {
            const currentStyle = window.getComputedStyle(span).fontStyle;
            const isItalic = currentStyle === 'italic' || span.style.fontStyle === 'italic';
            span.style.fontStyle = isItalic ? 'normal' : 'italic';
        }
    }

    // Update button states
    updateFormatButtonStates();

    // Restore selection
    restoreSelection(range);
}

function wrapSelectionInSpan(range) {
    const selectedContent = range.extractContents();

    // Check if already wrapped in a span with formatting
    let span;
    if (selectedContent.childNodes.length === 1 &&
        selectedContent.firstChild.nodeName === 'SPAN') {
        span = selectedContent.firstChild;
    } else {
        span = document.createElement('span');
        span.appendChild(selectedContent);
    }

    range.insertNode(span);
    return span;
}

function restoreSelection(range) {
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
}

function openTool(tool) {
    // Toggle behavior: if clicking the active tool, close it.
    if (currentTool === tool && toolPanel.classList.contains('open')) {
        closeToolPanel();
        return;
    }

    currentTool = tool;

    // Update Nav UI
    navItems.forEach(i => i.classList.remove('active'));
    document.querySelector(`[data-tool="${tool}"]`).classList.add('active');

    // Update Panel Content
    renderPanelContent(tool);

    // Show Panel
    toolPanel.classList.remove('hidden');
    // Small delay to allow display:block (if we were using it) to apply, 
    // but with height transition we just add the class.
    requestAnimationFrame(() => {
        toolPanel.classList.add('open');
    });

    panelTitle.innerText = tool.charAt(0).toUpperCase() + tool.slice(1);
}

function closeToolPanel() {
    toolPanel.classList.remove('open');
    toolPanel.classList.add('hidden'); // Logic handled by CSS height, but keeping for state
    navItems.forEach(i => i.classList.remove('active'));
    currentTool = null;
}

function fitCanvasToScreen() {
    const previewArea = document.querySelector('.preview-area');
    const wrapper = document.querySelector('.canvas-wrapper');

    if (!previewArea || !wrapper) return;

    // Reset styles to ensure clean calculation
    canvas.style.transform = 'none';
    wrapper.style.width = '';
    wrapper.style.height = '';
    wrapper.style.marginTop = '';
    wrapper.style.marginBottom = '';
    previewArea.style.overflowY = '';
    previewArea.style.display = '';
    previewArea.style.textAlign = '';
    previewArea.style.flexDirection = '';
    previewArea.style.justifyContent = '';
    previewArea.style.alignItems = '';

    const isMobile = window.innerWidth < 768;
    // ZERO padding on mobile to maximize size
    const padding = isMobile ? 0 : 80;

    const availableWidth = previewArea.clientWidth - padding;
    const availableHeight = previewArea.clientHeight - padding;

    const naturalWidth = parseFloat(canvas.style.width) || 350;
    const naturalHeight = parseFloat(canvas.style.height) || 350;

    const scaleX = availableWidth / naturalWidth;
    const scaleY = availableHeight / naturalHeight;

    // Fit to screen: use the smaller scale to ensure it fits entirely
    const scale = Math.min(scaleX, scaleY, 1);

    // Apply scale
    canvas.style.transform = `scale(${scale})`;
    canvas.style.transformOrigin = 'center center';

    // Ensure preview area centers the content
    previewArea.style.display = 'flex';
    previewArea.style.justifyContent = 'center';
    previewArea.style.alignItems = 'center';
    previewArea.style.overflow = 'hidden';
}

// Listen for window resize
window.addEventListener('resize', fitCanvasToScreen);

// Listen for panel transitions to resize canvas
toolPanel.addEventListener('transitionend', (e) => {
    if (e.propertyName === 'height') {
        fitCanvasToScreen();
    }
});

function renderPanelContent(tool) {
    panelContent.innerHTML = '';

    switch (tool) {
        case 'background':
            renderBackgroundTools();
            break;
        case 'text':
            renderTextTools();
            break;
        case 'font':
            renderFontTools();
            break;
        case 'layout':
            renderLayoutTools();
            break;
        case 'templates':
            renderTemplatesTools();
            break;
        case 'export':
            renderExportTools();
            break;
    }
}

// --- Tool Renderers ---

function renderBackgroundTools() {
    // Colors Section
    const colorGroup = createControlGroup('Solid Colors');
    const colorGrid = document.createElement('div');
    colorGrid.className = 'options-grid';

    colors.forEach(color => {
        const div = document.createElement('div');
        div.className = 'color-option';
        div.style.backgroundColor = color;
        div.onclick = () => {
            canvas.style.background = color;
            highlightSelected(div, colorGrid);
        };
        colorGrid.appendChild(div);
    });
    colorGroup.appendChild(colorGrid);
    panelContent.appendChild(colorGroup);

    // Gradients Section
    const gradientGroup = createControlGroup('Gradients');
    const gradientGrid = document.createElement('div');
    gradientGrid.className = 'options-grid';
    gradientGrid.style.gridTemplateColumns = 'repeat(2, 1fr)'; // Wider items for gradients

    gradients.forEach(grad => {
        const div = document.createElement('div');
        div.className = 'gradient-option';
        div.style.background = grad;
        div.onclick = () => {
            canvas.style.background = grad;
            highlightSelected(div, gradientGrid);
        };
        gradientGrid.appendChild(div);
    });
    gradientGroup.appendChild(gradientGrid);
    panelContent.appendChild(gradientGroup);
}

function renderTextTools() {
    // Text Color
    const colorGroup = createControlGroup('Text Color');
    const colorGrid = document.createElement('div');
    colorGrid.className = 'options-grid';

    textColors.forEach(color => {
        const div = document.createElement('div');
        div.className = 'color-option';
        div.style.backgroundColor = color;
        div.onclick = () => {
            canvas.style.color = color;
            highlightSelected(div, colorGrid);
        };
        colorGrid.appendChild(div);
    });
    colorGroup.appendChild(colorGrid);
    panelContent.appendChild(colorGroup);

    // Translucency
    const opacityGroup = createControlGroup('Text Opacity');
    const sliderContainer = document.createElement('div');
    sliderContainer.className = 'slider-container';

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0.1';
    slider.max = '1';
    slider.step = '0.1';
    slider.value = getComputedStyle(quoteText).opacity;
    slider.oninput = (e) => {
        quoteText.style.opacity = e.target.value;
        authorText.style.opacity = Math.max(0.1, e.target.value - 0.2); // Author slightly more transparent
    };

    sliderContainer.appendChild(slider);
    opacityGroup.appendChild(sliderContainer);
    panelContent.appendChild(opacityGroup);
}

function renderFontTools() {
    // Font Size
    const sizeGroup = createControlGroup('Font Size');
    const sliderContainer = document.createElement('div');
    sliderContainer.className = 'slider-container';

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '10';
    slider.max = '200'; // Pixel range
    slider.step = '1';

    // Get current font size in px
    const currentPx = parseFloat(getComputedStyle(quoteText).fontSize);
    slider.value = currentPx;

    slider.oninput = (e) => {
        const val = e.target.value;
        quoteText.style.fontSize = val + 'px';
        authorText.style.fontSize = (val * 0.6) + 'px'; // Author smaller
    };

    sliderContainer.appendChild(slider);
    sizeGroup.appendChild(sliderContainer);
    panelContent.appendChild(sizeGroup);

    // Font Family
    const fontGroup = createControlGroup('Font Style');
    const fontList = document.createElement('div');
    fontList.className = 'font-list';

    fonts.forEach(font => {
        const div = document.createElement('div');
        div.className = 'font-option';
        div.style.fontFamily = font;
        div.innerText = font;
        div.onclick = () => {
            quoteText.style.fontFamily = font;
            authorText.style.fontFamily = font;
            highlightSelected(div, fontList);
        };
        fontList.appendChild(div);
    });
    fontGroup.appendChild(fontList);
    panelContent.appendChild(fontGroup);
}

function renderTemplatesTools() {
    const group = createControlGroup('Predefined Designs');
    const grid = document.createElement('div');
    grid.className = 'font-list'; // Reuse grid layout

    templates.forEach(tmpl => {
        const div = document.createElement('div');
        div.className = 'template-option';
        div.style.background = tmpl.bg;
        div.style.color = tmpl.text;
        div.style.fontFamily = tmpl.font;
        div.innerText = tmpl.name;

        div.onclick = () => {
            applyTemplate(tmpl);
            highlightSelected(div, grid);
        };
        grid.appendChild(div);
    });
    group.appendChild(grid);
    panelContent.appendChild(group);
}

function applyTemplate(tmpl) {
    canvas.style.background = tmpl.bg;
    canvas.style.color = tmpl.text;

    quoteText.style.fontFamily = tmpl.font;
    authorText.style.fontFamily = tmpl.font;

    quoteText.style.textAlign = tmpl.align;
    authorText.style.textAlign = tmpl.align;
}

function renderLayoutTools() {
    // Canvas Size (Social Media Presets)
    const sizeGroup = createControlGroup('Canvas Size');
    const sizeList = document.createElement('div');
    sizeList.className = 'font-list'; // Reuse grid layout

    sizes.forEach(size => {
        const btn = document.createElement('div');
        btn.className = 'size-option';

        // Icon
        const icon = document.createElement('span');
        icon.className = 'material-icons-round';
        icon.textContent = size.icon || 'crop_original';

        // Name
        const name = document.createElement('div');
        name.className = 'size-name';
        name.textContent = size.name;

        // Dimensions
        const dimensions = document.createElement('div');
        dimensions.className = 'size-dimensions';
        dimensions.textContent = `${size.width} × ${size.height}`;

        btn.appendChild(icon);
        btn.appendChild(name);
        btn.appendChild(dimensions);

        if (currentSize.name === size.name) btn.classList.add('selected');

        btn.onclick = () => {
            applySize(size);
            highlightSelected(btn, sizeList);
        };
        sizeList.appendChild(btn);
    });
    sizeGroup.appendChild(sizeList);
    panelContent.appendChild(sizeGroup);

    // Alignment
    const alignGroup = createControlGroup('Text Alignment');
    const btnRow = document.createElement('div');
    btnRow.className = 'button-row';

    const alignments = [
        { icon: 'format_align_left', val: 'left' },
        { icon: 'format_align_center', val: 'center' },
        { icon: 'format_align_right', val: 'right' },
        { icon: 'format_align_justify', val: 'justify' }
    ];

    alignments.forEach(align => {
        const btn = document.createElement('button');
        btn.className = 'action-btn';
        btn.innerHTML = `<span class="material-icons-round">${align.icon}</span>`;
        btn.onclick = () => {
            quoteText.style.textAlign = align.val;
            authorText.style.textAlign = align.val;
            highlightSelected(btn, btnRow);
        };
        btnRow.appendChild(btn);
    });
    alignGroup.appendChild(btnRow);
    panelContent.appendChild(alignGroup);
}

function applySize(size) {
    currentSize = size;
    // Set actual pixel dimensions for high quality export
    canvas.style.width = size.width + 'px';
    canvas.style.height = size.height + 'px';

    // Scale font size proportionally to the canvas width
    // Base scale: ~5% of width for quote, ~2.5% for author
    const baseFontSize = Math.round(size.width * 0.05);
    const authorFontSize = Math.round(size.width * 0.025);

    quoteText.style.fontSize = `${baseFontSize}px`;
    authorText.style.fontSize = `${authorFontSize}px`;

    // Re-calculate scale to fit screen
    fitCanvasToScreen();
}

function renderExportTools() {
    const group = createControlGroup('Download Quote');

    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'download-btn';
    downloadBtn.innerHTML = '<span class="material-icons-round">save_alt</span> Download Image';
    downloadBtn.onclick = downloadImage;

    group.appendChild(downloadBtn);
    panelContent.appendChild(group);

    const info = document.createElement('p');
    info.style.color = '#888';
    info.style.fontSize = '0.8rem';
    info.style.marginTop = '10px';
    info.style.textAlign = 'center';
    info.innerHTML = `Current Size: <b>${currentSize.name}</b> (${currentSize.width}x${currentSize.height})`;
    panelContent.appendChild(info);
}

// --- Helpers ---

function createControlGroup(title) {
    const div = document.createElement('div');
    div.className = 'control-group';
    const label = document.createElement('label');
    label.className = 'control-label';
    label.innerText = title;
    div.appendChild(label);
    return div;
}

function highlightSelected(element, container) {
    Array.from(container.children).forEach(c => c.classList.remove('selected', 'active'));
    element.classList.add('selected'); // For colors/fonts
    element.classList.add('active');   // For buttons
}

function downloadImage() {
    // Save current transform state
    const currentTransform = canvas.style.transform;

    // Temporarily reset transform for clean export at actual size
    canvas.style.transform = 'scale(1)';

    // High quality export
    const scale = 2;

    html2canvas(canvas, {
        scale: scale,
        backgroundColor: null,
        useCORS: true,
        logging: false
    }).then(renderedCanvas => {
        // Restore the transform
        canvas.style.transform = currentTransform;

        // Download the image
        const link = document.createElement('a');
        link.download = `quote-${currentSize.name.toLowerCase().replace(/\s+/g, '-')}.png`;
        link.href = renderedCanvas.toDataURL('image/png');
        link.click();
    }).catch(err => {
        // Restore transform even on error
        canvas.style.transform = currentTransform;
        console.error("Download failed:", err);
        alert("Sorry, there was an error generating the image.");
    });
}

// Start
init();
