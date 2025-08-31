// Small helper to trigger Google Translate selection changes safely
(function(){
  function dispatchChange(el){
    if(!el) return;
    try{
      var ev = new Event('change', { bubbles: true });
      el.dispatchEvent(ev);
    }catch(e){
      if (document.createEvent) {
        var ev2 = document.createEvent('HTMLEvents');
        ev2.initEvent('change', true, true);
        el.dispatchEvent(ev2);
      } else if (el.fireEvent) {
        el.fireEvent('onchange');
      }
    }
  }

  function doGTranslateInternal(sel){
    var lang = '';
    if (!sel) return;
    if (typeof sel === 'string') lang = sel;
    else if (sel.value) lang = sel.value;

    var attempt = function(retries){
      var combo = document.querySelector('.goog-te-combo');
      if (combo) {
        combo.value = lang;
        dispatchChange(combo);
      } else if (retries > 0) {
        setTimeout(function(){ attempt(retries - 1); }, 300);
      }
    };

    attempt(10);
  }

  // expose globally for the inline onchange="doGTranslate(this)" in the template
  window.doGTranslate = doGTranslateInternal;
})();
