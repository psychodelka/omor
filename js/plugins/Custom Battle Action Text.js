//=============================================================================
// TDS Custom Battle Action Text
// Version: 1.0
//=============================================================================
// Add to Imported List
var Imported = Imported || {} ; Imported.TDS_CustomBattleActionText = true;
// Initialize Alias Object
var _TDS_ = _TDS_ || {} ; _TDS_.CustomBattleActionText = _TDS_.CustomBattleActionText || {};
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
_TDS_.CustomBattleActionText.Window_BattleLog_displayAction         = Window_BattleLog.prototype.displayAction;
_TDS_.CustomBattleActionText.Window_BattleLog_displayActionResults  = Window_BattleLog.prototype.displayActionResults;
//=============================================================================
// * Make Custom Action Text
//=============================================================================
Window_BattleLog.prototype.makeCustomActionText = function(subject, target, item) {
  var user          = subject;
  var result        = target.result();
  var hit           = result.isHit();
  var success       = result.success;
  var critical      = result.critical;
  var missed        = result.missed;
  var evaded        = result.evaded;
  var hpDam         = result.hpDamage;
  var mpDam         = result.mpDamage;
  var tpDam         = result.tpDamage;
  var addedStates   = result.addedStates;
  var removedStates = result.removedStates;
  var strongHit     = result.elementStrong;
  var weakHit       = result.elementWeak;
  var text = '';
  var type = item.meta.BattleLogType.toUpperCase();
  var switches = $gameSwitches;
  var unitLowestIndex = target.friendsUnit().getLowestIndexMember();


  function parseNoEffectEmotion(tname, em, target) {
    if(em.toLowerCase().contains("afraid")) {
      if(tname === $gameActors.actor(1).name()) {return "OMORI się nie boi!\r\n"}
      if(target._doesUseAlternateForms2()) {
        text = target.name() + ' się nie boją!';
      }
      return target.name() + " się nie boi!\r\n";
    }
    let finalString = `${tname} nie potrafi stać się ${em}`;
    if(finalString.length >= 40) {
      let voinIndex = 0;
      for(let i = 40; i >= 0; i--) {
        if(finalString[i] === " ") {
          voinIndex = i;
          break;
        }
      }
      finalString = [finalString.slice(0, voinIndex).trim(), "\r\n", finalString.slice(voinIndex).trimLeft()].join('')
    }
    return finalString;
  }

  function parseNoStateChange(tname,stat,hl) {
    let noStateChangeText = `${stat} ${tname} nie może\r\n${hl}`; // TARGET NAME - STAT - HIGHER/LOWER
    return noStateChangeText
  }

  // Type case
//OMORI//
if (hpDam != 0) {
  var hpDamageText = target.name() + ' otrzymuje ' + hpDam + ' obrażeń!';
  if (strongHit) {
    hpDamageText = '...To silny atak!\r\n' + hpDamageText;
  } else if (weakHit) {
    hpDamageText = '...To słaby atak.\r\n' + hpDamageText;
  }
} else if (result.isHit() === true) {
  var hpDamageText = user.name() + " atakuje, bez skutku.";
} else {
  var hpDamageText = user.name() + " pudłuje!";
}

if (critical) {
    hpDamageText = 'TRAF PROSTO W SERCE!\r\n' + hpDamageText;
}

if (mpDam > 0) {
  var mpDamageText = target.name() + ' traci ' + mpDam + ' SOKU...';
  hpDamageText = hpDamageText + "\r\n" + mpDamageText;
} else {
  var mpDamageText = '';
}

  switch (type) {
  case 'BLANK': // ATTACK
    text = '...';
    break;

  case 'ATTACK': // ATTACK
    text = user.name() + ' atakuje ' + target._altName() + '!\r\n';
    text += hpDamageText;
    break;

  case 'MULTIHIT':
    text = user.name() + "zadaje silny cios!\r\n";
    break;

  case 'OBSERVE': // OBSERVE
    text = user.name() + ' skupia się i obserwuje.\r\n';
    text += target._altName() + '!';
    break;

  case 'OBSERVE TARGET': // OBSERVE TARGET
    //text = user.name() + " observes " + target.name() + ".\r\n";
    text = target.name() + ' ma oko na\r\n';
    text += user._altName() + '!';
    break;

  case 'OBSERVE ALL': // OBSERVE TARGET
    //text = user.name() + " observes " + target.name() + ".\r\n";
    text = user.name() + ' skupia się i obserwuje\r\n';
    text += target._altName() + '!';
    text = target.name() + ' ma wszystkich na oku!';
    break;

  case 'SAD POEM':  // SAD POEM
    text = user.name() + ' czyta smutny wiersz.\r\n';
    if(!target._noEffectMessage) {
      if(target.isStateAffected(12)) {text += target.name() + ' jest PRZYBITY...';}
      else if(target.isStateAffected(11)) {text += target.name() + ' jest ZAŁAMANY..';}
      else if(target.isStateAffected(10)) {text += target.name() + ' czuje SMUTEK.';}
    }
    else {text += parseNoEffectEmotion($1,$2, target)}
    break;

  case 'STAB': // STAB
    text = user.name() + ' dźga.\r\n';
    text += hpDamageText;
    break;

  case 'TRICK':  // TRICK
    text = user.name() + ' robi psikusa.\r\n';
    if(target.isEmotionAffected("happy")) {
      if(!target._noStateMessage) {text += target.name() + ' zwalnia!\r\n';}
      else {text += parseNoStateChange(target.name(), "SZYBKOŚĆ", "już bardziej spaść!\r\n")}
    }
    text += hpDamageText;
    break;

  case 'SHUN': // SHUN
    text = user.name() + ' olewa wroga.\r\n';
    if(target.isEmotionAffected("sad")) {
      if(!target._noStateMessage) {text += target.name() + ' opuszcza gardę.\r\n';}
      else {text += parseNoStateChange(target.name(), "OBRONA", "już bardziej spaść!\r\n")}
    }
    text += hpDamageText;
    break;

  case 'MOCK': // MOCK
    text = user.name() + ' drwi sobie z wroga.\r\n';
    text += hpDamageText;
    break;

  case 'HACKAWAY':  // Hack Away
    text = user.name() + ' wywija nożem!';
    break;

  case 'PICK POCKET': //Pick Pocket
    text = user.name() + ' próbuje coś zwinąć!\r\n';
    text += 'od wroga.';
    break;

  case 'BREAD SLICE': //Bread Slice
    text = user.name() + ' ciacha!\r\n';
    text += hpDamageText;
    break;

  case 'HIDE': // Hide
    text = user.name() + ' wtapia się w otoczenie... ';
    break;

  case 'QUICK ATTACK': // Quick Attack
    text = user.name() + ' rzuca się na ' + target._altName() + '!\r\n';
    text += hpDamageText;
    break;

  case 'EXPLOIT HAPPY': //Exploit Happy
    text = user.name() + ' wzmacnia szczęście!\r\n';
    text += hpDamageText;
    break;

  case 'EXPLOIT SAD': // Exploit Sad
    text = user.name() + ' wzmacnia smutek!\r\n';
    text += hpDamageText;
    break;

  case 'EXPLOIT ANGRY': // Exploit Angry
    text = user.name() + ' wzmacnia złość!\r\n';
    text += hpDamageText;
    break;

  case 'EXPLOIT EMOTION': // Exploit Emotion
    text = user.name() + " wzmacnia EMOCJE";
    if(text.length >= 34) {
      text = user.name() + ' wzmacnia EMOCJE!\r\n';
    }
    else {text += "\r\n"}
    text += hpDamageText;
    break;

  case 'FINAL STRIKE': // Final Strike
    text = user.name() + ' zadaje swój ostateczny cios!';
    break;

  case 'TRUTH': // PAINFUL TRUTH
    text = user.name() + ' coś szepce.\r\n';
    text += hpDamageText + "\r\n";
    if(!target._noEffectMessage) {
      text += target.name() + " czuje SMUTEK.\r\n";
    }
    else {text += parseNoEffectEmotion($1,$2, target)}
    if(user.isStateAffected(12)) {text += user.name() + " jest PRZYBITY...";}
    else if(user.isStateAffected(11)) {text += user.name() + " jest ZAŁAMANY..";}
    else if(user.isStateAffected(10)) {text += user.name() + " czuje SMUTEK.";}
    break;

  case 'ATTACK AGAIN':  // ATTACK AGAIN 2
    text = user.name() + ' atakuje ponownie!\r\n';
    text += hpDamageText;
    break;

  case 'TRIP':  // TRIP
    text = user.name() + ' podkłada nogę!\r\n';
    if(!target._noStateMessage) {text += target.name() + ' zwalnia!\r\n';}
    else {text += parseNoStateChange(target.name(), "SZYBKOŚĆ", "już bardziej spaść!\r\n")}
    text += hpDamageText;
    break;

    case 'TRIP 2':  // TRIP 2
      text = user.name() + ' podkłada nogę!\r\n';
      if(!target._noStateMessage) {text += target.name() + ' zwalnia!\r\n';}
      else {text += parseNoStateChange(target.name(), "SZYBKOŚĆ", "już bardziej spaść!\r\n")}
      if(!target._noEffectMessage) {text += target.name() + ' czuje SMUTEK.\r\n';}
      else {text += parseNoEffectEmotion($1,$2, target)}
      text += hpDamageText;
      break;

  case 'STARE': // STARE
    text = user.name() + ' gapi się na wroga.\r\n';
    text += target.name() + ' czuje niepokój.';
    break;

  case 'RELEASE ENERGY':  // RELEASE ENERGY
    text = user.name() + ' z przyjaciółmi łączą swoje siły\r\n';
    text += 'i zadają swój ostateczny cios!';
    break;

  case 'VERTIGO': // OMORI VERTIGO
    if(target.index() <= unitLowestIndex) {
      text = user.name() + ' wytrąca wrogów z równowagi!\r\n';
      text += 'Wrogowie stali się słabsi!\r\n';
    }
    text += hpDamageText;
    break;

  case 'CRIPPLE': // OMORI CRIPPLE
    if(target.index() <= unitLowestIndex) {
      text = user.name() + ' paraliżuje wrogów!\r\n';
      text += "Wrogowie spowolnieli.\r\n";
    }
    text += hpDamageText;
    break;

  case 'SUFFOCATE': // OMORI SUFFOCATE
    if(target.index() <= unitLowestIndex) {
      text = user.name() + ' zadusza wrogów!\r\n';
      text += 'Wrogowie tracą oddech.\r\n';
      text += "Wrogowie opuścili gardę.\r\n";
    }
    text += hpDamageText;
    break;

  //AUBREY//
  case 'PEP TALK':  // PEP TALK
    text = user.name() + ' wspiera przyjaciela!\r\n';
    if(!target._noEffectMessage) {
      if(target.isStateAffected(8)) {text += target.name() + ' jest w EUFORII!!!';}
      else if(target.isStateAffected(7)) {text += target.name() + ' jest RADOSNY!!';}
      else if(target.isStateAffected(6)) {text += target.name() + ' czuje SZCZĘŚCIE!';}
    }
    else {text += parseNoEffectEmotion($1,$2, target)}
    break;

  case 'TEAM SPIRIT':  // TEAM SPIRIT
    text = user.name() + ' daje wsparcie!\r\n';
    if(!target._noEffectMessage) {
      if(target.isStateAffected(8)) {text += target.name() + ' jest w EUFORII!!!\r\n';}
      else if(target.isStateAffected(7)) {text += target.name() + ' jest RADOSNY!!\r\n';}
      else if(target.isStateAffected(6)) {text += target.name() + ' czuje SZCZĘŚCIE!\r\n';}
    }
    else {text += parseNoEffectEmotion($1,$2, target)}

    if(!user._noEffectMessage) {
      if(user.isStateAffected(8)) {text += user.name() + ' jest w EUFORII!!!';}
      else if(user.isStateAffected(7)) {text += user.name() + ' jest RADOSNY!!';}
      else if(user.isStateAffected(6)) {text += user.name() + ' czuje SZCZĘŚCIE!';}
    }
    else {text += parseNoEffectEmotion($1,$2, target)}
    break;

  case 'HEADBUTT':  // HEADBUTT
    text = user.name() + ' uderza z główki!\r\n';
    text += hpDamageText;
    break;

  case 'HOMERUN': // Homerun
    text = user.name() + ' wykopuje wroga\r\n';
    text += 'z parku!\r\n';
    text += hpDamageText;
    break;

  case 'THROW': // Wind-up Throw
    text = user.name() + ' rzuca bronią!';
    break;

  case 'POWER HIT': //Power Hit
    text = user.name() + ' rozgniata wroga!\r\n';
    if(!target._noStateMessage) {text += target.name() + ' opuszcza gardę.\r\n';}
    else {text += parseNoStateChange(target.name(), "OBRONA", "już bardziej spaść!\r\n")}
    text += hpDamageText;
    break;

  case 'LAST RESORT': // Last Resort
    text = user.name() + ' uderza wroga\r\n';
    text += 'z całej siły!\r\n';
    text += hpDamageText;
    break;

  case 'COUNTER ATTACK': // Counter Attack
    text = user.name() + ' przygotowuje swój kij!';
    break;

  case 'COUNTER HEADBUTT': // Counter Headbutt
    text = user.name() + ' przygotowuje swoją głowę!';
    break;

  case 'COUNTER ANGRY': //Counter Angry
    text = user.name() + ' się broni!';
    break;

  case 'LOOK OMORI 1':  // Look at Omori 2
    text = 'OMORI nie zauważa ' + user.name() + ', więc\r\n';
    text += user.name() + ' atakuje ponownie!\r\n';
    text += hpDamageText;
    break;

  case 'LOOK OMORI 2': // Look at Omori 2
    text = 'OMORI wciąż nie zauważa ' + user.name() + ', więc\r\n';
    text += user.name() + ' uderza mocniej!\r\n';
    text += hpDamageText;
    break;

  case 'LOOK OMORI 3': // Look at Omori 3
    text = 'OMORI w końcu zauważa ' + user.name() + '!\r\n';
    text += user.name() + ' szczęśliwie wymachuje kijem!\r\n';
    text += hpDamageText;
    break;

  case 'LOOK KEL 1':  // Look at Kel 1
    text = 'KEL wnerwia AUBREY!\r\n';
    text += target.name() + " czuje ZŁOŚĆ!";
    break;

  case 'LOOK KEL 2': // Look at Kel 2
   text = 'KEL wnerwia AUBREY!\r\n';
   text += 'KEL i AUBREY są silniejsi!\r\n';
   var AUBREY = $gameActors.actor(2);
   var KEL = $gameActors.actor(3);
   if(AUBREY.isStateAffected(14) && KEL.isStateAffected(14)) {text += 'KEL i AUBREY czują ZŁOŚĆ!';}
   else if(AUBREY.isStateAffected(14) && KEL.isStateAffected(15)) {
    text += 'KEL jest WKURZONY!!\r\n';
    text += 'AUBREY czuje ZŁOŚĆ!';
   }
   else if(AUBREY.isStateAffected(15) && KEL.isStateAffected(14)) {
    text += 'KEL czuje ZŁOŚĆ!\r\n';
    text += 'AUBREY jest WKURZONA!!';
   }
   else if(AUBREY.isStateAffected(15) && KEL.isStateAffected(15)) {text += 'KEL i AUBREY są WKURZENI!!';}
   else {text += 'KEL i AUBREY czują ZŁOŚĆ!';}
   break;

  case 'LOOK HERO':  // LOOK AT HERO 1
    text = 'HERO prosi AUBREY o skupienie!\r\n';
    if(target.isStateAffected(6)) {text += target.name() + " czuje SZCZĘŚCIE!\r\n"}
    else if(target.isStateAffected(7)) {text += target.name() + " jest RADOSNY!!\r\n"}
    text += user.name() + ' podnosi gardę!!';
    break;

  case 'LOOK HERO 2': // LOOK AT HERO 2
    text = 'HERO kibicuje AUBREY!\r\n';
    text += 'AUBREY podnosi gardę!!\r\n';
    if(target.isStateAffected(6)) {text += target.name() + " czuje SZCZĘŚCIE!\r\n"}
    else if(target.isStateAffected(7)) {text += target.name() + " jest RADOSNY!!\r\n"}
    if(!!$gameTemp._statsState[0]) {
      var absHp = Math.abs($gameTemp._statsState[0] - $gameActors.actor(2).hp);
      if(absHp > 0) {text += `AUBREY odzyskuje ${absHp} SERC!\r\n`;}
    }
    if(!!$gameTemp._statsState[1]) {
      var absMp = Math.abs($gameTemp._statsState[1] - $gameActors.actor(2).mp);
      if(absMp > 0) {text += `AUBREY odzyskuje ${absMp} SOKU...`;}
    }
    $gameTemp._statsState = undefined;
    break;

  case 'TWIRL': // ATTACK
    text = user.name() + ' atakuje!\r\n';
    text += hpDamageText;
    break;

  //KEL//
    case 'ANNOY':  // ANNOY
      text = user.name() + ' jest irytujący!\r\n';
      if(!target._noEffectMessage) {
        if(target.isStateAffected(14)) {text += target.name() + ' czuje ZŁOŚĆ!';}
        else if(target.isStateAffected(15)) {text += target.name() + ' jest WKURZONY!!';}
        else if(target.isStateAffected(16)) {text += target.name() + ' jest WŚCIEKŁY!!!';}
      }
      else {text += parseNoEffectEmotion($1,$2, target)}
      break;

    case 'REBOUND':  // REBOUND
      text = 'Piłka KELA odbija się wszędzie!';
      break;

    case 'FLEX':  // FLEX
      text = user.name() + ' ciśnie i czuje się mistrzem!\r\n';
      text += user.name() + " jest celniejszy!\r\n"
      break;

    case 'JUICE ME': // JUICE ME
      text = user.name() + ' podaje KOKOSA!\r\n'
      var absMp = Math.abs(mpDam);
      if(absMp > 0) {
        text += `${target.name()} odzyskuje ${absMp} SOKU...\r\n`
      }
      text += hpDamageText;
      break;

    case 'RALLY': // RALLY
      text = user.name() + ' podkręca atmosferę!\r\n';
      if(user.isStateAffected(7)) {text += user.name() + " jest RADOSNY!!\r\n"}
      else if(user.isStateAffected(6)) {text += user.name() + " czuje SZCZĘŚCIE!\r\n"}
      text += "Każdy zdobywa ENERGIĘ!\r\n"
      for(let actor of $gameParty.members()) {
        if(actor.name() === $gameActors.actor(3).name()) {continue;}
        var result = actor.result();
        if(result.mpDamage >= 0) {continue;}
        var absMp = Math.abs(result.mpDamage);
        text += `${actor.name()} odzyskuje ${absMp} SOKU...\r\n`
      }
      break;

    case 'SNOWBALL': // SNOWBALL
      text = user.name() + ' rzuca ŚNIEŻKĄ!\r\n';
      if(!target._noEffectMessage) {text += target.name() + " czuje SMUTEK.\r\n"}
      else {text += parseNoEffectEmotion($1,$2, target)}
      text += hpDamageText;
      break;

    case 'TICKLE': // TICKLE
      text = user.name() + ' łaskocze wroga!\r\n'
      text += `${target.name()} traci czujność!`
      break;

    case 'RICOCHET': // RICOCHET
     text = user.name() + ' robi odjazdowe triki z piłką!\r\n';
     text += hpDamageText;
     break;

    case 'CURVEBALL': // CURVEBALL
     text = user.name() + ' rzuca podkręconą...\r\n';
     text += target.name() + ' wytrąca się z równowagi.\r\n';
     switch($gameTemp._randomState) {
       case 6:
         if(!target._noEffectMessage) {text += target.name() + " czuje SZCZĘŚCIE!\r\n"}
         else {text += parseNoEffectEmotion($1,$2, target)}
         break;
      case 14:
        if(!target._noEffectMessage) {text += target.name() + " czuje ZŁOŚĆ!\r\n"}
        else {text += parseNoEffectEmotion($1,$2, target)}
        break;
      case 10:
        if(!target._noEffectMessage) {text += target.name() + " czuje SMUTEK.\r\n"}
        else {text += parseNoEffectEmotion($1,$2, target)}
        break;

     }
     text += hpDamageText;
     break;

    case 'MEGAPHONE': // MEGAPHONE
      if(target.index() <= unitLowestIndex) {text = user.name() + ' biega w kółko i wszystkich wkurza!\r\n';}
      if(target.isStateAffected(16)) {text += target.name() + ' jest WŚCIEKŁY!!!\r\n'}
      else if(target.isStateAffected(15)) {text += target.name() + ' jest WKURZONY!!\r\n'}
      else if(target.isStateAffected(14)) {text += target.name() + ' czuje ZŁOŚĆ!\r\n'}
      break;

    case 'DODGE ATTACK': // DODGE ATTACK
      text = user.name() + ' szykuje się na unik!';
      break;

    case 'DODGE ANNOY': // DODGE ANNOY
      text = user.name() + ' zaczyna dokuczać wrogom!';
      break;

    case 'DODGE TAUNT': // DODGE TAUNT
      text = user.name() + ' zaczyna drwić z wrogów!\r\n';
      text += "CELNOŚĆ wrogów spadła na turę!"
      break;

    case 'PASS OMORI':  // KEL PASS OMORI
      text = 'OMORI się zagapił i został pacnięty!\r\n';
      text += 'OMORI otrzymuje 1 obrażenie!';
      break;

    case 'PASS OMORI 2': //KEL PASS OMORI 2
      text = 'OMORI łapie piłkę KELA!\r\n';
      text += 'OMORI rzuca piłką\r\n';
      text += target.name() + '!\r\n';
      var OMORI = $gameActors.actor(1);
      if(OMORI.isStateAffected(6)) {text += "OMORI czuje SZCZĘŚCIE!\r\n"}
      else if(OMORI.isStateAffected(7)) {text += "OMORI jest RADOSNY!!\r\n"}
      text += hpDamageText;
      break;

    case 'PASS AUBREY':  // KEL PASS AUBREY
      text = 'AUBREY wykupuje piłkę z parku!\r\n';
      text += hpDamageText;
      break;

    case 'PASS HERO':  // KEL PASS HERO
      if(target.index() <= unitLowestIndex) {text = user.name() + ' ogrywa wrogów!\r\n';}
      text += hpDamageText;
      break;

    case 'PASS HERO 2':  // KEL PASS HERO
      if(target.index() <= unitLowestIndex) {
        text = user.name() + ' stylowo ogrywa wrogów!\r\n';
        text += "Wrogowie stali się słabsi!\r\n";
      }
      text += hpDamageText;
      break;

    //HERO//
    case 'MASSAGE':  // MASSAGE
      text = user.name() + ' robi masaż!\r\n';
      if(!!target.isAnyEmotionAffected(true)) {
        text += target.name() + ' się uspokaja...';
      }
      else {text += "Nie pomaga..."}
      break;

    case 'COOK':  // COOK
      text = user.name() + ' piecze ciastko!';
      break;

    case 'FAST FOOD': //FAST FOOD
      text = user.name() + ' przygotowuje szybkie danie.';
      break;

    case 'JUICE': // JUICE
      text = user.name() + ' przygotowuje przekąskę.';
      break;

    case 'SMILE':  // SMILE
      text = user.name() + ' się uśmiecha!\r\n';
      if(!target._noStateMessage) {text += target.name() + ' słabnie.';}
      else {text += parseNoStateChange(target.name(), "ATAK", "już bardziej spaść!\r\n")}
      break;

    case 'DAZZLE':
      text = user.name() + ' się uśmiecha!\r\n';
      if(!target._noStateMessage) {text += target.name() + ' słabnie.\r\n';}
      else {text += parseNoStateChange(target.name(), "ATAK", "już bardziej spaść!\r\n")}
      if(!target._noEffectMessage) {
        text += target.name() + ' czuje SZCZĘŚCIE!';
      }
      else {text += parseNoEffectEmotion($1,$2, target)}
      break;
    case 'TENDERIZE': // TENDERIZE
      text = user.name() + ' robi intensywny masaż!\r\n';
      if(!target._noStateMessage) {text += target.name() + ' opuszcza gardę!\r\n';}
      else {text += parseNoStateChange(target.name(), "OBRONA", "już bardziej spaść!\r\n")}
      text += hpDamageText;
      break;

    case 'SNACK TIME':  // SNACK TIME
      text = user.name() + ' piecze ciastka dla wszystkich!';
      break;

    case 'TEA TIME': // TEA TIME
      text = user.name() + ' wyciąga herbatkę.\r\n';
      text += target.name() + ' czuje się orzeźwiony!\r\n';
      if(result.hpDamage < 0) {
        var absHp = Math.abs(result.hpDamage);
        text += `${target.name()} odzyskuje ${absHp} SERC!\r\n`
      }
      if(result.mpDamage < 0) {
        var absMp = Math.abs(result.mpDamage);
        text += `${target.name()} odzyskuje ${absMp} SOKU...\r\n`
      }
      break;

    case 'SPICY FOOD': // SPICY FOOD
      text = user.name() + ' gotuje coś ostrego!\r\n';
      text += hpDamageText;
      break;

    case 'SINGLE TAUNT': // SINGLE TAUNT
      text = user.name() + ' przykuwa uwagę wroga.';
      break;

    case 'TAUNT':  // TAUNT
      text = user.name() + ' przykuwa uwagę wroga.';
      break;

    case 'SUPER TAUNT': // SUPER TAUNT
      text = user.name() + ' przykuwa uwagę wroga.\r\n';
      text += user.name() + ' przygotowuje się na odparcie ataku.';
      break;

    case 'ENCHANT':  // ENCHANT
      text = user.name() + ' uśmiechem przykuwa\r\n';
      text += 'uwagę wroga.\r\n';
      if(!target._noEffectMessage) {text += target.name() + " czuje SZCZĘŚCIE!";}
      else {text += parseNoEffectEmotion($1,$2, target)}
      break;

    case 'MENDING': //MENDING
      text = user.name() + ' się przymila.\r\n';
      text += user.name() + ' jest teraz osobistym kucharzem wroga!';
      break;

    case 'SHARE FOOD': //SHARE FOOD
      if(target.name() !== user.name()) {
        text = user.name() + ' dzieli się jedzeniem!'
      }
      break;

    case 'CALL OMORI':  // CALL OMORI
      text = user.name() + ' daje sygnał OMORIEMU!\r\n';
      if(!!$gameTemp._statsState[0]) {
        var absHp = Math.abs($gameTemp._statsState[0] - $gameActors.actor(1).hp);
        if(absHp > 0) {text += `OMORI odzyskuje ${absHp} SERC!\r\n`;}
      }
      if(!!$gameTemp._statsState[1]) {
        var absMp = Math.abs($gameTemp._statsState[1] - $gameActors.actor(1).mp);
        if(absMp > 0) {text += `OMORI odzyskuje ${absMp} SOKU...`;}
      }
      $gameTemp._statsState = undefined;
      break;

    case 'CALL KEL':  // CALL KEL
      text = user.name() + ' podkręca KELA!\r\n';
      if(!!$gameTemp._statsState[0]) {
        var absHp = Math.abs($gameTemp._statsState[0] - $gameActors.actor(3).hp);
        if(absHp > 0) {text += `KEL odzyskuje ${absHp} SERC!\r\n`;}
      }
      if(!!$gameTemp._statsState[1]) {
        var absMp = Math.abs($gameTemp._statsState[1] - $gameActors.actor(3).mp);
        if(absMp > 0) {text += `KEL odzyskuje ${absMp} SOKU...`;}
      }
      break;

    case 'CALL AUBREY':  // CALL AUBREY
      text = user.name() + ' zachęca AUBREY!\r\n';
      if(!!$gameTemp._statsState[0]) {
        var absHp = Math.abs($gameTemp._statsState[0] - $gameActors.actor(2).hp);
        if(absHp > 0) {text += `AUBREY odzyskuje ${absHp} SERC!\r\n`;}
      }
      if(!!$gameTemp._statsState[1]) {
        var absMp = Math.abs($gameTemp._statsState[1] - $gameActors.actor(2).mp);
        if(absMp > 0) {text += `AUBREY odzyskuje ${absMp} SOKU...`;}
      }
      break;

    //PLAYER//
    case 'CALM DOWN':  // PLAYER CALM DOWN
      if(item.id !== 1445) {text = user.name() + ' się uspokaja.\r\n';} // Process if Calm Down it's not broken;
      if(Math.abs(hpDam) > 0) {text += user.name() + ' odzyskuje ' + Math.abs(hpDam) + ' SERC!';}
      break;

    case 'FOCUS':  // PLAYER FOCUS
      text = user.name() + ' się skupia.';
      break;

    case 'PERSIST':  // PLAYER PERSIST
      text = user.name() + ' się upiera.';
      break;

    case 'OVERCOME':  // PLAYER OVERCOME
      text = user.name() + ' się przełamuje.';
      break;

  //UNIVERSAL//
    case 'FIRST AID':  // FIRST AID
      text = user.name() + ' się stara!\r\n';
      text += target.name() + ' odzyskuje ' + Math.abs(target._result.hpDamage) + ' SERC!';
      break;

    case 'PROTECT':  // PROTECT
      text = user.name() + ' wysuwa się naprzód!';
      break;

    case 'GAURD': // GAURD
      text = user.name() + ' przygotowuje się do odparcia ataku.';
      break;

  //FOREST BUNNY//
    case 'BUNNY ATTACK': // FOREST BUNNY ATTACK
      text = user.name() + ' skubie ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'BUNNY NOTHING': // BUNNY DO NOTHING
      text = user.name() + ' skacze dokoła!';
      break;

    case 'BE CUTE':  // BE CUTE
      text = user.name() + ' mruga na ' + target._altName() + '!\r\n';
      text += target.name() + ' słabnie...';
      break;

    case 'SAD EYES': //SAD EYES
      text = user.name() + ' wpatruje się smutnym wzrokiem na ' + target._altName() + '.\r\n';
      if(!target._noEffectMessage) {text += target.name() + ' czuje SMUTEK.';}
      else {text += parseNoEffectEmotion($1,$2, target)}
      break;

  //FOREST BUNNY?//
    case 'BUNNY ATTACK2': // BUNNY? ATTACK
      text = user.name() + ' skubie ' + target.name() + '?\r\n';
      text += hpDamageText;
      break;

    case 'BUNNY NOTHING2':  // BUNNY? DO NOTHING
      text = user.name() + ' skacze dokoła?';
      break;

    case 'BUNNY CUTE2':  // BE CUTE?
      text = user.name() + ' mruga na ' + target._altName() + '?\r\n';
      text += target.name() + ' słabnie?';
      break;

    case 'SAD EYES2': // SAD EYES?
      text = user.name() + ' wpatruje się smutnym wzrokiem na ' + target._altName() + '...\r\n';
      if(!target._noEffectMessage) {text += target.name() + ' czuje SMUTEK?';}
      else {text += parseNoEffectEmotion($1,$2, target)}
      break;

    //SPROUT MOLE//
    case 'SPROUT ATTACK':  // SPROUT MOLE ATTACK
      text = user.name() + ' uderza w ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SPROUT NOTHING':  // SPROUT NOTHING
      text = user.name() + ' się kręci.';
      break;

    case 'RUN AROUND':  // RUN AROUND
      text = user.name() + ' biega w kółko!';
      break;

    case 'HAPPY RUN AROUND': //HAPPY RUN AROUND
      text = user.name() + ' energicznie biega w kółko!';
       break;

    //MOON BUNNY//
    case 'MOON ATTACK':  // MOON BUNNY ATTACK
      text = user.name() + ' wpada na ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'MOON NOTHING':  // MOON BUNNY NOTHING
      text = user.name() + ' odlatuje myślami w kosmos.';
      break;

    case 'BUNNY BEAM':  // BUNNY BEAM
      text = user.name() + ' strzela laserem!\r\n';
      text += hpDamageText;
      break;

    //DUST BUNNY//
    case 'DUST NOTHING':  // DUST NOTHING
      text = user.name() + ' z całych sił próbuje\r\n';
      text += 'się nie rozlecieć.';
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
      text = user.name() + ' błyska dziwnym światłem!\r\n';
      text += target.name() + " czuje losową EMOCJĘ!"
      break;

    case 'ORANGE BEAM':  // ORANGE BEAM
      text = user.name() + ' świeci pomarańczowym laserem!\r\n';
      text += hpDamageText;
      break;

    //VENUS FLYTRAP//
    case 'FLYTRAP ATTACK':  // FLYTRAP ATTACK
      text = user.name() + ' uderza ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'FLYTRAP NOTHING':  // FLYTRAP NOTHING
      text = user.name() + ' ostrzy kły.';
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
      text = user.name() + ' się wierci...';
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
      text = user.name() + ' się rozplątuje.';
      break;

    case 'TANGLE':  // TANGLE
      text = target.name() + ' oplątuje się wokół wroga!\r\n';
      text += target.name() + ' słabnie...';
      break;

    //DIAL-UP//
    case 'DIAL ATTACK':  // DIAL ATTACK
      text = user.name() + ' przerywa.\r\n';
      var pronumn = target.name() === $gameActors.actor(2).name() ? "her" : "him";
      text += `${target.name()} rani się ze złości!\r\n`;
      text += hpDamageText;
      break;

    case 'DIAL NOTHING':  // DIAL NOTHING
      text = user.name() + ' szuka zasięgu...';
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
      text = user.name() + ' zapodaje niezły kawałek!';
      break;

    //SHARKPLANE//
    case 'SHARK ATTACK':  // SHARK PLANE
      text = user.name() + ' wpada na ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SHARK NOTHING':  // SHARK NOTHING
      text = user.name() + ' dłubie w zębach.';
      break;

    case 'OVERCLOCK ENGINE':  // OVERCLOCK ENGINE
      text = user.name() + ' odpala silnik!\r\n';
      if(!target._noStateMessage) {
        text += user.name() + ' przyspiesza!';
      }
      else {text += parseNoStateChange(user.name(), "SZYBKOŚĆ", "już bardziej wzrosnąć!")}
      break;

    case 'SHARK CRUNCH':  // SHARK
        text = user.name() + ' gryzie ' + target._altName() + '!\r\n';
        text += hpDamageText;
        break;

    //SNOW BUNNY//
    case 'SNOW BUNNY ATTACK':  // SNOW ATTACK
      text = user.name() + ' kopie śniegiem w ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SNOW NOTHING':  // SNOW NOTHING
      text = user.name() + ' bierze to na chłodno.';
      break;

    case 'SMALL SNOWSTORM':  // SMALL SNOWSTORM
      text = user.name() + ' zrzuca śnieg na wszystkich,\r\n';
      text += 'powodując najmniejszą na świecie śnieżycę!';
      break;

    //SNOW ANGEL//
    case 'SNOW ANGEL ATTACK': //SNOW ANGEL ATTACK
      text = user.name() + ' dotyka ' + target._altName() + '\r\n';
      text += 'swoimi zimnymi dłońmi.\r\n';
      text += hpDamageText;
      break;

    case 'UPLIFTING HYMN': //UPLIFTING HYMN
      if(target.index() <= unitLowestIndex) {
        text = user.name() + ' śpiewa piękną pieśń...\r\n';
        text += 'Wszyscy czują SZCZĘŚCIE!';
      }
      target._noEffectMessage = undefined;
      break;

    case 'PIERCE HEART': //PIERCE HEART
      text = user.name() + ' przeszywa SERCE ' + target._altName() + '.\r\n';
      text += hpDamageText;
      break;

    //SNOW PILE//
    case 'SNOW PILE ATTACK': //SNOW PILE ATTACK
      text = user.name() + ' rzuca śniegiem w ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SNOW PILE NOTHING': //SNOW PILE NOTHING
      text = user.name() + ' czuje, że ją mrozi.';
      break;

    case 'SNOW PILE ENGULF': //SNOW PILE ENGULF
      text = user.name() + ' zatapia w śniegu' + target._altName() + '!\r\n';
      text += user.name() + ' zwalnia.\r\n';
      text += user.name() + ' opuszcza gardę.';
      break;

    case 'SNOW PILE MORE SNOW': //SNOW PILE MORE SNOW
      text = user.name() + ' tarza się w śniegu!\r\n';
      text += user.name() + ' wzmacnia się!\r\n';
      text += user.name() + ' podnosi gardę!';
      break;

    //CUPCAKE BUNNY//
    case 'CCB ATTACK': //CUP CAKE BUNNY ATTACK
      text = user.name() + ' wpada na' + target._altName() + '.\r\n';
      text += hpDamageText;
      break;

    case 'CCB NOTHING': //CUP CAKE BUNNY NOTHING
      text = user.name() + ' skacze w miejscu.';
      break;

    case 'CCB SPRINKLES': //CUP CAKE BUNNY SPRINKLES
      text = user.name() + ' obsypuje posypką ' + target._altName() + '.\r\n';
      if(!target._noEffectMessage) {text += target.name() + ' czuje SZCZĘŚCIE!\r\n';}
      else {text += parseNoEffectEmotion($1,$2, target)}
      text += "Statystyki " + target._altName() + " wzrosły!"
      break;

    //MILKSHAKE BUNNY//
    case 'MSB ATTACK': //MILKSHAKE BUNNY ATTACK
      text = user.name() + ' wylewa mleczny koktajl na ' + target._altName() + '.\r\n';
      text += hpDamageText;
      break;

    case 'MSB NOTHING': //MILKSHAKE BUNNY NOTHING
      text = user.name() + ' kręci się w kółko.';
      break;

    case 'MSB SHAKE': //MILKSHAKE BUNNY SHAKE
      text = user.name() + ' zaczyna trząść się jak szalony!\r\n';
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
      text = user.name() + ' wbija kły w ' + target._altName() + '.\r\n';
      text += hpDamageText;
      break;

    case 'SSS NOTHING': //STRAWBERRY SHORT SNAKE NOTHING
      text = user.name() + ' syczy.';
      break;

    case 'SSS SLITHER': //STRAWBERRY SHORT SNAKE SLITHER
      text = user.name() + ' szczęśliwie pełza!\r\n';
      if(!user._noEffectMessage) {text += user.name() + ' czuje SZCZĘŚCIE!';}
      else {text += parseNoEffectEmotion($1,$2, target)}
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
      text = user.name() + ' wbija się w ' + target._altName() + '!\r\n';
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
      text = user.name() + ' dostaje wypieków.';
      break;

    //TOASTY//
    case 'TOASTY ATTACK': //TOASTY ATTACK
      text = user.name() + ' wpada w ' + target._altName() + '.\r\n';
      text += hpDamageText;
      break;

    case 'TOASTY NOTHING': //TOASTY NOTHING
      text = user.name() + ' dłubie w nosie.';
      break;

    case 'TOASTY RILE': //TOASTY RILE
      if(target.index() <= unitLowestIndex) {
        text = user.name() + ' wygłasza kontrowersyjną przemowę!\r\n';
        text += 'Wszyscy czują ZŁOŚĆ!';
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
      text = 'O nie! ' + user.name() + ' mówi brzydkie słowo!\r\n';
      text += hpDamageText;
      break;

    //SESAME//
    case 'SESAME ATTACK': //SESAME ATTACK
      text = user.name() + ' rzuca ziarnem w ' + target._altName() + '.\r\n';
      text += hpDamageText;
      break;

    case 'SESAME NOTHING': //SESAME Nothing
      text = user.name() + ' drapie się po głowie.';
      break;

    case 'SESAME ROLL': //SESAME BREAD ROLL
      if(target.index() <= unitLowestIndex) {
        text = user.name() + ' tarza się po wszystkich!\r\n';
      }
      text += hpDamageText;
      break;

    //CREEPY PASTA//
    case 'CREEPY ATTACK': //CREEPY ATTACK
      text = user.name() + ' sprawia, że ' + target.name() + ' czuje się\r\n';
      text += 'niekomfortowo.\r\n';
      text += hpDamageText;
      break;

    case 'CREEPY NOTHING': //CREEPY NOTHING
      text = user.name() + ' groźnie... nie robi nic!';
      break;

    case 'CREEPY SCARE': //CREEPY SCARE
      text = user.name() + ' pokazuje wszystkim ich\r\n';
      text += 'najgorsze koszmary!';
      break;

    //COPY PASTA//
    case 'COPY ATTACK': //COPY ATTACK
      text = user.name() + ' uderza ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'DUPLICATE': //DUPLICATE
      text = user.name() + ' się kopiuje! ';
      break;

    //HUSH PUPPY//
    case 'HUSH ATTACK': //HUSH ATTACK
      text = user.name() + ' uderza w ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'HUSH NOTHING': //HUSH NOTHING
      text = user.name() + ' próbuje szczekać...\r\n';
      text += 'Ale nie wydał z siebie żadnego dźwięku...';
      break;

    case 'MUFFLED SCREAMS': //MUFFLED SCREAMS
      text = user.name() + ' zaczyna kukuryczeć!\r\n';
      if(!target._noEffectMessage && target.name() !== "OMORI") {
        text += target.name() + ' jest PRZERAŻONY.';
      }
      else {text += parseNoEffectEmotion($1,$2, target)}
      break;

    //GINGER DEAD MAN//
    case 'GINGER DEAD ATTACK': //GINGER DEAD MAN ATTACK
      text = user.name() + ' dźga ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'GINGER DEAD NOTHING': //GINGER DEAD MAN DO NOTHING
      text = user.name() + ' traci głowę...\r\n';
      text += user.name() + ' odkłada ją na swoje miejsce.';
      break;

    case 'GINGER DEAD THROW HEAD': //GINGER DEAD MAN THROW HEAD
      text = user.name() + ' rzuca swoją głową w\r\n';
      text +=  target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    //LIVING BREAD//
    case 'LIVING BREAD ATTACK': //LIVING BREAD ATTACK
      text = user.name() + ' rąbie w ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'LIVING BREAD NOTHING': //LIVING BREAD ATTACK
      text = user.name() + ' powoli zbliża się do\r\n';
      text += target._altName() + '!';
      break;

    case 'LIVING BREAD BITE': //LIVING BREAD BITE
      text = user.name() + ' gryzie ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'LIVING BREAD BAD SMELL': //LIVING BREAD BAD SMELL
      text = user.name() + ' śmierdzi!\r\n';
      text += target.name() + ' opuszcza gardę!';
      break;

    //Bug Bunny//
    case 'BUG BUN ATTACK': //Bug Bun Attack
     text = user.name() + ' uderza ' + target._altName() + '!\r\n';
     text += hpDamageText;
     break;

    case 'BUG BUN NOTHING': //Bug Bun Nothing
      text = user.name() + ' próbuje balansować na głowie. ';
      break;

    case 'SUDDEN JUMP': //SUDDEN JUMP
      text = user.name() + ' nagle rzuca się na ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SCUTTLE': //Bug Bun Scuttle
      text = user.name() + ' szczęśliwie skacze dokoła.\r\n';
      text += 'Jest przesłodki!\r\n';
      if(!user._noEffectMessage) {text += user.name() + ' czuje SZCZĘŚCIE!';}
      else {text += parseNoEffectEmotion($1,$2, target)}
      break;

    //RARE BEAR//
    case 'BEAR ATTACK': //BEAR ATTACK
      text = user.name() + ' rzuca się na ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'BEAR HUG': //BEAR HUG
      text = user.name() + ' przytula ' + target._altName() + '!\r\n';
      text += target.name() + ' zwalnia!\r\n';
      text += hpDamageText;
      break;

    case 'ROAR': //ROAR
      text = user.name() + ' głośno ryczy!\r\n';
      if(!user._noEffectMessage) {text += user.name() + ' czuje ZŁOŚĆ!';}
      else {text += parseNoEffectEmotion($1,$2, target)}
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
      text = target.name() + ' przewraca się o swoje korzenie.\r\n';
      text += hpDamageText + '.\r\n';
      text += target.name() + ' zwalnia.';
      break;

    case 'PALM EXPLOSION': //PALM EXPLOSION
      text = user.name() + ' wybucha!';
      break;

    //SPIDER CAT//
    case  'SPIDER ATTACK': //SPIDER ATTACK
      text = user.name() + ' gryzie ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SPIDER NOTHING': //SPIDER NOTHING
      text = user.name() + ' wykrztusza kulkę z pajęczyny.';
      break;

    case 'SPIN WEB': //SPIN WEB
       text = user.name() + ' strzela pajęczyną w ' + target._altName() + '!\r\n';
       text += target.name() + ' zwalnia.';
       break;

    //SPROUT MOLE?//
    case 'SPROUT ATTACK 2':  // SPROUT MOLE? ATTACK
      text = user.name() + ' strzela ' + target._altName() + ' z liścia?\r\n';
      text += hpDamageText;
      break;

    case 'SPROUT NOTHING 2':  // SPROUT MOLE? NOTHING
      text = user.name() + ' się kręci?';
      break;

    case 'SPROUT RUN AROUND 2':  // SPROUT MOLE? RUN AROUND
      text = user.name() + ' biega w kółko?';
      break;

    //HAROLD//
    case 'HAROLD ATTACK': //HAROLD ATTACK
      text = user.name() + ' wywija mieczem na ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'HAROLD NOTHING': // HAROLD NOTHING
      text = user.name() + ' poprawia hełm.';
      break;

    case 'HAROLD PROTECT': // HAROLD PROTECT
      text = user.name() + ' się broni.';
      break;

    case 'HAROLD WINK': //HAROLD WINK
      text = user.name() + ' puszcza oczko do ' + target._altName() + '.\r\n';
      if(!target._noEffectMessage) {text += target.name() + ' czuje SZCZĘŚCIE!';}
      else {text += parseNoEffectEmotion($1,$2, target)}
      break;

    //MARSHA//
    case 'MARSHA ATTACK': //MARSHA ATTACK
      text = user.name() + ' wywija toporem na ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'MARSHA NOTHING': //MARSHA NOTHING
      text = user.name() + ' się wywraca. ';
      break;

    case 'MARSHA SPIN': //MARSHA NOTHING
      text = user.name() + ' zaczyna kręcić się z prędkością światła!\r\n';
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
      text = user.name() + ' wypuszcza strzałę.';
      break;

    case 'THERESE SNIPE': //THERESE SNIPE
      text = user.name() + ' strzela w słaby punkt ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'THERESE INSULT': //THERESE INSULT
      text = user.name() + ' nazywa ' + target._altName() + ' eciem-peciem!\r\n';
      if(!target._noEffectMessage) {text += target.name() + ' czuje ZŁOŚĆ!\r\n';}
      else {text += parseNoEffectEmotion($1,$2, target)}
      text += hpDamageText;
      break;

    case 'DOUBLE SHOT': //THERESE DOUBLE SHOT
      text = user.name() + ' wystrzeliwuje dwie strzały na raz!';
      break;

    //LUSCIOUS//
    case 'LUSCIOUS ATTACK': //LUSCIOUS ATTACK
      text = user.name() + ' próbuje rzucić zaklęcie...\r\n';
      text += user.name() + ' zrobił coś magicznego!\r\n';
      text += hpDamageText;
      break;

    case 'LUSCIOUS NOTHING': //LUSCIOUS NOTHING
      text = user.name() + ' próbuje rzucić zaklęcie...\r\n';
      text += 'Ale nic się nie zadziało...';
      break;

    case 'FIRE MAGIC': //FIRE MAGIC
      text = user.name() + ' próbuje rzucić zaklęcie...\r\n';
      text += user.name() + ' cała drużyna staje w ogniu!\r\n';
      text += hpDamageText;
      break;

    case 'MISFIRE MAGIC': //MISFIRE MAGIC
      text = user.name() + ' próbuje rzucić zaklęcie...\r\n';
      text += user.name() + ' wszystko się pali!!!\r\n';
      text += hpDamageText;
      break;

    //HORSE HEAD//
    case 'HORSE HEAD ATTACK': //HORSE HEAD ATTACK
      text = user.name() + ' gryzie rękę ' + target._altName() + '.\r\n';
      text += hpDamageText;
      break;

    case 'HORSE HEAD NOTHING': //HORSE HEAD NOTHING
      text = user.name() + ' beka.';
      break;

    case 'HORSE HEAD LICK': //HORSE HEAD LICK
     text = user.name() + ' liże włosy ' + target._altName() + '.\r\n';
     text += hpDamageText + '\r\n';
     if(!target._noEffectMessage) {text += target.name() + ' czuje ZŁOŚĆ!';}
     else {text += parseNoEffectEmotion($1,$2, target)}
     break;

    case 'HORSE HEAD WHINNY': //HORSE HEAD WHINNY
      text = user.name() + ' parska szczęśliwie!';
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
      text = user.name() + ' wpływa na ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'FISH BUNNY NOTHING': //FISH BUNNY NOTHING
      text = user.name() + ' pływa w kółko. ';
      break;

    case 'SCHOOLING': //SCHOOLING
      text = user.name() + ' przywołuje przyjaciół! ';
      break;

    //MAFIA ALLIGATOR//
    case 'MAFIA ATTACK': //MAFIA ATTACK
      text = user.name() + ' zadaje cios karate w ' + target._altName() + '!\r\n';
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
     text = user.name() + ' ciśnie i czuje się mistrzem!\r\n';
     text += user.name() + " jest celniejszy!\r\n"
     break;

    case 'MUSSEL HIDE': //MUSSEL HIDE
     text = user.name() + ' chowa się w swojej muszli.';
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
      text = 'Każdy ucieka od ASYRENA,\r\n';
      text += 'ale jednocześnie biegnie w jego stronę...\r\n';
      text += hpDamageText;
      break;

    //SHARK FIN//
    case 'SHARK FIN ATTACK': //SHARK FIN ATTACK
      text = user.name() + ' atakuje ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SHARK FIN NOTHING': //SHARK FIN NOTHING
      text = user.name() + ' pływa w kółko.';
      break;

    case 'SHARK FIN BITE': //SHARK FIN BITE
      text = user.name() + ' gryzie ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SHARK WORK UP': //SHARK FIN WORK UP
      text = user.name() + ' pracuje nad sobą!\r\n';
      text += user.name() + ' przyspiesza!\r\n';
      if(!user._noEffectMessage) {
        text += user.name() + ' czuje złość!';
      }
      else {text += parseNoEffectEmotion($1,$2, target)}
      break;

    //ANGLER FISH//
    case 'ANGLER ATTACK': //ANGLER FISH ATTACK
      text = user.name() + ' gryzie ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'ANGLER NOTHING': //ANGLER FISH NOTHING
      text = user.name() + ' słyszy burczenie swojego brzucha.';
      break;

    case 'ANGLER LIGHT OFF': //ANGLER FISH LIGHT OFF
      text = user.name() + ' zgasza swoje światło.\r\n';
      text += user.name() + ' zatapia się w ciemnościach.';
      break;

    case 'ANGLER BRIGHT LIGHT': //ANGLER FISH BRIGHT LIGHT
      text = 'Każdy widzi, jak jego życie\r\n';
      text += 'miga mu przed oczami!';
      break;

    case 'ANGLER CRUNCH': //ANGLER FISH CRUNCH
      text = user.name() + ' wbija swoje zęby w ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    //SLIME BUNNY//
    case 'SLIME BUN ATTACK': //SLIME BUNNY ATTACK
      text = user.name() + ' tuli się do ' + target._altName() +'.\r\n';
      text += hpDamageText;
      break;

    case 'SLIME BUN NOTHING': //SLIME BUN NOTHING
      text = user.name() + ' uśmiecha się do wszystkich.\r\n';
      break;

    case 'SLIME BUN STICKY': //SLIME BUN STICKY
      text = user.name() + ' czuje się samotny i płacze.\r\n';
      if(!target._noStateMessage) {text += target.name() + ' zwalnia!\r\n';}
      else {text += parseNoStateChange(target.name(), "SZYBKOŚĆ", "już bardziej spaść!\r\n")}
      text += target.name() + " czuje SMUTEK.";
      break;

    //WATERMELON MIMIC//
    case 'WATERMELON RUBBER BAND': //WATERMELON MIMIC RUBBER BAND
      text = user.name() + ' ciska RECEPTURKĄ!\r\n';
      text += hpDamageText;
      break;

    case 'WATERMELON JACKS': //WATERMELON MIMIC JACKS
      text = user.name() + ' rozrzuca wszędzie CIUPY!\r\n';
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
      text = user.name() + ' rzuca WINOGRONADĄ!\r\n';
      text += hpDamageText;
      break;

    case 'WATEMELON FRENCH FRIES': //WATERMELON MIMIC FRENCH FRIES
      text = user.name() + ' rzuca FRYTKAMI!\r\n';
      text += hpDamageText;
      break;

    case 'WATERMELON CONFETTI': //WATERMELON MIMIC CONFETTI
      if(target.index() <= unitLowestIndex) {
        text = user.name() + ' otwiera KONFETTI!\r\n';
        text += "Wszyscy czują SZCZĘŚCIE!"
      }
      target._noEffectMessage = undefined;
      break;

    case 'WATERMELON RAIN CLOUD': //WATERMELON MIMIC RAIN CLOUD
      if(target.index() <= unitLowestIndex) {
        text = user.name() + ' wzywa CHMURĘ DESZCZOWĄ!\r\n';
        text += "Wszyscy czują SMUTEK."
      }
      target._noEffectMessage = undefined;
      break;

    case 'WATERMELON AIR HORN': //WATERMELON MIMIC AIR HORN
      if(target.index() <= unitLowestIndex) {
        text = user.name() + ' używa GIGANTYCZNEJ TRĄBKI!\r\n';
        text += "Wszyscy czują ZŁOŚĆ!"
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
      text = user.name() + ' tworzy kałaobronę.\r\n';
      text += target.name() + ' podnosi gardę.';
      break;

    case  'SQUID MAGIC': //SQUID MAGIC
      text = user.name() +  ' rzuca zaklęcie kałamagiczne!\r\n';
      text += 'Wszyscy czują się dziwnie...';
      break;

    //WORM-BOT//
    case 'BOT ATTACK': //MECHA WORM ATTACK
      text = user.name() + ' uderza w ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'BOT NOTHING': //MECHA WORM NOTHING
      text = user.name() + ' głośno brzęczy!';
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
      text = user.name() + ' powiększa swojego gluta!\r\n';
      text += target.name() + ' wzmacnia się!';
      break;

    case 'SNOT POP': //SNOT POP
      text = user.name() + ' wybucha!\r\n';
      text += 'Wszystko jest w glutach!!\r\n';
      text += hpDamageText;
      break;

    //LAB RAT//
    case  'LAB ATTACK': //LAB RAT ATTACK
      text = user.name() + ' strzela małym laserem z myszki!\r\n';
      text += hpDamageText;
      break;

    case  'LAB NOTHING': //LAB RAT NOTHING
      text = user.name() + ' wypuszcza trochę gazu.';
      break;

    case  'LAB HAPPY GAS': //LAB RAT HAPPY GAS
      text = user.name() + ' uwalnia SZCZĘŚLIWY gaz!\r\n';
      text += 'Wszyscy czują SZCZĘŚCIE!';
      target._noEffectMessage = undefined;
      break;

    case  'LAB SCURRY': //LAB RAT SCURRY
      text = user.name() + ' tupocze!\r\n';
      break;

    //MECHA MOLE//
    case 'MECHA MOLE ATTACK': //MECHA MOLE ATTACK
      text = user.name() + ' strzela laserem w ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'MECHA MOLE NOTHING': //MECHA MOLE NOTHING
      text = 'Oko KIEŁKUNA?? delikatnie błyszczy.';
      break;

    case 'MECHA MOLE EXPLODE': //MECHA MOLE EXPLODE
      text = user.name() + ' roni łzę.\r\n';
      text += user.name() + ' majestatycznie wybucha!';
      break;

    case 'MECHA MOLE STRANGE LASER': //MECHA MOLE STRANGE LASER
      text = 'Oko KIEŁKUNA?? emituje dziwne\r\n';
      text += 'światło. ' + target.name() + ' czuje się dziwnie.';
      break;

    case 'MECHA MOLE JET PACK': //MECHA MOLE JET PACK
      text = 'Nad KIEŁKUNEM?? pojawił się odrzutowy plecak!\r\n';
      text += user.name() + ' przeleciał nad wszystkimi!';
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
      text = user.name() + ' robi małe salto!';
      break;

    case 'SALLI SPEED UP': //SALLI SPEED UP
      text = user.name() + ' zaczyna pędzić!\r\n';
      if(!target._noStateMessage) {
        text += user.name() + ' przyspiesza!';
      }
      else {text += parseNoStateChange(user.name(), "SZYBKOŚĆ", "już bardziej wzrosnąć!")}
      break;

    case 'SALLI DODGE ANNOY': //SALLI STARE
      text = user.name() + ' zaczyna się intensywnie skupiać! ';
      break;

    //CINDI//
    case 'CINDI ATTACK': //CINDI ATTACK
      text = user.name() + ' uderza ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'CINDI NOTHING': //CINDI NOTHING
      text = user.name() + ' kręci się w kółko.';
      break;

    case 'CINDI SLAM': //CINDI SLAM
      text = user.name() + ' uderza ręką w ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'CINDI COUNTER ATTACK': //CINDI COUNTER ATTACK
      text = user.name() + ' się przygotowuje!';
      break;

    //DOROTHI//
    case 'DOROTHI ATTACK': //DOROTHI ATTACK
      text = user.name() + ' nadeptuje na ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'DOROTHI NOTHING': //DOROTHI NOTHING
      text = user.name() + ' płacze w ciemności.';
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
      text = user.name() + ' kiwa się w przód i w tył.';
      break;

    case 'NANCI ANGRY': //NANCI ANGRY
      text = user.name() + ' zaczyna się gotować!';
      break;

    //MERCI//
    case 'MERCI ATTACK': //MERCI ATTACK
      text = user.name() + ' dotyka klatki ' + target._altName() + '.\r\n';
      text += target.name() + ' czuje, jak jego wnętrzności są rozrywane!\r\n';
      text += hpDamageText;
      break;

    case 'MERCI NOTHING': //MERCI NOTHING
      text = user.name() + ' dziwnie się uśmiecha.';
      break;

    case 'MERCI MELODY': //MERCI LAUGH
      text = user.name() + ' śpiewa.\r\n';
      text += target.name() + ' słyszy znajomą melodię.\r\n';
      if(target.isStateAffected(6)) {text += target.name() + " czuje SZCZĘŚCIE!\r\n"}
      else if(target.isStateAffected(7)) {text += target.name() + " jest RADOSNY!!\r\n"}
      else if(target.isStateAffected(8)) {text += target.name() + " jest w EUFORII!!!\r\n"}
      break;

    case 'MERCI SCREAM': //MERCI SCREAM
      text = user.name() + ' wydaje przerażający wrzask!\r\n';
      text += hpDamageText;
      break;


    //LILI//
    case 'LILI ATTACK': //LILI ATTACK
      text = user.name() + ' wpatruje się w duszę ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'LILI NOTHING': //LILI NOTHING
      text = user.name() + ' mruga.';
      break;

    case 'LILI MULTIPLY': //LILI MULTIPLY
      text = user.name() + ' traci oko!\r\n';
      text += 'Powstała z niego druga ' + user.name() + '!';
      break;

    case 'LILI CRY': //LILI CRY
      text = 'Łzy napływają do oczu ' + user.name() + '.\r\n';
      text += target.name() + " czuje SMUTEK."
      break;

    case 'LILI SAD EYES': //LILI SAD EYES
      text = target.name() + ' dostrzega smutek w oczach ' + user.name() + '.\r\n';
      text += target.name() + ' nie chce zaatakować ' + user.name(); + '.\r\n'
      break;

    //HOUSEFLY//
    case 'HOUSEFLY ATTACK': //HOUSEFLY ATTACK
      text = user.name() + ' ląduje na twarzy ' + target._altName() + '.\r\n';
      text += target.name() + ' uderza się w twarz!\r\n';
      text += hpDamageText;
      break;

    case 'HOUSEFLY NOTHING': //HOUSEFLY NOTHING
      text = user.name() + ' szybko brzęczy wokoło!';
      break;

    case 'HOUSEFLY ANNOY': //HOUSEFLY ANNOY
      text = user.name() + ' brzęczy nad uchem ' + target._altName() + '!\r\n';
      if(!target._noEffectMessage) {text += target.name() + ' czuje ZŁOŚĆ!';}
      else {text += parseNoEffectEmotion($1,$2, target)}
      break;

    //RECYCLIST//
    case 'FLING TRASH': //FLING TRASH
      text = user.name() + ' ciska ŚMIEĆMI w ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'GATHER TRASH': //GATHER TRASH
      text = user.name() + ' znajduje na ziemi ŚMIECI\r\n';
      text += 'i wciska je do swojej torby!\r\n';
      text += hpDamageText;
      break;

    case 'RECYCLIST CALL FOR FRIENDS': //RECYCLIST CALL FOR FRIENDS
      text = user.name() + ' przywołuje RECYKULTYSTÓW!!';
      break;

    //STRAY DOG//
    case 'STRAY DOG ATTACK': //STRAY DOG ATTACK
      text = user.name() + ' gryzie!\r\n';
      text += hpDamageText;
      break;

    case 'STRAY DOG HOWL': //STRAY DOG HOWL
      text = user.name() + ' wydaje przeszywający wyk!';
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
      text = user.name() + ' gryzie ' + target._altName() + '.\r\n';
      text += hpDamageText;
      break;

    case 'BEE NOTHING': //BEE NOTHING
      text = user.name() + ' lata w kółko!';
      break;

    // GHOST BUNNY //
    case 'GHOST BUNNY ATTACK': //GHOST BUNNY ATTACK
      text = user.name() + ' przechodzi przez ' + target._altName() + '!\r\n';
      text += target.name() + ' czuje zmęczenie.\r\n';
      text += mpDamageText;
      break;

    case 'GHOST BUNNY NOTHING': //GHOST BUNNY DO NOTHING
      text = user.name() + ' unosi się w miejscu.';
      break;

    //TOAST GHOST//
    case 'TOAST GHOST ATTACK': //TOAST GHOST ATTACK
      text = user.name() + ' przechodzi przez ' + target._altName() + '!\r\n';
      text += target.name() + ' czuje zmęczenie.\r\n';
      text += hpDamageText;
      break;

    case 'TOAST GHOST NOTHING': //TOAST GHOST NOTHING
      text = user.name() + ' wydaje straszny dźwięk.';
      break;

    //SPROUT BUNNY//
    case 'SPROUT BUNNY ATTACK': //SPROUT BUNNY ATTACK
      text = user.name() + ' strzela z liścia ' + target._altName() + '.\r\n';
      text += hpDamageText;
      break;

    case 'SPROUT BUNNY NOTHING': //SPROUT BUNNY NOTHING
      text = user.name() + ' żuje trawę.';
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
      text = user.name() + ' się przewraca.';
      break;

    //CILANTRO//
    case 'CILANTRO ATTACK': //CILANTRO ATTACK
      text = user.name() + ' wali ' + target._altName() + '.\r\n';
      text += hpDamageText;
      break;

    case 'CILANTRO NOTHING': //CILANTRO DO NOTHING
      text = user.name() + ' zastanawia się nad sensem życia.';
      break;

    case 'GARNISH': //CILANTRO GARNISH
      text = user.name() + ' poświęca się dla\r\n';
      text += 'dobra ' + target._altName() + '.';
      break;

    //GINGER//
    case 'GINGER ATTACK': //GINGER ATTACK
      text = user.name() + ' łamie się i atakuje ' + target._altName() + '.\r\n';
      text += hpDamageText;
      break;

    case 'GINGER NOTHING': //GINGER NOTHING
      text = user.name() + ' znajduje wewnętrzny spokój.';
      break;

    case 'GINGER SOOTHE': //GINGER SOOTHE
      text = user.name() + ' uspokaja ' + target._altName() + '.\r\n';
      break;

    //YE OLD MOLE//
    case 'YE OLD ROLL OVER': //MEGA SPROUT MOLE ROLL OVER
      text = user.name() + ' toczy się po wszystkich!';
      text += hpDamageText;
      break;

    //KITE KID//
    case 'KITE KID ATTACK':  // KITE KID ATTACK
      text = user.name() + ' rzuca CIUPY w ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'KITE KID BRAG':  // KITE KID BRAG
      text = user.name() + ' narzeka na LATAWIEC!\r\n';
      if(!target._noEffectMessage) {
        text += target.name() + ' czuje SZCZĘŚCIE!';
      }
      else {text += parseNoEffectEmotion($1,$2, target)}
      break;

    case 'REPAIR':  // REPAIR
      text = user.name() + ' skleja taśmą LATAWIEC!\r\n';
      text += 'LATAWIEC czuje się jak nowo narodzony!';
      break;

    //KID'S KITE//
    case 'KIDS KITE ATTACK': // KIDS KITE ATTACK
      text = user.name() + ' wlatuje w ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'KITE NOTHING': // KITE NOTHING
      text = user.name() + ' pręży się jak paw!';
      break;

    case 'FLY 1':  // FLY 1
      text = user.name() + ' leci wysoko!';
      break;

    case 'FLY 2':  // FLY 2
      text = user.name() + ' spada w dół!!';
      break;

    //PLUTO//
    case 'PLUTO NOTHING':  // PLUTO NOTHING
      text = user.name() + ' przybiera pozę!\r\n';
      break;

    case 'PLUTO HEADBUTT':  // PLUTO HEADBUTT
      text = user.name() + ' rozpędza się i roztrzaskuje ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'PLUTO BRAG':  // PLUTO BRAG
      text = user.name() + ' przechwala się swoimi muskułami!\r\n';
      if(!user._noEffectMessage) {
        text += user.name() + ' czuje SZCZĘŚCIE!';
      }
      else {text += parseNoEffectEmotion($1,$2, target)}
      break;

    case 'PLUTO EXPAND':  // PLUTO EXPAND
      text = user.name() + ' się pręży!!\r\n';
      if(!target._noStateMessage) {
        text += user.name() + ' wzmacnia się i podnosi gardę!!\r\n';
        text += user.name() + ' zwalnia.';
      }
      else {
        text += parseNoStateChange(user.name(), "ATAK", "już bardziej wzrosnąć!\r\n")
        text += parseNoStateChange(user.name(), "OBRONA", "już bardziej wzrosnąć!\r\n")
        text += parseNoStateChange(user.name(), "SZYBKOŚĆ", "już bardziej spaść!")
      }
      break;

    case 'EXPAND NOTHING':  // PLUTO NOTHING
      text = user.name() + 'onieśmiela cię\r\n';
      text += 'swoimi mięśniami.';
      break;

    //RIGHT ARM//
    case 'R ARM ATTACK':  // R ARM ATTACK
      text = user.name() + ' uderza ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'GRAB':  // GRAB
      text = user.name() + ' łapie ' + target._altName() + '!\r\n';
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
      if(!target._noEffectMessage) {
        text += target.name() + ' czuje ZŁOŚĆ!\r\n';
      }
      else {text += parseNoEffectEmotion($1,$2, target)}
      text += hpDamageText;
      break;

    //DOWNLOAD WINDOW//
    case 'DL DO NOTHING':  // DL DO NOTHING
      text = user.name() + ' zatrzymało się na 99%.';
      break;

    case 'DL DO NOTHING 2':  // DL DO NOTHING 2
      text = user.name() + ' wciąż stoi na 99%...';
      break;

    case 'DOWNLOAD ATTACK':  // DOWNLOAD ATTACK
      text = user.name() + ' zawiesza się i staje w ogniu!';
      break;

    //SPACE EX-BOYFRIEND//
    case 'SXBF ATTACK':  // SXBF ATTACK
      text = user.name() + ' kopie ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SXBF NOTHING':  // SXBF NOTHING
      text = user.name() + ' patrzy z tęsknotą\r\n';
      text += 'w dal.';
      break;

    case 'ANGRY SONG':  // ANGRY SONG
      text = user.name() + ' intensywnie beczy!';
      break;

    case 'ANGSTY SONG':  // ANGSTY SONG
      text = user.name() + ' śpiewa smutną piosenkę...\r\n';
      if(target.isStateAffected(10)) {text += target.name() + ' czuje SMUTEK.';}
      else if(target.isStateAffected(11)) {text += target.name() + ' jest ZAŁAMANY..';}
      else if(target.isStateAffected(12)) {text += target.name() + ' jest PRZYBITY...';}
      break;

    case 'BIG LASER':  // BIG LASER
      text = user.name() + ' strzela z lasera!\r\n';
      text += hpDamageText;
      break;

    case 'BULLET HELL':  // BULLET HELL
      text = user.name() + ' w desperacji\r\n';
      text += 'wystrzela swój laser!';
      break;

    case 'SXBF DESPERATE':  // SXBF NOTHING
      text = user.name() + '\r\n';
      text += 'zgrzyta zębami!';
      break;

    //THE EARTH//
    case 'EARTH ATTACK':  // EARTH ATTACK
      text = user.name() + ' atakuje ' + target._altName() + '!\r\n';
      text += hpDamageText
      break;

    case 'EARTH NOTHING':  // EARTH NOTHING
      text = user.name() + ' obraca się powoli.';
      break;

    case 'EARTH CRUEL':  // EARTH CRUEL
      text = user.name() + ' jest okrutna dla ' + target._altName() + '!\r\n';
      if(target.isStateAffected(10)) {text += target.name() + ' czuje SMUTEK.';}
      else if(target.isStateAffected(11)) {text += target.name() + ' jest ZAŁAMANY..';}
      else if(target.isStateAffected(12)) {text += target.name() + ' jest PRZYBITY...';}
      break;

    case 'CRUEL EPILOGUE':  // EARTH CRUEL
      if(target.index() <= unitLowestIndex) {
        text = user.name() + " jest okrutna dla wszystkich...\r\n";
        text += "Wszyscy czują SMUTEK."
      }
      break;

    case 'PROTECT THE EARTH':  // PROTECT THE EARTH
      text = user.name() + ' używa swojego najsilniejszego ataku!';
      break;

    //SPACE BOYFRIEND//
    case 'SBF ATTACK': //SPACE BOYFRIEND ATTACK
      text = user.name() + ' błyskawicznie kopie ' + target._altName() + '!\r\n';
      text += hpDamageText;
      break;

    case 'SBF LASER': //SPACE BOYFRIEND LASER
      text = user.name() + ' wystrzeliwuje laser!\r\n';
      text += hpDamageText;
      break;

    case 'SBF CALM DOWN': //SPACE BOYFRIEND CALM DOWN
      text = user.name() + ' oczyszcza swój umysł\r\n';
      text += 'i pozbywa się wszystkich EMOCJI.';
      break;

    case 'SBF ANGRY SONG': //SPACE BOYFRIEND ANGRY SONG
      if(target.index() <= unitLowestIndex) {
        text = user.name() + ' wściekle płacze!\r\n';
        text += "Wszyscy czują ZŁOŚĆ!\r\n";
      }
      text += hpDamageText;
      break;

    case 'SBF ANGSTY SONG': //SPACE BOYFRIEND ANGSTY SONG
      if(target.index() <= unitLowestIndex) {
        text = user.name() + ' sings with all the darkness\r\n';
        text += 'in his soul!\r\n';
        text += "Wszyscy czują SMUTEK.\r\n";
      }
      text += mpDamageText;
      break;

    case 'SBF JOYFUL SONG': //SPACE BOYFRIEND JOYFUL SONG
      if(target.index() <= unitLowestIndex) {
        text = user.name() + ' sings with all the joy\r\n';
        text += "in his heart!\r\n"
        text += "Wszyscy czują SZCZĘŚCIE!\r\n";
      }
      text += hpDamageText;
      break;

    //NEFARIOUS CHIP//
    case 'EVIL CHIP ATTACK': //NEFARIOUS CHIP ATTACK
      text = user.name() + ' charges into ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'EVIL CHIP NOTHING': //NEFARIOUS CHIP NOTHING
      text = user.name() + ' strokes his evil\r\n';
      text += 'moustache!';
      break;


    case 'EVIL LAUGH': //NEFARIOUS LAUGH
      text = user.name() + ' laughs like the evil\r\n';
      text += 'villain he is!\r\n';
      if(!target._noEffectMessage) {text += target.name() + " feels HAPPY!"}
      else {text += parseNoEffectEmotion($1,$2, target)}
      break;

    case 'EVIL COOKIES': //NEFARIOUS COOKIES
      text = user.name() + ' throws OATMEAL COOKIES at everyone!\r\n';
      text += 'How evil!';
      break;

    //BISCUIT AND DOUGHIE//
    case 'BD ATTACK': //BISCUIT AND DOUGHIE ATTACK
      text = user.name() + ' attack together!\r\n';
      text += hpDamageText;
      break;

    case 'BD NOTHING': //BISCUIT AND DOUGHIE NOTHING
      text = user.name() + ' forget something\r\n';
      text += 'in the oven!';
      break;

    case 'BD BAKE BREAD': //BISCUIT AND DOUGHIE BAKE BREAD
      text = user.name() + ' pull out some\r\n';
      text += 'BREAD from the oven!';
      break;

    case 'BD COOK': //BISCUIT AND DOUGHIE CHEER UP
      text = user.name() + ' makes a cookie!\r\n';
      text += `${target.name()} recovers ${Math.abs(hpDam)}\r\nHEART!`
      break;

    case 'BD CHEER UP': //BISCUIT AND DOUGHIE CHEER UP
      text = user.name() + ' do their best to not\r\n';
      text += 'be SAD.';
      break;

    //KING CRAWLER//
    case 'KC ATTACK': //KING CRAWLER ATTACK
      text = user.name() + ' slams into ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'KC NOTHING': //KING CRAWLER NOTHING
      text = user.name() + ' lets out an ear-piercing\r\n';
      text += 'screech!\r\n';
      if(!target._noEffectMessage) {
        text += target.name() + " feels ANGRY!";
      }
      else {text += parseNoEffectEmotion($1,$2, target)}
      break;

    case 'KC CONSUME': //KING CRAWLER CONSUME
      text = user.name() + ' ate a\r\n';
      text += "LOST SPROUT MOLE!\r\n"
      text += `${target.name()} recovers ${Math.abs(hpDam)} HEART!\r\n`;
      break;

    case 'KC RECOVER': //KING CRAWLER CONSUME
      text = `${target.name()} recovers ${Math.abs(hpDam)} HEART!\r\n`;
      if(!target._noEffectMessage) {text += target.name() + " feels HAPPY!"}
      else {text += parseNoEffectEmotion($1,$2, target)}
      break;

    case 'KC CRUNCH': //KING CRAWLER CRUNCH
      text = user.name() + ' chomps ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'KC RAM': //KING CRAWLER RAM
      text = user.name() + ' runs though the party!\r\n';
      text += hpDamageText;
      break;

    //KING CARNIVORE//

    case "SWEET GAS":
      if(target.index() <= unitLowestIndex) {
        text = user.name() + " releases gas!\r\n";
        text += "It smells sweet!\r\n";
        text += "Wszyscy czują SZCZĘŚCIE!";
      }
      target._noEffectMessage = undefined;
      break;

    //SPROUTMOLE LADDER//
    case 'SML NOTHING': //SPROUT MOLE LADDER NOTHING
      text = user.name() + ' stands firmly in place. ';
      break;

    case 'SML SUMMON MOLE': //SPROUT MOLE LADDER SUMMON SPROUT MOLE
      text = 'A SPROUT MOLE climbs up ' + user.name() + '!';
      break;

    case 'SML REPAIR': //SPROUT MOLE LADDER REPAIR
      text = user.name() + ' was repaired.';
      break;

    //UGLY PLANT CREATURE//
    case 'UPC ATTACK': //UGLY PLANT CREATURE ATTACK
      text = user.name() + ' wraps\r\n';
      text += target.name() + ' with vines!\r\n';
      text += hpDamageText;
      break;

    case 'UPC NOTHING': //UGLY PLANT CRATURE NOTHING
      text = user.name() + ' roars!';
      break;

    //ROOTS//
    case 'ROOTS NOTHING': //ROOTS NOTHING
      text = user.name() + ' wiggles around.';
      break;

    case 'ROOTS HEAL': //ROOTS HEAL
      text = user.name() + ' provides nutrients for\r\n';
      text += target.name() + '.';
      break;

    //BANDITO MOLE//
    case 'BANDITO ATTACK': //BANDITO ATTACK
      text = user.name() + ' cuts ' + target.name() + '!\r\n';
      text += hpDamageText;
      break;

    case 'BANDITO STEAL': //BANDITO STEAL
      text = user.name() + ' swiftly steals an item from\r\n';
      text += 'the party!'
      break;

    case 'B.E.D.': //B.E.D.
      text = user.name() + ' pulls out the B.E.D.!\r\n';
      text += hpDamageText;
      break;

    //SIR MAXIMUS//
    case 'MAX ATTACK': //SIR MAXIMUS ATTACK
      text = user.name() + ' swings his sword!\r\n';
      text += hpDamageText;
      break;

    case 'MAX NOTHING': //SIR MAXIMUS NOTHING
      text = user.name() + ' pulled his back...\r\n';
      if(!target._noEffectMessage) {
        text += target.name() + ' feels SAD.'
      }
      else {text += parseNoEffectEmotion($1,$2, target)}
      break;

    case 'MAX STRIKE': //SIR MAXIMUS SWIFT STRIKE
      text = user.name() + ' strikes twice!';
      break;

    case 'MAX ULTIMATE ATTACK': //SIR MAXIMUS ULTIMATE ATTACK
      text = '"NOW FOR MY ULTIMATE ATTACK!"';
      text += hpDamageText;
      break;

    case 'MAX SPIN': //SIR MAXIMUS SPIN
        break;

    //SIR MAXIMUS II//
    case 'MAX 2 NOTHING': //SIR MAXIMUS II NOTHING
      text = user.name() + ' remembers his\r\n';
      text += 'father\'s dying words.\r\n';
      if(!target._noEffectMessage) {
        text += target.name() + ' feels SAD.'
      }
      else {text += parseNoEffectEmotion($1,$2, target)}
      break;

    //SIR MAXIMUS III//
    case 'MAX 3 NOTHING': //SIR MAXIMUS III NOTHING
      text = user.name() + ' remembers his\r\n';
      text += 'grandfather\'s dying words.\r\n';
      text += target.name() + ' feels SAD.'
      break;

    //SWEETHEART//
    case 'SH ATTACK': //SWEET HEART ATTACK
      text = user.name() + ' slaps ' + target.name() + '.\r\n';
      text += hpDamageText;
      break;

    case 'SH INSULT': //SWEET HEART INSULT
      if(target.index() <= unitLowestIndex) {
        text = user.name() + " insults everyone!\r\n"
        text += "Everyone feels ANGRY!\r\n";
      }
      text += hpDamageText;
      target._noEffectMessage = undefined;
      break;

    case 'SH SNACK': //SWEET HEART SNACK
      text = user.name() + ' orders a servant to bring her\r\n';
      text += 'a SNACK.\r\n';
      text += hpDamageText;
      break;

    case 'SH SWING MACE': //SWEET HEART SWING MACE
      text = user.name() + ' swings her mace with fervor!\r\n';
      text += hpDamageText;
      break;

    case 'SH BRAG': //SWEET HEART BRAG
      text = user.name() + ' boasts about\r\n';
      text += 'one of her many, many talents!\r\n';
      if(!target._noEffectMessage) {
        if(target.isStateAffected(8)) {text += target.name() + ' feels MANIC!!!';}
        else if(target.isStateAffected(7)) {text += target.name() + ' feels ECSTATIC!!';}
        else if(target.isStateAffected(6)) {text += target.name() + ' feels HAPPY!';}
      }
      else {text += parseNoEffectEmotion($1,$2, target)}

      break;

      //MR. JAWSUM //
      case 'DESK SUMMON MINION': //MR. JAWSUM DESK SUMMON MINION
        text = user.name() + ' picks up the phone and\r\n';
        text += 'calls a GATOR GUY!';
        break;

      case 'JAWSUM ATTACK ORDER': //MR. JAWSUM DESK ATTACK ORDER
        if(target.index() <= unitLowestIndex) {
          text = user.name() + ' gives orders to attack!\r\n';
          text += "Everyone feels ANGRY!";
        }
        break;

      case 'DESK NOTHING': //MR. JAWSUM DESK DO NOTHING
        text = user.name() + ' begins counting CLAMS.';
        break;

      //PLUTO EXPANDED//
      case 'EXPANDED ATTACK': //PLUTO EXPANDED ATTACK
        text = user.name() + ' throws the Moon at\r\n';
        text += target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'EXPANDED SUBMISSION HOLD': //PLUTO EXPANDED SUBMISSION HOLD
        text = user.name() + ' puts ' + target.name() + '\r\n';
        text += 'in a submission hold!\r\n';
        text += target.name() + '\'s SPEED fell.\r\n';
        text += hpDamageText;
        break;

      case 'EXPANDED HEADBUTT': //PLUTO EXPANDED HEADBUTT
        text = user.name() + ' slams his head\r\n';
        text += 'into ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'EXPANDED FLEX COUNTER': //PLUTO EXPANDED FLEX COUNTER
        text = user.name() + ' flexes his muscles and\r\n'
        text += 'prepares himself!';
        break;

      case 'EXPANDED EXPAND FURTHER': //PLUTO EXPANDED EXPAND FURTHER
        text = user.name() + ' expands even further!\r\n';
        if(!target._noStateMessage) {
          text += target.name() + '\'s ATTACK rose!\r\n';
          text += target.name() + '\'s DEFENSE rose!\r\n';
          text += target.name() + '\'s SPEED fell.';
        }
        else {
          text += parseNoStateChange(user.name(), "ATTACK", "higher!\r\n")
          text += parseNoStateChange(user.name(), "DEFENSE", "higher!\r\n")
          text += parseNoStateChange(user.name(), "SPEED", "lower!")
        }
        break;

      case 'EXPANDED EARTH SLAM': //PLUTO EXPANDED EARTH SLAM
        text = user.name() + ' picks up the Earth\r\n';
        text += 'and slams it into eveyone!';
        break;

      case 'EXPANDED ADMIRATION': //PLUTO EXPANDED ADMIRATION
        text = user.name() + ' is admiring KEL\'s progress!\r\n';
        if(target.isStateAffected(8)) {text += target.name() + ' feels MANIC!!!';}
        else if(target.isStateAffected(7)) {text += target.name() + ' feels ECSTATIC!!';}
        else if(target.isStateAffected(6)) {text += target.name() + ' feels HAPPY!';}
        break;

      //ABBI TENTACLE//
      case 'TENTACLE ATTACK': //ABBI TENTACLE ATTACK
        text = user.name() + ' slams ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'TENTACLE TICKLE': //ABBI TENTACLE TICKLE
        text = user.name() + " weakens " + target.name() + "!\r\n";
        var pronumn = target.name() === $gameActors.actor(2).name() ? "her" : "his";
        text += `${target.name()} let ${pronumn} guard down!`
        break;

      case 'TENTACLE GRAB': //ABBI TENTACLE GRAB
        text = user.name() + ' wraps around ' + target.name() + '!\r\n';
        if(result.isHit()) {
          if(target.name() !== "OMORI" && !target._noEffectMessage) {text += target.name() + " feels AFRAID.\r\n";}
          else {text += parseNoEffectEmotion($1,$2, target)}
        }
        text += hpDamageText;
        break;

      case 'TENTACLE GOOP': //ABBI TENTACLE GOOP
        text = target.name() + ' is drenched in dark liquid!\r\n';
        text += target.name() + ' feels weaker...\r\n';
        text += target.name() + '\'s ATTACK fell.\r\n';
        text += target.name() + '\'s DEFENSE fell.\r\n';
        text += target.name() + '\'s SPEED fell.';
        break;

      //ABBI//
      case 'ABBI ATTACK': //ABBI ATTACK
        text = user.name() + ' attacks ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'ABBI REVIVE TENTACLE': //ABBI REVIVE TENTACLE
        text = user.name() + ' focuses her HEART.';
        break;

      case 'ABBI VANISH': //ABBI VANISH
        text = user.name() + ' vanishes into the shadows...';
        break;

      case 'ABBI ATTACK ORDER': //ABBI ATTACK ORDER
        if(target.index() <= unitLowestIndex) {
          text = user.name() + ' stretches her tentacles.\r\n';
          text += "Everyone's ATTACK rose!!\r\n"
          text += "Everyone feels ANGRY!"
        }
        break;

      case 'ABBI COUNTER TENTACLE': //ABBI COUNTER TENTACLES
        text = user.name() + ' moves through the shadows...';
        break;

      //ROBO HEART//
      case 'ROBO HEART ATTACK': //ROBO HEART ATTACK
        text = user.name() + ' fires rocket hands!\r\n';
        text += hpDamageText;
        break;

      case 'ROBO HEART NOTHING': //ROBO HEART NOTHING
        text = user.name() + ' is buffering...';
        break;

      case 'ROBO HEART LASER': //ROBO HEART LASER
        text = user.name() + ' opens her mouth and\r\n';
        text += 'fires a laser!\r\n';
        text += hpDamageText;
        break;

      case 'ROBO HEART EXPLOSION': //ROBO HEART EXPLOSION
        text = user.name() + ' sheds a single robot tear.\r\n';
        text += user.name() + ' explodes!';
        break;

      case 'ROBO HEART SNACK': //ROBO HEART SNACK
        text = user.name() + ' opens her mouth.\r\n';
        text += 'A nutritious SNACK appears!\r\n';
        text += hpDamageText;
        break;

      //MUTANT HEART//
      case 'MUTANT HEART ATTACK': //MUTANT HEART ATTACK
        text = user.name() + ' sings a song for ' + target.name() + '!\r\n';
        text += 'It was not the best...\r\n';
        text += hpDamageText;
        break;

      case 'MUTANT HEART NOTHING': //MUTANT HEART NOTHING
        text = user.name() + ' strikes a pose!';
        break;

      case 'MUTANT HEART HEAL': //MUTANT HEART HEAL
        text = user.name() + ' fixes her dress!';
        text += hpDamageText;
        break;

      case 'MUTANT HEART WINK': //MUTANT HEART WINK
        text = user.name() + ' winks at ' + target.name() + '!\r\n';
        text += 'It was kind of cute...\r\n';
        if(!target._noEffectMessage){text += target.name() + ' feels HAPPY!';}
        else {text += parseNoEffectEmotion($1,$2, target)}
        break;

      case 'MUTANT HEART INSULT': //MUTANT HEART INSULT
        text = user.name() + ' accidently says something\r\n';
        text += 'mean.\r\n';
        if(!target._noEffectMessage){text += target.name() + ' feels ANGRY!';}
        else {text += parseNoEffectEmotion($1,$2, target)}
        break;

      case 'MUTANT HEART KILL': //MUTANT HEART KILL
        text = 'MUTANTHEART slaps ' + user.name() +'!\r\n';
        text += hpDamageText;
        break;

        //PERFECT HEART//
        case 'PERFECT STEAL HEART': //PERFECT HEART STEAL HEART
          text = user.name() + ' steals ' + target.name() + '\'s\r\n';
          text += 'HEART.\r\n';
          text += hpDamageText + "\r\n";
          if(user.result().hpDamage < 0) {text += `${user.name()} recovers ${Math.abs(user.result().hpDamage)} HEART!\r\n`}
          break;

        case 'PERFECT STEAL BREATH': //PERFECT HEART STEAL BREATH
          text = user.name() + ' steals ' + target.name() + '\'s\r\n';
          text += 'breath away.\r\n';
          text += mpDamageText + "\r\n";
          if(user.result().mpDamage < 0) {text += `${user.name()} recovers ${Math.abs(user.result().mpDamage)} JUICE...\r\n`}
          break;

        case 'PERFECT EXPLOIT EMOTION': //PERFECT HEART EXPLOIT EMOTION
          text = user.name() + ' wzmacnia ' + target.name() + '\'s\r\n';
          text += 'EMOTIONS!\r\n';
          text += hpDamageText;
          break;

        case 'PERFECT SPARE': //PERFECT SPARE
          text = user.name() + ' decides to let\r\n';
          text += target.name() + ' live.\r\n';
          text += hpDamageText;
          break;

        case 'PERFECT ANGELIC VOICE': //UPLIFTING HYMN
          if(target.index() <= unitLowestIndex) {
            text = user.name() + ' sings a soulful song...\r\n';
            if(!user._noEffectMessage) {text += user.name() + " feels SAD.\r\n"}
            else {text += parseNoEffectEmotion($1,$2, target)}
            text += 'Wszyscy czują SZCZĘŚCIE!';
          }
          break;

        case "PERFECT ANGELIC WRATH":
          if(target.index() <= unitLowestIndex) {text = user.name() + " unleashes her wrath.\r\n";}
          if(!target._noEffectMessage) {
              if(target.isStateAffected(8)) {text += target.name() + ' feels MANIC!!!\r\n';}
              else if(target.isStateAffected(7)) {text += target.name() + ' feels ECSTATIC!!\r\n';}
              else if(target.isStateAffected(6)) {text += target.name() + ' feels HAPPY!\r\n';}
              else if(target.isStateAffected(12)) {text += target.name() + ' feels MISERABLE...\r\n';}
              else if(target.isStateAffected(11)) {text += target.name() + ' feels DEPRESSED..\r\n';}
              else if(target.isStateAffected(10)) {text += target.name() + ' feels SAD.\r\n';}
              else if(target.isStateAffected(12)) {text += target.name() + ' feels FURIOUS!!!\r\n';}
              else if(target.isStateAffected(11)) {text += target.name() + ' feels ENRAGED!!\r\n';}
              else if(target.isStateAffected(10)) {text += target.name() + ' feels ANGRY!\r\n';}
          }
          else {
            if(target.isEmotionAffected("happy")) {text += parseNoEffectEmotion($1,$2, target)}
            else if(target.isEmotionAffected("sad")) {text += parseNoEffectEmotion($1,$2, target)}
            else if(target.isEmotionAffected("angry")) {text += parseNoEffectEmotion($1,$2, target)}
          }
          text += hpDamageText;
          break;

        //SLIME GIRLS//
        case 'SLIME GIRLS COMBO ATTACK': //SLIME GIRLS COMBO ATTACK
          text = 'The ' + user.name() + ' attack all at once!\r\n';
          text += hpDamageText;
          break;

        case 'SLIME GIRLS DO NOTHING': //SLIME GIRLS DO NOTHING
          text = 'MEDUSA throws a bottle...\r\n';
          text += 'But nothing happened...';
          break;

        case 'SLIME GIRLS STRANGE GAS': //SLIME GIRLS STRANGE GAS
            if(!target._noEffectMessage) {
              if(target.isStateAffected(8)) {text += target.name() + ' feels MANIC!!!\r\n';}
              else if(target.isStateAffected(7)) {text += target.name() + ' feels ECSTATIC!!\r\n';}
              else if(target.isStateAffected(6)) {text += target.name() + ' feels HAPPY!\r\n';}
              else if(target.isStateAffected(12)) {text += target.name() + ' feels MISERABLE...\r\n';}
              else if(target.isStateAffected(11)) {text += target.name() + ' feels DEPRESSED..\r\n';}
              else if(target.isStateAffected(10)) {text += target.name() + ' feels SAD.\r\n';}
              else if(target.isStateAffected(16)) {text += target.name() + ' feels FURIOUS!!!\r\n';}
              else if(target.isStateAffected(15)) {text += target.name() + ' feels ENRAGED!!\r\n';}
              else if(target.isStateAffected(14)) {text += target.name() + ' feels ANGRY!\r\n';}
          }
          else {
            if(target.isEmotionAffected("happy")) {text += parseNoEffectEmotion($1,$2, target)}
            else if(target.isEmotionAffected("sad")) {text += parseNoEffectEmotion($1,$2, target)}
            else if(target.isEmotionAffected("angry")) {text += parseNoEffectEmotion($1,$2, target)}
          }
          break;

        case 'SLIME GIRLS DYNAMITE': //SLIME GIRLS DYNAMITE
          //text = 'MEDUSA threw a bottle...\r\n';
          //text += 'And it explodes!\r\n';
          text += hpDamageText;
          break;

        case 'SLIME GIRLS STING RAY': //SLIME GIRLS STING RAY
          text = 'MOLLY fires her stingers!\r\n';
          text += target.name() + ' gets struck!\r\n';
          text += hpDamageText;
          break;

        case 'SLIME GIRLS SWAP': //SLIME GIRLS SWAP
          text = 'MEDUSA does the thing!\r\n';
          text += 'Your HEART and JUICE are switched!';
          break;

        case 'SLIME GIRLS CHAIN SAW': //SLIME GIRLS CHAIN SAW
          text = 'MARINA pulls out a chainsaw!\r\n';
          text += hpDamageText;
          break;

      //HUMPHREY SWARM//
      case 'H SWARM ATTACK': //HUMPHREY SWARM ATTACK
        text = 'HUMPHREY surrounds and attacks ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      //HUMPHREY LARGE//
      case 'H LARGE ATTACK': //HUMPHREY LARGE ATTACK
        text = 'HUMPHREY slams into ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      //HUMPHREY FACE//
      case 'H FACE CHOMP': //HUMPHREY FACE CHOMP
        text = 'HUMPHREY sinks his teeth into ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'H FACE DO NOTHING': //HUMPHREY FACE DO NOTHING
        text = 'HUMPHREY stares at ' + target.name() + '!\r\n';
        text += 'HUMPHREY\'s mouth waters incessantly.';
        break;

      case 'H FACE HEAL': //HUMPHREY FACE HEAL
        text = 'HUMPHREY swallows a foe!\r\n';
        text += `HUMPHREY recovers ${Math.abs(hpDam)} HEART!`
        break;

      //HUMPHREY UVULA//
      case 'UVULA DO NOTHING 1': //HUMPHREY UVULA DO NOTHING
        text = user.name() + ' smirks at ' + target.name() + '.\r\n';
      break;

      case 'UVULA DO NOTHING 2': //HUMPHREY UVULA DO NOTHING
      text = user.name() + ' winks at ' + target.name() + '.\r\n';
      break;

      case 'UVULA DO NOTHING 3': //HUMPHREY UVULA DO NOTHING
      text = user.name() + ' spits on ' + target.name() + '.\r\n';
      break;

      case 'UVULA DO NOTHING 4': //HUMPHREY UVULA DO NOTHING
      text = user.name() + ' stares at ' + target.name() + '.\r\n';
      break;

      case 'UVULA DO NOTHING 5': //HUMPHREY UVULA DO NOTHING
      text = user.name() + ' blinks at ' + target.name() + '.\r\n';
      break;

      //FEAR OF FALLING//
      case 'DARK NOTHING': //SOMETHING IN THE DARK NOTHING
        text = user.name() + ' taunts ' + target.name() + '\r\n';
        text += 'as he falls.';
        break;

      case 'DARK ATTACK': //SOMETHING IN THE DARK ATTACK
        text = user.name() + ' shoves ' + target.name() + '.\r\n';
        text += hpDamageText;
        break;

      //FEAR OF BUGS//
      case 'BUGS ATTACK': //FEAR OF BUGS ATTACK
        text = user.name() + ' bites ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'BUGS NOTHING': //FEAR OF BUGS NOTHING
        text = user.name() + ' is trying to talk to you...';
        break;

      case 'SUMMON BABY SPIDER': //SUMMON BABY SPIDER
        text = 'A spider egg hatches\r\n';
        text += 'A BABY SPIDER appeared.';
        break;

      case 'BUGS SPIDER WEBS': //FEAR OF BUGS SPIDER WEBS
        text = user.name() + ' entangles ' + target.name() + '\r\n';
        text += 'in sticky webs.\r\n';
        text += target.name() + '\'s SPEED fell!\r\n';
        break;

      //BABY SPIDER//
      case 'BABY SPIDER ATTACK': //BABY SPIDER ATTACK
        text = user.name() + ' bites ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'BABY SPIDER NOTHING': //BABY SPIDER NOTHING
        text = user.name() + ' makes a strange noise.';
        break;

      //FEAR OF DROWNING//
      case 'DROWNING ATTACK': //FEAR OF DROWNING ATTACK
        text = 'Water pulls ' + target.name() + ' in different\r\n';
        text += 'directions.\r\n';
        text += hpDamageText;
        break;

      case 'DROWNING NOTHING': //FEAR OF DROWNING NOTHING
        text = user.name() + ' listens to ' + target.name() + " struggle.";
        break;

      case 'DROWNING DRAG DOWN': //FEAR OF DROWNING DRAG DOWN
        // text = user.name() + ' grabs\r\n';
        // text += target.name() + '\s leg and drags him down!\r\n';
        text = hpDamageText;
        break;

      //OMORI'S SOMETHING//
      case 'O SOMETHING ATTACK': //OMORI SOMETHING ATTACK
        text = user.name() + ' reaches through ' + target.name() + '.\r\n';
        text += hpDamageText;
        break;

      case 'O SOMETHING NOTHING': //OMORI SOMETHING NOTHING
        text = user.name() + ' sees through ' + target.name() + '.\r\n';
        break;

      case 'O SOMETHING BLACK SPACE': //OMORI SOMETHING BLACK SPACE
        //text = user.name() + ' drags ' + target.name() + ' into\r\n';
        //text += 'the shadows.';
        text = hpDamageText;
        break;

      case 'O SOMETHING SUMMON': //OMORI SOMETHING SUMMON SOMETHING
        text = user.name() + ' calls something from\r\n';
        text += 'the darkness.';
        break;

      case 'O SOMETHING RANDOM EMOTION': //OMORI SOMETHING RANDOM EMOTION
        text = user.name() + ' plays with ' + target.name() +'\'s EMOTIONS.';
        break;

      //BLURRY IMAGE//
      case 'BLURRY NOTHING': //BLURRY IMAGE NOTHING
        text = 'SOMETHING sways in the wind.';
        break;

      //HANGING BODY//
      case 'HANG WARNING':
          text = 'You feel a chill run down your spine.';
          break;

      case 'HANG NOTHING 1':
          text = 'You feel dizzy.';
          break;

      case 'HANG NOTHING 2':
          text = 'You feel your lungs tighten up.';
          break;

      case 'HANG NOTHING 3':
          text = 'You feel a sinking sensation in your\r\n';
          text += 'stomach.';
          break;

      case 'HANG NOTHING 4':
          text = 'You feel your heart beating out of\r\n';
          text += 'your chest.';
          break;

      case 'HANG NOTHING 5':
          text = 'You feel yourself trembling.';
          break;

      case 'HANG NOTHING 6':
          text = 'You feel your knees weaken.';
          break;

      case 'HANG NOTHING 7':
          text = 'You feel sweat dripping down your\r\n';
          text += 'forehead.';
          break;

      case 'HANG NOTHING 8':
          text = 'You feel your fist clenching on its own.';
          break;

      case 'HANG NOTHING 9':
          text = 'You hear your heart beating.';
          break;

      case 'HANG NOTHING 10':
          text = 'You hear your heart begin to steady.';
          break;

      case 'HANG NOTHING 11':
          text = 'You hear your breathing begin to steady.';
          break;

      case 'HANG NOTHING 12':
          text = 'You focus on what is straight\r\n';
          text += 'in front of you.';
          break;

      //AUBREY//
      case 'AUBREY NOTHING': //AUBREY NOTHING
        text = user.name() + ' spits on your shoe.';
        break;

      case 'AUBREY TAUNT': //AUBREY TAUNT
        text = user.name() + ' calls ' + target.name() + ' weak!\r\n';
        text += target.name() + " feels ANGRY!";
        break;

      //THE HOOLIGANS//
      case 'CHARLIE ATTACK': //HOOLIGANS CHARLIE ATTACK
        text = 'CHARLIE puts her all into an attack!\r\n';
        text += hpDamageText;
        break;

      case 'ANGEL ATTACK': //HOOLIGANS ANGEL ATTACK
        text = 'ANGEL swiftly strikes ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'MAVERICK CHARM': //HOOLIGANS MAVERICK CHARM
        text = 'THE MAVERICK winks at ' + target.name() + '!\r\n';
        text += target.name() + '\'s ATTACK fell.'
        break;

      case 'KIM HEADBUTT': //HOOLIGANS KIM HEADBUTT
        text = 'KIM slams her head into ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'VANCE CANDY': //HOOLIGANS VANCE CANDY
        text = 'VANCE throws candy!\r\n';
        text += hpDamageText;
        break;

      case 'HOOLIGANS GROUP ATTACK': //THE HOOLIGANS GROUP ATTACK
        text = user.name() + ' go all out!\r\n';
        text += hpDamageText;
        break;

      //BASIL//
      case 'BASIL ATTACK': //BASIL ATTACK
        text = user.name() + ' reaches inside ' + target.name() + '.\r\n';
        text += hpDamageText;
        break;

      case 'BASIL NOTHING': //BASIL NOTHING
        text = user.name() + '\'s eyes are red from crying.';
        break;

      case 'BASIL PREMPTIVE STRIKE': //BASIL PREMPTIVE STRIKE
        text = user.name() + ' slices ' + target.name() +'\'s arm.\r\n';
        text += hpDamageText;
        break;

      //BASIL'S SOMETHING//
      case 'B SOMETHING ATTACK': //BASIL'S SOMETHING ATTACK
        text = user.name() + ' strangles ' + target.name() + '.\r\n';
        text += hpDamageText;
        break;

      case 'B SOMETHING TAUNT': //BASIL'S SOMETHING TAUNT BASIL
        text = user.name() + ' reaches inside ' + target.name() + '.\r\n';
        break;

      //PLAYER SOMETHING BASIL FIGHT//
      case 'B PLAYER SOMETHING STRESS': //B PLAYER SOMETHING STRESS
        text = user.name() + ' does something to\r\n';
        text += target.name() + '.\r\n';
        text += hpDamageText;
        break;

      case 'B PLAYER SOMETHING HEAL': //B PLAYER SOMETHING HEAL
        text = user.name() + ' seeps into ' + target.name() + '\'s wounds.\r\n';
        text += hpDamageText;
        break;

      case 'B OMORI SOMETHING CONSUME EMOTION': //B OMORI SOMETHING CONSUME EMOTION
        text = user.name() + ' consumes ' + target.name() + '\'s EMOTIONS.';
        break;

      //CHARLIE//
      case 'CHARLIE RELUCTANT ATTACK': //CHARLIE RELUCTANT ATTACK
        text = user.name() + ' punches ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'CHARLIE NOTHING': //CHARLIE NOTHING
        text = user.name() + ' is standing there.';
        break;

      case 'CHARLIE LEAVE': //CHARLIE LEAVE
        text = user.name() + ' stops fighting.';
        break;

      //ANGEL//
      case 'ANGEL ATTACK': //ANGEL ATTACK
        text = user.name() + ' swiftly kicks ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'ANGEL NOTHING': //ANGEL NOTHING
        text = user.name() + ' does a flip and strikes a pose!';
        break;

      case 'ANGEL QUICK ATTACK': //ANGEL QUICK ATTACK
        text = user.name() + ' teleports behind ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'ANGEL TEASE': //ANGEL TEASE
        text = user.name() + ' says mean things about ' + target.name() + '!';
        break;

      //THE MAVERICK//
      case 'MAVERICK ATTACK': //THE MAVERICK ATTACK
        text = user.name() + ' hits ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'MAVERICK NOTHING': //THE MAVERICK NOTHING
        text = user.name() + ' starts bragging to\r\n';
        text += 'his adoring fans!';
        break;

      case 'MAVERICK SMILE': //THE MAVERICK SMILE
        text = user.name() + ' smiles seductively!\r\n';
        text += target.name() + '\'s ATTACK fell.';
        break;

      case 'MAVERICK TAUNT': //THE MAVERICK TAUNT
        text = user.name() + ' starts making fun of\r\n';
        text += target.name() + '!\r\n';
        text += target.name() + " feels ANGRY!"
        break;

      //KIM//
      case 'KIM ATTACK': //KIM ATTACK
        text = user.name() + ' punches ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'KIM NOTHING': //KIM DO NOTHING
        text = user.name() + '\'s phone rang...\r\n';
        text += 'It was a wrong number.';
        break;

      case 'KIM SMASH': //KIM SMASH
        text = user.name() + ' grabs ' + target.name() + '\'s shirt and\r\n';
        text += 'punches them in the face!\r\n';
        text += hpDamageText;
        break;

      case 'KIM TAUNT': //KIM TAUNT
        text = user.name() + ' starts making fun of ' + target.name() + '!\r\n';
        text += target.name() + " feels SAD.";
        break;

      //VANCE//
      case 'VANCE ATTACK': //VANCE ATTACK
        text = user.name() + ' punches ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'VANCE NOTHING': //VANCE NOTHING
        text = user.name() + ' scratches his belly.';
        break;

      case 'VANCE CANDY': //VANCE CANDY
        text = user.name() + ' throws old candy at ' + target.name() + '!\r\n';
        text += 'Ewww... It\'s sticky...\r\n';
        text += hpDamageText;
        break;

      case 'VANCE TEASE': //VANCE TEASE
        text = user.name() + ' said mean things about ' + target.name() + '!\r\n';
        text += target.name() + " feels SAD."
        break;

      //JACKSON//
      case 'JACKSON WALK SLOWLY': //JACKSON WALK SLOWLY
        text = user.name() + ' slowly inches forward...\r\n';
        text += 'You feel like you can\'t escape!';
        break;

      case 'JACKSON KILL': //JACKSON AUTO KILL
        text = user.name() + ' CAUGHT YOU!!!\r\n';
        text += 'You see your life flash before your eyes!';
        break;

      //RECYCLEPATH//
      case 'R PATH ATTACK': //RECYCLEPATH ATTACK
        text = user.name() + ' hits ' + target.name() + ' with a bag!\r\n';
        text += hpDamageText;
        break;

      case 'R PATH SUMMON MINION': //RECYCLEPATH SUMMON MINION
        text = user.name() + ' calls a follower!\r\n';
        text += 'A RECYCULTIST appeared!';
        break;

      case 'R PATH FLING TRASH': //RECYCLEPATH FLING TRASH
        text = user.name() + ' flings all their TRASH\r\n';
        text += 'at ' + target.name() + '!\r\n'
        text += hpDamageText;
        break;

      case 'R PATH GATHER TRASH': //RECYCLEPATH GATHER TRASH
        text = user.name() + ' picks up some TRASH!';
        break;

    //SOMETHING IN THE CLOSET//
      case 'CLOSET ATTACK': //SOMETHING IN THE CLOSET ATTACK
        text = user.name() + ' drags ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'CLOSET NOTHING': //SOMETHING IN THE CLOSET DO NOTHING
        text = user.name() + ' mutters eerily.';
        break;

      case 'CLOSET MAKE AFRAID': //SOMETHING IN THE CLOSET MAKE AFRAID
        text = user.name() + ' knows your secret!';
        break;

      case 'CLOSET MAKE WEAK': //SOMETHING IN THE CLOSET MAKE WEAK
        text = user.name() + ' saps ' + target.name() + '\'s will to live!';
        break;

    //BIG STRONG TREE//
      case 'BST SWAY': //BIG STRONG TREE NOTHING 1
        text = 'A gentle breeze blows across the leaves.';
        break;

      case 'BST NOTHING': //BIG STRONG TREE NOTHING 2
        text = user.name() + ' stands firm because\r\n';
        text += 'it is a tree.';
        break;

    //DREAMWORLD FEAR EXTRA BATTLES//
    //HEIGHTS//
    case 'DREAM HEIGHTS ATTACK': //DREAM FEAR OF HEIGHTS ATTACK
      text = user.name() + ' strikes ' + target.name() + '.\r\n';
      text += hpDamageText;
      break;

    case 'DREAM HEIGHTS GRAB': //DREAM FEAR OF HEIGHTS GRAB
      if(target.index() <= unitLowestIndex) {
        text = 'Hands appear and grab everyone!\r\n';
        text += 'Everyone' + '\'s ATTACK fell...';
      }

      break;

    case 'DREAM HEIGHTS HANDS': //DREAM FEAR OF HEIGHTS HANDS
      text = 'More hands appear and surround\r\n';
      text += user.name() + '.\r\n';
      if(!target._noStateMessage) {text += user.name() + '\'s DEFENSE rose!';}
      else {text += parseNoStateChange(user.name(), "DEFENSE", "higher!")}
      break;

    case 'DREAM HEIGHTS SHOVE': //DREAM FEAR OF HEIGHTS SHOVE
      text = user.name() + ' shoves ' + target.name() + '.\r\n';
      text += hpDamageText + '\r\n';
      if(!target._noEffectMessage && target.name() !== "OMORI"){text += target.name() + ' feels AFRAID.';}
      else {text += parseNoEffectEmotion($1,$2, target)}
      break;

    case 'DREAM HEIGHTS RELEASE ANGER': //DREAM FEAR OF HEIGHTS RELEASE ANGER
      text = user.name() + ' takes its ANGER out on everyone!';
      break;

    //SPIDERS//
    case 'DREAM SPIDERS CONSUME': //DREAM FEAR OF SPIDERS CONSUME
      text = user.name() + ' wraps up and eats ' + target.name() + '.\r\n';
      text += hpDamageText;
      break;

    //DROWNING//
    case 'DREAM DROWNING SMALL': //DREAM FEAR OF DROWNING SMALL
      text = 'Everyone is having a hard time breathing.';
      break;

    case 'DREAM DROWNING BIG': //DREAM FEAR OF DROWNING BIG
      text = 'Everyone feels like passing out.';
      break;

    // BLACK SPACE EXTRA //
    case 'BS LIAR': // BLACK SPACE LIAR
      text = 'Liar.';
      break;

    //BACKGROUND ACTORS//
    //BERLY//
      case 'BERLY ATTACK': //BERLY ATTACK
        text = 'BERLY headbutts ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      case 'BERLY NOTHING 1': //BERLY NOTHING 1
        text = 'BERLY is bravely hiding in the corner.';
        break;

      case 'BERLY NOTHING 2': //BERLY NOTHING 2
        text = 'BERLY fixes her glasses.';
        break;

      //TOYS//
      case 'CAN':  // CAN
        text = user.name() + ' kicks the CAN.';
        break;

      case 'DANDELION':  // DANDELION
        text = user.name() + ' blows on the DANDELION.\r\n';
        text += user.name() + ' feels like ' + (switches.value(6) ? 'her' : 'his') + 'self again.';
        break;

      case 'DYNAMITE':  // DYNAMITE
        text = user.name() + ' throws DYNAMITE!';
        break;

      case 'LIFE JAM':  // LIFE JAM
        text = user.name() + ' uses LIFE JAM on TOAST!\r\n';
        text += 'TOAST became ' + target.name() + '!';
        break;

      case 'PRESENT':  // PRESENT
        text = target.name() + ' opens the PRESENT\r\n';
        text += 'It wasn\'t what ' + target.name() + ' wanted...\r\n';
        if(!target._noEffectMessage){text += target.name() + ' feels ANGRY! ';}
        else {text += parseNoEffectEmotion($1,$2, target)}
        break;

      case 'SILLY STRING':  // DYNAMITE
        if(target.index() <= unitLowestIndex) {
          text = user.name() + ' uses SILLY STRING!\r\n';
          text += 'WOOOOO!! It\'s a party!\r\n';
          text += 'Wszyscy czują SZCZĘŚCIE! ';
        }
        break;

      case 'SPARKLER':  // SPARKLER
        text = user.name() + ' lights the SPARKLER!\r\n';
        text += 'WOOOOO!! It\'s a party!\r\n';
        if(!target._noEffectMessage){text += target.name() + ' feels HAPPY!';}
        else {text += parseNoEffectEmotion($1,$2, target)}
        break;

      case 'COFFEE': // COFFEE
        text = user.name() + ' drinks the COFFEE...\r\n';
        text += user.name() + ' feels amazing!';
        break;

      case 'RUBBERBAND': // RUBBERBAND
        text = user.name() + ' flicks ' + target.name() + '!\r\n';
        text += hpDamageText;
        break;

      //OMORI BATTLE//

      case "OMORI ERASES":
        text = user.name() + " erases the enemy.\r\n";
        text += hpDamageText;
        break;

      case "MARI ATTACK":
        text = user.name() + " erases the enemy.\r\n";
        text += target.name() + " feels AFRAID.\r\n";
        text += hpDamageText;
        break;

      //STATES//
      case 'HAPPY':
        if(!target._noEffectMessage){text = target.name() + ' feels HAPPY!';}
        else {text = parseNoEffectEmotion($1,$2, target)}
        break;

      case 'ECSTATIC':
        if(!target._noEffectMessage){text = target.name() + ' feels ECSTATIC!!';}
        else {text = parseNoEffectEmotion($1,$2, target)}
        break;

      case 'MANIC':
        if(!target._noEffectMessage){text = target.name() + ' feels MANIC!!!';}
        else {text = parseNoEffectEmotion($1,$2, target)}
        break;

      case 'SAD':
        if(!target._noEffectMessage){text = target.name() + ' feels SAD.';}
        else {text = parseNoEffectEmotion($1,$2, target)}
        break;

      case 'DEPRESSED':
        if(!target._noEffectMessage){text = target.name() + ' feels DEPRESSED..';}
        else {text = parseNoEffectEmotion($1,$2, target)}
        break;

      case 'MISERABLE':
        if(!target._noEffectMessage){text = target.name() + ' feels MISERABLE...';}
        else {text = parseNoEffectEmotion($1,$2, target)}
        break;

      case 'ANGRY':
        if(!target._noEffectMessage){text = target.name() + ' feels ANGRY!';}
        else {text = parseNoEffectEmotion($1,$2, target)}
        break;

      case 'ENRAGED':
        if(!target._noEffectMessage){text = target.name() + ' feels ENRAGED!!';}
        else {text = parseNoEffectEmotion($1,$2, target)}
        break;

      case 'FURIOUS':
        if(!target._noEffectMessage){text = target.name() + ' feels FURIOUS!!!'}
        else {text = parseNoEffectEmotion($1,$2, target)}
        break;

      case 'AFRAID':
        if(!target._noEffectMessage){text = target.name() + ' feels AFRAID!';}
        else {text = parseNoEffectEmotion($1,$2, target)}
        break;

      case 'CANNOT MOVE':
        text = target.name() + ' is immobilized! ';
        break;

      case 'INFATUATION':
        text = target.name() + ' is immobilized by love! ';
        break;

    //SNALEY//
    case 'SNALEY MEGAPHONE': // SNALEY MEGAPHONE
      if(target.index() <= unitLowestIndex) {text = user.name() + ' uses an AIRHORN!\r\n';}
      if(target.isStateAffected(16)) {text += target.name() + ' feels FURIOUS!!!\r\n'}
      else if(target.isStateAffected(15)) {text += target.name() + ' feels ENRAGED!!\r\n'}
      else if(target.isStateAffected(14)) {text += target.name() + ' feels ANGRY!\r\n'}
      break;

  }
  // Return Text
  return text;
};
//=============================================================================
// * Display Custom Action Text
//=============================================================================
Window_BattleLog.prototype.displayCustomActionText = function(subject, target, item) {
  // Make Custom Action Text
  var text = this.makeCustomActionText(subject, target, item);
  // If Text Length is more than 0
  if (text.length > 0) {
    if(!!this._multiHitFlag && !!item.isRepeatingSkill) {return;}
    // Get Get
    text = text.split(/\r\n/);
    for (var i = 0; i < text.length; i++) { this.push('addText', text[i]); }
    // Add Wait
    this.push('wait', 15);

  }
  if(!!item.isRepeatingSkill) {this._multiHitFlag = true;}
};
//=============================================================================
// * Display Action
//=============================================================================
Window_BattleLog.prototype.displayAction = function(subject, item) {
  // Return if Item has Custom Battle Log Type
  if (item.meta.BattleLogType) { return; }
  // Run Original Function
  _TDS_.CustomBattleActionText.Window_BattleLog_displayAction.call(this, subject, item);
};
//=============================================================================
// * Display Action Results
//=============================================================================
Window_BattleLog.prototype.displayActionResults = function(subject, target) {
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
Window_BattleLog.prototype.displayHpDamage = function(target) {
  let result = target.result();
  if(result.isHit() && result.hpDamage > 0) {
    if(!!result.elementStrong) {
      this.push("addText","...It was a moving attack!");
      this.push("waitForNewLine");
    }
    else if(!!result.elementWeak) {
      this.push("addText", "...It was a dull attack!");
      this.push("waitForNewLine")
    }
  }
  return _old_window_battleLog_displayHpDamage.call(this, target)
};

//=============================================================================
// * CLEAR
//=============================================================================
_TDS_.CustomBattleActionText.Window_BattleLog_endAction= Window_BattleLog.prototype.endAction;
Window_BattleLog.prototype.endAction = function() {
  _TDS_.CustomBattleActionText.Window_BattleLog_endAction.call(this);
  this._multiHitFlag = false;
};

//=============================================================================
// * DISPLAY ADDED STATES
//=============================================================================
