;(function(){
  // https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener DOM元素事件列表
  function bind(el, method, callback) {
    el && el.addEventListener(method, callback, false)
  }
  function Validator(options) {
    this.options = options
    this.el = typeof options.el === 'string' ? document.querySelectorAll(options.el) : ''
    this.init()
    this.regx = {
      email : /^([a-zA-Z0-9_\.])+@([a-zA-Z0-9])+\.([a-zA-Z0-9])/,
      number: /[0-9]+/
    }
    this.noop = function(){}
  }

  Validator.prototype = {
    init : function() {
      this.bindElement(this.el, this)
    },
    bindElement: function(els, validator) {
      if(els.length) {
        for(var i = 0; i < els.length; i++) {
          bind(els[i], 'input', this.validate.bind(this))
          bind(els[i], 'blur', this.validate.bind(this))
        }
      }
    },
    validate: function(evt, args) {
      window.evt = evt
      var options = evt.target.getAttribute('data-validate')
      if(!options) return
      options = options.indexOf('{') > -1 ? eval('(' + options  + ')') : options.split('|')
      this.validateProcess(evt.target.value,options, evt.target)
    },
    validateProcess: function(val, options, el) {
      if(Array.isArray(options)) {
        for(var i = 0 ; i < options.length; i++) {
          switch(options[i].trim()) {
            case 'required': {
              if(val === '') {
                this.notify('不能为空', el)
                // console.log('notify required message')
              } else {
                // console.log('set success required state')
                this.removeErrDiv(el)
              }
            }
            case 'email':  {
              if(this.regx['email'].test(val)) {
                // console.log('set sucess state')
              } else {
                // console.log('notify fail message')
              }
            }           
            default: {
              reg = /\s*len\(([0-9]+),([0-9]+)\)\s*/
              var result = options[i].match(reg) 
              if(result) {
                var len = val.length, min = +result[1], max= +result[2]
                // console.log(val, max, min)
                // val 非空
                if(len > max || len < min && val !== '') {
                  this.notify('输入字符长度在' + min + '到' + max + '之间', el)
                }
              }
            }
          }
        }
      } else {
        
        // 用户传入的validate 
        // message: "请输入0-9的数字"
        // reg: "/[0-9]+/"
        // required: true
        // style: "color:red !important"
        var message = options.message || ''
        var reg = options.reg || ''
        var required = options.required || ''
        var style = options.style || ''
        var func = options.success ||  this.noop
        var password = options.password || ''
        if(required && el.value === '') {
          this.notify('不能为空', el, style || '')
        } else if(reg && reg.test(val)) {
          this.removeErrDiv(el)
          password && this.validatePassWord(el)
          func && func(el)
          // 全局成功回调函数
          this.options.success && this.options.success()
        } else {
          this.notify(message, el, style)
        }
      }
    },
    notify: function(msg, el, style) {
      // 已经存在err-msg的div 不添加
      this.createErrDiv(msg, el, style)
    },
    validatePassWord(el) {
      let inputs = el.parentElement.parentElement.querySelectorAll('input[type="password"]')
      if(inputs.length) {
        if(inputs[0].value !== inputs[1].value) {
          this.notify('两次输入的密码不一致',el)
        }
      }

    },
    createErrDiv: function(msg, el, style) {
      // 1. 已经存在err-msg的div 不添加  
      // 2. msg不一样 重新设置textContent内容
      var nextSib =  el.nextElementSibling
      // console.log(nextSib)
      if(nextSib && nextSib.className && nextSib.className.indexOf('err-msg') > -1) return
      if(nextSib && nextSib.textContent !== msg) nextSib.textContent = msg
      var errDiv = document.createElement('div')
      errDiv.className = 'err-msg'
      style && errDiv.setAttribute('style',style)
      errDiv.textContent = msg   
      el.parentElement.insertBefore(errDiv, nextSib)
    },
    removeErrDiv: function(el) {
      el.nextElementSibling && el.nextElementSibling.className.indexOf('err-msg') > -1 
      && el.parentElement.removeChild(el.nextElementSibling)
    },
    destroyed: function() {
      clearTimeout(this.timer)
    }
  }
  if(typeof module !== 'undefined' && typeof exports === 'object') {
    module.exports = Validator
  } else {
    window.Validator = Validator
  }
})()

window.validator = new Validator({
  el: 'input'
  // success: function() {
  //   console.log('验证成功')
  // }
})