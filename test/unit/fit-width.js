import Masonry from "../../src/lib/masonry.js";
import QUnit from "@paper-folding/outlayer/test/qunitjs/qunit/qunit";

QUnit.test("fit width", function (assert) {
    var container = document.querySelector("#fit-width .container");
    var msnry = new Masonry(container, {
        columnWidth: 60,
        isFitWidth: true
    });

    assert.equal(msnry.cols, 2, "2 columns");
    assert.equal(msnry.cols * msnry.columnWidth + "px", container.style.width, "width set to match");
});
