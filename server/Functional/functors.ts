class Container {
    $value:any;
    constructor(x) {
      this.$value = x;
    }
  
    static of(x) {
      return new Container(x);
    }
    map(f){
      return Container.of(f(this.$value));
    }
  }
  
  // Container.prototype.map = function (f) {
  //   return Container.of(f(this.$value));
  // };
  
  Container.of(3);
  console.log(
    Container.of(8)
    .map(two => two * 2)
    .map(some => some + 1)
    );