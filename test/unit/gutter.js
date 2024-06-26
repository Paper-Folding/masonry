import Masonry from "../../src/lib/masonry.js";
import QUnit from "@paper-folding/outlayer/test/qunitjs/qunit/qunit";

QUnit.test("gutter", function (assert) {
    debugger;
    var msnry = new Masonry("#gutter", {
        columnWidth: 60,
        gutter: 20
    });

    checkItemPositions(msnry, assert, {
        0: { left: 0, top: 0 },
        1: { left: 80, top: 0 },
        2: { left: 160, top: 0 },
        3: { left: 0, top: 30 }
    });
});
