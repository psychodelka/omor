let old_createSprites = Window_OmoriBattleActorStatus.prototype.createSprites
Window_OmoriBattleActorStatus.prototype.createSprites = function() {
  let thisActor = this.actor()
  if (!thisActor) {return old_createSprites.call(this)}
  let thisActorId = thisActor.actorId()
  let old = ImageManager.loadSystem
  if (thisActorId === 2 || thisActorId === 9) {
    ImageManager.loadSystem = function(img) {
      img = img === 'statelist' ? 'statelist2' : img
      return old.call(this, img)
    }
  }
  old_createSprites.call(this)
  ImageManager.loadSystem = old
}