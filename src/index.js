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
  }

  Validator.prototype = {
    init : function() {
      this.bindElement(this.el, this)
    },
    bindElement: function(els, validator) {
      if(els.length) {
        for(var i = 0; i < els.length; i++) {
          bind(els[i], 'blur', this.validate.bind(this))
          // bind(els[i], 'focus', this.validate.bind(this))
          // bind(els[i], 'input', this.validate.bind(this))
        }
      }
    },
    validate: function(evt, args) {
      var options = evt.target.getAttribute('data-validate')
      if(!options) return
      options = options.indexOf('{') > -1 ? eval('(' + options  + ')') : options.split('|')
      this.validateProcess(evt.target.value,options)
    },
    validateProcess: function(val, options) {
      if(Array.isArray(options)) {
        for(var i = 0 ; i < options.length; i++) {
          switch(options[i].trim()) {
            case 'required': {
              if(val === '') {
                console.log('notify required message')
              } else {
                console.log('set success required state')
              }
            }
            case 'email':  {
              if(this.regx['email'].test(val)) {
                console.log('set sucess state')
              } else {
                console.log('notify fail message')
              }
            }           
            default: ''
          }
        }
        // 默认的validate
        console.log(options)
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
        console.log(reg)
        if(reg.test(val)) {
          // 验证通过 设置 验证成功的state 
          console.log('验证成功')
        } else {
          console.log('验证失败')
        }

      }
    },
    notify: function(msg) {
      // <template class="error-msg">{{}}</template>
    }
    
  }

  if(typeof module !== 'undefined' && typeof exports === 'object') {
    module.exports = Validator
  } else {
    window.Validator = Validator
  }
})()

window.validator = new Validator({
  el: 'input',
})