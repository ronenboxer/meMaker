'use strict'

var gCurrLang = 'en'
var gAvailableLangs = ['en','he']

const gTrans = {
    'nav-view': {
        en: 'VIEW',
        he: 'תצוגה'
    },
    'nav-sort': {
        en: 'SORT',
        he: ' מיון',
    },
    'sort-direction' :{
        en: 'direction',
        he :'כיוון'
    },
    'sort-default' :{
        en: 'default',
        he :'ברירת מחדל'
    },
    'sort-id': {
        en:'id',
        he:'מזהה'
    },
    'sort-price': {
        en:'price',
        he:'מחיר'
    },
    'sort-rating' :{
        en: 'rating',
        he:'דירוג'
    },
    'sort-name': {
        en: 'name',
        he: 'שם'
    },
    'sort-author': {
        en: 'author',
        he:'סופר/ת'
    },
    'nav-filter':{
        en: 'FILTER',
        he :'סינון'
    },
    'filter-price': {
        en:' price',
        he:'מחיר'
    },
    'filter-rating':{
        en: 'rating',
        he: 'דירוג'
    },
    'filter-bookmark': {
        en:'bookmark',
        he: 'מועדף'
    },
    'nav-add': {
        en: 'ADD',
        he: 'הוספה'
    },
    'header-slogen': {
        en: `CLICK HER TO SELL THEM BOOKS!`,
        he: `פה לוחצים`
    },
    'header-lorem': {
        en: 'Lorem',
        he :'לורם'
    },
    'header-ipsum': {
        en:' Ipsum',
        he :'איפסום'
    },
    'table-id': {
        en:'id',
        he:'מזהה'
    },
    'table-name':{
        en:'TITLE',
        he:'שם'
    },
    'table-author':{
        en:'AUTHOR',
        he:'סופר/ת'
    },
    'table-price':{
        en:'PRICE',
        he:'מחיר'
    },
    'table-rating':{
        en:'RATING',
        he:'דירוג'
    },
    'table-actions':{
        en:'ACTIONS',
        he :'פעולות'
    },
    'The Bible':{
        en: 'The Bible',
        he: 'תנ״כ'
    },
    'Harry Potter (I)':{
        en: 'Harry Potter (I)',
        he: 'הארי פוטר (1)'
    },
    'Einstein was wrong':{
        en: 'Einstein was wrong',
        he: 'איינשטיין טעה'
    },
    'The Alchemist': {
        en: 'The Alchemist',
        he: 'האלכימאי'
    },
    'Algebra': {
        en: 'Algebra',
        he: 'אלגברה'
    },
    'I feel bad about my neck':{
        en: 'I feel bad about my neck',
        he: 'כואב לי הצוואר'
    },
    'The tipping point': {
        en: 'The tipping point',
        he:'נקודת המפנה'
    },
    'Noughts & Crosses':{
        en:'Noughts & Crosses',
        he:'איקס עיגול'
    },
    'Adults in the room':{
        en :'Adults in the room',
        he:'מבוגרים בחדר'
    },
    'Caroline':{
        en:'Caroline',
        he:'קרולין'
    },
    'Harvest':{
        en:'Harvest',
        he:'קציר'
    },
    'Days without end':{
        en:'Days without end',
        he:'ימים ללא סוף'
    },
    'Sebastian Barry':{
        en:'Sebastian Barry',
        he:'סבסטיאן ברי'
    },
    'Jim Grace':{
        en:'Jim Grace',
        he:'ג׳ים גרייס'
    },
    'Niel Gaiman':{
        en:'Niel Gaiman',
        he:'ניל גיימן'
    },
    'Yanis Varoufakis':{
        en:'Yanis Varoufakis',
        he:'יאניס ורופקיס'
    },
    'Malorie Blackman':{
        en:'Malorie Blackman',
        he:'מלורי בלאקמן'
    },
    'Malcolm Gladwell':{
        en:'Malcolm Gladwell',
        he:'מלקולם גלאדוול'
    },
    'Norah Ephron':{
        en:'Norah Ephron',
        he:'נורה עפרון'
    },
    'Benny Goren':{
        en:'Benny Goren',
        he:'בני גורן'
    },
    'Paulo Coelho':{
        en:'Paulo Coelho',
        he:'פאולו קוהלחו'
    },
    'Torklid Glaven':{
        en:'Torklid Glaven',
        he:'טורקיד גלאבן'
    },
    'J.K. Rowlin':{
        en:'J.K. Rowlin',
        he:`ג׳יי. קיי. רולינג`
    },
    'GOD':{
        en:'GOD',
        he:'השם'
    },
    'about':{
        en: makeLoremEng,
        he: makeLoremHeb
    },
    'Delete':{
        en:'Delete',
        he:'מחק'
    },
    'Add a new book':{
        en:'Add a new book',
        he:'הוספת ספר חדש'
    },
    'Edit book':{
        en:'Edit book',
        he:'עריכת ספר'
    },
    'Are you sure you want to delete this book':{
        en:'Are you sure you want to delete this book',
        he:'בטוחים לגבי מחיקת הספר'
    },
    'book name':{
        en:'book name',
        he:'שם הספר'
    },
    'author':{
        en:'author',
        he:'סופר/ת'
    },
    'price':{
        en:'price',
        he:'מחיר'
    },
    'Cancel':{
        en:'Cancel',
        he:'ביטול'
    },
    'Okay':{
        en:'Okay',
        he:'אישור'
    }
}

function setLang(lang){
    if (!lang || !gAvailableLangs.includes(lang)) return
    gCurrLang = lang
}

function getTrans(transKey){
    const transMap = gTrans[transKey]
    if (!transMap) return 'UNKOWN'
    let trans = transMap[gCurrLang]
    if (!trans) trans = transMap['en']
    return trans
}

function doTrans(){
    $('[data-trans]').text(function (){
        return getTrans(this.dataset.trans)
    })
    const textDirection = new Intl.Locale(gCurrLang).textInfo.direction
    if (textDirection === 'rtl') $('body').addClass('rtl')
    else $('body').removeClass('rtl')
}

function formatNum(num){
    return new Intl.NumberFormat(gCurrLang).format(num)
}