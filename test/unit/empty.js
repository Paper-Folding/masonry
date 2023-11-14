import Masonry from "../../src/lib/masonry.js";
import QUnit from "@paper-folding/outlayer/test/qunitjs/qunit/qunit";
import getSize from "get-size";

QUnit.test("empty", function (assert) {
    var container = document.querySelector("#empty");
    var msnry = new Masonry(container);

    assert.ok(true, "empty masonry did not throw error");
    assert.equal(msnry.columnWidth, getSize(container).innerWidth, "columnWidth = innerWidth");
});
