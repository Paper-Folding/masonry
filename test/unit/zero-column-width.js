import Masonry from "../../src/lib/masonry.js";
import QUnit from "@paper-folding/outlayer/test/qunitjs/qunit/qunit";

QUnit.test("zero column width", function (assert) {
    var msnry = new Masonry("#zero-column-width");
    assert.equal(msnry.columnWidth, 180, "columnWidth = container innerWidth");
});
