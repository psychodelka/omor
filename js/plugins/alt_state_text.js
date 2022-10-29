// <AlternateTextForms> on actor or enemy notes (make sure to get every emotion state for enemies)

// for states:
// <AltActorInflict:texthere>
// <AltEnemyInflict:texthere>
// <AltPersist:texthere>
// <AltRemove:texthere>
{
    Game_Actor.prototype._doesUseAlternateForms = function() {
        return !!this.actor().meta.AlternateTextForms
    }
    Game_Enemy.prototype._doesUseAlternateForms = function() {
        return !!this.enemy().meta.AlternateTextForms
    }
    Game_Actor.prototype._doesUseAlternateForms2 = function() {
        return !!this.actor().meta.AlternateTextForms2
    }
    Game_Enemy.prototype._doesUseAlternateForms2 = function() {
        return !!this.enemy().meta.AlternateTextForms2
    }
    Game_Actor.prototype._doesUseAlternateForms3 = function() {
        return !!this.actor().meta.AlternateTextForms3
    }
    Game_Enemy.prototype._doesUseAlternateForms3 = function() {
        return !!this.enemy().meta.AlternateTextForms3
    }
    Game_Actor.prototype._altName = function() {
        return this.actor().meta.AltName || this.actor().name
    }
    Game_Enemy.prototype._altName = function() {
        return this.enemy().meta.AltName || this.enemy().name
    }
}
{
    Game_Actor.prototype.showAddedStates = function() {
        this.result().addedStateObjects().forEach(function(state) {
            let message
            if (this._doesUseAlternateForms3()) {
                message = state.meta.AltActorInflict3
            } else if (this._doesUseAlternateForms2()) {
                message = state.meta.AltActorInflict2
            } else if (this._doesUseAlternateForms()) {
                message = state.meta.AltActorInflict
            } else {
                message = state.message1
            }
            if (message) {
                $gameMessage.add(this._name + message)
            }
        }, this)
    }

    Window_BattleLog.prototype.displayAddedStates = function(target) {
		target.result().addedStateObjects().forEach(function(state) {
            let message
            if (target._doesUseAlternateForms3()) {
                message = target.isActor() ? state.meta.AltActorInflict3 : state.meta.AltEnemyInflict3
            } else if (target._doesUseAlternateForms2()) {
                message = target.isActor() ? state.meta.AltActorInflict2 : state.meta.AltEnemyInflict2
            } else if (target._doesUseAlternateForms()) {
                message = target.isActor() ? state.meta.AltActorInflict : state.meta.AltEnemyInflict
            } else {
                message = target.isActor() ? state.message1 : state.message2
            }
			if (state.id === target.deathStateId()) {
				this.push('performCollapse', target)
			}
			if(state.id === target.deathStateId() && target.isActor()) {
				if([1,8,9,10,11].contains(target.actorId())) {
                    if (target._doesUseAlternateForms()) {
                        // alternate rw black out text
                        message = " blacked out!"
                    } else {
                        message = " blacked out!"
                    }
				}
			}
			if (message) {
				this.push('popBaseLine')
				this.push('pushBaseLine')
				this.push('addText', target.name() + message)
				this.push('waitForEffect')
			}
		}, this)
    }
}
{
    Game_BattlerBase.prototype.mostImportantStateText = function() {
        var states = this.states();
        for (var i = 0; i < states.length; i++) {
            if (this._doesUseAlternateForms3()) {
                if (states[i].meta.AltPersist3) {
                    return states[i].meta.AltPersist3
                }
            }
            if (this._doesUseAlternateForms2()) {
                if (states[i].meta.AltPersist2) {
                    return states[i].meta.AltPersist2
                }
            }
            if (this._doesUseAlternateForms()) {
                if (states[i].meta.AltPersist) {
                    return states[i].meta.AltPersist
                }
            }
            if (states[i].message3) {
                return states[i].message3;
            }
        }
        return '';
    };
}
{
    Game_Actor.prototype.showRemovedStates = function() {
        this.result().removedStateObjects().forEach(function(state) {
            let message
            if (this._doesUseAlternateForms3()) {
                message = state.meta.AltRemoveText3
            } else if (this._doesUseAlternateForms2()) {
                message = state.meta.AltRemoveText2
            } else if (this._doesUseAlternateForms()) {
                message = state.meta.AltRemoveText
            } else {
                message = state.message4
            }
            if (message) {
                $gameMessage.add(this._name + message)
            }
        }, this)
    }

    Window_BattleLog.prototype.displayRemovedStates = function(target) {
        target.result().removedStateObjects().forEach(function(state) {
            let message
            if (target._doesUseAlternateForms3()) {
                message = state.meta.AltRemoveText3
            } else if (target._doesUseAlternateForms2()) {
                message = state.meta.AltRemoveText2
            } else if (target._doesUseAlternateForms()) {
                message = state.meta.AltRemoveText
            } else {
                message = state.message4
            }
            if (message) {
                this.push('popBaseLine')
                this.push('pushBaseLine')
                this.push('addText', target.name() + message)
            }
        }, this)
    }
}
