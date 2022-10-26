'use strict'

let gMemeImgs = [
    {id: 1, keywords: ['trump', 'politics']},
    {id: 2, keywords: ['trump', 'politics']},
    {id: 3, keywords: ['trump', 'politics']},
    {id: 4, keywords: ['trump', 'politics']},
    {id: 5, keywords: ['trump', 'politics']},
    {id: 6, keywords: ['trump', 'politics']},
    {id: 7, keywords: ['trump', 'politics']},
    {id: 8, keywords: ['trump', 'politics']},
    {id: 9, keywords: ['trump', 'politics']},
    {id: 10, keywords: ['trump', 'politics']},
    {id: 11, keywords: ['trump', 'politics']},
    {id: 12, keywords: ['trump', 'politics']},
    {id: 13, keywords: ['trump', 'politics']},
    {id: 14, keywords: ['trump', 'politics']},
    {id: 15, keywords: ['trump', 'politics']},
    {id: 16, keywords: ['trump', 'politics']},
    {id: 17, keywords: ['trump', 'politics']},
    {id: 18, keywords: ['trump', 'politics']},
    ]

let gMeme = {
    imgId: 1,
    url: 'square.imgs/1.jpg',
    selectedLineIdx: -1,
    lines: [
        {
            txt: 'I sometimes eat Falafel',
            font: 'Impact',
            size: 20,
            strokeSize: 1,
            strokeColor:'black',
            align: 'start',
            color: 'red'
        },
        {
            txt: 'sefsdf, sdfsdfsdfs',
            font: 'Impact',
            size: 30,
            strokeSize:1,
            strokeColor:'black',
            align: 'end',
            color: 'brown'
        },
        {
            txt: 'hjkj lkjklkj kjkk123l',
            font: 'Impact',
            size: 40,
            strokeSize:1,
            strokeColor:'black',
            align: 'center',
            color: 'yellow'
        }
    ]
}

function getMeme(){
    return gMeme
}

function setMeme(imgId){
    gMeme = {
        imgId,
        url: `../square.imgs/${imgId}.jpg`,
        selectedLineIdx: -1,
        lines: []
    }
}

function setLinePos({x,y,idx,angle}){
    if (!isNaN(x) && !isNaN(y)) {
        gMeme.lines[idx].x = x
        gMeme.lines[idx].y = y
    }
    if (!isNaN(angle)) gMeme[idx].angle = angle
}

function setTextProp(prop, value){
    gMeme.lines[gMeme.selectedLineIdx][prop] = value
}

function setSelectedLine(idx){
    gMeme.selectedLineIdx = idx
}
