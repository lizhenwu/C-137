// https://developer.mozilla.org/zh-CN/docs/Web/Guide/API/DOM/The_structured_clone_algorithm
// from MDN 深拷贝
export default function clone(objectToBeCloned) {
    // Basis.
    if (!(objectToBeCloned instanceof Object)) {
      return objectToBeCloned;
    }
  
    var objectClone;
    
    // Filter out special objects.
    var Constructor = objectToBeCloned.constructor;
    switch (Constructor) {
      // Implement other special objects here.
      case RegExp:
        objectClone = new Constructor(objectToBeCloned);
        break;
      case Date:
        objectClone = new Constructor(objectToBeCloned.getTime());
        break;
      default:
        objectClone = new Constructor();
    }
    
    // Clone each property.
    for (var prop in objectToBeCloned) {
      objectClone[prop] = clone(objectToBeCloned[prop]);
    }
    
    return objectClone;
  }