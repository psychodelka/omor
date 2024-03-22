Window_Base.prototype.convertEscapeCharacters = function(text) {
    // Get Text
    var text = _TDS_.OmoriBASE.Window_Base_convertEscapeCharacters.call(this, text);
    // Get Last Gained Item
    var item = $gameParty.lastGainedItem();
    // If Item Exists
    if (item) {
      // Get Amount
      var amount = $gameParty._lastItemData.amount;
      // If Amount is more than 0
      if (amount > 0) {
  
        if (amount === 1) {
          // Replace Code with Item Name
          if (checkIfItemHasAlternativeForm(item)) {
            text = text.replace(/\x1bitemget/ig, item.meta.AlternativeForm);
          }
          else  {
            text = text.replace(/\x1bitemget/ig, item.name);
          }
        } else {
          // Replace Code with Item Name
          text = text.replace(/\x1bitemget/ig, item.name + ' x' + $gameParty._lastItemData.amount);
        };
      } else {
        if (amount < -1) {
          // Replace Code with Item Name
          text = text.replace(/\x1bitemget/ig, item.name + ' x' + Math.abs($gameParty._lastItemData.amount));
        } else {
          // Replace Code with Item Name
          text = text.replace(/\x1bitemget/ig, item.name);
        };
      };
    } else {
      text = text.replace(/\x1bitemget/ig, 'NULL ID #');
    };
    // Return Text
    return text;
  };

  function checkIfItemHasAlternativeForm(item) {
    if (item.meta.AlternativeForm !== undefined) {
        return true;
    }
    return false;
  }

  Window_Base.prototype.drawCurrencyValue = function(value, unit, wx, wy, ww) {
    this.resetTextColor();
    this.contents.fontSize = Yanfly.Param.GoldFontSize;
    if (this.usingGoldIcon(unit)) {
      var cx = Window_Base._iconWidth;
    } else {
      var cx = this.textWidth(unit);
    }
    var text = value;
    if (this.textWidth(text) > ww - cx) {
      text = Yanfly.Param.GoldOverlap;
    }
    this.drawText(text, wx, wy, ww - cx - 4, 'right');
    if (this.usingGoldIcon(unit)) {
      this.drawIcon(Yanfly.Icon.Gold, wx + ww - Window_Base._iconWidth, wy + 2);
    } else {
      this.changeTextColor(this.systemColor());
      this.drawText(unit, wx, wy, ww, 'right');
    }
    this.resetFontSettings();
};