//=============================================================================
// TDS Custom Battle Action Text
// Version: 1.0
//=============================================================================
// Add to Imported List
var Imported = Imported || {}; Imported.TDS_CustomBattleActionText = true;
// Initialize Alias Object
var _TDS_ = _TDS_ || {}; _TDS_.CustomBattleActionText = _TDS_.CustomBattleActionText || {};
//=============================================================================
/*:
* @plugindesc
* This plugins allows you to set customized messages for actions.
*
* @author TDS
*/
//=============================================================================


//=============================================================================
// ** Window_BattleLog
//-----------------------------------------------------------------------------
// The window for displaying battle progress. No frame is displayed, but it is
// handled as a window for convenience.
//=============================================================================
// Alias Listing
//=============================================================================
_TDS_.CustomBattleActionText.Window_BattleLog_displayAction = Window_BattleLog.prototype.displayAction;
_TDS_.CustomBattleActionText.Window_BattleLog_displayActionResults = Window_BattleLog.prototype.displayActionResults;
//=============================================================================
// * Make Custom Action Text
//=============================================================================
Window_BattleLog.prototype.makeCustomActionText = function (subject, target, item) {
  var user = subject;
  var result = target.result();
  var hit = result.isHit();
  var success = result.success;
  var critical = result.critical;
  var missed = result.missed;
  var evaded = result.evaded;
  var hpDam = result.hpDamage;
  var mpDam = result.mpDamage;
  var tpDam = result.tpDamage;
  var addedStates = result.addedStates;
  var removedStates = result.removedStates;
  var strongHit = result.elementStrong;
  var weakHit = result.elementWeak;
  var text = '';
  var type = item.meta.BattleLogType.toUpperCase();
  var switches = $gameSwitches;
  var unitLowestIndex = target.friendsUnit().getLowestIndexMember();


  function parseNoEffectEmotion(tname, em, target) {
    if (em.toLowerCase().contains("BA??")) {
      if (tname === $gameActors.actor(1).name()) { return "OMORI si?? nie boi!\r\n" }
      if (target._doesUseAlternateForms2()) {
        return target.name() + ' si?? nie boj??!\r\n';
      }
      return target.name() + " si?? nie boi!\r\n";
    }
    let finalString;
    if (target._doesUseAlternateForms2()) {
      finalString = `${tname} nie mog?? sta?? si?? ${em}`; // TOvDO: plural
    } else {
      finalString = `${tname} nie mo??e sta?? si?? ${em}`;
    }
    if (finalString.length >= 40) {
      let voinIndex = 0;
      for (let i = 40; i >= 0; i--) {
        if (finalString[i] === " ") {
          voinIndex = i;
          break;
        }
      }
      finalString = [finalString.slice(0, voinIndex).trim(), "\r\n", finalString.slice(voinIndex).trimLeft()].join('')
    }
    return finalString;
  }

  function parseNoStateChange(tname, stat, hl, target) {
    let noStateChangeText; // TARGET NAME - STAT - HIGHER/LOWER
    if (target._doesUseAlternateForms()) {
      noStateChangeText = `${stat} ${target._altName()} nie mo??e ${hl}`;
    } else if (target._doesUseAlternateForms2()) {
      noStateChangeText = `${stat} ${target._altName()} nie mog?? ${hl}`;
    } else {
      noStateChangeText = `${stat} ${target._altName()} nie mo??e ${hl}`;
    }
    return noStateChangeText
  }

  function steppedEmotionStateText(emotion, target, append = '') {
    emotion = emotion.toLowerCase()
    if (emotion === 'sad') {
      if (target._doesUseAlternateForms()) {
        if (target.isStateAffected(12)) { return target.name() + ' jest PRZYBITA...' + append; }
        else if (target.isStateAffected(11)) { return target.name() + ' jest ZA??AMANA...' + append; }
        else if (target.isStateAffected(10)) { return target.name() + ' czuje SMUTEK.' + append; }
      } else if (target._doesUseAlternateForms2()) {
        if (target.isStateAffected(12)) { return target.name() + ' s?? PRZYBITE...' + append; }
        else if (target.isStateAffected(11)) { return target.name() + ' s?? ZA??AMANE...' + append; }
        else if (target.isStateAffected(10)) { return target.name() + ' czuj?? SMUTEK.' + append; }
      } else if (target._doesUseAlternateForms3()) {
        if (target.isStateAffected(12)) { return target.name() + ' jest PRZYBITE...' + append; }
        else if (target.isStateAffected(11)) { return target.name() + ' jest ZA??AMANE...' + append; }
        else if (target.isStateAffected(10)) { return target.name() + ' czuje SMUTEK.' + append; }
      } else {
        if (target.isStateAffected(12)) { return target.name() + ' jest PRZYBITY...' + append; }
        else if (target.isStateAffected(11)) { return target.name() + ' jest ZA??AMANY...' + append; }
        else if (target.isStateAffected(10)) { return target.name() + ' czuje SMUTEK.' + append; }
      }
    } else if (emotion === 'happy') {
      if (target._doesUseAlternateForms()) {
        if (target.isStateAffected(8)) { return target.name() + ' jest w EUFORII!!!' + append; } // TOvDO: female
        else if (target.isStateAffected(7)) { return target.name() + ' jest RADOSNA!!' + append; } // TOvDO: female
        else if (target.isStateAffected(6)) { return target.name() + ' czuje SZCZ????CIE!' + append; } // TOvDO: female
      } else if (target._doesUseAlternateForms2()) {
        if (target.isStateAffected(8)) { return target.name() + ' s?? w EUFORII!!!' + append; } // TOvDO: plural
        else if (target.isStateAffected(7)) { return target.name() + ' s?? RADOSNE!!' + append; } // TOvDO: plural
        else if (target.isStateAffected(6)) { return target.name() + ' czuj?? SZCZ????CIE!' + append; } // TOvDO: plural
      } else if (target._doesUseAlternateForms3()) {
        if (target.isStateAffected(8)) { return target.name() + ' jest w EUFORII!!!' + append; } // TOvDO: neutral
        else if (target.isStateAffected(7)) { return target.name() + ' jest RADOSNE!!' + append; } // TOvDO: neutral
        else if (target.isStateAffected(6)) { return target.name() + ' czuje SZCZ????CIE!' + append; } // TOvDO: neutral
      } else {
        if (target.isStateAffected(8)) { return target.name() + ' jest w EUFORII!!!' + append; }
        else if (target.isStateAffected(7)) { return target.name() + ' jest RADOSNY!!' + append; }
        else if (target.isStateAffected(6)) { return target.name() + ' czuje SZCZ????CIE!' + append; }
      }
    } else if (emotion === 'angry') {
      if (target._doesUseAlternateForms()) {
        if (target.isStateAffected(14)) { return target.name() + ' czuje Z??O????!' + append; } // TOvDO: female
        else if (target.isStateAffected(15)) { return target.name() + ' jest WKURZONA!!' + append; } // TOvDO: female
        else if (target.isStateAffected(16)) { return target.name() + ' jest W??CIEK??A!!!' + append; } // TOvDO: female
      } else if (target._doesUseAlternateForms2()) {
        if (target.isStateAffected(14)) { return target.name() + ' czuj?? Z??O????!' + append; } // TOvDO: plural
        else if (target.isStateAffected(15)) { return target.name() + ' s?? WKURZONE!!' + append; } // TOvDO: plural
        else if (target.isStateAffected(16)) { return target.name() + ' s?? W??CIEK??E!!!' + append; } // TOvDO: plural
      } else if (target._doesUseAlternateForms3()) {
        if (target.isStateAffected(14)) { return target.name() + ' czuje Z??O????!' + append; } // TOvDO: neutral
        else if (target.isStateAffected(15)) { return target.name() + ' jest WKURZONE!!' + append; } // TOvDO: neutral
        else if (target.isStateAffected(16)) { return target.name() + ' jest W??CIEK??E!!!' + append; } // TOvDO: neutral
      } else {
        if (target.isStateAffected(14)) { return target.name() + ' czuje Z??O????!' + append; }
        else if (target.isStateAffected(15)) { return target.name() + ' jest WKURZONY!!' + append; }
        else if (target.isStateAffected(16)) { return target.name() + ' jest W??CIEK??Y!!!' + append; }
      }
    }
    return ''
  }

  // Type case
  //OMORI//
  if (hpDam != 0) {
    var hpDamageText;
    if (target.name() === $gameActors.actor(8).name()) {
      hpDamageText = 'Otrzymujesz ' + hpDam + ' obra??e??!';
    } else if (target._doesUseAlternateForms2()) {
      hpDamageText = target.name() + ' otrzymuj?? ' + hpDam + ' obra??e??!';
    } else {
      hpDamageText = target.name() + ' otrzymuje ' + hpDam + ' obra??e??!';
    }
    if (strongHit) {
      hpDamageText = '...To silny atak!\r\n' + hpDamageText;
    } else if (weakHit) {
      hpDamageText = '...To s??aby atak.\r\n' + hpDamageText;
    }
  } else if (result.isHit() === true) {
    var hpDamageText = user.name() + " atakuje, bez skutku.";
  } else {
    var hpDamageText = user.name() + " pud??uje!";
  }

  if (critical) {
    hpDamageText = 'TRAFIA PROSTO W SERCE!\r\n' + hpDamageText;
  }

  if (mpDam > 0) {
    var mpDamageText;
    if (target.name() === $gameActors.actor(8).name()) {
      mpDamageText = 'Tracisz ' + mpDam + ' SOKU...';
    } else if (target._doesUseAlternateForms2()) {
      mpDamageText = target.name() + ' trac?? ' + mpDam + ' SOKU...';
    } else {
      mpDamageText = target.name() + ' traci ' + mpDam + ' SOKU...';
    }
    hpDamageText = hpDamageText + "\r\n" + mpDamageText;
  } else {
    var mpDamageText = '';
  }

  switch (type) {
    case 'BLANK': // ATTACK
      text = '...';
      break;

    case 'ATTACK': // ATTACK
      if (target.name() === $gameActors.actor(8).name()) {
        text = user.name() + ' ci?? atakuje!\r\n';
      } else if (target._doesUseAlternateForms2()) {
        text = user.name() + ' atakuj?? ' + target._altName() + '!\r\n';
      } else {
        text = user.name() + ' atakuje ' + target._altName() + '!\r\n';
      }
      text += hpDamageText;
      break;

    case 'MULTIHIT':
      text = user.name() + "zadaje silny cios!\r\n";
      break;

    case 'OBSERVE': // OBSERVE
      text = user.name() + ' skupia si?? i obserwuje ' + target._altName() + '!';
      break;

    case 'OBSERVE TARGET': // OBSERVE TARGET
      //text = user.name() + " observes " + target.name() + ".\r\n";
      text = target.name() + ' ma oko na ' + user._altName() + '!';
      break;

    case 'OBSERVE ALL': // OBSERVE TARGET
      //text = user.name() + " observes " + target.name() + ".\r\n";
      text = user.name() + ' skupia si?? i obserwuje ' + target._altName() + '!';
      text = target.name() + ' ma wszystkich na oku!';
      break;

    case 'SAD POEM':  // SAD POEM
      text = user.name() + ' czyta smutny wiersz.\r\n';
      if (!target._noEffectMessage) {
        text += steppedEmotionStateText('sad', target)
      }
      else { if (target._doesUseAlternateForms()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SMUTNA!', target); // TOvDO: female
      } else if (target._doesUseAlternateForms2()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SMUTNE!', target) // TOvDO: plural
      } else if (target._doesUseAlternateForms3()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SMUTNE!', target) // TOvDO: neutral
      } else {
        text += parseNoEffectEmotion(target.name(), 'bardziej SMUTNY!', target) } }
      break;

    case 'STAB': // STAB
      if (target.name() === $gameActors.actor(8).name()) {
        text = user.name() + ' ci?? d??ga.\r\n';
      } else {
        text = user.name() + ' d??ga ' + target._altName() + '.\r\n';
      }
      text += hpDamageText;
      break;

    case 'TRICK':  // TRICK
      text = user.name() + ' robi psikusa.\r\n';
      if (target.isEmotionAffected("happy")) {
        if (target._doesUseAlternateForms2()) {
          if (!target._noStateMessage) { text += target.name() + ' zwalniaj??!\r\n'; }
          else { text += parseNoStateChange(target.name(), "SZYBKO????", "ju?? bardziej spa????!\r\n", target) }
        } else {
          if (!target._noStateMessage) { text += target.name() + ' zwalnia!\r\n'; }
          else { text += parseNoStateChange(target.name(), "SZYBKO????", "ju?? bardziej spa????!\r\n", target) }
        }
      }
      text += hpDamageText;
      break;

    case 'SHUN': // SHUN
      text = user.name() + ' olewa wroga.\r\n';
      if (target.isEmotionAffected("sad")) {
        if (target._doesUseAlternateForms2()) {
          if (!target._noStateMessage) { text += target.name() + ' opuszczaj?? gard??.\r\n'; }
          else { text += parseNoStateChange(target.name(), "OBRONA", "ju?? bardziej spa????!\r\n", target) }
        } else {
          if (!target._noStateMessage) { text += target.name() + ' opuszcza gard??.\r\n'; }
          else { text += parseNoStateChange(target.name(), "OBRONA", "ju?? bardziej spa????!\r\n", target) }
        }
      }
      text += hpDamageText;
      break;

    case 'MOCK': // MOCK
      text = user.name() + ' drwi sobie z wroga.\r\n';
      text += hpDamageText;
      break;

    case 'HACKAWAY':  // Hack Away
      text = user.name() + ' wywija no??em!';
      break;

    case 'PICK POCKET': //Pick Pocket
      text = user.name() + ' pr??buje co?? zwin???? od ' + target._altName() + '!';
      break;

    case 'BREAD SLICE': //Bread Slice
      text = user.name() + ' ciacha ' + target._altName() +'!\r\n';
      text += hpDamageText;
      break;

    case 'HIDE': // Hide
      text = user.name() + ' wtapia si?? w otoczenie...';
      break;

    case 'QUICK ATTACK': // Quick Attack
      text = user.name() + ' rzuca si?? na ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'EXPLOIT HAPPY': //Exploit Happy
      text = user.name() + ' wzmacnia szcz????cie!\r\n';
      text += hpDamageText;
      break;

    case 'EXPLOIT SAD': // Exploit Sad
      text = user.name() + ' wzmacnia smutek!\r\n';
      text += hpDamageText;
      break;

    case 'EXPLOIT ANGRY': // Exploit Angry
      text = user.name() + ' wzmacnia z??o????!\r\n';
      text += hpDamageText;
      break;

    case 'EXPLOIT EMOTION': // Exploit Emotion
      text = user.name() + " wzmacnia EMOCJE";
      if (text.length >= 34) {
        text = user.name() + ' wzmacnia EMOCJE!\r\n';
      }
      else { text += "\r\n" }
      text += hpDamageText;
      break;

    case 'FINAL STRIKE': // Final Strike
      text = user.name() + ' zadaje sw??j ostateczny cios!';
      break;

    case 'TRUTH': // PAINFUL TRUTH
      text = user.name() + ' co?? szepce.\r\n';
      text += hpDamageText + "\r\n";
      if (!target._noEffectMessage) {
        if (target._doesUseAlternateForms2()) {
          text += target.name() + " czuj?? SMUTEK.\r\n"; // TOvDO: plural
        } else {
          text += target.name() + " czuje SMUTEK.\r\n";
        }
      }
      else { if (target._doesUseAlternateForms()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SMUTNA!\r\n', target); // TOvDO: female
      } else if (target._doesUseAlternateForms2()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SMUTNE!\r\n', target) // TOvDO: plural
      } else if (target._doesUseAlternateForms3()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SMUTNE!\r\n', target) // TOvDO: neutral
      } else {
        text += parseNoEffectEmotion(target.name(), 'bardziej SMUTNY!\r\n', target) } }
      text += steppedEmotionStateText('sad', user)
      break;
    case 'ATTACK AGAIN':  // ATTACK AGAIN 2
      text = user.name() + ' atakuje ponownie!\r\n';
      text += hpDamageText;
      break;

    case 'TRIP':  // TRIP
      text = user.name() + ' podk??ada nog??!\r\n';
      if (!target._noStateMessage) {
        if (target._doesUseAlternateForms2()) {
          text += target.name() + ' zwalniaj??!\r\n'; // TOvDO: plural
        } else {
          text += target.name() + ' zwalnia!\r\n';
        }
      }
      else { text += parseNoStateChange(target.name(), "SZYBKO????", "ju?? bardziej spa????!\r\n", target) }
      text += hpDamageText;
      break;

    case 'TRIP 2':  // TRIP 2
      text = user.name() + ' podk??ada nog??!\r\n';
      if (!target._noStateMessage) {
        if (target._doesUseAlternateForms2()) {
          text += target.name() + ' zwalniaj??!\r\n'; // TOvDO: plural
        } else {
          text += target.name() + ' zwalnia!\r\n';
        }
      }
      else { text += parseNoStateChange(target.name(), "SZYBKO????", "ju?? bardziej spa????!\r\n", target) }
      if (!target._noEffectMessage) {
        if (target._doesUseAlternateForms2()) {
          text += target.name() + ' czuj?? SMUTEK.\r\n'; // TOvDO: plural
        } else {
          text += target.name() + ' czuje SMUTEK.\r\n';
        }
      }
      else { if (target._doesUseAlternateForms()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SMUTNA!\r\n', target); // TOvDO: female
      } else if (target._doesUseAlternateForms2()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SMUTNE!\r\n', target) // TOvDO: plural
      } else if (target._doesUseAlternateForms3()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SMUTNE!\r\n', target) // TOvDO: neutral
      } else {
        text += parseNoEffectEmotion(target.name(), 'bardziej SMUTNY!\r\n', target) } }
      text += hpDamageText;
      break;

    case 'STARE': // STARE
      text = user.name() + ' gapi si?? na ' + target._altName() + '.\r\n';
      if (target._doesUseAlternateForms2()) {
        text += target.name() + ' czuj?? niepok??j.'; // TOvDO: plural
      } else {
        text += target.name() + ' czuje niepok??j.';
      }
      break;

    case 'RELEASE ENERGY':  // RELEASE ENERGY
      text = user.name() + ' z przyjaci????mi ????cz?? si??y i zadaj?? sw??j ostateczny cios!';
      break;

    case 'VERTIGO': // OMORI VERTIGO
      if (target.index() <= unitLowestIndex) {
        text = user.name() + ' wytr??ca wrog??w z r??wnowagi!\r\n';
        text += 'Wrogowie stali si?? s??absi!\r\n';
      }
      text += hpDamageText;
      break;

    case 'CRIPPLE': // OMORI CRIPPLE
      if (target.index() <= unitLowestIndex) {
        text = user.name() + ' parali??uje wrog??w!\r\n';
        text += "Wrogowie spowolnieli.\r\n";
      }
      text += hpDamageText;
      break;

    case 'SUFFOCATE': // OMORI SUFFOCATE
      if (target.index() <= unitLowestIndex) {
        text = user.name() + ' zadusza wrog??w!\r\n';
        text += 'Wrogowie trac?? oddech.\r\n';
        text += "Wrogowie opu??cili gard??.\r\n";
      }
      text += hpDamageText;
      break;

    //AUBREY//
    case 'PEP TALK':  // PEP TALK
      text = user.name() + ' wspiera ' + target._altName() + '!\r\n';
      if (!target._noEffectMessage) {
        text += steppedEmotionStateText('happy', target)
      }
      else { if (target._doesUseAlternateForms()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWA!', target); // TOvDO: female
      } else if (target._doesUseAlternateForms2()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWE!', target) // TOvDO: plural
      } else if (target._doesUseAlternateForms3()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWE!', target) // TOvDO: neutral
      } else {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWY!', target) } }
      break;

    case 'TEAM SPIRIT':  // TEAM SPIRIT
      text = user.name() + ' daje wsparcie!\r\n';
      if (!target._noEffectMessage) {
        text += steppedEmotionStateText('happy', target, '\r\n')
      }
      else { if (target._doesUseAlternateForms()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWA!\r\n', target); // TOvDO: female
      } else if (target._doesUseAlternateForms2()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWE!\r\n', target) // TOvDO: plural
      } else if (target._doesUseAlternateForms3()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWE!\r\n', target) // TOvDO: neutral
      } else {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWY!\r\n', target) } }
      if (!user._noEffectMessage) {
        text += steppedEmotionStateText('happy', user)
      }
      else { if (user._doesUseAlternateForms()) {
        text += parseNoEffectEmotion(user.name(), 'bardziej SZCZ????LIWA!', user); // TOvDO: female
      } else {
        text += parseNoEffectEmotion(user.name(), 'bardziej SZCZ????LIWY!', user) } }
      break;

    case 'HEADBUTT':  // HEADBUTT
      text = user.name() + ' uderza ' + target._altName() + ' z g????wki!\r\n';
      text += hpDamageText;
      break;

    case 'HOMERUN': // Homerun
      text = user.name() + ' wykopuje wroga z parku!\r\n';
      text += hpDamageText;
      break;

    case 'THROW': // Wind-up Throw
      text = user.name() + ' rzuca broni??!';
      break;

    case 'POWER HIT': //Power Hit
      text = user.name() + ' rozgniata wroga!\r\n';
      if (!target._noStateMessage) {
        if (target._doesUseAlternateForms2()) {
          text += target.name() + ' opuszczaj?? gard??.\r\n'; // TOvDO: plural
        } else {
          text += target.name() + ' opuszcza gard??.\r\n';
        }
      }
      else { text += parseNoStateChange(target.name(), "OBRONA", "ju?? bardziej spa????!\r\n", target) }
      text += hpDamageText;
      break;

    case 'LAST RESORT': // Last Resort
      text = user.name() + ' uderza ' + target._altName() + ' z ca??ej si??y!\r\n';
      text += hpDamageText;
      break;

    case 'COUNTER ATTACK': // Counter Attack
      text = user.name() + ' przygotowuje sw??j kij!';
      break;

    case 'COUNTER HEADBUTT': // Counter Headbutt
      text = user.name() + ' przygotowuje swoj?? g??ow??!';
      break;

    case 'COUNTER ANGRY': //Counter Angry
      text = user.name() + ' si?? broni!';
      break;

    case 'LOOK OMORI 1':  // Look at Omori 2
      text = 'OMORI nie zauwa??a ' + user.name() + ', wi??c ' + user.name() + ' atakuje ponownie!\r\n';
      text += hpDamageText;
      break;

    case 'LOOK OMORI 2': // Look at Omori 2
      text = 'OMORI wci???? nie zauwa??a ' + user.name() + ', wi??c ' + user.name() + ' uderza mocniej!\r\n';
      text += hpDamageText;
      break;

    case 'LOOK OMORI 3': // Look at Omori 3
      text = 'OMORI w ko??cu zauwa??a ' + user.name() + '!\r\n';
      text += user.name() + ' szcz????liwie wymachuje kijem!\r\n';
      text += hpDamageText;
      break;

    case 'LOOK KEL 1':  // Look at Kel 1
      text = 'KEL wnerwia AUBREY!\r\n';
      text += target.name() + " czuje Z??O????!";
      break;

    case 'LOOK KEL 2': // Look at Kel 2
      text = 'KEL wnerwia AUBREY!\r\n';
      text += 'KEL i AUBREY s?? silniejsi!\r\n';
      var AUBREY = $gameActors.actor(2);
      var KEL = $gameActors.actor(3);
      if (AUBREY.isStateAffected(14) && KEL.isStateAffected(14)) { text += 'KEL i AUBREY czuj?? Z??O????!'; }
      else if (AUBREY.isStateAffected(14) && KEL.isStateAffected(15)) {
        text += 'KEL jest WKURZONY!!\r\n';
        text += 'AUBREY czuje Z??O????!';
      }
      else if (AUBREY.isStateAffected(15) && KEL.isStateAffected(14)) {
        text += 'KEL czuje Z??O????!\r\n';
        text += 'AUBREY jest WKURZONA!!';
      }
      else if (AUBREY.isStateAffected(15) && KEL.isStateAffected(15)) { text += 'KEL i AUBREY s?? WKURZENI!!'; }
      else { text += 'KEL i AUBREY czuj?? Z??O????!'; }
      break;

    case 'LOOK HERO':  // LOOK AT HERO 1
      text = 'HERO prosi AUBREY o skupienie!\r\n';
      text += steppedEmotionStateText('happy', user, '\r\n')
      text += user.name() + ' podnosi gard??!!';
      break;

    case 'LOOK HERO 2': // LOOK AT HERO 2
      text = 'HERO kibicuje AUBREY!\r\n';
      text += 'AUBREY podnosi gard??!!\r\n';
      text += steppedEmotionStateText('happy', user, '\r\n')
      if (!!$gameTemp._statsState[0]) {
        var absHp = Math.abs($gameTemp._statsState[0] - $gameActors.actor(2).hp);
        if (absHp > 0) { text += `AUBREY odzyskuje ${absHp} SERC!\r\n`; }
      }
      if (!!$gameTemp._statsState[1]) {
        var absMp = Math.abs($gameTemp._statsState[1] - $gameActors.actor(2).mp);
        if (absMp > 0) { text += `AUBREY odzyskuje ${absMp} SOKU...`; }
      }
      $gameTemp._statsState = undefined;
      break;

    case 'TWIRL': // ATTACK
      text = user.name() + ' atakuje ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    //KEL//
    case 'ANNOY':  // ANNOY
      text = user.name() + ' jest irytuj??cy!\r\n';
      if (!target._noEffectMessage) {
        text += steppedEmotionStateText('angry', target)
      }
      else { if (target._doesUseAlternateForms()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej Z??A!', target); // TOvDO: female
      } else if (target._doesUseAlternateForms2()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej Z??E!', target) // TOvDO: plural
      } else if (target._doesUseAlternateForms3()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej Z??E!', target) // TOvDO: neutral
      } else {
        text += parseNoEffectEmotion(target.name(), 'bardziej Z??Y!', target) } }
      break;

    case 'REBOUND':  // REBOUND
      text = 'Pi??ka KELA odbija si?? wsz??dzie!';
      break;

    case 'FLEX':  // FLEX
      text = user.name() + ' ci??nie i czuje si?? mistrzem!\r\n';
      text += user.name() + " jest celniejszy!\r\n"
      break;

    case 'JUICE ME': // SOKU ME
      text = user.name() + ' podaje KOKOSA!\r\n'
      var absMp = Math.abs(mpDam);
      if (absMp > 0) {
        text += `${target.name()} odzyskuje ${absMp} SOKU...\r\n`
      }
      text += hpDamageText;
      break;

    case 'RALLY': // RALLY
      text = user.name() + ' podkr??ca atmosfer??!\r\n';
      text += steppedEmotionStateText('happy', user, '\r\n')
      text += "Ka??dy zdobywa ENERGI??!\r\n"
      for (let actor of $gameParty.members()) {
        if (actor.name() === $gameActors.actor(3).name()) { continue; }
        var result = actor.result();
        if (result.mpDamage >= 0) { continue; }
        var absMp = Math.abs(result.mpDamage);
        text += `${actor.name()} odzyskuje ${absMp} SOKU...\r\n`
      }
      break;

    case 'SNOWBALL': // SNOWBALL
      text = user.name() + ' rzuca ??NIE??K?? w ' + target._altName() + '!\r\n';
      if (!target._noEffectMessage) {
        if (target._doesUseAlternateForms2()) {
          text += target.name() + " czuj?? SMUTEK.\r\n"; // TOvDO: plural
        } else {
          text += target.name() + " czuje SMUTEK.\r\n";
        }
      }
      else { if (target._doesUseAlternateForms()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SMUTNA!\r\n', target); // TOvDO: female
      } else if (target._doesUseAlternateForms2()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SMUTNE!\r\n', target) // TOvDO: plural
      } else if (target._doesUseAlternateForms3()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SMUTNE!\r\n', target) // TOvDO: neutral
      } else {
        text += parseNoEffectEmotion(target.name(), 'bardziej SMUTNY!\r\n', target) } }
      text += hpDamageText;
      break;

    case 'TICKLE': // TICKLE
      text = user.name() + ' ??askocze ' + target._altName() + '!\r\n';
      if (target._doesUseAlternateForms2()) {
        text += `${target.name()} trac?? czujno????!` // TOvDO: plural
      } else {
        text += `${target.name()} traci czujno????!`
      }
      break;

    case 'RICOCHET': // RICOCHET
      text = user.name() + ' robi odjazdowe triki z pi??k??!\r\n';
      text += hpDamageText;
      break;

    case 'CURVEBALL': // CURVEBALL
      text = user.name() + ' rzuca podkr??con??...\r\n';
      if (target._doesUseAlternateForms2()) {
        text += target.name() + ' wytr??caj?? si?? z r??wnowagi.\r\n'; // TOvDO: plural
      } else {
        text += target.name() + ' wytr??ca si?? z r??wnowagi.\r\n';
      }
      switch ($gameTemp._randomState) {
        case 6:
          if(!target._noEffectMessage) {
            if (target._doesUseAlternateForms2()) {
              text += target.name() + " czuj?? SZCZ????CIE!\r\n"; // TOvDO: plural
            } else {
              text += target.name() + " czuje SZCZ????CIE!\r\n";
            }
          }
          else { if (target._doesUseAlternateForms()) {
            text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWA!\r\n', target); // TOvDO: female
          } else if (target._doesUseAlternateForms2()) {
            text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWE!\r\n', target) // TOvDO: plural
          } else if (target._doesUseAlternateForms3()) {
            text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWE!\r\n', target) // TOvDO: neutral
          } else {
            text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWY!\r\n', target) } }
          break;
        case 14:
          if(!target._noEffectMessage) {
            if (target._doesUseAlternateForms2()) {
              text += target.name() + " czuj?? Z??O????!\r\n"; // TOvDO: plural
            } else {
              text += target.name() + " czuje Z??O????!\r\n";
            }
          }
          else { if (target._doesUseAlternateForms()) {
            text += parseNoEffectEmotion(target.name(), 'bardziej Z??A!\r\n', target); // TOvDO: female
          } else if (target._doesUseAlternateForms2()) {
            text += parseNoEffectEmotion(target.name(), 'bardziej Z??E!\r\n', target) // TOvDO: plural
          } else if (target._doesUseAlternateForms3()) {
            text += parseNoEffectEmotion(target.name(), 'bardziej Z??E!\r\n', target) // TOvDO: neutral
          } else {
            text += parseNoEffectEmotion(target.name(), 'bardziej Z??Y!\r\n', target) } }
          break;
        case 10:
          if(!target._noEffectMessage) {
            if (target._doesUseAlternateForms2()) {
              text += target.name() + " czuj?? SMUTEK.\r\n"; // TOvDO: plural
            } else {
              text += target.name() + " czuje SMUTEK.\r\n";
            }
          }
          else { if (target._doesUseAlternateForms()) {
            text += parseNoEffectEmotion(target.name(), 'bardziej SMUTNA!\r\n', target); // TOvDO: female
          } else if (target._doesUseAlternateForms2()) {
            text += parseNoEffectEmotion(target.name(), 'bardziej SMUTNE!\r\n', target) // TOvDO: plural
          } else if (target._doesUseAlternateForms3()) {
            text += parseNoEffectEmotion(target.name(), 'bardziej SMUTNE!\r\n', target) // TOvDO: neutral
          } else {
            text += parseNoEffectEmotion(target.name(), 'bardziej SMUTNY!\r\n', target) } }
          break;
      }
      text += hpDamageText;
      break;

    case 'MEGAPHONE': // MEGAPHONE
      if (target.index() <= unitLowestIndex) { text = user.name() + ' biega w k????ko i wszystkich wkurza!\r\n'; }
      text += steppedEmotionStateText('angry', target, '\r\n')
      break;

    case 'DODGE ATTACK': // DODGE ATTACK
      text = user.name() + ' szykuje si?? na unik!';
      break;

    case 'DODGE ANNOY': // DODGE ANNOY
      text = user.name() + ' zaczyna dokucza?? wrogom!';
      break;

    case 'DODGE TAUNT': // DODGE TAUNT
      text = user.name() + ' zaczyna drwi?? z wrog??w!\r\n';
      text += "CELNO???? wrog??w spad??a na tur??!"
      break;

    case 'PASS OMORI':  // KEL PASS OMORI
      text = 'OMORI si?? zagapi?? i zosta?? pacni??ty!\r\n';
      text += 'OMORI otrzymuje 1 obra??enie!';
      break;

    case 'PASS OMORI 2': //KEL PASS OMORI 2
      text = 'OMORI ??apie pi??k?? KELA!\r\n';
      text += 'OMORI rzuca pi??k?? w ' + target._altName() + '!\r\n';
      var OMORI = $gameActors.actor(1);
      if (OMORI.isStateAffected(6)) { text += "OMORI czuje SZCZ????CIE!\r\n" }
      else if (OMORI.isStateAffected(7)) { text += "OMORI jest RADOSNY!!\r\n" }
      text += hpDamageText;
      break;

    case 'PASS AUBREY':  // KEL PASS AUBREY
      text = 'AUBREY wykupuje pi??k?? z parku!\r\n';
      text += hpDamageText;
      break;

    case 'PASS HERO':  // KEL PASS HERO
      if (target.index() <= unitLowestIndex) { text = user.name() + ' ogrywa wrog??w!\r\n'; }
      text += hpDamageText;
      break;

    case 'PASS HERO 2':  // KEL PASS HERO
      if (target.index() <= unitLowestIndex) {
        text = user.name() + ' stylowo ogrywa wrog??w!\r\n';
        text += "Wrogowie stali si?? s??absi!\r\n";
      }
      text += hpDamageText;
      break;

    //HERO//
    case 'MASSAGE':  // MASSAGE
      text = user.name() + ' robi masa??!\r\n';
      if (!!target.isAnyEmotionAffected(true)) {
        if (target._doesUseAlternateForms2()) {
          text += target.name() + ' si?? uspokajaj??...'; // TOvDO: plural
        } else {
          text += target.name() + ' si?? uspokaja...';
        }
      }
      else { text += "Nie pomaga..." }
      break;

    case 'COOK':  // COOK
      text = user.name() + ' piecze ciastko!';
      break;

    case 'FAST FOOD': //FAST FOOD
      text = user.name() + ' przygotowuje szybkie danie.';
      break;

    case 'SOKU': // SOKU
      text = user.name() + ' przygotowuje przek??sk??.';
      break;

    case 'SMILE':  // SMILE
      text = user.name() + ' si?? u??miecha!\r\n';
      if (!target._noStateMessage) {
        if (target._doesUseAlternateForms2()) {
          text += target.name() + ' s??abn??.'; // TOvDO: plural
        } else {
          text += target.name() + ' s??abnie.';
        }
      }
      else { text += parseNoStateChange(target.name(), "ATAK", "ju?? bardziej spa????!\r\n", target) }
      break;
    case 'DAZZLE':
      text = user.name() + ' si?? u??miecha!\r\n';
      if (!target._noStateMessage) { text += target.name() + ' s??abnie.\r\n'; }
      else { text += parseNoStateChange(target.name(), "ATAK", "ju?? bardziej spa????!\r\n", target) }
      if (!target._noEffectMessage) {
        if (target._doesUseAlternateForms2()) {
          text += target.name() + ' czuj?? SZCZ????CIE!'; // TOvDO: plural
        } else {
          text += target.name() + ' czuje SZCZ????CIE!';
        }
      }
      else { if (target._doesUseAlternateForms()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWA!', target); // TOvDO: female
      } else if (target._doesUseAlternateForms2()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWE!', target) // TOvDO: plural
      } else if (target._doesUseAlternateForms3()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWE!', target) // TOvDO: neutral
      } else {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWY!', target) } }
      break;
    case 'TENDERIZE': // TENDERIZE
      text = user.name() + ' robi intensywny masa??!\r\n';
      if (!target._noStateMessage) {
        if (target._doesUseAlternateForms2()) {
          text += target.name() + ' opuszczaj?? gard??!\r\n'; // TOvDO: plural
        } else {
          text += target.name() + ' opuszcza gard??!\r\n';
        }
      }
      else { text += parseNoStateChange(target.name(), "OBRONA", "ju?? bardziej spa????!\r\n", target) }
      text += hpDamageText;
      break;

    case 'SNACK TIME':  // SNACK TIME
      text = user.name() + ' piecze ciastka dla wszystkich!';
      break;

    case 'TEA TIME': // TEA TIME
      text = user.name() + ' wyci??ga herbatk??.\r\n';
      if (target._doesUseAlternateForms()) {
        text += target.name() + ' czuje si?? orze??wiona!\r\n'; // TOvDO: female
      } else if (target._doesUseAlternateForms2()) {
        text += target.name() + ' czuj?? si?? orze??wione!\r\n'; // TOvDO: plural
      } else if (target._doesUseAlternateForms3()) {
        text += target.name() + ' czuje si?? orze??wione!\r\n'; // TOvDO: neutral
      } else {
        text += target.name() + ' czuje si?? orze??wiony!\r\n';
      }
      if (result.hpDamage < 0) {
        var absHp = Math.abs(result.hpDamage);
        text += `${target.name()} odzyskuje ${absHp} SERC!\r\n`
      }
      if (result.mpDamage < 0) {
        var absMp = Math.abs(result.mpDamage);
        text += `${target.name()} odzyskuje ${absMp} SOKU...\r\n`
      }
      break;

    case 'SPICY FOOD': // SPICY FOOD
      text = user.name() + ' gotuje co?? ostrego!\r\n';
      text += hpDamageText;
      break;

    case 'SINGLE TAUNT': // SINGLE TAUNT
      text = user.name() + ' przykuwa uwag?? wroga.';
      break;

    case 'TAUNT':  // TAUNT
      text = user.name() + ' przykuwa uwag?? wroga.';
      break;

    case 'SUPER TAUNT': // SUPER TAUNT
      text = user.name() + ' przykuwa uwag?? wroga.\r\n';
      text += user.name() + ' przygotowuje si?? na odparcie ataku.';
      break;

    case 'ENCHANT':  // ENCHANT
      text = user.name() + ' u??miechem przykuwa uwag?? wroga.\r\n';
      if (!target._noEffectMessage) {
        if (target._doesUseAlternateForms2()) {
          text += target.name() + " czuj?? SZCZ????CIE!\r\n"; // TOvDO: plural
        } else {
          text += target.name() + " czuje SZCZ????CIE!\r\n";
        }
      }
      else { if (target._doesUseAlternateForms()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWA!', target); // TOvDO: female
      } else if (target._doesUseAlternateForms2()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWE!', target) // TOvDO: plural
      } else if (target._doesUseAlternateForms3()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWE!', target) // TOvDO: neutral
      } else {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWY!', target) } }
      break;
    case 'MENDING': //MENDING
      text = user.name() + ' si?? przymila.\r\n';
      text += user.name() + ' jest teraz osobistym kucharzem wroga!';
      break;

    case 'SHARE FOOD': //SHARE FOOD
      if (target.name() !== user.name()) {
        text = user.name() + ' dzieli si?? jedzeniem!'
      }
      break;

    case 'CALL OMORI':  // CALL OMORI
      text = user.name() + ' daje sygna?? OMORIEMU!\r\n';
      if (!!$gameTemp._statsState[0]) {
        var absHp = Math.abs($gameTemp._statsState[0] - $gameActors.actor(1).hp);
        if (absHp > 0) { text += `OMORI odzyskuje ${absHp} SERC!\r\n`; }
      }
      if (!!$gameTemp._statsState[1]) {
        var absMp = Math.abs($gameTemp._statsState[1] - $gameActors.actor(1).mp);
        if (absMp > 0) { text += `OMORI odzyskuje ${absMp} SOKU...`; }
      }
      $gameTemp._statsState = undefined;
      break;

    case 'CALL KEL':  // CALL KEL
      text = user.name() + ' podkr??ca KELA!\r\n';
      if (!!$gameTemp._statsState[0]) {
        var absHp = Math.abs($gameTemp._statsState[0] - $gameActors.actor(3).hp);
        if (absHp > 0) { text += `KEL odzyskuje ${absHp} SERC!\r\n`; }
      }
      if (!!$gameTemp._statsState[1]) {
        var absMp = Math.abs($gameTemp._statsState[1] - $gameActors.actor(3).mp);
        if (absMp > 0) { text += `KEL odzyskuje ${absMp} SOKU...`; }
      }
      break;

    case 'CALL AUBREY':  // CALL AUBREY
      text = user.name() + ' zach??ca AUBREY!\r\n';
      if (!!$gameTemp._statsState[0]) {
        var absHp = Math.abs($gameTemp._statsState[0] - $gameActors.actor(2).hp);
        if (absHp > 0) { text += `AUBREY odzyskuje ${absHp} SERC!\r\n`; }
      }
      if (!!$gameTemp._statsState[1]) {
        var absMp = Math.abs($gameTemp._statsState[1] - $gameActors.actor(2).mp);
        if (absMp > 0) { text += `AUBREY odzyskuje ${absMp} SOKU...`; }
      }
      break;

    //PLAYER//
    case 'CALM DOWN':  // PLAYER CALM DOWN
      if (item.id !== 1445) { text = user.name() + ' si?? uspokaja.\r\n'; } // Process if Calm Down it's not broken;
      if (Math.abs(hpDam) > 0) { text += user.name() + ' odzyskuje ' + Math.abs(hpDam) + ' SERC!'; }
      break;

    case 'FOCUS':  // PLAYER FOCUS
      text = user.name() + ' si?? skupia.';
      break;

    case 'PERSIST':  // PLAYER PERSIST
      text = user.name() + ' si?? upiera.';
      break;

    case 'OVERCOME':  // PLAYER OVERCOME
      text = user.name() + ' si?? prze??amuje.';
      break;

    //UNIVERSAL//
    case 'FIRST AID':  // FIRST AID
      text = user.name() + ' si?? stara!\r\n';
      text += target.name() + ' odzyskuje ' + Math.abs(target._result.hpDamage) + ' SERC!';
      break;

    case 'PROTECT':  // PROTECT
      text = user.name() + ' wysuwa si?? naprz??d!';
      break;

    case 'GAURD': // GAURD
      text = user.name() + ' przygotowuje si?? do odparcia ataku.';
      break;

    //FOREST BUNNY//
    case 'BUNNY ATTACK': // FOREST BUNNY ATTACK
      text = user.name() + ' skubie ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'BUNNY NOTHING': // BUNNY DO NOTHING
      text = user.name() + ' skacze doko??a!';
      break;

    case 'BE CUTE':  // BE CUTE
      text = user.name() + ' mruga na ' + target._altName() + '!\r\n';
      text += target.name() + ' s??abnie...';
      break;

    case 'SAD EYES': //SAD EYES
      text = user.name() + ' wpatruje si?? smutnym wzrokiem na ' + target._altName() + '.\r\n';
      if (!target._noEffectMessage) { text += target.name() + ' czuje SMUTEK.'; }
      else { if (target._doesUseAlternateForms()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SMUTNA!', target); // TOvDO: female
      } else if (target._doesUseAlternateForms2()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SMUTNE!', target) // TOvDO: plural
      } else if (target._doesUseAlternateForms3()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SMUTNE!', target) // TOvDO: neutral
      } else {
        text += parseNoEffectEmotion(target.name(), 'bardziej SMUTNY!', target) } }
      break;

    //FOREST BUNNY?//
    case 'BUNNY ATTACK2': // BUNNY? ATTACK
      text = user.name() + ' skubie ' + target.name() + '?\r\n';
      text += hpDamageText;
      break;

    case 'BUNNY NOTHING2':  // BUNNY? DO NOTHING
      text = user.name() + ' skacze doko??a?';
      break;

    case 'BUNNY CUTE2':  // BE CUTE?
      text = user.name() + ' mruga na ' + target._altName() + '?\r\n';
      text += target.name() + ' s??abnie?';
      break;

    case 'SAD EYES2': // SAD EYES?
      text = user.name() + ' wpatruje si?? smutnym wzrokiem na ' + target._altName() + '...\r\n';
      if (!target._noEffectMessage) { text += target.name() + ' czuje SMUTEK?'; }
      else { if (target._doesUseAlternateForms()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SMUTNA?', target); // TOvDO: female
      } else if (target._doesUseAlternateForms2()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SMUTNE?', target) // TOvDO: plural
      } else if (target._doesUseAlternateForms3()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SMUTNE?', target) // TOvDO: neutral
      } else {
        text += parseNoEffectEmotion(target.name(), 'bardziej SMUTNY?', target) } }
      break;

    //SPROUT MOLE//
    case 'SPROUT ATTACK':  // SPROUT MOLE ATTACK
      text = user.name() + ' uderza w ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SPROUT NOTHING':  // SPROUT NOTHING
      text = user.name() + ' si?? kr??ci.';
      break;

    case 'RUN AROUND':  // RUN AROUND
      text = user.name() + ' biega w k????ko!';
      break;

    case 'HAPPY RUN AROUND': //HAPPY RUN AROUND
      text = user.name() + ' energicznie biega w k????ko!';
      break;

    //MOON BUNNY//
    case 'MOON ATTACK':  // MOON BUNNY ATTACK
      text = user.name() + ' wpada na ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'MOON NOTHING':  // MOON BUNNY NOTHING
      text = user.name() + ' odlatuje my??lami w kosmos.';
      break;

    case 'BUNNY BEAM':  // BUNNY BEAM
      text = user.name() + ' strzela laserem!\r\n';
      text += hpDamageText;
      break;

    //DUST BUNNY//
    case 'DUST NOTHING':  // DUST NOTHING
      text = user.name() + ' z ca??ych si?? pr??buje si?? nie rozlecie??.';
      break;

    case 'DUST SCATTER':  // DUST SCATTER
      text = user.name() + ' wybucha!';
      break;

    //U.F.O//
    case 'UFO ATTACK':  // UFO ATTACK
      text = user.name() + ' wpada na ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'UFO NOTHING':  // UFO NOTHING
      text = user.name() + ' traci zainteresowanie.';
      break;

    case 'STRANGE BEAM':  // STRANGE BEAM
      text = user.name() + ' b??yska dziwnym ??wiat??em!\r\n';
      text += target.name() + " czuje losow?? EMOCJ??!"
      break;

    case 'ORANGE BEAM':  // ORANGE BEAM
      text = user.name() + ' ??wieci pomara??czowym laserem!\r\n';
      text += hpDamageText;
      break;

    //VENUS FLYTRAP//
    case 'FLYTRAP ATTACK':  // FLYTRAP ATTACK
      text = user.name() + ' uderza ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'FLYTRAP NOTHING':  // FLYTRAP NOTHING
      text = user.name() + ' ostrzy k??y.';
      break;

    case 'FLYTRAP CRUNCH':  // FLYTRAP
      text = user.name() + ' gryzie ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    //WORMHOLE//
    case 'WORM ATTACK':  // WORM ATTACK
      text = user.name() + ' klepie ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'WORM NOTHING':  // WORM NOTHING
      text = user.name() + ' si?? wierci...';
      break;

    case 'OPEN WORMHOLE':  // OPEN WORMHOLE
      text = user.name() + ' otwiera tunel czasoprzestrzenny!';
      break;

    //MIXTAPE//
    case 'MIXTAPE ATTACK':  // MIXTAPE ATTACK
      text = user.name() + ' policzkuje ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'MIXTAPE NOTHING':  // MIXTAPE NOTHING
      text = user.name() + ' si?? rozpl??tuje.';
      break;

    case 'TANGLE':  // TANGLE
      text = target.name() + ' opl??tuje si?? wok???? wroga!\r\n';
      text += target.name() + ' s??abnie...';
      break;

    //DIAL-UP//
    case 'DIAL ATTACK':  // DIAL ATTACK
      text = user.name() + ' przerywa.\r\n';
      var pronumn = target.name() === $gameActors.actor(2).name() ? "her" : "him";
      text += `${target.name()} rani si?? ze z??o??ci!\r\n`;
      text += hpDamageText;
      break;

    case 'DIAL NOTHING':  // DIAL NOTHING
      text = user.name() + ' szuka zasi??gu...';
      break;

    case 'DIAL SLOW':  // DIAL SLOW
      text = user.name() + ' zwaaaaaaaaaalnia.\r\n';
      text += 'Wszyscy spowolnieli...';
      break;

    //DOOMBOX//
    case 'DOOM ATTACK':  // DOOM ATTACK
      text = user.name() + ' wpada na ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'DOOM NOTHING':  // DOOM NOTHING
      text = user.name() + ' reguluje odbiornik.';
      break;

    case 'BLAST MUSIC':  // BLAST MUSIC
      text = user.name() + ' zapodaje niez??y kawa??ek!';
      break;

    //SHARKPLANE//
    case 'SHARK ATTACK':  // SHARK PLANE
      text = user.name() + ' wpada na ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SHARK NOTHING':  // SHARK NOTHING
      text = user.name() + ' d??ubie w z??bach.';
      break;

    case 'OVERCLOCK ENGINE':  // OVERCLOCK ENGINE
      text = user.name() + ' odpala silnik!\r\n';
      if (!target._noStateMessage) {
        text += user.name() + ' przyspiesza!';
      }
      else { text += parseNoStateChange(user.name(), "SZYBKO????", "ju?? bardziej wzrosn????!", user) }
      break;

    case 'SHARK CRUNCH':  // SHARK
      text = user.name() + ' gryzie ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    //SNOW BUNNY//
    case 'SNOW BUNNY ATTACK':  // SNOW ATTACK
      text = user.name() + ' kopie ??niegiem w ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SNOW NOTHING':  // SNOW NOTHING
      text = user.name() + ' bierze to na ch??odno.';
      break;

    case 'SMALL SNOWSTORM':  // SMALL SNOWSTORM
      text = user.name() + ' zrzuca ??nieg na wszystkich, powoduj??c najmniejsz?? na ??wiecie ??nie??yc??!';
      break;

    //SNOW ANGEL//
    case 'SNOW ANGEL ATTACK': //SNOW ANGEL ATTACK
      text = user.name() + ' dotyka ' + target._altName() + '\r\n';
      text += 'swoimi zimnymi d??o??mi.\r\n';
      text += hpDamageText;
      break;

    case 'UPLIFTING HYMN': //UPLIFTING HYMN
      if (target.index() <= unitLowestIndex) {
        text = user.name() + ' ??piewa pi??kn?? pie????...\r\n';
        text += 'Wszyscy czuj?? SZCZ????CIE!';
      }
      target._noEffectMessage = undefined;
      break;

    case 'PIERCE SERC': //PIERCE SERC
      text = user.name() + ' przeszywa SERCE ' + target._altName() + '.\r\n';
      text += hpDamageText;
      break;

    //SNOW PILE//
    case 'SNOW PILE ATTACK': //SNOW PILE ATTACK
      text = user.name() + ' rzuca ??niegiem w ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SNOW PILE NOTHING': //SNOW PILE NOTHING
      text = user.name() + ' czuje, ??e j?? mrozi.';
      break;

    case 'SNOW PILE ENGULF': //SNOW PILE ENGULF
      text = user.name() + ' zatapia w ??niegu' + target._altName() + '!\r\n';
      text += user.name() + ' zwalnia.\r\n';
      text += user.name() + ' opuszcza gard??.';
      break;

    case 'SNOW PILE MORE SNOW': //SNOW PILE MORE SNOW
      text = user.name() + ' tarza si?? w ??niegu!\r\n';
      text += user.name() + ' wzmacnia si??!\r\n';
      text += user.name() + ' podnosi gard??!';
      break;

    //CUPCAKE BUNNY//
    case 'CCB ATTACK': //CUP CAKE BUNNY ATTACK
      text = user.name() + ' wpada na ' + target._altName() + '.\r\n';
      text += hpDamageText;
      break;

    case 'CCB NOTHING': //CUP CAKE BUNNY NOTHING
      text = user.name() + ' skacze w miejscu.';
      break;

    case 'CCB SPRINKLES': //CUP CAKE BUNNY SPRINKLES
      text = user.name() + ' obsypuje posypk?? ' + target._altName() + '.\r\n';
      if (!target._noEffectMessage) { text += target.name() + ' czuje SZCZ????CIE!\r\n'; }
      else { if (target._doesUseAlternateForms()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWA!\r\n', target); // TOvDO: female
      } else if (target._doesUseAlternateForms2()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWE!\r\n', target) // TOvDO: plural
      } else if (target._doesUseAlternateForms3()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWE!\r\n', target) // TOvDO: neutral
      } else {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWY!\r\n', target) } }
      text += "Statystyki " + target._altName() + " wzros??y!"
      break;

    //MILKSHAKE BUNNY//
    case 'MSB ATTACK': //MILKSHAKE BUNNY ATTACK
      text = user.name() + ' wylewa mleczny koktajl na ' + target._altName() + '.\r\n';
      text += hpDamageText;
      break;

    case 'MSB NOTHING': //MILKSHAKE BUNNY NOTHING
      text = user.name() + ' kr??ci si?? w k????ko.';
      break;

    case 'MSB SHAKE': //MILKSHAKE BUNNY SHAKE
      text = user.name() + ' zaczyna trz?????? si?? jak szalony!\r\n';
      text += 'Wszystko jest w koktajlu!';
      break;

    //PANCAKE BUNNY//
    case 'PAN ATTACK': //PANCAKE BUNNY ATTACK
      text = user.name() + ' skubie ' + target._altName() + '.\r\n';
      text += hpDamageText;
      break;

    case 'PAN NOTHING': //PANCAKE BUNNY NOTHING
      text = user.name() + ' robi salto!\r\n';
      text += 'Co za talent!';
      break;

    //STRAWBERRY SHORT SNAKE//
    case 'SSS ATTACK': //STRAWBERRY SHORT SNAKE ATTACK
      text = user.name() + ' wbija k??y w ' + target._altName() + '.\r\n';
      text += hpDamageText;
      break;

    case 'SSS NOTHING': //STRAWBERRY SHORT SNAKE NOTHING
      text = user.name() + ' syczy.';
      break;

    case 'SSS SLITHER': //STRAWBERRY SHORT SNAKE SLITHER
      text = user.name() + ' szcz????liwie pe??za!\r\n';
      if (!user._noEffectMessage) { text += user.name() + ' czuje SZCZ????CIE!'; }
      else { if (user._doesUseAlternateForms()) {
        text += parseNoEffectEmotion(user.name(), 'bardziej SZCZ????LIWA!', user); // TOvDO: female
      } else {
        text += parseNoEffectEmotion(user.name(), 'bardziej SZCZ????LIWY!', user) } }
      break;

    //PORCUPIE//
    case 'PORCUPIE ATTACK': //PORCUPIE ATTACK
      text = user.name() + ' szturcha ' + target._altName() + '.\r\n';
      text += hpDamageText;
      break;

    case 'PORCUPIE NOTHING': //PORCUPIE NOTHING
      text = user.name() + ' niucha.';
      break;

    case 'PORCUPIE PIERCE': //PORCUPIE PIERCE
      text = user.name() + ' wbija si?? w ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    //BUN BUNNY//
    case 'BUN ATTACK': //BUN ATTACK
      text = user.name() + ' wpada na ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'BUN NOTHING': //BUN NOTHING
      text = user.name() + ' wyrasta.';
      break;

    case 'BUN HIDE': //BUN HIDE
      text = user.name() + ' dostaje wypiek??w.';
      break;

    //TOASTY//
    case 'TOASTY ATTACK': //TOASTY ATTACK
      text = user.name() + ' wpada w ' + target._altName() + '.\r\n';
      text += hpDamageText;
      break;

    case 'TOASTY NOTHING': //TOASTY NOTHING
      text = user.name() + ' d??ubie w nosie.';
      break;

    case 'TOASTY RILE': //TOASTY RILE
      if (target.index() <= unitLowestIndex) {
        text = user.name() + ' wyg??asza kontrowersyjn?? przemow??!\r\n';
        text += 'Wszyscy czuj?? Z??O????!';
      }
      target._noEffectMessage = undefined;
      break;

    //SOURDOUGH//
    case 'SOUR ATTACK': //SOURDOUGH ATTACK
      text = user.name() + ' depcze po palcach ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SOUR NOTHING': //SOURDOUGH NOTHING
      text = user.name() + ' kopie piach.';
      break;

    case 'SOUR BAD WORD': //SOURDOUGH BAD WORD
      text = 'O nie! ' + user.name() + ' m??wi brzydkie s??owo!\r\n';
      text += hpDamageText;
      break;

    //SESAME//
    case 'SESAME ATTACK': //SESAME ATTACK
      text = user.name() + ' rzuca ziarnem w ' + target._altName() + '.\r\n';
      text += hpDamageText;
      break;

    case 'SESAME NOTHING': //SESAME Nothing
      text = user.name() + ' drapie si?? po g??owie.';
      break;

    case 'SESAME ROLL': //SESAME BREAD ROLL
      if (target.index() <= unitLowestIndex) {
        text = user.name() + ' tarza si?? po wszystkich!\r\n';
      }
      text += hpDamageText;
      break;

    //CREEPY PASTA//
    case 'CREEPY ATTACK': //CREEPY ATTACK
      text = user.name() + ' sprawia, ??e ' + target.name() + ' czuje si?? niekomfortowo.\r\n';
      text += hpDamageText;
      break;

    case 'CREEPY NOTHING': //CREEPY NOTHING
      text = user.name() + ' gro??nie... nie robi nic!';
      break;

    case 'CREEPY SCARE': //CREEPY SCARE
      text = user.name() + ' pokazuje wszystkim ich najgorsze koszmary!';
      break;

    //COPY PASTA//
    case 'COPY ATTACK': //COPY ATTACK
      text = user.name() + ' uderza ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'DUPLICATE': //DUPLICATE
      text = user.name() + ' si?? kopiuje! ';
      break;

    //HUSH PUPPY//
    case 'HUSH ATTACK': //HUSH ATTACK
      text = user.name() + ' uderza w ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'HUSH NOTHING': //HUSH NOTHING
      text = user.name() + ' pr??buje szczeka??...\r\n';
      text += 'Ale nie wyda?? z siebie ??adnego d??wi??ku...';
      break;

    case 'MUFFLED SCREAMS': //MUFFLED SCREAMS
      text = user.name() + ' zaczyna kukurycze??!\r\n';
      if (!target._noEffectMessage && target.name() !== "OMORI") {
        if (target._doesUseAlternateForms()) {
          text += target.name() + ' jest PRZERA??ONA.'; // TOvDO: female
        } else {
          text += target.name() + ' jest PRZERA??ONY.';
        }
      }
      else { text += parseNoEffectEmotion(target.name(), 'BA??.', target) }
      break;

    //GINGER DEAD MAN//
    case 'GINGER DEAD ATTACK': //GINGER DEAD MAN ATTACK
      text = user.name() + ' d??ga ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'GINGER DEAD NOTHING': //GINGER DEAD MAN DO NOTHING
      text = user.name() + ' traci g??ow??...\r\n';
      text += user.name() + ' odk??ada j?? na swoje miejsce.';
      break;

    case 'GINGER DEAD THROW HEAD': //GINGER DEAD MAN THROW HEAD
      text = user.name() + ' rzuca swoj?? g??ow?? w ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    //LIVING BREAD//
    case 'LIVING BREAD ATTACK': //LIVING BREAD ATTACK
      text = user.name() + ' r??bie w ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'LIVING BREAD NOTHING': //LIVING BREAD ATTACK
      text = user.name() + ' powoli zbli??a si?? do' + target._altName() + '!';
      break;

    case 'LIVING BREAD BITE': //LIVING BREAD BITE
      text = user.name() + ' gryzie ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'LIVING BREAD BAD SMELL': //LIVING BREAD BAD SMELL
      text = user.name() + ' ??mierdzi!\r\n';
      text += target.name() + ' opuszcza gard??!';
      break;

    //Bug Bunny//
    case 'BUG BUN ATTACK': //Bug Bun Attack
      text = user.name() + ' uderza ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'BUG BUN NOTHING': //Bug Bun Nothing
      text = user.name() + ' pr??buje balansowa?? na g??owie.';
      break;

    case 'SUDDEN JUMP': //SUDDEN JUMP
      text = user.name() + ' nagle rzuca si?? na ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SCUTTLE': //Bug Bun Scuttle
      text = user.name() + ' szcz????liwie skacze doko??a.\r\n';
      text += 'Jest przes??odki!\r\n';
      if (!user._noEffectMessage) { text += user.name() + ' czuje SZCZ????CIE!'; }
      else { if (user._doesUseAlternateForms()) {
        text += parseNoEffectEmotion(user.name(), 'bardziej SZCZ????LIWA!', user); // TOvDO: female
      } else {
        text += parseNoEffectEmotion(user.name(), 'bardziej SZCZ????LIWY!', user) } }
      break;

    //RARE BEAR//
    case 'BEAR ATTACK': //BEAR ATTACK
      text = user.name() + ' rzuca si?? na ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'BEAR HUG': //BEAR HUG
      text = user.name() + ' przytula ' + target._altName() + '!\r\n';
      text += target.name() + ' zwalnia!\r\n';
      text += hpDamageText;
      break;

    case 'ROAR': //ROAR
      text = user.name() + ' g??o??no ryczy!\r\n';
      if (!user._noEffectMessage) { text += user.name() + ' czuje Z??O????!'; }
      else { if (target._doesUseAlternateForms()) {
        text += parseNoEffectEmotion(user.name(), 'bardziej Z??A!', user); // TOvDO: female
      } else {
        text += parseNoEffectEmotion(user.name(), 'bardziej Z??Y!', user) } }
      break;

    //POTTED PALM//
    case 'PALM ATTACK': //PALM ATTACK
      text = user.name() + ' uderza w ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'PALM NOTHING': //PALM NOTHING
      text = user.name() + ' spoczywa w swojej doniczce. ';
      break;

    case 'PALM TRIP': //PALM TRIP
      text = target.name() + ' przewraca si?? o swoje korzenie.\r\n';
      text += hpDamageText + '.\r\n';
      text += target.name() + ' zwalnia.';
      break;

    case 'PALM EXPLOSION': //PALM EXPLOSION
      text = user.name() + ' wybucha!';
      break;

    //SPIDER CAT//
    case 'SPIDER ATTACK': //SPIDER ATTACK
      text = user.name() + ' gryzie ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SPIDER NOTHING': //SPIDER NOTHING
      text = user.name() + ' wykrztusza kulk?? z paj??czyny.';
      break;

    case 'SPIN WEB': //SPIN WEB
      text = user.name() + ' strzela paj??czyn?? w ' + target._altName() + '!\r\n';
      text += target.name() + ' zwalnia.';
      break;

    //SPROUT MOLE?//
    case 'SPROUT ATTACK 2':  // SPROUT MOLE? ATTACK
      text = user.name() + ' strzela ' + target._altName() + ' z li??cia?\r\n';
      text += hpDamageText;
      break;

    case 'SPROUT NOTHING 2':  // SPROUT MOLE? NOTHING
      text = user.name() + ' si?? kr??ci?';
      break;

    case 'SPROUT RUN AROUND 2':  // SPROUT MOLE? RUN AROUND
      text = user.name() + ' biega w k????ko?';
      break;

    //HAROLD//
    case 'HAROLD ATTACK': //HAROLD ATTACK
      text = user.name() + ' wywija mieczem na ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'HAROLD NOTHING': // HAROLD NOTHING
      text = user.name() + ' poprawia he??m.';
      break;

    case 'HAROLD PROTECT': // HAROLD PROTECT
      text = user.name() + ' si?? broni.';
      break;

    case 'HAROLD WINK': //HAROLD WINK
      text = user.name() + ' puszcza oczko do ' + target._altName() + '.\r\n';
      if (!target._noEffectMessage) { text += target.name() + ' czuje SZCZ????CIE!'; }
      else { if (target._doesUseAlternateForms()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWA!', target); // TOvDO: female
      } else if (target._doesUseAlternateForms2()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWE!', target) // TOvDO: plural
      } else if (target._doesUseAlternateForms3()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWE!', target) // TOvDO: neutral
      } else {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWY!', target) } }
      break;

    //MARSHA//
    case 'MARSHA ATTACK': //MARSHA ATTACK
      text = user.name() + ' wywija toporem na ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'MARSHA NOTHING': //MARSHA NOTHING
      text = user.name() + ' si?? wywraca. ';
      break;

    case 'MARSHA SPIN': //MARSHA NOTHING
      text = user.name() + ' zaczyna kr??ci?? si?? z pr??dko??ci?? ??wiat??a!\r\n';
      text += hpDamageText;
      break;

    case 'MARSHA CHOP': //MARSHA CHOP
      text = user.name() + ' uderza toporem w ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    //THERESE//
    case 'THERESE ATTACK': //THERESE ATTACK
      text = user.name() + ' strzela w ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'THERESE NOTHING': //THERESE NOTHING
      text = user.name() + ' wypuszcza strza????.';
      break;

    case 'THERESE SNIPE': //THERESE SNIPE
      text = user.name() + ' strzela w s??aby punkt ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'THERESE INSULT': //THERESE INSULT
      text = user.name() + ' nazywa ' + target._altName() + ' eciem-peciem!\r\n';
      if (!target._noEffectMessage) { text += target.name() + ' czuje Z??O????!\r\n'; }
      else { if (target._doesUseAlternateForms()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej Z??A!\r\n', target); // TOvDO: female
      } else if (target._doesUseAlternateForms2()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej Z??E!\r\n', target) // TOvDO: plural
      } else if (target._doesUseAlternateForms3()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej Z??E!\r\n', target) // TOvDO: neutral
      } else {
        text += parseNoEffectEmotion(target.name(), 'bardziej Z??Y!\r\n', target) } }
      text += hpDamageText;
      break;

    case 'DOUBLE SHOT': //THERESE DOUBLE SHOT
      text = user.name() + ' wystrzeliwuje dwie strza??y na raz!';
      break;

    //LUSCIOUS//
    case 'LUSCIOUS ATTACK': //LUSCIOUS ATTACK
      text = user.name() + ' pr??buje rzuci?? zakl??cie...\r\n';
      text += user.name() + ' zrobi?? co?? magicznego!\r\n';
      text += hpDamageText;
      break;

    case 'LUSCIOUS NOTHING': //LUSCIOUS NOTHING
      text = user.name() + ' pr??buje rzuci?? zakl??cie...\r\n';
      text += 'Ale nic si?? nie zadzia??o...';
      break;

    case 'FIRE MAGIC': //FIRE MAGIC
      text = user.name() + ' pr??buje rzuci?? zakl??cie...\r\n';
      text += 'Ca??a dru??yna staje w ogniu!\r\n';
      text += hpDamageText;
      break;

    case 'MISFIRE MAGIC': //MISFIRE MAGIC
      text = user.name() + ' pr??buje rzuci?? zakl??cie...\r\n';
      text += 'Wszystko si?? pali!!!\r\n';
      text += hpDamageText;
      break;

    //HORSE HEAD//
    case 'HORSE HEAD ATTACK': //HORSE HEAD ATTACK
      text = user.name() + ' gryzie r??k?? ' + target._altName() + '.\r\n';
      text += hpDamageText;
      break;

    case 'HORSE HEAD NOTHING': //HORSE HEAD NOTHING
      text = user.name() + ' beka.';
      break;

    case 'HORSE HEAD LICK': //HORSE HEAD LICK
      text = user.name() + ' li??e w??osy ' + target._altName() + '.\r\n';
      text += hpDamageText + '\r\n';
      if (!target._noEffectMessage) { text += target.name() + ' czuje Z??O????!'; }
      else { if (target._doesUseAlternateForms()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej Z??A!\r\n', target); // TOvDO: female
      } else if (target._doesUseAlternateForms2()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej Z??E!\r\n', target) // TOvDO: plural
      } else if (target._doesUseAlternateForms3()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej Z??E!\r\n', target) // TOvDO: neutral
      } else {
        text += parseNoEffectEmotion(target.name(), 'bardziej Z??Y!\r\n', target) } }
      break;

    case 'HORSE HEAD WHINNY': //HORSE HEAD WHINNY
      text = user.name() + ' szcz????liwie parska!';
      break;

    //HORSE BUTT//
    case 'HORSE BUTT ATTACK': //HORSE BUTT ATTACK
      text = user.name() + ' nadeptuje na ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'HORSE BUTT NOTHING': //HORSE BUTT NOTHING
      text = user.name() + ' pierdzi.';
      break;

    case 'HORSE BUTT KICK': //HORSE BUTT KICK
      text = user.name() + ' kopie ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'HORSE BUTT PRANCE': //HORSE BUTT PRANCE
      text = user.name() + ' bryka.';
      break;

    //FISH BUNNY//
    case 'FISH BUNNY ATTACK': //FISH BUNNY ATTACK
      text = user.name() + ' wp??ywa na ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'FISH BUNNY NOTHING': //FISH BUNNY NOTHING
      text = user.name() + ' p??ywa w k????ko.';
      break;

    case 'SCHOOLING': //SCHOOLING
      text = user.name() + ' przywo??uje przyjaci????!';
      break;

    //MAFIA ALLIGATOR//
    case 'MAFIA ATTACK': //MAFIA ATTACK
      text = user.name() + ' uderza ' + target._altName() + ' ciosem karate!\r\n';
      text += hpDamageText;
      break;

    case 'MAFIA NOTHING': //MAFIA NOTHING
      text = user.name() + ' strzela palcami.';
      break;

    case 'MAFIA ROUGH UP': //MAFIA ROUGH UP
      text = user.name() + ' bije ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'MAFIA BACK UP': //MAFIA ALLIGATOR BACKUP
      text = user.name() + ' dzwoni po wsparcie!';
      break;

    //MUSSEL//
    case 'MUSSEL ATTACK': //MUSSEL ATTACK
      text = user.name() + ' uderza ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'MUSSEL FLEX': //MUSSEL FLEX
      text = user.name() + ' ci??nie i czuje si?? mistrzem!\r\n';
      text += user.name() + " jest celniejszy!\r\n"
      break;

    case 'MUSSEL HIDE': //MUSSEL HIDE
      text = user.name() + ' chowa si?? w swojej muszli.';
      break;

    //REVERSE MERMAID//
    case 'REVERSE ATTACK': //REVERSE ATTACK
      text = target.name() + ' wpada na siebie!\r\n';
      text += hpDamageText;
      break;

    case 'REVERSE NOTHING': //REVERSE NOTHING
      text = user.name() + ' robi salto!\r\n';
      text += 'WOW!';
      break;

    case 'REVERSE RUN AROUND': //REVERSE RUN AROUND
      text = 'Ka??dy ucieka od ASYRENA, ale jednocze??nie biegnie w jego stron??...\r\n';
      text += hpDamageText;
      break;

    //SHARK FIN//
    case 'SHARK FIN ATTACK': //SHARK FIN ATTACK
      text = user.name() + ' atakuje ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SHARK FIN NOTHING': //SHARK FIN NOTHING
      text = user.name() + ' p??ywa w k????ko.';
      break;

    case 'SHARK FIN BITE': //SHARK FIN BITE
      text = user.name() + ' gryzie ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SHARK WORK UP': //SHARK FIN WORK UP
      text = user.name() + ' pracuje nad sob??!\r\n';
      text += user.name() + ' przyspiesza!\r\n';
      if (!user._noEffectMessage) {
        text += user.name() + ' czuje z??o????!';
      }
      else { if (target._doesUseAlternateForms()) {
        text += parseNoEffectEmotion(user.name(), 'bardziej Z??A!', user); // TOvDO: female
      } else {
        text += parseNoEffectEmotion(user.name(), 'bardziej Z??Y!', user) } }
      break;

    //ANGLER FISH//
    case 'ANGLER ATTACK': //ANGLER FISH ATTACK
      text = user.name() + ' gryzie ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'ANGLER NOTHING': //ANGLER FISH NOTHING
      text = user.name() + ' s??yszy burczenie swojego brzucha.';
      break;

    case 'ANGLER LIGHT OFF': //ANGLER FISH LIGHT OFF
      text = user.name() + ' zgasza swoje ??wiat??o.\r\n';
      text += user.name() + ' zatapia si?? w ciemno??ciach.';
      break;

    case 'ANGLER BRIGHT LIGHT': //ANGLER FISH BRIGHT LIGHT
      text = '??ycie ka??dego miga mu przed oczami!';
      break;

    case 'ANGLER CRUNCH': //ANGLER FISH CRUNCH
      text = user.name() + ' wbija swoje z??by w ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    //SLIME BUNNY//
    case 'SLIME BUN ATTACK': //SLIME BUNNY ATTACK
      text = user.name() + ' tuli si?? do ' + target._altName() + '.\r\n';
      text += hpDamageText;
      break;

    case 'SLIME BUN NOTHING': //SLIME BUN NOTHING
      text = user.name() + ' u??miecha si?? do wszystkich.\r\n';
      break;

    case 'SLIME BUN STICKY': //SLIME BUN STICKY
      text = user.name() + ' czuje si?? samotny i p??acze.\r\n';
      if (!target._noStateMessage) { text += target.name() + ' zwalnia!\r\n'; }
      else { text += parseNoStateChange(target.name(), "SZYBKO????", "ju?? bardziej spa????!\r\n", target) }
      text += target.name() + " czuje SMUTEK.";
      break;

    //WATERMELON MIMIC//
    case 'WATERMELON RUBBER BAND': //WATERMELON MIMIC RUBBER BAND
      text = user.name() + ' ciska RECEPTURK??!\r\n';
      text += hpDamageText;
      break;

    case 'WATERMELON JACKS': //WATERMELON MIMIC JACKS
      text = user.name() + ' rozrzuca wsz??dzie CIUPY!\r\n';
      text += hpDamageText;
      break;

    case 'WATERMELON DYNAMITE': //WATERMELON MIMIC DYNAMITE
      text = user.name() + ' rzuca DYNAMIT!\r\n';
      text += 'O NIE!\r\n';
      text += hpDamageText;
      break;

    case 'WATERMELON WATERMELON SLICE': //WATERMELON MIMIC WATERMELON SLICE
      text = user.name() + ' rzuca SOKIEM ARBUZOWYM!\r\n';
      text += hpDamageText;
      break;

    case 'WATERMELON GRAPES': //WATERMELON MIMIC GRAPES
      text = user.name() + ' rzuca WINOGRONAD??!\r\n';
      text += hpDamageText;
      break;

    case 'WATEMELON FRENCH FRIES': //WATERMELON MIMIC FRENCH FRIES
      text = user.name() + ' rzuca FRYTKAMI!\r\n';
      text += hpDamageText;
      break;

    case 'WATERMELON CONFETTI': //WATERMELON MIMIC CONFETTI
      if (target.index() <= unitLowestIndex) {
        text = user.name() + ' otwiera KONFETTI!\r\n';
        text += "Wszyscy czuj?? SZCZ????CIE!"
      }
      target._noEffectMessage = undefined;
      break;

    case 'WATERMELON RAIN CLOUD': //WATERMELON MIMIC RAIN CLOUD
      if (target.index() <= unitLowestIndex) {
        text = user.name() + ' wzywa CHMUR?? DESZCZOW??!\r\n';
        text += "Wszyscy czuj?? SMUTEK."
      }
      target._noEffectMessage = undefined;
      break;

    case 'WATERMELON AIR HORN': //WATERMELON MIMIC AIR HORN
      if (target.index() <= unitLowestIndex) {
        text = user.name() + ' u??ywa GIGANTYCZNEJ TR??BKI!\r\n';
        text += "Wszyscy czuj?? Z??O????!"
      }
      target._noEffectMessage = undefined;
      break;

    //SQUIZZARD//
    case 'SQUIZZARD ATTACK': //SQUIZZARD ATTACK
      text = user.name() + ' czaruje ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SQUIZZARD NOTHING': //SQUIZZARD NOTHING
      text = user.name() + ' mamrocze bzdury.';
      break;

    case 'SQUID WARD': //SQUID WARD
      text = user.name() + ' tworzy ka??aobron??.\r\n';
      text += target.name() + ' podnosi gard??.';
      break;

    case 'SQUID MAGIC': //SQUID MAGIC
      text = user.name() + ' rzuca zakl??cie ka??amagiczne!\r\n';
      text += 'Wszyscy czuj?? si?? dziwnie...';
      break;

    //WORM-BOT//
    case 'BOT ATTACK': //MECHA WORM ATTACK
      text = user.name() + ' uderza w ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'BOT NOTHING': //MECHA WORM NOTHING
      text = user.name() + ' g??o??no brz??czy!';
      break;

    case 'BOT LASER': //MECHA WORM CRUNCH
      text = user.name() + ' strzela laserem w ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'BOT FEED': //MECHA WORM FEED
      text = user.name() + ' zjada ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;


    //SNOT BUBBLE//
    case 'SNOT INFLATE': //SNOT INFLATE
      text = user.name() + ' powi??ksza swojego gluta!\r\n';
      text += target.name() + ' wzmacnia si??!';
      break;

    case 'SNOT POP': //SNOT POP
      text = user.name() + ' wybucha!\r\n';
      text += 'Wszystko jest w glutach!!\r\n';
      text += hpDamageText;
      break;

    //LAB RAT//
    case 'LAB ATTACK': //LAB RAT ATTACK
      text = user.name() + ' strzela ma??ym laserem z myszki!\r\n';
      text += hpDamageText;
      break;

    case 'LAB NOTHING': //LAB RAT NOTHING
      text = user.name() + ' wypuszcza troch?? gazu.';
      break;

    case 'LAB HAPPY GAS': //LAB RAT HAPPY GAS
      text = user.name() + ' uwalnia SZCZ????LIWY gaz!\r\n';
      text += 'Wszyscy czuj?? SZCZ????CIE!';
      target._noEffectMessage = undefined;
      break;

    case 'LAB SCURRY': //LAB RAT SCURRY
      text = user.name() + ' tupocze!\r\n';
      break;

    //MECHA MOLE//
    case 'MECHA MOLE ATTACK': //MECHA MOLE ATTACK
      text = user.name() + ' strzela laserem w ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'MECHA MOLE NOTHING': //MECHA MOLE NOTHING
      text = 'Oko KIE??KUNA?? delikatnie b??yszczy.';
      break;

    case 'MECHA MOLE EXPLODE': //MECHA MOLE EXPLODE
      text = user.name() + ' roni ??z??.\r\n';
      text += user.name() + ' majestatycznie wybucha!';
      break;

    case 'MECHA MOLE STRANGE LASER': //MECHA MOLE STRANGE LASER
      text = 'Oko KIE??KUNA?? emituje dziwne ??wiat??o. ' + target.name() + ' czuje si?? dziwnie.';
      break;

    case 'MECHA MOLE JET PACK': //MECHA MOLE JET PACK
      text = 'Nad KIE??KUNEM?? pojawi?? si?? odrzutowy plecak!\r\n';
      text += user.name() + ' przelecia?? nad wszystkimi!';
      break;

    //CHIMERA CHICKEN//
    case 'CHICKEN RUN AWAY': //CHIMERA CHICKEN RUN AWAY
      text = user.name() + ' ucieka.';
      break;

    case 'CHICKEN NOTHING': //CHICKEN DO NOTHING
      text = user.name() + ' gdacze. ';
      break;

    //SALLI//
    case 'SALLI ATTACK': //SALLI ATTACK
      text = user.name() + ' wbiega w ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SALLI NOTHING': //SALLI NOTHING
      text = user.name() + ' robi ma??e salto!';
      break;

    case 'SALLI SPEED UP': //SALLI SPEED UP
      text = user.name() + ' zaczyna p??dzi??!\r\n';
      if (!target._noStateMessage) {
        text += user.name() + ' przyspiesza!';
      }
      else { text += parseNoStateChange(user.name(), "SZYBKO????", "ju?? bardziej wzrosn????!", user) }
      break;

    case 'SALLI DODGE ANNOY': //SALLI STARE
      text = user.name() + ' zaczyna si?? intensywnie skupia??! ';
      break;

    //CINDI//
    case 'CINDI ATTACK': //CINDI ATTACK
      text = user.name() + ' uderza ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'CINDI NOTHING': //CINDI NOTHING
      text = user.name() + ' kr??ci si?? w k????ko.';
      break;

    case 'CINDI SLAM': //CINDI SLAM
      text = user.name() + ' uderza r??k?? w ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'CINDI COUNTER ATTACK': //CINDI COUNTER ATTACK
      text = user.name() + ' si?? przygotowuje!';
      break;

    //DOROTHI//
    case 'DOROTHI ATTACK': //DOROTHI ATTACK
      text = user.name() + ' nadeptuje na ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'DOROTHI NOTHING': //DOROTHI NOTHING
      text = user.name() + ' p??acze w ciemno??ci.';
      break;

    case 'DOROTHI KICK': //DOROTHI KICK
      text = user.name() + ' kopie ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'DOROTHI HAPPY': //DOROTHI HAPPY
      text = user.name() + ' bryka!';
      break;

    //NANCI//
    case 'NANCI ATTACK': //NANCI ATTACK
      text = user.name() + ' wbija szpony w ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'NANCI NOTHING': //NANCI NOTHING
      text = user.name() + ' kiwa si?? w prz??d i w ty??.';
      break;

    case 'NANCI ANGRY': //NANCI ANGRY
      text = user.name() + ' zaczyna si?? gotowa??!';
      break;

    //MERCI//
    case 'MERCI ATTACK': //MERCI ATTACK
      text = user.name() + ' dotyka klatki ' + target._altName() + '.\r\n';
      if (target._doesUseAlternateForms2()) {
        text += target.name() + ' czuje, jak jej wn??trzno??ci s?? rozrywane!\r\n'; // TOvDO: female
      } else {
        text += target.name() + ' czuje, jak jego wn??trzno??ci s?? rozrywane!\r\n';
      }
      text += hpDamageText;
      break;

    case 'MERCI NOTHING': //MERCI NOTHING
      text = user.name() + ' dziwnie si?? u??miecha.';
      break;

    case 'MERCI MELODY': //MERCI LAUGH
      text = user.name() + ' ??piewa.\r\n';
      text += target.name() + ' s??yszy znajom?? melodi??.\r\n';
      text += steppedEmotionStateText('happy', target, '\r\n')
      break;

    case 'MERCI SCREAM': //MERCI SCREAM
      text = user.name() + ' wydaje przera??aj??cy wrzask!\r\n';
      text += hpDamageText;
      break;


    //LILI//
    case 'LILI ATTACK': //LILI ATTACK
      text = user.name() + ' wpatruje si?? w dusz?? ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'LILI NOTHING': //LILI NOTHING
      text = user.name() + ' mruga.';
      break;

    case 'LILI MULTIPLY': //LILI MULTIPLY
      text = user.name() + ' traci oko!\r\n';
      text += 'Powsta??a z niego druga ' + user.name() + '!';
      break;

    case 'LILI CRY': //LILI CRY
      text = user.name() + ' zalewa si?? ??zami.\r\n';
      text += target.name() + " czuje SMUTEK."
      break;

    case 'LILI SAD EYES': //LILI SAD EYES
      text = target.name() + ' dostrzega smutek w oczach ' + user.name() + '.\r\n';
      text += target.name() + ' nie chce zaatakowa?? ' + user.name(); + '.\r\n'
      break;

    //HOUSEFLY//
    case 'HOUSEFLY ATTACK': //HOUSEFLY ATTACK
      if (target.name() === $gameActors.actor(8).name()) {
        text = user.name() + ' l??duje na twojej twarzy.\r\n'; //TOvDO: target = player custom line
        text += 'Uderzasz si?? w twarz!\r\n'; //TOvDO: target = player custom line
      } else {
        text = user.name() + ' l??duje na twarzy ' + target._altName() + '.\r\n';
        text += target.name() + ' uderza si?? w twarz!\r\n';
      }
      text += hpDamageText;
      break;

    case 'HOUSEFLY NOTHING': //HOUSEFLY NOTHING
      text = user.name() + ' szybko brz??czy woko??o!';
      break;

    case 'HOUSEFLY ANNOY': //HOUSEFLY ANNOY
      if (target.name() === $gameActors.actor(8).name()) {
        text = user.name() + ' brz??czy nad twoim uchem!\r\n'; //TOvDO: target = player custom line
      } else {
        text = user.name() + ' brz??czy nad uchem ' + target._altName() + '!\r\n';
      }
      if (!target._noEffectMessage) { text += target.name() + ' czuje Z??O????!'; }
      else { if (target._doesUseAlternateForms()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej Z??A!', target); // TOvDO: female
      } else if (target._doesUseAlternateForms2()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej Z??E!', target) // TOvDO: plural
      } else if (target._doesUseAlternateForms3()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej Z??E!', target) // TOvDO: neutral
      } else {
        text += parseNoEffectEmotion(target.name(), 'bardziej Z??Y!', target) } }
      break;

    //RECYCLIST//
    case 'FLING TRASH': //FLING TRASH
      if (target.name() === $gameActors.actor(8).name()) {
        text = user.name() + ' ciska w ciebie ??MIE??MI!\r\n'; //TOvDO: target = player custom line
      } else {
        text = user.name() + ' ciska ??MIE??MI w ' + target._altName() + '!\r\n';
      }
      text += hpDamageText;
      break;

    case 'GATHER TRASH': //GATHER TRASH
      text = user.name() + ' znajduje na ziemi ??MIECI i wciska je do swojej torby!\r\n';
      text += hpDamageText;
      break;

    case 'RECYCLIST CALL FOR FRIENDS': //RECYCLIST CALL FOR FRIENDS
      text = user.name() + ' przywo??uje RECYKULTYST??W!!';
      break;

    //STRAY DOG//
    case 'STRAY DOG ATTACK': //STRAY DOG ATTACK
      text = user.name() + ' gryzie!\r\n';
      text += hpDamageText;
      break;

    case 'STRAY DOG HOWL': //STRAY DOG HOWL
      text = user.name() + ' wydaje przeszywaj??cy wyk!';
      break;

    //CROW//
    case 'CROW ATTACK': //CROW ATTACK
      text = user.name() + ' pecks at ' + target.name() + '\'s eyes.\r\n';
      text += hpDamageText;
      break;

    case 'CROW GRIN': //CROW GRIN
      text = user.name() + ' has a big grin on his face.';
      break;

    case 'CROW STEAL': //CROW STEAL
      text = user.name() + ' steals something!';
      break;

    // BEE //
    case 'BEE ATTACK': //BEE Attack
      if (target.name() === $gameActors.actor(8).name()) {
        text = user.name() + ' ci?? gryzie.\r\n'; //TOvDO: target = player custom line
      } else {
        text = user.name() + ' gryzie ' + target._altName() + '.\r\n';
      }
      text += hpDamageText;
      break;

    case 'BEE NOTHING': //BEE NOTHING
      text = user.name() + ' lata w k????ko!';
      break;

    // GHOST BUNNY //
    case 'GHOST BUNNY ATTACK': //GHOST BUNNY ATTACK
      text = user.name() + ' przechodzi przez ' + target._altName() + '!\r\n';
      text += target.name() + ' czuje zm??czenie.\r\n';
      text += mpDamageText;
      break;

    case 'GHOST BUNNY NOTHING': //GHOST BUNNY DO NOTHING
      text = user.name() + ' unosi si?? w miejscu.';
      break;

    //TOAST GHOST//
    case 'TOAST GHOST ATTACK': //TOAST GHOST ATTACK
      text = user.name() + ' przechodzi przez ' + target._altName() + '!\r\n';
      text += target.name() + ' czuje zm??czenie.\r\n';
      text += hpDamageText;
      break;

    case 'TOAST GHOST NOTHING': //TOAST GHOST NOTHING
      text = user.name() + ' wydaje straszny d??wi??k.';
      break;

    //SPROUT BUNNY//
    case 'SPROUT BUNNY ATTACK': //SPROUT BUNNY ATTACK
      text = user.name() + ' strzela z li??cia ' + target._altName() + '.\r\n';
      text += hpDamageText;
      break;

    case 'SPROUT BUNNY NOTHING': //SPROUT BUNNY NOTHING
      text = user.name() + ' ??uje traw??.';
      break;

    case 'SPROUT BUNNY FEED': //SPROUT BUNNY FEED
      text = user.name() + ' karmi ' + target._altName() + '.\r\n';
      text += `${user.name()} odzyskuje ${Math.abs(hpDam)} SERC!`
      break;

    //CELERY//
    case 'CELERY ATTACK': //CELERY ATTACK
      text = user.name() + ' uderza ' + target._altName() + '.\r\n';
      text += hpDamageText;
      break;

    case 'CELERY NOTHING': //CELERY NOTHING
      text = user.name() + ' si?? przewraca.';
      break;

    //CILANTRO//
    case 'CILANTRO ATTACK': //CILANTRO ATTACK
      text = user.name() + ' wali ' + target._altName() + '.\r\n';
      text += hpDamageText;
      break;

    case 'CILANTRO NOTHING': //CILANTRO DO NOTHING
      text = user.name() + ' zastanawia si?? nad sensem ??ycia.';
      break;

    case 'GARNISH': //CILANTRO GARNISH
      text = user.name() + ' po??wi??ca si?? dla dobra ' + target._altName() + '.';
      break;

    //GINGER//
    case 'GINGER ATTACK': //GINGER ATTACK
      text = user.name() + ' ??amie si?? i atakuje ' + target._altName() + '.\r\n';
      text += hpDamageText;
      break;

    case 'GINGER NOTHING': //GINGER NOTHING
      text = user.name() + ' znajduje wewn??trzny spok??j.';
      break;

    case 'GINGER SOOTHE': //GINGER SOOTHE
      text = user.name() + ' uspokaja ' + target._altName() + '.\r\n';
      break;

    //YE OLD MOLE//
    case 'YE OLD ROLL OVER': //MEGA SPROUT MOLE ROLL OVER
      text = user.name() + ' toczy si?? po wszystkich!';
      text += hpDamageText;
      break;

    //KITE KID//
    case 'KITE KID ATTACK':  // KITE KID ATTACK
      text = user.name() + ' rzuca CIUPY w ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'KITE KID BRAG':  // KITE KID BRAG
      text = user.name() + ' narzeka na LATAWIEC!\r\n';
      if (!target._noEffectMessage) {
        text += target.name() + ' czuje SZCZ????CIE!';
      }
      else { if (target._doesUseAlternateForms()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWA!', target); // TOvDO: female
      } else if (target._doesUseAlternateForms2()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWE!', target) // TOvDO: plural
      } else if (target._doesUseAlternateForms3()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWE!', target) // TOvDO: neutral
      } else {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWY!', target) } }
      break;

    case 'REPAIR':  // REPAIR
      text = user.name() + ' skleja ta??m?? LATAWIEC!\r\n';
      text += 'LATAWIEC czuje si?? jak nowo narodzony!';
      break;

    //KID'S KITE//
    case 'KIDS KITE ATTACK': // KIDS KITE ATTACK
      text = user.name() + ' wlatuje w ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'KITE NOTHING': // KITE NOTHING
      text = user.name() + ' pr????y si?? jak paw!';
      break;

    case 'FLY 1':  // FLY 1
      text = user.name() + ' leci wysoko!';
      break;

    case 'FLY 2':  // FLY 2
      text = user.name() + ' spada w d????!!';
      break;

    //PLUTO//
    case 'PLUTO NOTHING':  // PLUTO NOTHING
      text = user.name() + ' przybiera poz??!\r\n';
      break;

    case 'PLUTO HEADBUTT':  // PLUTO HEADBUTT
      text = user.name() + ' rozp??dza si?? i roztrzaskuje ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'PLUTO BRAG':  // PLUTO BRAG
      text = user.name() + ' przechwala si?? swoimi musku??ami!\r\n';
      if (!user._noEffectMessage) {
        text += user.name() + ' czuje SZCZ????CIE!';
      }
      else { if (user._doesUseAlternateForms()) {
        text += parseNoEffectEmotion(user.name(), 'bardziej SZCZ????LIWA!', user); // TOvDO: female
      } else {
        text += parseNoEffectEmotion(user.name(), 'bardziej SZCZ????LIWY!', user) } }
      break;

    case 'PLUTO EXPAND':  // PLUTO EXPAND
      text = user.name() + ' si?? pr????y!!\r\n';
      if (!target._noStateMessage) {
        text += user.name() + ' wzmacnia si?? i podnosi gard??!!\r\n';
        text += user.name() + ' zwalnia.';
      }
      else {
        text += parseNoStateChange(user.name(), "ATAK", "ju?? bardziej wzrosn????!\r\n", user)
        text += parseNoStateChange(user.name(), "OBRONA", "ju?? bardziej wzrosn????!\r\n", user)
        text += parseNoStateChange(user.name(), "SZYBKO????", "ju?? bardziej spa????!", user)
      }
      break;

    case 'EXPAND NOTHING':  // PLUTO NOTHING
      text = user.name() + 'onie??miela ci?? swoimi mi????niami.';
      break;

    //RIGHT ARM//
    case 'R ARM ATTACK':  // R ARM ATTACK
      text = user.name() + ' uderza ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'GRAB':  // GRAB
      text = user.name() + ' ??apie ' + target._altName() + '!\r\n';
      text += target.name() + ' zwalnia.\r\n';
      text += hpDamageText;
      break;

    //LEFT ARM//
    case 'L ARM ATTACK':  // L ARM ATTACK
      text = user.name() + ' uderza ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'POKE':  // POKE
      text = user.name() + ' pstryka ' + target._altName() + '!\r\n';
      if (!target._noEffectMessage) {
        text += target.name() + ' czuje Z??O????!\r\n';
      }
      else { if (target._doesUseAlternateForms()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej Z??A!', target); // TOvDO: female
      } else if (target._doesUseAlternateForms2()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej Z??E!', target) // TOvDO: plural
      } else if (target._doesUseAlternateForms3()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej Z??E!', target) // TOvDO: neutral
      } else {
        text += parseNoEffectEmotion(target.name(), 'bardziej Z??Y!', target) } }
      text += hpDamageText;
      break;

    //DOWNLOAD WINDOW//
    case 'DL DO NOTHING':  // DL DO NOTHING
      text = user.name() + ' zatrzyma??o si?? na 99%.';
      break;

    case 'DL DO NOTHING 2':  // DL DO NOTHING 2
      text = user.name() + ' wci???? stoi na 99%...';
      break;

    case 'DOWNLOAD ATTACK':  // DOWNLOAD ATTACK
      text = user.name() + ' zawiesza si?? i staje w ogniu!';
      break;

    //SPACE EX-BOYFRIEND//
    case 'SXBF ATTACK':  // SXBF ATTACK
      text = user.name() + ' kopie ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SXBF NOTHING':  // SXBF NOTHING
      text = user.name() + ' patrzy z t??sknot?? w dal.';
      break;

    case 'ANGRY SONG':  // ANGRY SONG
      text = user.name() + ' intensywnie beczy!';
      break;

    case 'ANGSTY SONG':  // ANGSTY SONG
      text = user.name() + ' ??piewa smutn?? piosenk??...\r\n';
      text += steppedEmotionStateText('sad', target)
      break;

    case 'BIG LASER':  // BIG LASER
      text = user.name() + ' strzela z lasera!\r\n';
      text += hpDamageText;
      break;

    case 'BULLET HELL':  // BULLET HELL
      text = user.name() + ' w desperacji wystrzeliwuje sw??j laser!';
      break;

    case 'SXBF DESPERATE':  // SXBF NOTHING
      text = user.name() + ' zgrzyta z??bami!';
      break;

    //THE EARTH//
    case 'EARTH ATTACK':  // EARTH ATTACK
      text = user.name() + ' atakuje ' + target._altName() + '!\r\n';
      text += hpDamageText
      break;

    case 'EARTH NOTHING':  // EARTH NOTHING
      text = user.name() + ' obraca si?? powoli.';
      break;

    case 'EARTH CRUEL':  // EARTH CRUEL
      text = user.name() + ' jest okrutna dla ' + target._altName() + '!\r\n';
      text += steppedEmotionStateText('sad', target)
      break;

    case 'CRUEL EPILOGUE':  // EARTH CRUEL
      if (target.index() <= unitLowestIndex) {
        text = user.name() + " jest okrutna dla wszystkich...\r\n";
        text += "Wszyscy czuj?? SMUTEK."
      }
      break;

    case 'PROTECT THE EARTH':  // PROTECT THE EARTH
      text = user.name() + ' u??ywa swojego najsilniejszego ataku!';
      break;

    //SPACE BOYFRIEND//
    case 'SBF ATTACK': //SPACE BOYFRIEND ATTACK
      text = user.name() + ' b??yskawicznie kopie ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SBF LASER': //SPACE BOYFRIEND LASER
      text = user.name() + ' wystrzeliwuje laser!\r\n';
      text += hpDamageText;
      break;

    case 'SBF CALM DOWN': //SPACE BOYFRIEND CALM DOWN
      text = user.name() + ' oczyszcza sw??j umys?? i pozbywa si?? wszystkich EMOCJI.';
      break;

    case 'SBF ANGRY SONG': //SPACE BOYFRIEND ANGRY SONG
      if (target.index() <= unitLowestIndex) {
        text = user.name() + ' w??ciekle p??acze!\r\n';
        text += "Wszyscy czuj?? Z??O????!\r\n";
      }
      text += hpDamageText;
      break;

    case 'SBF ANGSTY SONG': //SPACE BOYFRIEND ANGSTY SONG
      if (target.index() <= unitLowestIndex) {
        text = user.name() + ' ??piewa mroczn?? piosenk?? prosto z g????bi swojej duszy!\r\n';
        text += "Wszyscy czuj?? SMUTEK.\r\n";
      }
      text += mpDamageText;
      break;

    case 'SBF JOYFUL SONG': //SPACE BOYFRIEND JOYFUL SONG
      if (target.index() <= unitLowestIndex) {
        text = user.name() + ' ??piewa radosn?? piosenk?? prosto z g????bi swego serca!\r\n';
        text += "Wszyscy czuj?? SZCZ????CIE!\r\n";
      }
      text += hpDamageText;
      break;

    //NEFARIOUS CHIP//
    case 'EVIL CHIP ATTACK': //NEFARIOUS CHIP ATTACK
      text = user.name() + ' wpada na ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'EVIL CHIP NOTHING': //NEFARIOUS CHIP NOTHING
      text = user.name() + ' g??adzi sw??j z??wieszczy w??s!';
      break;


    case 'EVIL LAUGH': //NEFARIOUS LAUGH
      text = user.name() + ' ??mieje si??, jak na z??oczy??c?? przysta??o!\r\n';
      if (!target._noEffectMessage) { text += target.name() + " czuje SZCZ????CIE!" }
      else { if (target._doesUseAlternateForms()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWA!\r\n', target); // TOvDO: female
      } else if (target._doesUseAlternateForms2()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWE!\r\n', target) // TOvDO: plural
      } else if (target._doesUseAlternateForms3()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWE!\r\n', target) // TOvDO: neutral
      } else {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWY!\r\n', target) } }
      break;

    case 'EVIL COOKIES': //NEFARIOUS COOKIES
      text = user.name() + ' rzuca we wszystkich CIASTKAMI OWSIANYMI!\r\n';
      text += 'Czyste z??o!';
      break;

    //BISCUIT AND DOUGHIE//
    case 'BD ATTACK': //BISCUIT AND DOUGHIE ATTACK
      text = user.name() + ' atakuj?? razem!\r\n';
      text += hpDamageText;
      break;

    case 'BD NOTHING': //BISCUIT AND DOUGHIE NOTHING
      text = user.name() + ' zapomnieli wyci??gn???? czego?? z pieca!';
      break;

    case 'BD BAKE BREAD': //BISCUIT AND DOUGHIE BAKE BREAD
      text = user.name() + ' wyci??gaj?? CHLEB z pieca!';
      break;

    case 'BD COOK': //BISCUIT AND DOUGHIE CHEER UP
      text = user.name() + ' piek?? ciastka!\r\n';
      text += `${target.name()} odzyskuj?? ${Math.abs(hpDam)} SERC!\r\n`
      break;

    case 'BD CHEER UP': //BISCUIT AND DOUGHIE CHEER UP
      text = user.name() + ' z ca??ej si??y pr??buj?? nie by?? SMUTNI.';
      break;

    //KING CRAWLER//
    case 'KC ATTACK': //KING CRAWLER ATTACK
      text = user.name() + ' uderza w ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'KC NOTHING': //KING CRAWLER NOTHING
      text = user.name() + ' wydaje z siebie przera??aj??cy wrzask!\r\n';
      if (!target._noEffectMessage) {
        text += target.name() + " czuje Z??O????!";
      }
      else { if (target._doesUseAlternateForms()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej Z??A!', target); // TOvDO: female
      } else if (target._doesUseAlternateForms2()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej Z??E!', target) // TOvDO: plural
      } else if (target._doesUseAlternateForms3()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej Z??E!', target) // TOvDO: neutral
      } else {
        text += parseNoEffectEmotion(target.name(), 'bardziej Z??Y!', target) } }
      break;

    case 'KC CONSUME': //KING CRAWLER CONSUME
      text = user.name() + ' zjada ZAGUBIONEGO KIE??KUNA!\r\n';
      text += `${target.name()} odzyskuje ${Math.abs(hpDam)} SERC!\r\n`;
      break;

    case 'KC RECOVER': //KING CRAWLER CONSUME
      text = `${target.name()} odzyskuje ${Math.abs(hpDam)} SERC!\r\n`;
      if (!target._noEffectMessage) { text += target.name() + " czuje SZCZ????CIE!" }
      else { if (target._doesUseAlternateForms()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWA!', target); // TOvDO: female
      } else if (target._doesUseAlternateForms2()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWE!', target) // TOvDO: plural
      } else if (target._doesUseAlternateForms3()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWE!', target) // TOvDO: neutral
      } else {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWY!', target) } }
      break;

    case 'KC CRUNCH': //KING CRAWLER CRUNCH
      text = user.name() + ' gryzie ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'KC RAM': //KING CRAWLER RAM
      text = user.name() + ' przebiega po dru??ynie!\r\n';
      text += hpDamageText;
      break;

    //KING CARNIVORE//

    case "SWEET GAS":
      if (target.index() <= unitLowestIndex) {
        text = user.name() + " uwalnia gaz!\r\n";
        text += "S??odko pachnie!\r\n";
        text += "Wszyscy czuj?? SZCZ????CIE!";
      }
      target._noEffectMessage = undefined;
      break;

    //SPROUTMOLE LADDER//
    case 'SML NOTHING': //SPROUT MOLE LADDER NOTHING
      text = user.name() + ' stabilnie stoi.';
      break;

    case 'SML SUMMON MOLE': //SPROUT MOLE LADDER SUMMON SPROUT MOLE
      text = 'KIE??KUN wspina si?? na ' + user._altName() + '!';
      break;

    case 'SML REPAIR': //SPROUT MOLE LADDER REPAIR
      text = user.name() + ' zostaje naprawiona.';
      break;

    //UGLY PLANT CREATURE//
    case 'UPC ATTACK': //UGLY PLANT CREATURE ATTACK
      text = user.name() + ' owija pn??czami ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'UPC NOTHING': //UGLY PLANT CRATURE NOTHING
      text = user.name() + ' ryczy!';
      break;

    //ROOTS//
    case 'ROOTS NOTHING': //ROOTS NOTHING
      text = user.name() + ' si?? wierci.';
      break;

    case 'ROOTS HEAL': //ROOTS HEAL
      text = user.name() + ' dostarcza sk??adnik??w od??ywczych dla ' + target._altName() + '.';
      break;

    //BANDITO MOLE//
    case 'BANDITO ATTACK': //BANDITO ATTACK
      text = user.name() + ' tnie ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'BANDITO STEAL': //BANDITO STEAL
      text = user.name() + ' sprawnie kradnie co?? dru??ynie!'
      break;

    case 'B.E.D.': //B.E.D.
      text = user.name() + ' wyci??ga ??.O.??.E.!\r\n';
      text += hpDamageText;
      break;

    //SIR MAXIMUS//
    case 'MAX ATTACK': //SIR MAXIMUS ATTACK
      text = user.name() + ' wymachuje mieczem!\r\n';
      text += hpDamageText;
      break;

    case 'MAX NOTHING': //SIR MAXIMUS NOTHING
      text = user.name() + ' si?? wycofuje...\r\n';
      if (!target._noEffectMessage) {
        text += target.name() + ' czuje SMUTEK.'
      }
      else { if (target._doesUseAlternateForms()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SMUTNA!\r\n', target); // TOvDO: female
      } else if (target._doesUseAlternateForms2()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SMUTNE!\r\n', target) // TOvDO: plural
      } else if (target._doesUseAlternateForms3()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SMUTNE!\r\n', target) // TOvDO: neutral
      } else {
        text += parseNoEffectEmotion(target.name(), 'bardziej SMUTNY!\r\n', target) } }
      break;

    case 'MAX STRIKE': //SIR MAXIMUS SWIFT STRIKE
      text = user.name() + ' uderza dwukrotnie!';
      break;

    case 'MAX ULTIMATE ATTACK': //SIR MAXIMUS ULTIMATE ATTACK
      text = '"CZAS NA CIOS OSTATECZNY!"';
      text += hpDamageText;
      break;

    case 'MAX SPIN': //SIR MAXIMUS SPIN
      break;

    //SIR MAXIMUS II//
    case 'MAX 2 NOTHING': //SIR MAXIMUS II NOTHING
      text = user.name() + ' przypomina sobie ostatnie s??owa swojego ojca.\r\n';
      if (!target._noEffectMessage) {
        text += target.name() + ' czuje SMUTEK.'
      }
      else { if (target._doesUseAlternateForms()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SMUTNA!', target); // TOvDO: female
      } else if (target._doesUseAlternateForms2()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SMUTNE!', target) // TOvDO: plural
      } else if (target._doesUseAlternateForms3()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SMUTNE!', target) // TOvDO: neutral
      } else {
        text += parseNoEffectEmotion(target.name(), 'bardziej SMUTNY!', target) } }
      break;

    //SIR MAXIMUS III//
    case 'MAX 3 NOTHING': //SIR MAXIMUS III NOTHING
      text = user.name() + ' przypomina sobie ostatnie s??owa swojego dziadka.\r\n';
      text += target.name() + ' czuje SMUTEK.'
      break;

    //SWEETSERC//
    case 'SH ATTACK': //SWEET SERC ATTACK
      text = user.name() + ' strzela ' + target._altName() + '.\r\n';
      text += hpDamageText;
      break;

    case 'SH INSULT': //SWEET SERC INSULT
      if (target.index() <= unitLowestIndex) {
        text = user.name() + " obra??a wszystkich!\r\n"
        text += "Wszyscy czuj?? Z??O????!\r\n";
      }
      text += hpDamageText;
      target._noEffectMessage = undefined;
      break;

    case 'SH SNACK': //SWEET SERC SNACK
      text = user.name() + ' ka??e s??u????cemu przynie???? jej PRZEK??SK??.\r\n';
      text += hpDamageText;
      break;

    case 'SH SWING MACE': //SWEET SERC SWING MACE
      text = user.name() + ' z zapa??em wymachuje maczug??!\r\n';
      text += hpDamageText;
      break;

    case 'SH BRAG': //SWEET SERC BRAG
      text = user.name() + ' chwali si?? jednym ze swoich wielu talent??w!\r\n';
      if (!target._noEffectMessage) {
        text += steppedEmotionStateText('happy', target)
      }
      else { if (target._doesUseAlternateForms()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWA!', target); // TOvDO: female
      } else if (target._doesUseAlternateForms2()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWE!', target) // TOvDO: plural
      } else if (target._doesUseAlternateForms3()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWE!', target) // TOvDO: neutral
      } else {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWY!', target) } }

      break;

    //MR. JAWSUM //
    case 'DESK SUMMON MINION': //MR. JAWSUM DESK SUMMON MINION
      text = user.name() + ' si??ga po telefon i dzwoni po ALI GATORA!';
      break;

    case 'JAWSUM ATTACK ORDER': //MR. JAWSUM DESK ATTACK ORDER
      if (target.index() <= unitLowestIndex) {
        text = user.name() + ' rozkazuje atakowa??!\r\n';
        text += "Wszyscy czuj?? Z??O????!";
      }
      break;

    case 'DESK NOTHING': //MR. JAWSUM DESK DO NOTHING
      text = user.name() + ' przelicza MA????E.';
      break;

    //PLUTO EXPANDED//
    case 'EXPANDED ATTACK': //PLUTO EXPANDED ATTACK
      text = user.name() + ' rzuca Ksi????ycem w '+ target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'EXPANDED SUBMISSION HOLD': //PLUTO EXPANDED SUBMISSION HOLD
      text = user.name() + ' zak??ada d??wigni?? na ' + target._altName() + '!\r\n';
      text += target.name() + ' zwalnia.\r\n';
      text += hpDamageText;
      break;

    case 'EXPANDED HEADBUTT': //PLUTO EXPANDED HEADBUTT
      text = user.name() + ' strzela ' + target._altName() + ' z g????wki!\r\n';
      text += hpDamageText;
      break;

    case 'EXPANDED FLEX COUNTER': //PLUTO EXPANDED FLEX COUNTER
      text = user.name() + ' pr????y mi????nie i si?? przygotowuje!';
      break;

    case 'EXPANDED EXPAND FURTHER': //PLUTO EXPANDED EXPAND FURTHER
      text = user.name() + ' pakuje jeszcze bardziej!\r\n';
      if (!target._noStateMessage) {
        text += target.name() + ' wzmacnia si??!\r\n';
        text += target.name() + ' podnosi gard??!\r\n';
        text += target.name() + ' zwalnia.';
      }
      else {
        text += parseNoStateChange(user.name(), "ATAK", "ju?? bardziej wzrosn????!\r\n", user)
        text += parseNoStateChange(user.name(), "OBRONA", "ju?? bardziej wzrosn????!\r\n", user)
        text += parseNoStateChange(user.name(), "SZYBKO????", "ju?? bardziej spa????!", user)
      }
      break;

    case 'EXPANDED EARTH SLAM': //PLUTO EXPANDED EARTH SLAM
      text = user.name() + ' podnosi ZIEMI?? i ciska ni?? we wszystkich!';
      break;

    case 'EXPANDED ADMIRATION': //PLUTO EXPANDED ADMIRATION
      text = user.name() + ' podziwia progres KELA!\r\n';
      text += steppedEmotionStateText('happy', target)
      break;

    //ABBI TENTACLE//
    case 'TENTACLE ATTACK': //ABBI TENTACLE ATTACK
      text = user.name() + ' trzaska ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'TENTACLE TICKLE': //ABBI TENTACLE TICKLE
      text = user.name() + " os??abia " + target._altName() + "!\r\n";
      var pronumn = target.name() === $gameActors.actor(2).name() ? "her" : "his";
      text += `${target.name()} opuszcza gard??!`
      break;

    case 'TENTACLE GRAB': //ABBI TENTACLE GRAB
      text = user.name() + ' owija si?? wok???? ' + target._altName() + '!\r\n';
      if (result.isHit()) {
        if (target.name() !== "OMORI" && !target._noEffectMessage) { text += target.name() + " si?? BOI.\r\n"; }
        else { text += parseNoEffectEmotion(target.name(), 'BA??.\r\n', target) }
      }
      text += hpDamageText;
      break;

    case 'TENTACLE GOOP': //ABBI TENTACLE GOOP
      text = target.name() + ' jest w ciemnej mazi!\r\n';
      text += target.name() + ' s??abnie...\r\n';
      text += target.name() + ' s??abnie.\r\n';
      text += target.name() + ' opuszcza gard??.\r\n';
      text += target.name() + ' zwalnia.';
      break;

    //ABBI//
    case 'ABBI ATTACK': //ABBI ATTACK
      text = user.name() + ' atakuje ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'ABBI REVIVE TENTACLE': //ABBI REVIVE TENTACLE
      text = user.name() + ' koncentruje swoje SERCE.';
      break;

    case 'ABBI VANISH': //ABBI VANISH
      text = user.name() + ' zatapia si?? w ciemno??ciach...';
      break;

    case 'ABBI ATTACK ORDER': //ABBI ATTACK ORDER
      if (target.index() <= unitLowestIndex) {
        text = user.name() + ' rozci??ga swoje macki.\r\n';
        text += "Wszyscy s?? silniejsi!!\r\n"
        text += "Wszyscy czuj?? Z??O????!"
      }
      break;

    case 'ABBI COUNTER TENTACLE': //ABBI COUNTER TENTACLES
      text = user.name() + ' porusza si?? w ciemno??ciach...';
      break;

    //ROBO SERC//
    case 'ROBO HEART ATTACK': //ROBO SERC ATTACK
      text = user.name() + ' wystrzeliwuje rakietowe r??ce!\r\n';
      text += hpDamageText;
      break;

    case 'ROBO HEART NOTHING': //ROBO SERC NOTHING
      text = user.name() + ' przetwarza informacje...';
      break;

    case 'ROBO HEART LASER': //ROBO SERC LASER
      text = user.name() + ' otwiera paszcz?? i strzela z lasera!\r\n';
      text += hpDamageText;
      break;

    case 'ROBO HEART EXPLOSION': //ROBO SERC EXPLOSION
      text = user.name() + ' roni robotyczn?? ??z??.\r\n';
      text += user.name() + ' wybucha!';
      break;

    case 'ROBO HEART SNACK': //ROBO SERC SNACK
      text = user.name() + ' otwiera paszcz??.\r\n';
      text += 'Pojawia si?? od??ywcza KANAPKA!\r\n';
      text += hpDamageText;
      break;

    //MUTANT SERC//
    case 'MUTANT HEART ATTACK': //MUTANT SERC ATTACK
      text = user.name() + ' ??piewa piosenk?? dla ' + target._altName() + '!\r\n';
      text += 'Nie brzmia??a najlepiej...\r\n';
      text += hpDamageText;
      break;

    case 'MUTANT HEART NOTHING': //MUTANT SERC NOTHING
      text = user.name() + ' pozuje!';
      break;

    case 'MUTANT HEART HEAL': //MUTANT SERC HEAL
      text = user.name() + ' poprawia sukienk??!';
      text += hpDamageText;
      break;

    case 'MUTANT HEART WINK': //MUTANT SERC WINK
      text = user.name() + ' puszcza oczko do ' + target._altName() + '!\r\n';
      text += 'To nawet urocze...\r\n';
      if (!target._noEffectMessage) { text += target.name() + ' czuje SZCZ????CIE!'; }
      else { if (target._doesUseAlternateForms()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWA!', target); // TOvDO: female
      } else if (target._doesUseAlternateForms2()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWE!', target) // TOvDO: plural
      } else if (target._doesUseAlternateForms3()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWE!', target) // TOvDO: neutral
      } else {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWY!', target) } }
      break;

    case 'MUTANT HEART INSULT': //MUTANT SERC INSULT
      text = user.name() + ' przypadkiem m??wi co?? obra??liwego.\r\n';
      if (!target._noEffectMessage) { text += target.name() + ' czuje Z??O????!'; }
      else { if (target._doesUseAlternateForms()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej Z??A!', target); // TOvDO: female
      } else if (target._doesUseAlternateForms2()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej Z??E!', target) // TOvDO: plural
      } else if (target._doesUseAlternateForms3()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej Z??E!', target) // TOvDO: neutral
      } else {
        text += parseNoEffectEmotion(target.name(), 'bardziej Z??Y!', target) } }
      break;

    case 'MUTANT HEART KILL': //MUTANT SERC KILL
      text = 'POCZWARNIUTKA strzela z li??cia ' + user._altName() + '!\r\n';
      text += hpDamageText;
      break;

    //PERFECT SERC//
    case 'PERFECT STEAL HEART': //PERFECT SERC STEAL SERC
      text = user.name() + ' kradnie SERCE ' + target._altName() + '.\r\n';
      text += hpDamageText + "\r\n";
      if (user.result().hpDamage < 0) { text += `${user.name()} odzyskuje ${Math.abs(user.result().hpDamage)} SERC!\r\n` }
      break;

    case 'PERFECT STEAL BREATH': //PERFECT SERC STEAL BREATH
      text = user.name() + ' zabiera dech w piersi ' + target._altName() + '.\r\n';
      text += mpDamageText + "\r\n";
      if (user.result().mpDamage < 0) { text += `${user.name()} odzyskuje ${Math.abs(user.result().mpDamage)} SOKU...\r\n` }
      break;

    case 'PERFECT EXPLOIT EMOTION': //PERFECT SERC EXPLOIT EMOTION
      text = user.name() + ' wzmacnia EMOCJE ' + target._altName() + '.\r\n';
      text += hpDamageText;
      break;

    case 'PERFECT SPARE': //PERFECT SPARE
      text = user.name() + ' oszcz??dza ' + target._altName() + '.\r\n';
      text += hpDamageText;
      break;

    case 'PERFECT ANGELIC VOICE': //UPLIFTING HYMN
      if (target.index() <= unitLowestIndex) {
        text = user.name() + ' ??piewa wzruszaj??c?? piosenk??...\r\n';
        if (!user._noEffectMessage) { text += user.name() + " czuje SMUTEK.\r\n" }
        else { if (target._doesUseAlternateForms()) {
          text += parseNoEffectEmotion(user.name(), 'bardziej SMUTNA!\r\n', user); // TOvDO: female
        } else {
          text += parseNoEffectEmotion(user.name(), 'bardziej SMUTNY!\r\n', user) } }
        text += 'Wszyscy czuj?? SZCZ????CIE!';
      }
      break;

    case "PERFECT ANGELIC WRATH":
      if (target.index() <= unitLowestIndex) { text = user.name() + " uwalnia sw??j gniew.\r\n"; }
      if (!target._noEffectMessage) {
        text += steppedEmotionStateText('sad', target, '\r\n')
        text += steppedEmotionStateText('happy', target, '\r\n')
        text += steppedEmotionStateText('angry', target, '\r\n')
      }
      else {
        if (target.isEmotionAffected("happy")) { if (target._doesUseAlternateForms()) {
          text += parseNoEffectEmotion($target.name(), 'bardziej SZCZ????LIWA!\r\n', target); // TOvDO: female
        } else if (target._doesUseAlternateForms2()) {
          text += parseNoEffectEmotion($target.name(), 'bardziej SZCZ????LIWE!\r\n', target) // TOvDO: plural
        } else if (target._doesUseAlternateForms3()) {
          text += parseNoEffectEmotion($target.name(), 'bardziej SZCZ????LIWE!\r\n', target) // TOvDO: neutral
        } else {
          text += parseNoEffectEmotion($target.name(), 'bardziej SZCZ????LIWY!\r\n', target) } }
        else if (target.isEmotionAffected("sad")) { if (target._doesUseAlternateForms()) {
          text += parseNoEffectEmotion($target.name(), 'bardziej SMUTNA!\r\n', target); // TOvDO: female
        } else if (target._doesUseAlternateForms2()) {
          text += parseNoEffectEmotion($target.name(), 'bardziej SMUTNE!\r\n', target) // TOvDO: plural
        } else if (target._doesUseAlternateForms3()) {
          text += parseNoEffectEmotion($target.name(), 'bardziej SMUTNE!\r\n', target) // TOvDO: neutral
        } else {
          text += parseNoEffectEmotion($target.name(), 'bardziej SMUTNY!\r\n', target) } }
        else if (target.isEmotionAffected("angry")) { if (target._doesUseAlternateForms()) {
          text += parseNoEffectEmotion($target.name(), 'bardziej Z??A!\r\n', target); // TOvDO: female
        } else if (target._doesUseAlternateForms2()) {
          text += parseNoEffectEmotion($target.name(), 'bardziej Z??E!\r\n', target) // TOvDO: plural
        } else if (target._doesUseAlternateForms3()) {
          text += parseNoEffectEmotion($target.name(), 'bardziej Z??E!\r\n', target) // TOvDO: neutral
        } else {
          text += parseNoEffectEmotion($target.name(), 'bardziej Z??Y!\r\n', target) } }
      }
      text += hpDamageText;
      break;

    //SLIME GIRLS//
    case 'SLIME GIRLS COMBO ATTACK': //SLIME GIRLS COMBO ATTACK
      text = user.name() + ' atakuj?? wsp??lnie!\r\n';
      text += hpDamageText;
      break;

    case 'SLIME GIRLS DO NOTHING': //SLIME GIRLS DO NOTHING
      text = 'MEDUZA rzuca butelk??...\r\n';
      text += 'Nic si?? nie sta??o...';
      break;

    case 'SLIME GIRLS STRANGE GAS': //SLIME GIRLS STRANGE GAS
      if (!target._noEffectMessage) {
        text += steppedEmotionStateText('sad', target, '\r\n')
        text += steppedEmotionStateText('happy', target, '\r\n')
        text += steppedEmotionStateText('angry', target, '\r\n')
      }
      else {
        if (target.isEmotionAffected("happy")) { if (target._doesUseAlternateForms()) {
          text += parseNoEffectEmotion($target.name(), 'bardziej SZCZ????LIWA!\r\n', target); // TOvDO: female
        } else if (target._doesUseAlternateForms2()) {
          text += parseNoEffectEmotion($target.name(), 'bardziej SZCZ????LIWE!\r\n', target) // TOvDO: plural
        } else if (target._doesUseAlternateForms3()) {
          text += parseNoEffectEmotion($target.name(), 'bardziej SZCZ????LIWE!\r\n', target) // TOvDO: neutral
        } else {
          text += parseNoEffectEmotion($target.name(), 'bardziej SZCZ????LIWY!\r\n', target) } }
        else if (target.isEmotionAffected("sad")) { if (target._doesUseAlternateForms()) {
          text += parseNoEffectEmotion($target.name(), 'bardziej SMUTNA!\r\n', target); // TOvDO: female
        } else if (target._doesUseAlternateForms2()) {
          text += parseNoEffectEmotion($target.name(), 'bardziej SMUTNE!\r\n', target) // TOvDO: plural
        } else if (target._doesUseAlternateForms3()) {
          text += parseNoEffectEmotion($target.name(), 'bardziej SMUTNE!\r\n', target) // TOvDO: neutral
        } else {
          text += parseNoEffectEmotion($target.name(), 'bardziej SMUTNY!\r\n', target) } }
        else if (target.isEmotionAffected("angry")) { if (target._doesUseAlternateForms()) {
          text += parseNoEffectEmotion($target.name(), 'bardziej Z??A!\r\n', target); // TOvDO: female
        } else if (target._doesUseAlternateForms2()) {
          text += parseNoEffectEmotion($target.name(), 'bardziej Z??E!\r\n', target) // TOvDO: plural
        } else if (target._doesUseAlternateForms3()) {
          text += parseNoEffectEmotion($target.name(), 'bardziej Z??E!\r\n', target) // TOvDO: neutral
        } else {
          text += parseNoEffectEmotion($target.name(), 'bardziej Z??Y!\r\n', target) } }
      }
      break;

    case 'SLIME GIRLS DYNAMITE': //SLIME GIRLS DYNAMITE
      //text = 'MEDUSA threw a bottle...\r\n';
      //text += 'And it explodes!\r\n';
      text += hpDamageText;
      break;

    case 'SLIME GIRLS STING RAY': //SLIME GIRLS STING RAY
      text = 'MOLLY wystrzeliwuje ????d??a!\r\n';
      text += target.name() + ' obrywa!\r\n';
      text += hpDamageText;
      break;

    case 'SLIME GIRLS SWAP': //SLIME GIRLS SWAP
      text = 'MEDUZA robi co?? tam!\r\n';
      text += 'Twoje SERCA zamieniaj?? si?? z SOKIEM!';
      break;

    case 'SLIME GIRLS CHAIN SAW': //SLIME GIRLS CHAIN SAW
      text = 'MARINA wyciaga pi????!\r\n';
      text += hpDamageText;
      break;

    //HUMPHREY SWARM//
    case 'H SWARM ATTACK': //HUMPHREY SWARM ATTACK
      text = 'GIGANTOS otacza i atakuje ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    //HUMPHREY LARGE//
    case 'H LARGE ATTACK': //HUMPHREY LARGE ATTACK
      text = 'GIGANTOS wpada na ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    //HUMPHREY FACE//
    case 'H FACE CHOMP': //HUMPHREY FACE CHOMP
      text = 'GIGANTOS zatapia k??y w ciele ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'H FACE DO NOTHING': //HUMPHREY FACE DO NOTHING
      text = 'GIGANTOS gapi si?? na ' + target._altName() + '!\r\n';
      text += 'GIGANTOS zaczyna si?? ??lini??.';
      break;

    case 'H FACE HEAL': //HUMPHREY FACE HEAL
      text = 'GIGANTOS po??yka wroga!\r\n';
      text += `GIGANTOS odzyskuje ${Math.abs(hpDam)} SERC!`
      break;

    //HUMPHREY UVULA//
    case 'UVULA DO NOTHING 1': //HUMPHREY UVULA DO NOTHING
      text = user.name() + ' u??miecha si?? do ' + target._altName() + '.\r\n';
      break;

    case 'UVULA DO NOTHING 2': //HUMPHREY UVULA DO NOTHING
      text = user.name() + ' puszcza oczko do ' + target._altName() + '.\r\n';
      break;

    case 'UVULA DO NOTHING 3': //HUMPHREY UVULA DO NOTHING
      text = user.name() + ' pluje na ' + target._altName() + '.\r\n';
      break;

    case 'UVULA DO NOTHING 4': //HUMPHREY UVULA DO NOTHING
      text = user.name() + ' gapi si?? na ' + target._altName() + '.\r\n';
      break;

    case 'UVULA DO NOTHING 5': //HUMPHREY UVULA DO NOTHING
      text = user.name() + ' mruga.\r\n';
      break;

    //FEAR OF FALLING//
    case 'DARK NOTHING': //SOMETHING IN THE DARK NOTHING
      text = user.name() + ' drwi z twojego upadku.\r\n';
      break;

    case 'DARK ATTACK': //SOMETHING IN THE DARK ATTACK
      text = user.name() + ' ci?? popycha.\r\n';
      text += hpDamageText;
      break;

    //FEAR OF BUGS//
    case 'BUGS ATTACK': //FEAR OF BUGS ATTACK
      text = user.name() + ' ci?? gryzie!\r\n';
      text += hpDamageText;
      break;

    case 'BUGS NOTHING': //FEAR OF BUGS NOTHING
      text = user.name() + ' pr??buje co?? do ciebie powiedzie??...';
      break;

    case 'SUMMON BABY SPIDER': //SUMMON BABY SPIDER
      text = 'Paj??cze jajko p??ka.\r\n';
      text += 'Pojawi?? si?? PAJ??CZEK.';
      break;

    case 'BUGS SPIDER WEBS': //FEAR OF BUGS SPIDER WEBS
      text = user.name() + ' wpl??tuje ci?? w lepk?? sie??.\r\n';
      text += target.name() + ' zwalnia!\r\n';
      break;

    //BABY SPIDER//
    case 'BABY SPIDER ATTACK': //BABY SPIDER ATTACK
      text = user.name() + ' ci?? gryzie!\r\n';
      text += hpDamageText;
      break;

    case 'BABY SPIDER NOTHING': //BABY SPIDER NOTHING
      text = user.name() + ' wydaje dziwny d??wi??k.';
      break;

    //FEAR OF DROWNING//
    case 'DROWNING ATTACK': //FEAR OF DROWNING ATTACK
      text = 'Woda porywa ci?? w r????ne strony.\r\n';
      text += hpDamageText;
      break;

    case 'DROWNING NOTHING': //FEAR OF DROWNING NOTHING
      text = user.name() + ' s??ucha, jak si?? zmagasz.';
      break;

    case 'DROWNING DRAG DOWN': //FEAR OF DROWNING DRAG DOWN
      // text = user.name() + ' grabs\r\n';
      // text += target.name() + '\s leg and drags him down!\r\n';
      text = hpDamageText;
      break;

    //OMORI'S SOMETHING//
    case 'O SOMETHING ATTACK': //OMORI SOMETHING ATTACK
      text = user.name() + ' ci?? przeszywa.\r\n';
      text += hpDamageText;
      break;

    case 'O SOMETHING NOTHING': //OMORI SOMETHING NOTHING
      text = user.name() + ' mo??e przejrze?? ci?? na wylot.\r\n';
      break;

    case 'O SOMETHING BLACK SPACE': //OMORI SOMETHING BLACK SPACE
      //text = user.name() + ' drags ' + target.name() + ' into\r\n';
      //text += 'the shadows.';
      text = hpDamageText;
      break;

    case 'O SOMETHING SUMMON': //OMORI SOMETHING SUMMON SOMETHING
      text = user.name() + ' wzywa co?? z ciemno??ci.\r\n';
      break;

    case 'O SOMETHING RANDOM EMOTION': //OMORI SOMETHING RANDOM EMOTION
      text = user.name() + ' gra na twoich EMOCJACH.';
      break;

    //BLURRY IMAGE//
    case 'BLURRY NOTHING': //BLURRY IMAGE NOTHING
      text = 'CO?? ko??ysze si?? na wietrze.';
      break;

    //HANGING BODY//
    case 'HANG WARNING':
      text = 'Czujesz, jak przeszywa ci?? dreszcz.';
      break;

    case 'HANG NOTHING 1':
      text = 'Niedobrze ci.';
      break;

    case 'HANG NOTHING 2':
      text = 'Czujesz ucisk w klatce.';
      break;

    case 'HANG NOTHING 3':
      text = 'Ci????ko ci na ??o????dku.';
      break;

    case 'HANG NOTHING 4':
      text = 'Czujesz, jak twoje SERCE wyrywa si?? z piersi.';
      break;

    case 'HANG NOTHING 5':
      text = 'Ca??y si?? trz??siesz.';
      break;

    case 'HANG NOTHING 6':
      text = 'Masz nogi jak z waty.';
      break;

    case 'HANG NOTHING 7':
      text = 'Pot kapie ci z czo??a.';
      break;

    case 'HANG NOTHING 8':
      text = 'Pi????ci same ci si?? zaciskaj??.';
      break;

    case 'HANG NOTHING 9':
      text = 'S??yszysz, jak wali ci SERCE.';
      break;

    case 'HANG NOTHING 10':
      text = 'S??yszysz, jak twoje serce si?? uspokaja.';
      break;

    case 'HANG NOTHING 11':
      text = 'S??yszysz, jak tw??j oddech si?? uspokaja.';
      break;

    case 'HANG NOTHING 12':
      text = 'Koncentrujesz si?? na tym, co jest na wprost.';
      break;

    //AUBREY//
    case 'AUBREY NOTHING': //AUBREY NOTHING
      text = user.name() + ' pluje ci na buta.';
      break;

    case 'AUBREY TAUNT': //AUBREY TAUNT
      text = target._altName() + ' zostaje nazwany s??abiakiem przez ' + user.name() + '!\r\n';
      text += target.name() + " czuje Z??O????!";
      break;

    //THE HOOLIGANS//
    case 'CHARLIE ATTACK': //HOOLIGANS CHARLIE ATTACK
      text = 'CHARLIE daje z siebie wszystko!\r\n';
      text += hpDamageText;
      break;

    case 'ANGEL ATTACK': //HOOLIGANS ANGEL ATTACK
      text = target.name() + ' zostaje uderzony przez zwinny ruch ANGELA!\r\n';
      text += hpDamageText;
      break;

    case 'MAVERICK CHARM': //HOOLIGANS MAVERICK CHARM
      text = user.name() + ' puszcza oczko!\r\n';
      text += target.name() + ' s??abnie.'
      break;

    case 'KIM HEADBUTT': //HOOLIGANS KIM HEADBUTT
      text = target.name() + ' obrywa z g????wki od ' + user._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'VANCE CANDY': //HOOLIGANS VANCE CANDY
      text = user.name() + ' rzuca s??odyczami!\r\n';
      text += hpDamageText;
      break;

    case 'HOOLIGANS GROUP ATTACK': //THE HOOLIGANS GROUP ATTACK
      text = user.name() + ' id?? na ca??o????!\r\n';
      text += hpDamageText;
      break;

    //BASIL//
    case 'BASIL ATTACK': //BASIL ATTACK
      text = user.name() + ' si??ga wg????b ciebie.\r\n';
      text += hpDamageText;
      break;

    case 'BASIL NOTHING': //BASIL NOTHING
      text = user.name() + ' ma oczy czerwone od p??aczu.';
      break;

    case 'BASIL PREMPTIVE STRIKE': //BASIL PREMPTIVE STRIKE
      text = user.name() + ' rani twoj?? r??k??.\r\n';
      text += hpDamageText;
      break;

    //BASIL'S SOMETHING//
    case 'B SOMETHING ATTACK': //BASIL'S SOMETHING ATTACK
      text = user.name() + ' ci?? dusi.\r\n';
      text += hpDamageText;
      break;

    case 'B SOMETHING TAUNT': //BASIL'S SOMETHING TAUNT BASIL
      text = user.name() + ' si??ga wg????b ciebie.\r\n';
      break;

    //PLAYER SOMETHING BASIL FIGHT//
    case 'B PLAYER SOMETHING STRESS': //B PLAYER SOMETHING STRESS
      text = user.name() + ' ci co?? robi.\r\n';
      text += hpDamageText;
      break;

    case 'B PLAYER SOMETHING HEAL': //B PLAYER SOMETHING HEAL
      text = user.name() + ' wsi??ka w twoje rany.\r\n';
      text += hpDamageText;
      break;

    case 'B OMORI SOMETHING CONSUME EMOTION': //B OMORI SOMETHING CONSUME EMOTION
      text = user.name() + ' poch??ania twoje EMOCJE.';
      break;

    //CHARLIE//
    case 'CHARLIE RELUCTANT ATTACK': //CHARLIE RELUCTANT ATTACK
      text = target.name() + ' obrywa od ' + user._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'CHARLIE NOTHING': //CHARLIE NOTHING
      text = user.name() + ' sobie stoi.';
      break;

    case 'CHARLIE LEAVE': //CHARLIE LEAVE
      text = user.name() + ' przestaje walczy??.';
      break;

    //ANGEL//
    case 'ANGEL ATTACK': //ANGEL ATTACK
    if (target.name() === $gameActors.actor(8).name()) {
      text = user.name() + ' nagle ci?? kopie!\r\n';
    }
    else text = user.name() + ' nagle kopie ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'ANGEL NOTHING': //ANGEL NOTHING
      text = user.name() + ' robi salto i pozuje!';
      break;

    case 'ANGEL QUICK ATTACK': //ANGEL QUICK ATTACK
      text = user.name() + ' si?? teleportuje!\r\n';
      text += hpDamageText;
      break;

    case 'ANGEL TEASE': //ANGEL TEASE
      if (target.name() === $gameActors.actor(8).name()) {
        text = user.name() + ' ci?? obra??a!\r\n';
      }
      else text = user.name() + ' obra??a ' + target._altName() + '!\r\n';
        text += hpDamageText;
        break;

    //THE MAVERICK//
    case 'MAVERICK ATTACK': //THE MAVERICK ATTACK
      if (target.name() === $gameActors.actor(8).name()) {
        text = user.name() + ' ci?? uderza!\r\n';
      }
      else text = user.name() + ' uderza ' + target._altName() + '!\r\n';
        text += hpDamageText;
        break;

    case 'MAVERICK NOTHING': //THE MAVERICK NOTHING
      text = user.name() + ' zaczyna chwali?? si?? swoimi wielbicielkami!';
      break;

    case 'MAVERICK SMILE': //THE MAVERICK SMILE
      text = user.name() + ' uwodzicielsko si?? u??miecha!\r\n';
      text += target.name() + ' s??abnie.';
      break;

    case 'MAVERICK TAUNT': //THE MAVERICK TAUNT
      if (target.name() === $gameActors.actor(8).name()) {
        text = user.name() + ' ci?? obra??a!\r\n';
      }
      else text = user.name() + ' obra??a ' + target._altName() + '!\r\n';
      text += target.name() + " czuje Z??O????!"
      break;

    //KIM//
    case 'KIM ATTACK': //KIM ATTACK
      if (target.name() === $gameActors.actor(8).name()) {
        text = user.name() + ' ci?? uderza!\r\n';
      }
      else text = user.name() + ' uderza ' + target._altName() + '!\r\n';
        text += hpDamageText;
        break;

    case 'KIM NOTHING': //KIM DO NOTHING
      text = 'Kto?? zadzwoni?? do ' + user._altName() + '...\r\n';
      text += 'Pomy??ka.';
      break;

    case 'KIM SMASH': //KIM SMASH
      if (target.name() === $gameActors.actor(8).name()) {
        text = user.name() + ' ??apie ci?? za koszulk?? i obrywasz w nos!\r\n';
      }
      else text = user.name() + ' ??apie ' + target._altName() + ' za koszulk?? i obrywa w nos!\r\n';
      text += hpDamageText;
      break;

    case 'KIM TAUNT': //KIM TAUNT
      if (target.name() === $gameActors.actor(8).name()) {
        text = user.name() + ' si?? z ciebie ??mieje!\r\n';
      }
      else text = user.name() + ' ??mieje si?? z ' + target._altName() + '!\r\n';
      text += target.name() + " czuje SMUTEK."
      break;

    //VANCE//
    case 'VANCE ATTACK': //VANCE ATTACK
      if (target.name() === $gameActors.actor(8).name()) {
        text = user.name() + ' ci?? uderza!\r\n';
      }
      else text = user.name() + ' uderza ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'VANCE NOTHING': //VANCE NOTHING
      text = user.name() + ' drapie si?? po brzuchu.';
      break;

    case 'VANCE CANDY': //VANCE CANDY
      text = target.name() + ' obrywa ze starych s??odyczy!\r\n';
      text += 'Fuuu... Ale si?? klei...\r\n';
      text += hpDamageText;
      break;

    case 'VANCE TEASE': //VANCE TEASE
      if (target.name() === $gameActors.actor(8).name()) {
        text = user.name() + ' ci?? wyzywa!\r\n';
      }
      else text = user.name() + ' wyzywa ' + target._altName() + '!\r\n';
      text += target.name() + " czuje SMUTEK."
      break;

    //JACKSON//
    case 'JACKSON WALK SLOWLY': //JACKSON WALK SLOWLY
      text = user.name() + ' powoli posuwa si?? naprz??d...\r\n';
      text += 'Nie ma ucieczki!';
      break;

    case 'JACKSON KILL': //JACKSON AUTO KILL
      text = user.name() + ' CI?? Z??APA??!!!\r\n';
      text += '??ycie miga ci przed oczami!';
      break;

    //RECYCLEPATH//
    case 'R PATH ATTACK': //RECYCLEPATH ATTACK
      text = target.name() + ' obrywa od RECYKLOPATY torb??!\r\n';
      text += hpDamageText;
      break;

    case 'R PATH SUMMON MINION': //RECYCLEPATH SUMMON MINION
      text = user.name() + ' wzywa recyklowyznawc??!\r\n';
      text += 'Pojawia si?? RECYKULTYSTA!';
      break;

    case 'R PATH FLING TRASH': //RECYCLEPATH FLING TRASH
      text = target.name() + ' obrywa ze ??MIECI od RECYKLOPATY!\r\n'
      text += hpDamageText;
      break;

    case 'R PATH GATHER TRASH': //RECYCLEPATH GATHER TRASH
      text = user.name() + ' zbiera ??MIECI!';
      break;

    //SOMETHING IN THE CLOSET//
    case 'CLOSET ATTACK': //SOMETHING IN THE CLOSET ATTACK
      text = user.name() + ' ci?? chwyta!\r\n';
      text += hpDamageText;
      break;

    case 'CLOSET NOTHING': //SOMETHING IN THE CLOSET DO NOTHING
      text = user.name() + ' dziwacznie mamrocze.';
      break;

    case 'CLOSET MAKE AFRAID': //SOMETHING IN THE CLOSET MAKE AFRAID
      text = user.name() + ' zna tw??j sekret!';
      break;

    case 'CLOSET MAKE WEAK': //SOMETHING IN THE CLOSET MAKE WEAK
      text = user.name() + ' wysysa twoje ch??ci do ??ycia!';
      break;

    //BIG STRONG TREE//
    case 'BST SWAY': //BIG STRONG TREE NOTHING 1
      text = 'Delikatny wiatr rozwiewa li??cie.';
      break;

    case 'BST NOTHING': //BIG STRONG TREE NOTHING 2
      text = user.name() + ' stoi twardo, jak na drzewo przysta??o.';
      break;

    //DREAMWORLD FEAR EXTRA BATTLES//
    //HEIGHTS//
    case 'DREAM HEIGHTS ATTACK': //DREAM FEAR OF HEIGHTS ATTACK
      text = user.name() + ' uderza ' + target._altName() + '.\r\n';
      text += hpDamageText;
      break;

    case 'DREAM HEIGHTS GRAB': //DREAM FEAR OF HEIGHTS GRAB
      if (target.index() <= unitLowestIndex) {
        text = 'R??ce pojawiaj?? si?? i ??api?? wszystkich!\r\n';
        text += 'Wszyscy s??abn??...';
      }

      break;

    case 'DREAM HEIGHTS HANDS': //DREAM FEAR OF HEIGHTS HANDS
      text = 'Pojawia si?? wi??cej r??k, kt??re otaczaj?? ' + user._altName() + '.\r\n';
      if (!target._noStateMessage) { text += user.name() + ' podnosi gard??!'; }
      else { text += parseNoStateChange(user.name(), "OBRONA", "ju?? bardziej wzrosn????!", user) }
      break;

    case 'DREAM HEIGHTS SHOVE': //DREAM FEAR OF HEIGHTS SHOVE
      text = user.name() + ' popycha ' + target._altName() + '.\r\n';
      text += hpDamageText + '\r\n';
      if (!target._noEffectMessage && target.name() !== "OMORI") { text += target.name() + ' si?? BOI.'; }
      else { text += parseNoEffectEmotion(target.name(), 'BA??.', target) }
      break;

    case 'DREAM HEIGHTS RELEASE ANGER': //DREAM FEAR OF HEIGHTS RELEASE ANGER
      text = user.name() + ' wy??adowuje swoj?? Z??O???? na wszystkich!';
      break;

    //SPIDERS//
    case 'DREAM SPIDERS CONSUME': //DREAM FEAR OF SPIDERS CONSUME
      text = user.name() + ' otacza i zjada ' + target._altName() + '.\r\n';
      text += hpDamageText;
      break;

    //DROWNING//
    case 'DREAM DROWNING SMALL': //DREAM FEAR OF DROWNING SMALL
      text = 'Wszyscy maj?? trudno??ci z oddychaniem.';
      break;

    case 'DREAM DROWNING BIG': //DREAM FEAR OF DROWNING BIG
      text = 'Wszyscy s?? blisko omdlenia.';
      break;

    // BLACK SPACE EXTRA //
    case 'BS LIAR': // BLACK SPACE LIAR
      text = 'K??amca.';
      break;

    //BACKGROUND ACTORS//
    //BERLY//
    case 'BERLY ATTACK': //BERLY ATTACK
      text = 'BERLY uderza z g????wki ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'BERLY NOTHING 1': //BERLY NOTHING 1
      text = 'BERLY dzielnie chowa si?? za rogiem.';
      break;

    case 'BERLY NOTHING 2': //BERLY NOTHING 2
      text = 'BERLY poprawia okulary.';
      break;

    //TOYS//
    case 'CAN':  // CAN
      text = user.name() + ' kopie PUSZK??.';
      break;

    case 'DANDELION':  // DANDELION
      text = user.name() + ' dmucha DMUCHAWCA.\r\n';
      text += user.name() + ' znowu czuje si?? sob??.';
      break;

    case 'DYNAMITE':  // DYNAMITE
      text = user.name() + ' rzuca DYNAMIT!';
      break;

    case 'LIFE JAM':  // LIFE JAM
      text = user.name() + ' smaruje TOSTA D??EMEM ??YCIA!\r\n';
      text += 'TOST zamieni?? si?? w ' + target._altName() + '!';
      break;

    case 'PRESENT':  // PRESENT
      text = target.name() + ' otwiera PREZENT\r\n';
      if (target._doesUseAlternateForms()) {
        text += 'To nie to, co sobie wymarzy??a...\r\n'; // TOvDO: female
      } else {
        text += 'To nie to, co sobie wymarzy??...\r\n';
      }
      if (!target._noEffectMessage) { text += target.name() + ' czuje Z??O????!'; }
      else { if (target._doesUseAlternateForms()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej Z??A!', target); // TOvDO: female
      } else if (target._doesUseAlternateForms2()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej Z??E!', target) // TOvDO: plural
      } else if (target._doesUseAlternateForms3()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej Z??E!', target) // TOvDO: neutral
      } else {
        text += parseNoEffectEmotion(target.name(), 'bardziej Z??Y!', target) } }
      break;

    case 'SILLY STRING':  // DYNAMITE
      if (target.index() <= unitLowestIndex) {
        text = user.name() + ' u??ywa SERPENTYNY!\r\n';
        text += '??UUUUU!! Imprezka!\r\n';
        text += 'Wszyscy czuj?? SZCZ????CIE! ';
      }
      break;

    case 'SPARKLER':  // SPARKLER
      text = user.name() + ' odpala SZTUCZNY OGIE??!\r\n';
      text += '??UUUUU!! Imprezka!\r\n';
      if (!target._noEffectMessage) { text += target.name() + ' czuje SZCZ????CIE!'; }
      else { if (target._doesUseAlternateForms()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWA!', target); // TOvDO: female
      } else if (target._doesUseAlternateForms2()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWE!', target) // TOvDO: plural
      } else if (target._doesUseAlternateForms3()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWE!', target) // TOvDO: neutral
      } else {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWY!', target) } }
      break;

    case 'COFFEE': // COFFEE
      text = user.name() + ' pije KAW??...\r\n';
      text += user.name() + ' czuje si?? ??wietnie!';
      break;

    case 'RUBBERBAND': // RUBBERBAND
      text = user.name() + ' pstryka ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    //OMORI BATTLE//

    case "OMORI ERASES":
      text = user.name() + " eliminuje wroga.\r\n";
      text += hpDamageText;
      break;

    case "MARI ATTACK":
      text = user.name() + " eliminuje wroga.\r\n";
      text += target.name() + " jest PRZERA??ONY.\r\n";
      text += hpDamageText;
      break;

    //STATES//
    case 'HAPPY':
      if (!target._noEffectMessage) {
        if (target._doesUseAlternateForms2()) {
          text = target.name() + ' czuj?? SZCZ????CIE!'; // TOvDO: plural
        } else {
          text = target.name() + ' czuje SZCZ????CIE!';
        }
      }
      else { if (target._doesUseAlternateForms()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWA!', target); // TOvDO: female
      } else if (target._doesUseAlternateForms2()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWE!', target) // TOvDO: plural
      } else if (target._doesUseAlternateForms3()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWE!', target) // TOvDO: neutral
      } else {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWY!', target) } }
      break;

    case 'ECSTATIC':
      if (!target._noEffectMessage) {
        if (target._doesUseAlternateForms()) {
          text = target.name() + ' jest RADOSNA!!'; // TOvDO: female
        } else if (target._doesUseAlternateForms2()) {
          text = target.name() + ' s?? RADOSNE!!'; // TOvDO: plural
        } else {
          text = target.name() + ' jest RADOSNY!!';
        }
      }
      else { if (target._doesUseAlternateForms()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWA!', target); // TOvDO: female
      } else if (target._doesUseAlternateForms2()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWE!', target) // TOvDO: plural
      } else if (target._doesUseAlternateForms3()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWE!', target) // TOvDO: neutral
      } else {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWY!', target) } }
      break;

    case 'MANIC':
      if (!target._noEffectMessage) {
        if (target._doesUseAlternateForms2()) {
          text = target.name() + ' s?? w EUFORII!!!'; //TOvDO: plural
        } else {
          text = target.name() + ' jest w EUFORII!!!';
        }
      }
      else { if (target._doesUseAlternateForms()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWA!', target); // TOvDO: female
      } else if (target._doesUseAlternateForms2()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWE!', target) // TOvDO: plural
      } else if (target._doesUseAlternateForms3()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWE!', target) // TOvDO: neutral
      } else {
        text += parseNoEffectEmotion(target.name(), 'bardziej SZCZ????LIWY!', target) } }
      break;

    case 'SAD':
      if (!target._noEffectMessage) {
        if (target._doesUseAlternateForms2()) {
          text = target.name() + ' czuj?? SMUTEK.'; //TOvDO: plural
        } else {
          text = target.name() + ' czuje SMUTEK.';
        }
      }
      else { if (target._doesUseAlternateForms()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SMUTNA!\r\n', target); // TOvDO: female
      } else if (target._doesUseAlternateForms2()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SMUTNE!\r\n', target) // TOvDO: plural
      } else if (target._doesUseAlternateForms3()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SMUTNE!\r\n', target) // TOvDO: neutral
      } else {
        text += parseNoEffectEmotion(target.name(), 'bardziej SMUTNY!\r\n', target) } }
      break;

    case 'DEPRESSED':
      if (!target._noEffectMessage) {
        if (target._doesUseAlternateForms()) {
          text = target.name() + ' jest ZA??AMANA..'; // TOvDO: female
        } else if (target._doesUseAlternateForms2()) {
          text = target.name() + ' s?? ZA??AMANE..'; // TOvDO: plural
        } else {
          text = target.name() + ' jest ZA??AMANY..';
        }
      }
      else { if (target._doesUseAlternateForms()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SMUTNA!\r\n', target); // TOvDO: female
      } else if (target._doesUseAlternateForms2()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SMUTNE!\r\n', target) // TOvDO: plural
      } else if (target._doesUseAlternateForms3()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SMUTNE!\r\n', target) // TOvDO: neutral
      } else {
        text += parseNoEffectEmotion(target.name(), 'bardziej SMUTNY!\r\n', target) } }
      break;

    case 'MISERABLE':
      if (!target._noEffectMessage) {
        if (target._doesUseAlternateForms()) {
          text = target.name() + ' jest PRZYBITA...'; // TOvDO: female
        } else if (target._doesUseAlternateForms2()) {
          text = target.name() + ' s?? PRZYBITE...'; // TOvDO: plural
        } else {
          text = target.name() + ' jest PRZYBITY...';
        }
      }
      else { if (target._doesUseAlternateForms()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SMUTNA!', target); // TOvDO: female
      } else if (target._doesUseAlternateForms2()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SMUTNE!', target) // TOvDO: plural
      } else if (target._doesUseAlternateForms3()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej SMUTNE!', target) // TOvDO: neutral
      } else {
        text += parseNoEffectEmotion(target.name(), 'bardziej SMUTNY!', target) } }
      break;

    case 'ANGRY':
      if (!target._noEffectMessage) {
        if (target._doesUseAlternateForms2()) {
          text = target.name() + ' czuj?? Z??O????!'; //TOvDO: plural
        } else {
          text = target.name() + ' czuje Z??O????!';
        }
      }
      else { if (target._doesUseAlternateForms()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej Z??A!', target); // TOvDO: female
      } else if (target._doesUseAlternateForms2()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej Z??E!', target) // TOvDO: plural
      } else if (target._doesUseAlternateForms3()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej Z??E!', target) // TOvDO: neutral
      } else {
        text += parseNoEffectEmotion(target.name(), 'bardziej Z??Y!', target) } }
      break;

    case 'ENRAGED':
      if (!target._noEffectMessage) {
        if (target._doesUseAlternateForms()) {
          text = target.name() + ' jest WKURZONA!!'; // TOvDO: female
        } else if (target._doesUseAlternateForms2()) {
          text = target.name() + ' s?? WKURZONE!!'; // TOvDO: plural
        } else {
          text = target.name() + ' jest WKURZONY!!';
        }
      }
      else { if (target._doesUseAlternateForms()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej Z??A!', target); // TOvDO: female
      } else if (target._doesUseAlternateForms2()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej Z??E!', target) // TOvDO: plural
      } else if (target._doesUseAlternateForms3()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej Z??E!', target) // TOvDO: neutral
      } else {
        text += parseNoEffectEmotion(target.name(), 'bardziej Z??Y!', target) } }
      break;

    case 'FURIOUS':
      if (!target._noEffectMessage) {
        if (target._doesUseAlternateForms()) {
          text = target.name() + ' jest W??CIEK??A!!!' // TOvDO: female
        } else if (target._doesUseAlternateForms2()) {
          text = target.name() + ' s?? W??CIEK??E!!!' // TOvDO: plural
        } else {
          text = target.name() + ' jest W??CIEK??Y!!!'
        }
      }
      else { if (target._doesUseAlternateForms()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej Z??A!', target); // TOvDO: female
      } else if (target._doesUseAlternateForms2()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej Z??E!', target) // TOvDO: plural
      } else if (target._doesUseAlternateForms3()) {
        text += parseNoEffectEmotion(target.name(), 'bardziej Z??E!', target) // TOvDO: neutral
      } else {
        text += parseNoEffectEmotion(target.name(), 'bardziej Z??Y!', target) } }
      break;

    case 'AFRAID':
      if (!target._noEffectMessage) {
        if (target._doesUseAlternateForms()) {
          text = target.name() + ' jest PRZERA??ONA!'; // TOvDO: female
        } else if (target._doesUseAlternateForms2()) {
          text = target.name() + ' s?? PRZERA??ONE!'; // TOvDO: plural
        } else {
          text = target.name() + ' jest PRZERA??ONY!';
        }
      }
      else { text = parseNoEffectEmotion(target.name(), 'BA??.', target) }
      break;

    case 'CANNOT MOVE':
      if (target._doesUseAlternateForms()) {
        text = target.name() + ' jest zmobilizowana! '; //TOvDO: female
      } else if (target._doesUseAlternateForms2()) {
        text = target.name() + ' s?? zmobilizowane! '; //TOvDO: plural
      } else if (target._doesUseAlternateForms3()) {
        text = target.name() + ' jest zmobilizowane! '; //TOvDO: neutral
      } else {
        text = target.name() + ' jest zmobilizowany! ';
      }
      break;

    case 'INFATUATION':
      if (target._doesUseAlternateForms()) {
        text = target.name() + ' jest zmobilizowana mi??o??ci??! '; //TOvDO: female
      } else if (target._doesUseAlternateForms2()) {
        text = target.name() + ' s?? zmobilizowane mi??o??ci??! '; //TOvDO: plural
      } else if (target._doesUseAlternateForms3()) {
        text = target.name() + ' jest zmobilizowane mi??o??ci??! '; //TOvDO: neutral
      } else {
        text = target.name() + ' jest zmobilizowany mi??o??ci??! ';
      }
      break;

    //SNALEY//
    case 'SNALEY MEGAPHONE': // SNALEY MEGAPHONE
      if (target.index() <= unitLowestIndex) { text = user.name() + ' u??ywa TR??BKI!\r\n'; }
      if (target.isStateAffected(16)) { text += target.name() + ' jest W??CIEK??Y!!!\r\n' }
      else if (target.isStateAffected(15)) { text += target.name() + ' jest WKURZONY!!\r\n' }
      else if (target.isStateAffected(14)) { text += target.name() + ' czuje Z??O????!\r\n' }
      break;

  }
  // Return Text
  return text;
};
//=============================================================================
// * Display Custom Action Text
//=============================================================================
const MAX_CHAR_IN_LINE = 36;

Window_BattleLog.prototype.displayCustomActionText = function (subject, target, item) {
  // Make Custom Action Text
  var text = this.makeCustomActionText(subject, target, item);
  // If Text Length is more than 0
  if (text.length > 0) {
    if (!!this._multiHitFlag && !!item.isRepeatingSkill) { return; }
    // Split text into several parts
    textArray = text.split(/\r\n/);

    // Check if every text line is no more than MAX_CHAR_IN_LINE
    textArray.forEach(text => { 
      if (text.length > MAX_CHAR_IN_LINE) {
        this.sliceLongString(text);
      }
      else this.push('addText', text); 
    });
    // Add Wait
    this.push('wait', 15);
  }
  if (!!item.isRepeatingSkill) { this._multiHitFlag = true; }
}

Window_BattleLog.prototype.displayHpDamage = function(target) {
  let text = this.makeHpDamageText(target);

  if (target.result().hpAffected) {
      if (target.result().hpDamage > 0 && !target.result().drain) {
          this.push('performDamage', target);
      }
      if (target.result().hpDamage < 0) {
          this.push('performRecovery', target);
      }
      if (text.length > MAX_CHAR_IN_LINE) {
        this.sliceLongString(text);
        return;
      }
      this.push('addText', text);
  }
};

// Function which slices text into 2 parts if it's longer than MAX_CHAR_IN_LINE
Window_BattleLog.prototype.sliceLongString = function(text) {
  var sliceIndex = 0;

  for(let j = MAX_CHAR_IN_LINE; j >= 0; j--) {
    if(text[j] === " ") {
      sliceIndex = j;
      break;
    }
  }

  this.push('addText', text.slice(0, sliceIndex).trim());
  this.push('addText', text.slice(sliceIndex).trimLeft());
  this.push('wait', 10);
}

//=============================================================================
// * Display Action
//=============================================================================
Window_BattleLog.prototype.displayAction = function (subject, item) {
  // Return if Item has Custom Battle Log Type
  if (item.meta.BattleLogType) { return; }
  else if (!DataManager.isSkill(item)) {
    this.push('addText', `${subject.name()} u??ywa przedmiotu.`);
    this.push('wait');
    this.push('addText', `Wykorzystano: ${item.name}!`);
    this.push('wait');
  }
  // Run Original Function
  else _TDS_.CustomBattleActionText.Window_BattleLog_displayAction.call(this, subject, item);
};
//=============================================================================
// * Display Action Results
//=============================================================================
Window_BattleLog.prototype.displayActionResults = function (subject, target) {
  // Get Item Object
  var item = BattleManager._action._item.object();
  // If Item has custom battle log type
  if (item && item.meta.BattleLogType) {
    // Display Custom Action Text
    this.displayCustomActionText(subject, target, item);
    // Return
  }
  // Run Original Function
  else {
    _TDS_.CustomBattleActionText.Window_BattleLog_displayActionResults.call(this, subject, target);
  }
};

const _old_window_battleLog_displayHpDamage = Window_BattleLog.prototype.displayHpDamage
Window_BattleLog.prototype.displayHpDamage = function (target) {
  let result = target.result();
  if (result.isHit() && result.hpDamage > 0) {
    if (!!result.elementStrong) {
      this.push("addText", "...To silny atak!");
      this.push("waitForNewLine");
    }
    else if (!!result.elementWeak) {
      this.push("addText", "...To s??aby atak!");
      this.push("waitForNewLine")
    }
  }
  return _old_window_battleLog_displayHpDamage.call(this, target)
};

//=============================================================================
// * CLEAR
//=============================================================================
_TDS_.CustomBattleActionText.Window_BattleLog_endAction = Window_BattleLog.prototype.endAction;
Window_BattleLog.prototype.endAction = function () {
  _TDS_.CustomBattleActionText.Window_BattleLog_endAction.call(this);
  this._multiHitFlag = false;
};

//=============================================================================
// * DISPLAY ADDED STATES
//=============================================================================