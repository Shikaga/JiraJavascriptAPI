test( "add test", function() {
    equal(5, add(2,3));
  ok( 2 == add(1,1), "Passed!" );
});

test( "sub test", function() {
    equal(2, sub(5,3));
});

test("time dilation!", function() {
    
    var clock = this.sandbox.useFakeTimers();

    var x = 0;
    setTimeout(function() { x = 2 }, 1000);

    clock.tick(999);
    equal(0, x);

    clock.tick(1);
    equal(2, x);

    clock.restore();
});