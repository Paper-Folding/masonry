import Outlayer from "@paper-folding/outlayer";
import getSize from "get-size";

// -------------------------- masonryDefinition -------------------------- //

// create an Outlayer layout class
var Masonry = Outlayer.create("masonry");
// isFitWidth -> fitWidth
Masonry.compatOptions.fitWidth = "isFitWidth";

var proto = Masonry.prototype;

proto._resetLayout = function () {
    this.getSize();
    this._getMeasurement("columnWidth", "outerWidth");
    this._getMeasurement("gutter", "outerWidth");
    this.measureColumns();

    // reset column Y
    this.colYs = [];
    for (var i = 0; i < this.cols; i++) {
        this.colYs.push(0);
    }

    this.maxY = 0;
    this.horizontalColIndex = 0;
};

proto.measureColumns = function () {
    this.getContainerWidth();
    // if columnWidth is 0, default to outerWidth of first item
    if (!this.columnWidth) {
        var firstItem = this.items[0];
        var firstItemElem = firstItem && firstItem.element;
        // columnWidth fall back to item of first element
        this.columnWidth =
            (firstItemElem && getSize(firstItemElem).outerWidth) ||
            // if first elem has no width, default to size of container
            this.containerWidth;
    }

    var columnWidth = (this.columnWidth += this.gutter);

    // calculate columns
    var containerWidth = this.containerWidth + this.gutter;
    var cols;
    if (this.options.columns)
        // if `columns` option is explicitly delivered, use that cuz columns calculated by masonry is not accurately guaranteed
        cols = this.options.columns;
    else cols = containerWidth / columnWidth;
    // fix rounding errors, typically with gutters
    var excess = columnWidth - (containerWidth % columnWidth);
    // if overshoot is less than a pixel, round up, otherwise floor it
    var mathMethod = excess && excess < 1 ? "round" : "floor";
    cols = Math[mathMethod](cols);
    this.cols = Math.max(cols, 1);
    // it looks like masonry will incorrectly calculate actual columns
    // when each items' width are fixed percentage value,
    // so we'd better force correct columnWidth to be calculated here.
    this.columnWidth = this.containerWidth / this.cols;
};

proto.getContainerWidth = function () {
    // container is parent if fit width
    var isFitWidth = this._getOption("fitWidth");
    var container = isFitWidth ? this.element.parentNode : this.element;
    // check that this.size and size are there
    // IE8 triggers resize on body size change, so they might not be
    var size = getSize(container);
    this.containerWidth = size && size.innerWidth;
};

proto._getItemLayoutPosition = function (item) {
    item.getSize();
    // how many columns does this brick span
    var remainder = item.size.outerWidth % this.columnWidth;
    var mathMethod = remainder && remainder < 1 ? "round" : "ceil";
    // round if off by 1 pixel, otherwise use ceil
    var colSpan = Math[mathMethod](item.size.outerWidth / this.columnWidth);
    colSpan = Math.min(colSpan, this.cols);
    // use horizontal or top column position
    var colPosMethod = this.options.horizontalOrder ? "_getHorizontalColPosition" : "_getTopColPosition";
    var colPosition = this[colPosMethod](colSpan, item);
    // position the brick
    var position = {
        x: this.columnWidth * colPosition.col,
        y: colPosition.y
    };
    // apply setHeight to necessary columns
    var setHeight = colPosition.y + item.size.outerHeight;
    var setMax = colSpan + colPosition.col;
    for (var i = colPosition.col; i < setMax; i++) {
        this.colYs[i] = setHeight;
    }

    return position;
};

proto._getTopColPosition = function (colSpan) {
    var colGroup = this._getTopColGroup(colSpan);
    // get the minimum Y value from the columns
    var minimumY = Math.min.apply(Math, colGroup);

    return {
        col: colGroup.indexOf(minimumY),
        y: minimumY
    };
};

/**
 * @param {Number} colSpan - number of columns the element spans
 * @returns {Array} colGroup
 */
proto._getTopColGroup = function (colSpan) {
    if (colSpan < 2) {
        // if brick spans only one column, use all the column Ys
        return this.colYs;
    }

    var colGroup = [];
    // how many different places could this brick fit horizontally
    var groupCount = this.cols + 1 - colSpan;
    // for each group potential horizontal position
    for (var i = 0; i < groupCount; i++) {
        colGroup[i] = this._getColGroupY(i, colSpan);
    }
    return colGroup;
};

proto._getColGroupY = function (col, colSpan) {
    if (colSpan < 2) {
        return this.colYs[col];
    }
    // make an array of colY values for that one group
    var groupColYs = this.colYs.slice(col, col + colSpan);
    // and get the max value of the array
    return Math.max.apply(Math, groupColYs);
};

// get column position based on horizontal index. #873
proto._getHorizontalColPosition = function (colSpan, item) {
    var col = this.horizontalColIndex % this.cols;
    var isOver = colSpan > 1 && col + colSpan > this.cols;
    // shift to next row if item can't fit on current row
    col = isOver ? 0 : col;
    // don't let zero-size items take up space
    var hasSize = item.size.outerWidth && item.size.outerHeight;
    this.horizontalColIndex = hasSize ? col + colSpan : this.horizontalColIndex;

    return {
        col: col,
        y: this._getColGroupY(col, colSpan)
    };
};

proto._manageStamp = function (stamp) {
    var stampSize = getSize(stamp);
    var offset = this._getElementOffset(stamp);
    // get the columns that this stamp affects
    var isOriginLeft = this._getOption("originLeft");
    var firstX = isOriginLeft ? offset.left : offset.right;
    var lastX = firstX + stampSize.outerWidth;
    var firstCol = Math.floor(firstX / this.columnWidth);
    firstCol = Math.max(0, firstCol);
    var lastCol = Math.floor(lastX / this.columnWidth);
    // lastCol should not go over if multiple of columnWidth #425
    lastCol -= lastX % this.columnWidth ? 0 : 1;
    lastCol = Math.min(this.cols - 1, lastCol);
    // set colYs to bottom of the stamp

    var isOriginTop = this._getOption("originTop");
    var stampMaxY = (isOriginTop ? offset.top : offset.bottom) + stampSize.outerHeight;
    for (var i = firstCol; i <= lastCol; i++) {
        this.colYs[i] = Math.max(stampMaxY, this.colYs[i]);
    }
};

proto._getContainerSize = function () {
    this.maxY = Math.max.apply(Math, this.colYs);
    var size = {
        height: this.maxY
    };

    if (this._getOption("fitWidth")) {
        size.width = this._getContainerFitWidth();
    }

    return size;
};

proto._getContainerFitWidth = function () {
    var unusedCols = 0;
    // count unused columns
    var i = this.cols;
    while (--i) {
        if (this.colYs[i] !== 0) {
            break;
        }
        unusedCols++;
    }
    // fit container to columns that have been used
    return (this.cols - unusedCols) * this.columnWidth - this.gutter;
};

proto.needsResizeLayout = function () {
    var previousWidth = this.containerWidth;
    this.getContainerWidth();
    return previousWidth != this.containerWidth;
};

/**
 * Insert elements to layout
 * borrowed code from https://github.com/desandro/masonry/issues/950#issuecomment-296721854
 * @param {Array or NodeList or Element} elems
 * @param {Number} index
 */
proto.insert = function (elems, index) {
    let items = this._itemize(elems);
    if (!items.length) return;

    // append item elements
    let item,
        len = items.length;
    let fragment = document.createDocumentFragment();
    for (let i = 0; i < len; i++) {
        item = items[i];
        fragment.appendChild(item.element);
    }
    let beforeElem = this.items[index].element;
    this.element.insertBefore(fragment, beforeElem);
    // insert items
    let spliceArgs = [index, 0].concat(items);
    this.items.splice.apply(this.items, spliceArgs);
    // set flag
    for (let i = 0; i < len; i++) {
        items[i].isLayoutInstant = true;
    }
    this.layout();
    // reset flag
    for (let i = 0; i < len; i++) {
        delete items[i].isLayoutInstant;
    }
    this.reveal(items);
};

export default Masonry;
