// 导入jQuery

import $ from "jquery";
// const $ = require('jquery');

// 引入css  
import './css/index.css';

$(function () {
    // console.log('hah')
    $('li:odd').css('backgroundColor','red');
    $('li:even').css('backgroundColor','pink');
})