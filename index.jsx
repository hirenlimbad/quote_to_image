import React, { useState, useRef, useEffect } from 'react';
import './ShareQuotes.css';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import FontDownloadIcon from '@mui/icons-material/FontDownload';
import AlignHorizontalRightIcon from '@mui/icons-material/AlignHorizontalRight';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import html2canvas from 'html2canvas';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import TextEditorTooltip from './TextEditorTooltip';
import { Link } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

import './BottomNavShare.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import FormatAlignJustify from '@mui/icons-material/FormatAlignJustify';


function ShareQuote() {

    const [bgColor, setBgColor] = useState('white');
    const [quote, setQuote] = useState({ quote: '', author: '' });
    const [textColor, setTextColor] = useState('black');
    const [authorColor, setAuthorColor] = useState('rgba(0, 0, 0, 0.8)');
    const [showWatermark, setShowWatermark] = useState(true);
    const [showAuthor, setShowAuthor] = useState(true);
    const [fonts, setFonts] = useState('Amethysta');
    const [fontSize, setFontSize] = useState(25);
    const [height, setHeight] = useState(1500);
    const [width, setWidth] = useState(0);
    const [postSize, setPostSize] = useState('');
    const [alignment, setAlignment] = useState('left');
    const [dynamicUnit, setDynamicUnit] = useState('sigStyles');

    const [selectedText, setSelectedText] = useState('');
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const quoteRef = useRef(null);
    const container = document.getElementById('print');

    // after loading the page scroll to the top
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const colors = ['#d62828', '#14213d', '#03045e', '#073b4c', '#ee9b00', 'red', 'blue', 'green', 'yellow', 'purple', 'pink', 'black', 'white', 'linear-gradient(to right, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
        'linear-gradient(to right, #a1c4fd 0%, #c2e9fb 100%)',
        'linear-gradient(to right, #667eea 0%, #764ba2 60%)',
        'linear-gradient(to right, #ff758c 0%, #ff7eb3 100%)',
        'linear-gradient(to right, #8e2de2, #4a00e0)',
        'linear-gradient(to right, #FFD194, #D1913C)',
        'linear-gradient(to top, #005aa7, #fffde4)',
        'linear-gradient(to top, #a8c0ff, #3f2b96)'
    ];

    const textColors = ['#d62828', '#14213d', '#03045e', '#073b4c', '#ee9b00', 'purple', '#003566', '#293241', 'white', 'black'];


    // signature style unit
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
            background: ' linear-gradient(to right, #ec77ab 0%, #7873f5 100%)',
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
        },


    }
    // end of signature style unit

    const handleSize = (postSize) => {

        const heightInput = document.querySelector('.heightInput');
        const widthInput = document.querySelector('.widthInput');

        console.log(postSize);
        switch (postSize) {
            case 'square':
                setHeightWidth(600, 600)
                break
            case 'rectangle':
                setHeightWidth(600, 400)
                break;

            case 'tweet-post':
                setHeightWidth(600, 512)
                break;

            case 'instagram-story':
                setHeightWidth(1080, 720)
                break;

            case 'free-size':
                container.style.resize = 'both';
                break;

            case 'screen-size':
                container.style.height = '500px';
                container.style.width = '500px';
                break;

            default:
                container.style.height = '300px';
                container.style.width = '300px';

        }
    };


    // fetching the quote
    useEffect(() => {
        // getting quoteID from the URL
        const url = window.location.href;
        const quoteId = url.split("/").pop();

        // fetching the quote from the database
        axios.post('https://wisdomwise.onrender.com/getQuoteById', { quoteId })
            .then(response => {
                setQuote([response.data.quote, response.data.author_name]);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);
    // end of fetching the quote


    // tooltip starting

    const handleMouseUp = (event) => {
        const selection = window.getSelection();
        let text = selection.toString();

        let firstSpace = "";
        if (text[0] == " ") {
            firstSpace = " ";
        }
        let lastSpace = "";
        if (text[text.length - 1] == " ") {
            lastSpace = " ";
        }

        text = text.trim()


        // Check if the selected text is a single word
        const isSingleWord = /^[^\s]+$/.test(text);

        text = firstSpace + text + lastSpace;

        if (isSingleWord) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            setTooltipPosition({ x: rect.left, y: rect.top });
            setSelectedText(text);
        } else {
            setSelectedText('');
        }
    };
    const applyStyle = (style, value) => {
        if (!selectedText) return;

        const span = document.createElement('span');

        switch (style) {
            case 'increase-font':
                span.style.fontSize = 'larger';
                break;
            case 'decrease-font':
                span.style.fontSize = 'smaller';
                break;
            case 'bold':
                span.style.fontWeight = 'bold';
                break;
            case 'italic':
                span.style.fontStyle = 'italic';
                break;
            case 'underline':
                span.style.textDecoration = 'underline';
                break;
            case 'color':
                span.style.color = value;
                break;
            default:
                break;
        }

        span.textContent = selectedText;

        const range = window.getSelection().getRangeAt(0);
        range.deleteContents();
        range.insertNode(span);

        setSelectedText('');
    };

    useEffect(() => {
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);
    // ending to tooltip


    // for bottom navigation
    useEffect(() => {
        const bottomNavigationItems = document.querySelectorAll('.BottomNavigation-item');
        bottomNavigationItems.forEach(item => {
            item.addEventListener('click', function () {
                bottomNavigationItems.forEach(item => {
                    item.classList.remove('active');
                });
                item.classList.add('active');
            });
        });
    }, []);

    const [value, setValue] = useState('sig_styles');

    const handleNavigationClick = (component) => {
        console.log(component);
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    function showHideWatermark() {
        if (showWatermark) {
            setShowWatermark(false);
        } else {
            setShowWatermark(true);
        }
    }

    function showHideAuthor() {
        if (showAuthor) {
            setShowAuthor(false);
        } else {
            setShowAuthor(true);
        }
    }

    function handleHeightChange(e) {
        let selectSize = document.getElementById('selectSize');
        selectSize.value = 'free-size';
        setHeight(e.target.value);
        container.style.height = e.target.value + 'px';
    }

    function handleWidthChange(e) {
        let selectSize = document.getElementById('selectSize');
        selectSize.value = 'free-size';
        setWidth(e.target.value);
        container.style.width = e.target.value + 'px';
    }

    function setHeightWidth(height, width) {
        const container = document.getElementById('print');
        container.style.height = height + 'px';
        container.style.width = width + 'px';
        setHeight(height);
        setWidth(width);
    }

    function refresh(){
        window.location.href = '../'
    }

    const printRef = useRef(null);


    return (
        <div className='ShareQuotePage'>
            <Link to="../" onClick={refresh}>
                <div className="homeButton qshomebtn" style={{marginLeft: '20px' }}>
                    <ArrowBackIosNewIcon /> Home
                </div>
            </Link>
            <div className="viewPort">
                <p className='preview' style={{ fontFamily: 'amethysta' }}>Preview</p>
                <div
                    className={`ShareQuoteContainer`}
                    id='print'
                    ref={printRef}
                    style={{ fontFamily: fonts, background: bgColor }} >

                    <div className='ShareQuote'>
                        <div className='Quote'>
                            <div className='quoteText' ref={quoteRef}>
                                <p style={{ fontSize: fontSize + 'px', color: textColor, textAlign: alignment }}
                                    data-tip
                                    data-for='textEditorTooltip'
                                >
                                    {quote[0]}
                                </p>

                                <div style={{ fontSize: fontSize + 'px', color: textColor, textAlign: alignment }}>
                                    {showAuthor && <p> - {quote[1]} </p>}
                                </div>
                            </div>
                        </div>

                        {bgColor === 'white' && textColor === 'black' && alignment === 'left' && showWatermark && (
                            <p className='watermark'> WisdomWise -  Signature Style <CheckCircleIcon sx={{ fontSize: 'inherit' }} /> </p>
                        )}

                        {!(bgColor === 'white' && textColor === 'black' && alignment === 'left') && showWatermark && (
                            <p className='watermark'> WisdomWise  </p>
                        )}

                        {selectedText && (
                            <div
                            id='textEditorTooltip'
                            style={{
                                position: 'absolute',
                                top: tooltipPosition.y,
                                left: tooltipPosition.x,
                                zIndex: 1000,
                            }}
                            >
                                <TextEditorTooltip onApplyStyle={applyStyle} />
                            </div>
                        )}
                    </div>
                </div>
            </div>






            <div className="customization">

                {dynamicUnit === 'sigStyles' && (
                    <div className="dynamicUnit">
                        <div className="dynamicUnit__header">
                        </div>

                        <div className="dynamicUnit__content">
                            <div className='signatureSelector'>
                                {Object.keys(SigStyles).map(sigStyle => (
                                    <button key={sigStyle} className='colorButton'
                                        onClick={() => {
                                            setFonts(SigStyles[sigStyle].fontFamily);
                                            setTextColor(SigStyles[sigStyle].color);
                                            setBgColor(SigStyles[sigStyle].background);
                                            setShowWatermark(SigStyles[sigStyle].showWatermark);
                                            setShowAuthor(SigStyles[sigStyle].showAuthor);
                                        }}
                                        style={{
                                            fontSize: '20px',
                                            fontFamily: SigStyles[sigStyle].fontFamily,
                                            color: SigStyles[sigStyle].color,
                                            background: SigStyles[sigStyle].background,
                                        }}
                                    >
                                        A
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {dynamicUnit === 'bgColor' && (
                    <div className="dynamicUnit">
                        <div className="dynamicUnit__header">
                        </div>
                        <div className="dynamicUnit__content">
                            <div className='colorSelector'>
                                {colors.map(color => (
                                    <button
                                        key={color}
                                        className='colorButton'
                                        style={{ background: color }}
                                        onClick={() => setBgColor(color)}
                                    >
                                        {bgColor === color && <span className="checkmark">✔</span>}
                                    </button>
                                ))}
                                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
                            </div>
                        </div>
                    </div>
                )}


                {dynamicUnit === 'textColor' && (
                    <div className="dynamicUnit">
                        <div className="dynamicUnit__header">
                        </div>
                        <div className="dynamicUnit__content">
                            <div className='colorSelector'>
                                {textColors.map(color => (
                                    <button
                                        key={color}
                                        className='colorButton'
                                        style={{ background: color }}
                                        onClick={() => setTextColor(color)}
                                    >
                                        {textColor === color && <span className="checkmark">✔</span>}
                                    </button>
                                ))}
                                <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} />
                            </div>
                        </div>
                    </div>
                )}

                {dynamicUnit === 'fontAndSize' && (

                    <div className="dynamicUnit">

                        <div className="dynamicUnit__header">
                        </div>

                        <div className="dynamicUnit__content">
                            <div className='fontSelector'>
                                <div className='left'>
                                    <p className='font-size-tag'>  Font Size </p> &nbsp; &nbsp;
                                    <input className='fontSizeInput slider'
                                        type='range'
                                        min='10'
                                        max='50'
                                        value={fontSize}
                                        onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                                    />
                                </div>
                                <div className="right">
                                    <select
                                        value={fonts}
                                        onChange={(e) => setFonts(e.target.value)}
                                        style={{ fontFamily: fonts }} >
                                        <option value='Amethysta' style={{ fontFamily: 'Amethysta' }}>Amethysta</option>
                                        <option value='Caveat' style={{ fontFamily: 'caveat' }}>Caveat</option>
                                        <option value='Dancing Script' style={{ fontFamily: 'Dancing Script' }}>Dancing Script</option>
                                        <option value='Great Vibes' style={{ fontFamily: 'Great Vibes' }} >Great Vibes</option>
                                        <option value='Indie Flower' style={{ fontFamily: 'Indie Flower' }}>Indie Flower</option>
                                        <option value='Lobster' style={{ fontFamily: 'Lobster' }}>Lobster</option>
                                        <option value='Pacifico' style={{ fontFamily: 'Pacifico' }}>Pacifico</option>
                                        <option value='Parisienne' style={{ fontFamily: 'Parisienne' }}>Parisienne</option>
                                        <option value='Sacramento' style={{ fontFamily: 'Sacramento' }}>Sacramento</option>
                                        <option value='Shadows Into Light' style={{ fontFamily: 'Shadows Into Light' }}>Shadows Into Light</option>
                                        <option value='Tangerine' style={{ fontFamily: 'Tangerine' }}>Tangerine</option>
                                        <option value="kalam" style={{fontFamily: 'kalam'}}>Kalam</option>
                                        <option value="Jaini Purva" style={{fontFamily: 'Jaini Purva'}}>Jaini Purva</option>
                                        <option value="Rozha One" style={{fontFamily: 'Rozha One'}}>Rozha One</option>
                                        <option value="Shrikhand" style={{fontFamily: 'Shrikhand'}}>Shrikhand</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {dynamicUnit === 'textAlign' && (
                    <div className="dynamicUnit">
                        <div className="dynamicUnit__header">
                        </div>
                        <div className="dynamicUnit__content">
                            <div className='alignmentSelector'>
                                <button
                                    onClick={() => setAlignment('left')}
                                    style={{ textAlign: 'left' }}
                                >
                                    <span> <FormatAlignLeftIcon />Left</span>
                                </button>
                                <button
                                    onClick={() => setAlignment('center')}
                                    style={{ textAlign: 'center' }}
                                >
                                    <span> <FormatAlignCenterIcon /> Center</span>
                                </button>
                                <button
                                    onClick={() => setAlignment('right')}
                                    style={{ textAlign: 'right' }}
                                >
                                    <span> <FormatAlignRightIcon /> Right</span>
                                </button>
                                <button
                                    onClick={() => setAlignment('justify')}
                                    style={{ textAlign: 'justify' }}
                                >
                                    <span> <FormatAlignJustify /> Justify</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {dynamicUnit === 'showHide' && (
                    <div className="dynamicUnit">
                        <div className="dynamicUnit__header">
                        </div>
                        <div className="dynamicUnit__content">
                            <div className='showHideSelector'>
                                <button onClick={() => showHideWatermark()}>
                                    {showWatermark ? 'Hide' : 'Show'} Watermark
                                </button>

                                <button onClick={() => showHideAuthor()}>
                                    {showAuthor ? 'Hide' : 'Show'} Author
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
            {dynamicUnit === 'export' && (
                <div className="dynamicUnit">
                    <div className="dynamicUnit__header">
                    </div>
                    <div className="dynamicUnit__content">
                        <div className='exportSelector'>
                            <div className="heightWidthSelection">

                                <div className="left">
                                    <select onChange={(e) => handleSize(e.target.value)} id='selectSize'>
                                        <option value='free-size' > Free size </option>
                                        <option value='square'>Instagram Post</option>
                                        <option value='instagram-story'>Instagram Story</option>
                                        <option value='rectangle'> Rectangle </option>
                                        <option value='tweet-post'>X Post</option>
                                    </select>
                                </div>

                                <div className="centered">

                                    <label htmlFor="heightInput"> Or Height</label>
                                    <input
                                        className='heightInput'
                                        type='number'
                                        value={height}
                                        onChange={handleHeightChange}
                                    />

                                    <label htmlFor="widthInput">Width</label>
                                    <input
                                        className='widthInput'
                                        type='number'
                                        value={width}
                                        onChange={handleWidthChange}
                                    />

                                </div>

                                <div className="right">
                                    <button
                                        onClick={() => {
                                            try {
                                                const container = document.getElementById('print').cloneNode(true);
                                                container.style.width = width + 'px';
                                                container.style.height = height + 'px';
                                                document.body.appendChild(container);
                                                container.style.borderRadius = '0px';

                                                html2canvas(container, { width: width, height: height }).then(canvas => {
                                                    const imgData = canvas.toDataURL('image/png');
                                                    const link = document.createElement('a');
                                                    link.href = imgData;
                                                    link.download = height + "x" + width + 'quote.png';
                                                    link.click();
                                                    document.body.removeChild(container);
                                                }).catch(error => {
                                                    console.error('Error rendering canvas:', error);
                                                });
                                            } catch (error) {
                                                console.error('Error during onClick handling:', error);
                                            }
                                        }}
                                    >
                                        Download
                                    </button>


                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )
            }

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <BottomNavigation
                    className="BottomNavigation"
                    sx={{ width: '50%', background: '#292837', position: "fixed", margin: "0 auto", borderRadius: "10px", bottom: 0 }}
                    value={value}
                    onChange={handleChange}

                >

                    <BottomNavigationAction onClick={() => setDynamicUnit('sigStyles')}
                        label="Signatures"
                        value="sig_styles"
                        icon={<CheckCircleIcon />}
                    />

                    <BottomNavigationAction onClick={() => setDynamicUnit('bgColor')}
                        label="Background"
                        value="bgColor"
                        icon={<FormatColorFillIcon />}
                    />
                    <BottomNavigationAction onClick={() => setDynamicUnit('textColor')}
                        label="Color"
                        value="favorites"
                        icon={<FormatColorTextIcon
                            sx={{ color: textColor }}
                        />}
                    />
                    <BottomNavigationAction onClick={() => setDynamicUnit('fontAndSize')}
                        label="Fonts"
                        value="nearby"
                        icon={<FontDownloadIcon />}
                    />
                    <BottomNavigationAction onClick={() => setDynamicUnit('textAlign')}
                        label="Alignments"
                        value="folder"
                        icon={<AlignHorizontalRightIcon />}
                    />
                    <BottomNavigationAction onClick={() => setDynamicUnit('showHide')}
                        label="Show/Hide"
                        value="ShowHide"
                        icon={<VisibilityIcon />}
                    />
                    <BottomNavigationAction onClick={() => {
                        const container = document.getElementById('print');
                        setHeight(container.clientHeight);
                        setWidth(container.clientWidth);
                        setDynamicUnit('export');

                    }}
                        label="Download"
                        value="download"
                        icon={<DownloadIcon />}
                    />
                </BottomNavigation>
            </div>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
        </div>
    );
}


export default ShareQuote;
