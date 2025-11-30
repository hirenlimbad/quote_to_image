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
    
    // OR Condition 2: A signature style is currently applied
    const isSignatureStyle = appliedSigStyle !== null;
    
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
